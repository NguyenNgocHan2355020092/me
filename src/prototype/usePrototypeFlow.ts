import { useEffect, useState, useSyncExternalStore } from 'react';
import { screens, startFrameId, findScreen } from '../design/catalog';
import transitions from '../design/transitions.json';
import { PrototypeController } from './controller.mjs';

export function usePrototypeFlow() {
  const [controller] = useState(() => {
    const query = new URLSearchParams(location.search); const requested = query.get('frame') ?? startFrameId;
    return new PrototypeController({ frames:screens, transitions, initialFrameId:findScreen(requested)?requested:startFrameId, autoAdvance:query.get('review')!=='1',
      onCommit:(frameId:string, source:string) => { const url=new URL(location.href);url.searchParams.set('frame',frameId);if(source==='click')history.pushState({frameId},'',url);else history.replaceState({frameId},'',url); },
    });
  });
  const snapshot=useSyncExternalStore(controller.subscribe,controller.getSnapshot);
  useEffect(()=>{const pop=()=>controller.jump(new URLSearchParams(location.search).get('frame')??startFrameId);window.addEventListener('popstate',pop);controller.start();return()=>{window.removeEventListener('popstate',pop);controller.stop();};},[controller]);
  return {controller,snapshot};
}
