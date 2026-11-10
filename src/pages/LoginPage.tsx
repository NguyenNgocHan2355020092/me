import {Title,TextField,SvgButton,SocialIcons,at,asset} from '../components/FormControls';
import {useFormState} from '../design/form-state';
export function LoginPage({onHotspot}:{onHotspot:(name:string)=>void}){const f=useFormState();return <>
  <Title left={825} top={96}>Log in</Title><img src={asset('bracelet-login.svg')} alt="" style={at(223,156)} draggable={false}/>
  <TextField left={708} top={202} placeholder="Email/phone number" id="login-email" value={f.values.loginEmail} onChange={v=>f.set('loginEmail',v)}/>
  <TextField left={708} top={278} placeholder="Password" id="login-password" password value={f.values.loginPassword} onChange={v=>f.set('loginPassword',v)} revealed={f.eye.login} onReveal={()=>f.toggleEye('login')}/>
  <button type="button" className="text-link forgot-link" style={at(1011,297)} onClick={()=>onHotspot('Forgot password?')} data-node-id="18:89">Forgot password?</button>
  <button type="button" className="svg-button checkbox" style={at(707,339,19,19)} aria-label="Remember me" aria-pressed={f.remembered} onClick={f.toggleRemembered}><img src={asset(f.remembered?'checkbox-checked.svg':'checkbox-empty.svg')} alt=""/>{!f.remembered&&<span className="empty-checkbox-fill"/>}</button>
  <p className="input-copy" style={at(726,340)}>Remember me</p><SvgButton name="loginbuton.svg" left={794} top={390} label="Log in"/>
  <p className="body-copy" style={at(849,452)}>Or log in with</p><SocialIcons left={823} top={479}/>
  <p className="body-copy" style={at(788,526)}>Don’t have account?</p><button type="button" className="text-link strong-link" style={at(956,526)} onClick={()=>onHotspot('link-to-register')} data-node-id="20:23">Sign up</button>
  </>;}
