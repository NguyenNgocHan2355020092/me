import { clickTransition, timeoutTransition, timeoutMilliseconds } from './engine.mjs';

/** Animation completion, not a guessed timer, advances the prototype. */
export class PrototypeController {
  constructor({ frames, transitions, initialFrameId, autoAdvance = true, clock = globalThis, onCommit = () => {} }) {
    this.ids = new Set(frames.map(frame => frame.id)); this.transitions = transitions;
    this.clock = clock; this.autoAdvance = autoAdvance; this.onCommit = onCommit;
    this.listeners = new Set(); this.generation = 0; this.timer = null; this.running = false;
    this.snapshot = { frameId: this.ids.has(initialFrameId) ? initialFrameId : frames[0].id, targetFrameId: null, phase: 'settled', transition: null, token: 0, triggerSource: null };
    this.trace = [];
  }
  getSnapshot = () => this.snapshot;
  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  emit() { for (const listener of this.listeners) listener(); }
  clearTimer() { if (this.timer !== null) this.clock.clearTimeout(this.timer); this.timer = null; }
  start() { this.running = true; this.schedule(); }
  stop() { this.running = false; this.clearTimer(); this.generation++; }
  schedule() {
    this.clearTimer();
    if (!this.running || !this.autoAdvance || this.snapshot.phase !== 'settled') return;
    const edge = timeoutTransition(this.transitions, this.snapshot.frameId); if (!edge) return;
    const generation = this.generation;
    this.timer = this.clock.setTimeout(() => { if (this.running && generation === this.generation) this.begin(edge, 'delay'); }, timeoutMilliseconds(edge));
  }
  click(hotspotId) {
    if (this.snapshot.phase !== 'settled') return false;
    const edge = clickTransition(this.transitions, this.snapshot.frameId, hotspotId);
    return edge ? this.begin(edge, 'click') : false;
  }
  begin(edge, triggerSource) {
    if (this.snapshot.phase !== 'settled' || edge.from !== this.snapshot.frameId || !this.ids.has(edge.to)) return false;
    this.clearTimer(); const token = ++this.generation;
    this.snapshot = { ...this.snapshot, targetFrameId: edge.to, phase: 'animating', transition: edge, token, triggerSource };
    this.trace.push({ from: edge.from, to: edge.to, hotspotId: edge.hotspotId, trigger: edge.trigger, animation: edge.animation });
    if (this.trace.length > 200) this.trace.shift(); this.emit(); return true;
  }
  complete(token) {
    if (this.snapshot.phase !== 'animating' || token !== this.generation) return false;
    const { targetFrameId, triggerSource, transition } = this.snapshot;
    this.snapshot = { frameId: targetFrameId, targetFrameId: null, phase: 'settled', transition: null, token, triggerSource: null };
    this.onCommit(targetFrameId, triggerSource, transition); this.emit(); this.schedule(); return true;
  }
  jump(frameId) {
    if (!this.ids.has(frameId)) return false; this.clearTimer();
    this.snapshot = { frameId, targetFrameId: null, phase: 'settled', transition: null, token: ++this.generation, triggerSource: null };
    this.emit(); this.schedule(); return true;
  }
}
