/** Preserve the actual hotspot and trigger; do not infer navigation from labels. */
export function clickTransition(transitions, frameId, hotspotId) {
  return transitions.find(t => t.from === frameId && t.hotspotId === hotspotId && t.trigger.type === 'ON_CLICK') ?? null;
}

export function timeoutTransition(transitions, frameId) {
  return transitions.find(t => t.from === frameId && t.trigger.type === 'AFTER_TIMEOUT') ?? null;
}

export function transitionMilliseconds(transition) {
  return Math.round(transition.animation.duration * 1000);
}

export function timeoutMilliseconds(transition) {
  return transition.trigger.type === 'AFTER_TIMEOUT'
    ? Math.round(transition.trigger.timeout * 1000)
    : 0;
}
