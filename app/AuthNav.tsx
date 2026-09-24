'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';
export default function AuthNav(){
 const s=createClient(),r=useRouter();const [signed,setSigned]=useState(false),[admin,setAdmin]=useState(false);
 useEffect(()=>{async function sync(){const {data:{user}}=await s.auth.getUser();setSigned(!!user);if(user){const {data}=await s.from('admin_members').select('role').eq('user_id',user.id).maybeSingle();setAdmin(!!data)}else setAdmin(false)}sync();const {data}=s.auth.onAuthStateChange(()=>sync());return()=>data.subscription.unsubscribe()},[]);
 async function out(){await s.auth.signOut();setSigned(false);setAdmin(false);r.push('/');r.refresh()}
 return <div className="row">{signed?<>{admin&&<Link href="/admin">Admin</Link>}<Link href="/create">Create</Link><Link href="/dashboard">My Picks</Link><button className="navButton" onClick={out}>Sign out</button></>:<><Link href="/create">Create</Link><Link href="/auth?mode=signin">Sign in</Link><Link className="navSignup" href="/auth?mode=signup">Sign up</Link></>}</div>
}
