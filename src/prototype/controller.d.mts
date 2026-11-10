export interface PrototypeEdge {from:string;to:string;hotspotId:string;hotspotName?:string;trigger:{type:string;timeout?:number};animation:{type:string;duration:number;easing:{type:string;easingFunctionCubicBezier?:{x1:number;y1:number;x2:number;y2:number}};direction?:string}}
export interface PrototypeSnapshot {frameId:string;targetFrameId:string|null;phase:'settled'|'animating';transition:PrototypeEdge|null;token:number;triggerSource:string|null}
export class PrototypeController {
  constructor(options:{frames:{id:string}[];transitions:PrototypeEdge[];initialFrameId:string;autoAdvance?:boolean;clock?:{setTimeout:(callback:()=>void,delay:number)=>unknown;clearTimeout:(id:unknown)=>void};onCommit?:(id:string,source:string,edge:PrototypeEdge)=>void});
  getSnapshot:()=>PrototypeSnapshot;subscribe:(listener:()=>void)=>()=>void;start:()=>void;stop:()=>void;click:(id:string)=>boolean;complete:(token:number)=>boolean;jump:(id:string)=>boolean;trace:unknown[];
}
