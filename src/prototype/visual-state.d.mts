type ContentState={x:number;y:number;opacity:number};
export interface VisualState {paper:{left:number;top:number;width:number;height:number};background:{left:number;top:number};rollerLeft:{left:number;top:number};rollerRight:{left:number;top:number};divider:{opacity:number};login:ContentState;register:ContentState;mail:ContentState;code:ContentState;newpass:ContentState;done:ContentState}
export function visualState(frame:unknown):VisualState;
