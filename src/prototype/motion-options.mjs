const curves = { EASE_IN: [0.42,0,1,1], EASE_OUT: [0,0,0.58,1], EASE_IN_AND_OUT: [0.42,0,0.58,1], LINEAR: [0,0,1,1] };
export function motionOptions(animation, reducedMotion = false) {
  if (!animation || !Number.isFinite(animation.duration)) throw new Error('Missing original transition duration');
  const easing = animation.easing; let ease = curves[easing?.type];
  if (easing?.type === 'CUSTOM_CUBIC_BEZIER') { const b = easing.easingFunctionCubicBezier; if (b) ease = [b.x1,b.y1,b.x2,b.y2]; }
  if (!ease) throw new Error('Original easing is unsupported or incomplete: ' + easing?.type);
  return { type: 'tween', duration: reducedMotion ? 0 : animation.duration, ease };
}
/** Only used if an explicit transition of that type is provided. */
export function directionalEndpoints(animation, width, height) {
  const offsets = { LEFT:[width,0], RIGHT:[-width,0], TOP:[0,height], BOTTOM:[0,-height] };
  if (animation.type === 'DISSOLVE') return { incoming:{from:{opacity:0},to:{opacity:1}},outgoing:{from:{opacity:1},to:{opacity:0}} };
  if (!['MOVE_IN','MOVE_OUT','SLIDE_IN','SLIDE_OUT','PUSH'].includes(animation.type)) throw new Error('Not a directional transition');
  const offset = offsets[animation.direction]; if (!offset) throw new Error('Original motion direction is missing');
  const [x,y] = offset; const incoming={from:{x,y},to:{x:0,y:0}}; const outgoing={from:{x:0,y:0},to:{x:-x,y:-y}};
  if (['MOVE_IN','SLIDE_IN'].includes(animation.type)) outgoing.to={x:0,y:0};
  if (['MOVE_OUT','SLIDE_OUT'].includes(animation.type)) incoming.from={x:0,y:0};
  return {incoming,outgoing};
}
