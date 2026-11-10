import { useEffect,useMemo,useRef,useState } from 'react';
import { motion,useAnimate,useReducedMotion } from 'motion/react';
import type { AnimationOptions } from 'motion/react';
import { findScreen } from '../design/catalog';
import transitions from '../design/transitions.json';
import { visualState } from '../prototype/visual-state.mjs';
import { motionOptions } from '../prototype/motion-options.mjs';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RecoveryPage } from '../pages/RecoveryPage';
import { asset,at } from './FormControls';
import type { PrototypeController } from '../prototype/controller.mjs';

const keys=['login','register','mail','code','newpass','done'] as const;
export function PrototypeScene({controller}:{controller:PrototypeController}){
  const state=controller.getSnapshot();const frame=findScreen(state.frameId)!;
  const target=findScreen(state.targetFrameId??state.frameId)!;
  const initial=useRef(visualState(frame));const current=useMemo(()=>visualState(target),[target]);
  const[scope,animate]=useAnimate();const reduced=useReducedMotion();
  const[painted,setPainted]=useState(false);
  useEffect(()=>{let id=requestAnimationFrame(()=>{id=requestAnimationFrame(()=>setPainted(true));});return()=>cancelAnimationFrame(id);},[]);
  const[scale,setScale]=useState(()=>Math.min(1,innerWidth/1728,innerHeight/1117));
  useEffect(()=>{const resize=()=>setScale(Math.min(1,innerWidth/1728,innerHeight/1117));window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
  useEffect(()=>{
    let cancelled=false;
    const opts=state.transition?motionOptions(state.transition.animation,!!reduced):{duration:0};
    const controls=Object.entries(current).map(([key,value])=>animate(`[data-anim="${key}"]`,value,opts as AnimationOptions));
    Promise.all(controls).then(()=>{if(!cancelled&&state.phase==='animating')controller.complete(state.token);});
    return()=>{cancelled=true;controls.forEach(control=>control.stop());};
  },[animate,controller,current,reduced,state.phase,state.token]);
  const activate=(name:string)=>{
    const edge=transitions.find(t=>t.from===controller.getSnapshot().frameId&&t.hotspotName===name&&t.trigger.type==='ON_CLICK');
    if(edge)controller.click(edge.hotspotId);
  };
  return <main className="viewport" aria-label="Little Gem prototype">
    <div className="scaled-frame" style={{width:1728*scale,height:1117*scale}}>
      <div ref={scope} className="design-canvas" style={{transform:`scale(${scale})`}} data-frame-id={state.frameId} data-target-frame={state.targetFrameId??''} data-phase={state.phase} data-painted={painted} aria-busy={state.phase==='animating'}>
        <motion.div className="paper-clip" data-anim="paper" style={initial.current.paper}>
          <motion.div className="paper-background" data-anim="background" style={initial.current.background}><img src={asset('paper.svg')} alt="" draggable={false}/></motion.div>
          <motion.div className="divider" data-anim="divider" style={{...at(615,90),...initial.current.divider}}><img src={asset('divider.svg')} alt=""/></motion.div>
          {keys.map(key=>{
            const active=state.phase==='settled'&&current[key].opacity>0;
            return <motion.div key={key} className="content-layer" data-anim={key} data-content={key} style={{...initial.current[key],pointerEvents:active?'auto':'none'}} inert={!active} aria-hidden={!active}>
              {key==='login'?<LoginPage onHotspot={activate}/>:key==='register'?<RegisterPage onHotspot={activate}/>:<RecoveryPage step={key} onHotspot={activate}/>}
            </motion.div>;
          })}
        </motion.div>
        <motion.div className="roller" data-anim="rollerLeft" style={initial.current.rollerLeft}><img src={asset('roller-left.svg')} alt="" draggable={false}/></motion.div>
        <motion.div className="roller" data-anim="rollerRight" style={initial.current.rollerRight}><img src={asset('roller-right.svg')} alt="" draggable={false}/></motion.div>
      </div>
    </div>
  </main>;
}
