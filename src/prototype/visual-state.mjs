const bases = { login: {x:226,y:96}, register:{x:123,y:91}, mail:{x:370,y:180}, code:{x:216,y:195}, newpass:{x:240,y:181}, done:{x:232,y:255} };
function semantic(group) {
  if(group.name==='content-login')return 'login';
  if(group.name==='content-register')return 'register';
  if(group.name==='resetpass'){
    if(Math.abs(group.w-441)<1)return 'mail';
    if(Math.abs(group.w-725)<1)return 'code';
    if(Math.abs(group.w-681)<1)return 'newpass';
    if(Math.abs(group.w-767)<1)return 'done';
  }
  return null;
}
export function visualState(frame){
  const p=frame.paper; const background=p.children.find(c=>c.name==='paper');
  const line=p.children.find(c=>c.name==='Line 2');
  const left=frame.children.find(c=>c.name==='roller-left');const right=frame.children.find(c=>c.name==='roller-right');
  const result={paper:{left:p.x,top:p.y,width:p.width,height:p.height},background:{left:background?.x??0,top:background?.y??0},rollerLeft:{left:left.x,top:left.y},rollerRight:{left:right.x,top:right.y},divider:{opacity:line?.opacity??0}};
  for(const[key,base]of Object.entries(bases))result[key]={x:0,y:0,opacity:0};
  for(const group of p.children){const key=semantic(group);if(key)result[key]={x:group.x-bases[key].x,y:group.y-bases[key].y,opacity:group.opacity};}
  return result;
}
