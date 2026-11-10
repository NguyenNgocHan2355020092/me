import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { clickTransition, timeoutTransition, timeoutMilliseconds, transitionMilliseconds } from '../src/prototype/engine.mjs';
const load = name => JSON.parse(readFileSync(new URL('../src/design/' + name, import.meta.url), 'utf8'));
const catalog = load('frames.json');
const transitions = load('transitions.json');
const screenIds = new Set(catalog.frames.map(frame => frame.id));

test('all 23 UI frames are represented, with no palette or excluded code layer', () => {
  assert.equal(screenIds.size, 23);
  assert.equal(catalog.frames.length, 23);
  assert.equal(catalog.frames.filter(frame => frame.kind === 'screen').length, 6);
  for (const id of ['2:5', '91:95']) assert.equal(screenIds.has(id), false);
  for (const frame of catalog.frames) assert.deepEqual([frame.width, frame.height], [1728, 1117]);
});

test('all navigation sources and targets resolve and are reachable from Flow 1', () => {
  assert.equal(transitions.length, 27);
  for (const transition of transitions) {
    assert.ok(screenIds.has(transition.from));
    assert.ok(screenIds.has(transition.to));
    assert.equal(transition.animation.type, 'SMART_ANIMATE');
  }
  const reachable = new Set([catalog.flowStart.nodeId]);
  for (let changed = true; changed;) {
    changed = false;
    for (const transition of transitions) {
      if (reachable.has(transition.from) && !reachable.has(transition.to)) {
        reachable.add(transition.to); changed = true;
      }
    }
  }
  assert.equal(reachable.size, 23);
});

test('each Back hotspot follows its own recorded Figma path', () => {
  assert.equal(clickTransition(transitions, '41:2044', '48:2344').to, '50:3567');
  assert.equal(clickTransition(transitions, '48:3203', '48:3214').to, '48:3488');
  assert.equal(clickTransition(transitions, '48:3318', '48:3334').to, '48:3488');
});

test('timeout and animation duration remain distinct, including nested paper trigger', () => {
  const fade = timeoutTransition(transitions, '48:3488');
  assert.equal(fade.hotspotId, '48:3489');
  assert.equal(fade.to, '41:2044');
  assert.equal(timeoutMilliseconds(fade), 800);
  assert.equal(transitionMilliseconds(fade), 300);
  assert.equal(clickTransition(transitions, '1:4', 'nonexistent'), null);
});
