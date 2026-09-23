'use client';
import {FormEvent,useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';

export default function Auth(){
  const router=useRouter();
  const supabase=createClient();
  const [mode,setMode]=useState<'signin'|'signup'>('signin');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    setMode(params.get('mode')==='signup'?'signup':'signin');
    supabase.auth.getUser().then(({data})=>{
      if(data.user) router.replace('/dashboard');
    });
  },[]);

  async function submit(e:FormEvent){
    e.preventDefault();
    setMsg('Working…');
    if(mode==='signup'){
      const {error}=await supabase.auth.signUp({email,password});
      setMsg(error?error.message:'Check your email to confirm your account, then sign in.');
      return;
    }
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setMsg(error.message);return;}
    router.push('/dashboard');
    router.refresh();
  }

  function switchMode(){
    const next=mode==='signup'?'signin':'signup';
    setMode(next);
    setMsg('');
    window.history.replaceState(null,'',next==='signup'?'/auth?mode=signup':'/auth?mode=signin');
  }

  return <main className="shell"><div className="card">
    <h1>{mode==='signup'?'Join PICK':'Sign in to PICK'}</h1>
    <p className="muted">Anyone can vote. An account lets you create, share, and manage your own PICKs.</p>
    <form onSubmit={submit}>
      <input className="field" type="email" placeholder="Email" required value={email} onChange={e=>setEmail(e.target.value)}/>
      <input className="field" type="password" placeholder="Password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)}/>
      <button className="primary">{mode==='signup'?'Create account':'Sign in'}</button>
    </form>
    {msg&&<p className="muted">{msg}</p>}
    <p className="muted">{mode==='signup'?'Already have an account? ':'New to PICK? '}
      <button className="textButton" type="button" onClick={switchMode}>{mode==='signup'?'Sign in':'Sign up'}</button>
    </p>
  </div></main>;
}
