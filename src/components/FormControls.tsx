import type { CSSProperties, ReactNode } from 'react';
export const asset=(filename:string)=>`/assets/figma/${filename}`;
export const at=(left:number,top:number,width?:number,height?:number):CSSProperties=>({position:'absolute',left,top,width,height});
export function SvgButton({name,left,top,onClick,nodeId,label}:{name:string;left:number;top:number;onClick?:()=>void;nodeId?:string;label:string}){
  return <button type="button" className="svg-button" style={at(left,top,220,45)} onClick={onClick} data-node-id={nodeId} aria-label={label}><img src={asset(name)} alt="" draggable={false}/></button>;
}
export function Title({left,top,children}:{left:number;top:number;children:ReactNode}){return <h1 className="design-title" style={at(left,top)}>{children}</h1>;}
export function BackButton({left,top,onClick,nodeId}:{left:number;top:number;onClick:()=>void;nodeId?:string}){return <button type="button" className="svg-button back-button" style={at(left,top,24,24)} onClick={onClick} aria-label="Return" data-node-id={nodeId}><img src={asset('return.svg')} alt=""/></button>;}
export function TextField({left,top,placeholder,value,onChange,password=false,revealed=false,onReveal,id}:{left:number;top:number;placeholder:string;value:string;onChange:(v:string)=>void;password?:boolean;revealed?:boolean;onReveal?:()=>void;id:string}){
  return <div style={at(left,top,391,19)} className="text-field"><input aria-label={placeholder} name={id} autoComplete="off" value={value} onChange={e=>onChange(e.target.value)} type={password&&!revealed?'password':'text'} placeholder={placeholder} spellCheck={false} style={{width:password?369:391}}/><img className="input-line" src={asset(password?'password-line.svg':'input-line.svg')} alt=""/>{password&&<button type="button" className="svg-button eye-button" aria-label={revealed?'Hide password':'Show password'} aria-pressed={revealed} onClick={onReveal}><img src={asset(revealed?'eye.svg':'eye-off.svg')} alt=""/></button>}</div>;
}
export function SocialIcons({left,top}:{left:number;top:number}){return <>{['google.svg','facebook.svg','apple.svg'].map((file,i)=><img key={file} className="social-icon" src={asset(file)} alt={file.replace('.svg','')} style={at(left+i*66,top)}/>)}</>;}
