create table if not exists public.admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('master','admin','moderator')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.admin_members enable row level security;

create or replace function public.is_pick_admin(p_roles text[] default array['master','admin','moderator'])
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admin_members a where a.user_id=(select auth.uid()) and a.role=any(p_roles)); $$;
revoke all on function public.is_pick_admin(text[]) from public;
grant execute on function public.is_pick_admin(text[]) to authenticated;

drop policy if exists "admins can read own admin membership" on public.admin_members;
create policy "admins can read own admin membership" on public.admin_members
for select to authenticated using(user_id=(select auth.uid()));

create or replace function public.get_admin_overview()
returns jsonb language sql stable security definer set search_path = ''
as $$
select case when not public.is_pick_admin() then jsonb_build_object('authorized',false)
else jsonb_build_object(
'authorized',true,
'users',(select count(*) from auth.users),
'picks',(select count(*) from public.picks),
'public_picks',(select count(*) from public.picks where is_public_browse=true),
'featured_picks',(select count(*) from public.picks where is_featured=true),
'votes',(select count(*) from public.votes)) end;
$$;
revoke all on function public.get_admin_overview() from public;
grant execute on function public.get_admin_overview() to authenticated;

create or replace function public.admin_set_pick_feed(p_pick_id uuid,p_public boolean,p_featured boolean default false)
returns void language plpgsql security definer set search_path = ''
as $$ begin
if not public.is_pick_admin(array['master','admin']) then raise exception 'Not authorized'; end if;
update public.picks set is_public_browse=p_public,is_featured=case when p_public then p_featured else false end where id=p_pick_id;
if not found then raise exception 'PICK not found'; end if;
end; $$;
revoke all on function public.admin_set_pick_feed(uuid,boolean,boolean) from public;
grant execute on function public.admin_set_pick_feed(uuid,boolean,boolean) to authenticated;

create or replace function public.get_admin_picks(p_limit integer default 100)
returns table(id uuid,slug text,question text,status text,is_public_browse boolean,is_featured boolean,created_at timestamptz,creator_id uuid)
language plpgsql stable security definer set search_path = ''
as $$ begin
if not public.is_pick_admin() then raise exception 'Not authorized'; end if;
return query select p.id,p.slug,p.question,p.status,p.is_public_browse,p.is_featured,p.created_at,p.creator_id
from public.picks p order by p.created_at desc limit greatest(1,least(coalesce(p_limit,100),250));
end; $$;
revoke all on function public.get_admin_picks(integer) from public;
grant execute on function public.get_admin_picks(integer) to authenticated;
