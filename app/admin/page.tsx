'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';

type Overview={authorized:boolean;users?:number;picks?:number;public_picks?:number;featured_picks?:number;votes?:number};
type Pick={id:string;slug:string;question:string;status:string;is_public_browse:boolean;is_featured:boolean;created_at:string;creator_id:string};

export default function AdminPage(){
 const s=createClient(),router=useRouter();
 const [overview,setOverview]=useState<Overview|null>(null),[picks,setPicks]=useState<Pick[]>([]),[role,setRole]=useState(''),[busy,setBusy]=useState('');
 async function load(){
  const {data:{user}}=await s.auth.getUser(); if(!user){router.replace('/auth?mode=signin');return}
  const {data:m}=await s.from('admin_members').select('role').eq('user_id',user.id).maybeSingle();
  if(!m){setOverview({authorized:false});return} setRole(m.role);
  const [{data:o},{data:p}]=await Promise.all([s.rpc('get_admin_overview'),s.rpc('get_admin_picks',{p_limit:100})]);
  setOverview(o as Overview);setPicks((p||[]) as Pick[]);
 }
 useEffect(()=>{load()},[]);
 async function setFeed(p:Pick,pub:boolean,featured:boolean){
  setBusy(p.id);const {error}=await s.rpc('admin_set_pick_feed',{p_pick_id:p.id,p_public:pub,p_featured:featured});
  if(error)alert(error.message);await load();setBusy('');
 }
 if(!overview)return <main className="shell"><div className="card">Loading Admin Control…</div></main>;
 if(!overview.authorized)return <main className="shell"><div className="card"><h1>Admin Control</h1><p className="error">This account does not have admin access.</p><Link href="/" className="secondary">Return home</Link></div></main>;
 return <main className="adminShell">
  <div className="adminTitle"><div><p className="feedEyebrow">PICK CONTROL</p><h1>Admin</h1><p className="muted">Signed in with <b>{role.toUpperCase()}</b> access.</p></div><Link className="primary" href="/create">+ Create PICK</Link></div>
  <section className="statGrid">
   <div className="statCard"><b>{overview.users??0}</b><span>Users</span></div>
   <div className="statCard"><b>{overview.picks??0}</b><span>PICKs</span></div>
   <div className="statCard"><b>{overview.votes??0}</b><span>Votes</span></div>
   <div className="statCard"><b>{overview.public_picks??0}</b><span>Public</span></div>
   <div className="statCard"><b>{overview.featured_picks??0}</b><span>Featured</span></div>
  </section>
  <section className="adminPanel"><div className="feedHeader"><div><p className="feedEyebrow">FEED CONTROL</p><h2>Recent PICKs</h2></div><button className="secondary" onClick={load}>Refresh</button></div>
  {picks.map(p=><article className="adminPick" key={p.id}><div className="adminPickBody"><div className="row"><span className={'statusPill '+(p.is_public_browse?'live':'')}>{p.is_public_browse?'PUBLIC':'LINK ONLY'}</span>{p.is_featured&&<span className="statusPill featured">FEATURED</span>}<span className="muted">{p.status}</span></div><h3>{p.question}</h3><Link className="feedLink" href={'/p/'+p.slug}>Open PICK →</Link></div><div className="adminActions">
   {p.is_public_browse?<button disabled={busy===p.id} className="secondary" onClick={()=>setFeed(p,false,false)}>Remove from feed</button>:<button disabled={busy===p.id} className="secondary" onClick={()=>setFeed(p,true,false)}>Make public</button>}
   {p.is_public_browse&&(p.is_featured?<button disabled={busy===p.id} className="secondary" onClick={()=>setFeed(p,true,false)}>Unfeature</button>:<button disabled={busy===p.id} className="primary" onClick={()=>setFeed(p,true,true)}>Feature</button>)}
  </div></article>)}
  </section>
 </main>
}
