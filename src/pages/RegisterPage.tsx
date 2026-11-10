import {Title,TextField,SvgButton,SocialIcons,at,asset} from '../components/FormControls';
import {useFormState} from '../design/form-state';
export function RegisterPage({onHotspot}:{onHotspot:(name:string)=>void}){const f=useFormState();return <>
  <Title left={232} top={91}>Sign up</Title>
  <TextField left={124} top={185} placeholder="Name" id="register-name" value={f.values.registerName} onChange={v=>f.set('registerName',v)}/>
  <TextField left={126} top={249} placeholder="Email/phone number" id="register-email" value={f.values.registerEmail} onChange={v=>f.set('registerEmail',v)}/>
  <TextField left={123} top={310} placeholder="Password" id="register-password" password value={f.values.registerPassword} onChange={v=>f.set('registerPassword',v)} revealed={f.eye.register} onReveal={()=>f.toggleEye('register')}/>
  <TextField left={123} top={374} placeholder="Confirm password" id="register-confirm" password value={f.values.registerConfirm} onChange={v=>f.set('registerConfirm',v)} revealed={f.eye.registerConfirm} onReveal={()=>f.toggleEye('registerConfirm')}/>
  <SvgButton name="signupbuton.svg" left={209} top={429} label="Sign up"/><p className="body-copy" style={at(257,482)}>Or sign up with</p><SocialIcons left={238} top={510}/>
  <p className="body-copy" style={at(185,559)}>Already have an account?</p><button type="button" className="text-link strong-link" style={at(395,559)} onClick={()=>onHotspot('link-to-login')} data-node-id="41:964">Sign in</button><img src={asset('bracelet-register.svg')} alt="" style={at(769,141)} draggable={false}/>
  </>;}
