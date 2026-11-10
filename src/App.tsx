import { useEffect,useState } from 'react';
import { FormStateProvider } from './design/form-state';
import { PrototypeScene } from './components/PrototypeScene';
import { usePrototypeFlow } from './prototype/usePrototypeFlow';

function ReadyPrototype(){const{controller}=usePrototypeFlow();return <PrototypeScene controller={controller}/>;}
export function App(){
  const[ready,setReady]=useState(false);
  useEffect(()=>{let alive=true;const assets=['paper.svg','roller-left.svg','roller-right.svg','bracelet-login.svg','bracelet-register.svg','eye.svg','eye-off.svg','checkbox-empty.svg','checkbox-checked.svg','loginbuton.svg','signupbuton.svg','continuebuton.svg','returnbutton.svg','google.svg','facebook.svg','apple.svg','return.svg','passcode.svg','divider.svg','input-line.svg','password-line.svg'];
    const images=assets.map(file=>new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve();image.onerror=()=>reject(new Error('Missing original Figma asset: '+file));image.src='/assets/figma/'+file;}));
    const fonts=Promise.all([document.fonts.load('48px "Bona Nova SC"'),document.fonts.load('300 15px Montserrat'),document.fonts.load('400 16px Montserrat'),document.fonts.load('700 16px Montserrat')]);
    Promise.all([...images,fonts]).then(()=>{if(alive)setReady(true);}).catch(error=>{console.error(error);});return()=>{alive=false;};
  },[]);
  return <FormStateProvider>{ready?<ReadyPrototype/>:<main className="viewport" aria-label="Loading original design resources"/>}</FormStateProvider>;
}
