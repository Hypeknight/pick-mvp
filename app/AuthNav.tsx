'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';
export default function AuthNav(){const s=createClient(),r=useRouter();const [on,setOn]=useState<boolean|null>(null);useEffect(()=>{s.auth.getUser().then(({data})=>setOn(!!data.user));const {data:x}=s.auth.onAuthStateChange((_e,z)=>setOn(!!z?.user));return()=>x.subscription.unsubscribe()},[]);async function out(){await s.auth.signOut();setOn(false);r.push('/');r.refresh()}return <div className="row"><Link href="/create">Create</Link>{on?<><Link href="/dashboard">My Picks</Link><button className="navButton" onClick={out}>Sign out</button></>:on===false?<><Link href="/auth?mode=signin">Sign in</Link><Link className="navSignup" href="/auth?mode=signup">Sign up</Link></>:null}</div>}
