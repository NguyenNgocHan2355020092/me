import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PrototypeController} from '../src/prototype/controller.mjs';
import {motionOptions,directionalEndpoints} from '../src/prototype/motion-options.mjs';
import {visualState} from '../src/prototype/visual-state.mjs';
import {nextVariant} from '../src/prototype/variants.mjs';
const read=name=>JSON.parse(readFileSync(new URL('../src/design/'+name,import.meta.url),'utf8'));
const frames=read('frames.json').frames,transitions=read('transitions.json');
function setup(initialFrameId='1:4',autoAdvance=true){
 const pending=new Map();let next=0;const commits=[];
 const clock={setTimeout:(fn,delay)=>{pending.set(++next,{fn,delay});return next;},clearTimeout:id=>pending.delete(id)};
 const controller=new PrototypeController({frames,transitions,initialFrameId,autoAdvance,clock,onCommit:(...args)=>commits.push(args)});
 controller.start();return{controller,pending,commits};
}
function finish(c){assert.equal(c.getSnapshot().phase,'animating');assert.equal(c.complete(c.getSnapshot().token),true);}
function tick(pending){assert.equal(pending.size,1);const[id,job]=[...pending][0];pending.delete(id);job.fn();return job.delay;}
test('all 27 transitions preserve exact timings and cannot be reentered while animating',()=>{
 for(const edge of transitions){const{controller:c,pending}=setup(edge.from);
  if(edge.trigger.type==='AFTER_TIMEOUT')assert.equal(tick(pending),Math.round(edge.trigger.timeout*1000));else assert.ok(c.click(edge.hotspotId));
  assert.equal(c.getSnapshot().transition,edge);assert.equal(c.click(edge.hotspotId),false);assert.equal(pending.size,0);
  assert.equal(c.getSnapshot().frameId,edge.from);assert.equal(c.getSnapshot().targetFrameId,edge.to);
  finish(c);assert.equal(c.getSnapshot().frameId,edge.to);c.stop();assert.equal(pending.size,0);
 }
});
test('After Delay starts only after animation completion',()=>{
 const{controller:c,pending}=setup();c.click('20:23');assert.equal(pending.size,0);finish(c);
 assert.equal([...pending.values()][0].delay,300);tick(pending);assert.equal(pending.size,0);
 assert.equal(c.getSnapshot().transition.animation.duration,0.800000011920929);finish(c);
 assert.equal([...pending.values()][0].delay,800);
});
test('back/forward interruption cancels stale timer and animation completion',()=>{
 const{controller:c,pending}=setup('41:90');const old=[...pending.values()][0].fn;tick(pending);const token=c.getSnapshot().token;
 c.jump('48:3203');old();assert.equal(c.getSnapshot().frameId,'48:3203');assert.equal(c.complete(token),false);assert.equal(c.getSnapshot().phase,'settled');
 assert.equal(c.jump('unknown-frame'),false);assert.equal(c.click('unknown-hotspot'),false);
});
test('register/login loop can repeat without stale timeout or reset',()=>{
 const{controller:c,pending}=setup();
 for(let repeat=0;repeat<6;repeat++){
  c.click('20:23');finish(c);while(pending.size){tick(pending);finish(c);}assert.equal(c.getSnapshot().frameId,'41:924');
  c.click('41:964');finish(c);while(pending.size){tick(pending);finish(c);}assert.equal(c.getSnapshot().frameId,'1:4');
 }
 assert.equal(c.trace.length,48);
});
test('review mode freezes automatic edges without altering source timing',()=>{
 const{controller:c,pending}=setup('41:90',false);assert.equal(pending.size,0);assert.equal(c.getSnapshot().frameId,'41:90');
});
test('all frame visual targets are finite and all six final content groups are correct',()=>{
 const groups={'1:4':'login','41:924':'register','41:2044':'mail','48:3203':'code','48:3318':'newpass','48:3422':'done'};
 for(const frame of frames){const state=visualState(frame);for(const group of Object.values(state))for(const n of Object.values(group))assert.ok(Number.isFinite(n));if(groups[frame.id])assert.equal(state[groups[frame.id]].opacity,1);}
 assert.equal(visualState(frames.find(f=>f.id==='41:368')).paper.width,222);
});
test('easing maps preserve source durations and reduced motion keeps separate delay',()=>{
 for(const edge of transitions){const opts=motionOptions(edge.animation);assert.equal(opts.duration,edge.animation.duration);assert.equal(opts.type,'tween');}
 assert.deepEqual(motionOptions(transitions[0].animation).ease,[0,0,0.58,1]);
 assert.equal(motionOptions(transitions[0].animation,true).duration,0);
 assert.throws(()=>motionOptions({easing:{type:'EASE_OUT'}}),/duration/);
 assert.throws(()=>directionalEndpoints({type:'MOVE_IN'},1728,1117),/direction/);
});
test('Dissolve and explicit directional adapters do not add unspecified transitions',()=>{
 assert.deepEqual(directionalEndpoints({type:'DISSOLVE'},1728,1117).incoming.from,{opacity:0});
 assert.deepEqual(directionalEndpoints({type:'MOVE_IN',direction:'LEFT'},1728,1117).incoming.from,{x:1728,y:0});
 assert.equal(transitions.filter(t=>t.animation.type!=='SMART_ANIMATE').length,0);
});
test('component variants toggle instantly in both directions',()=>{
 assert.equal(nextVariant('41:61'),'41:62');assert.equal(nextVariant('41:62'),'41:61');assert.equal(nextVariant('41:76'),'41:77');assert.equal(nextVariant('41:77'),'41:76');
});
