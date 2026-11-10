import { createContext,useContext,useState } from 'react';
import type { ReactNode } from 'react';
const initialValues={loginEmail:'',loginPassword:'',registerName:'',registerEmail:'',registerPassword:'',registerConfirm:'',recoveryEmail:'',passcode:'',newPassword:'',newConfirm:''};
type Values=typeof initialValues;type Field=keyof Values;
type Store={values:Values;set:(key:Field,value:string)=>void;eye:Record<string,boolean>;toggleEye:(key:string)=>void;remembered:boolean;toggleRemembered:()=>void};
const Context=createContext<Store|null>(null);
export function FormStateProvider({children}:{children:ReactNode}){const[values,setValues]=useState(initialValues);const[eye,setEye]=useState<Record<string,boolean>>({});const[remembered,setRemembered]=useState(true);return <Context.Provider value={{values,set:(key,value)=>setValues(old=>({...old,[key]:value})),eye,toggleEye:key=>setEye(old=>({...old,[key]:!old[key]})),remembered,toggleRemembered:()=>setRemembered(old=>!old)}}>{children}</Context.Provider>;}
export function useFormState(){const v=useContext(Context);if(!v)throw new Error('FormStateProvider missing');return v;}
