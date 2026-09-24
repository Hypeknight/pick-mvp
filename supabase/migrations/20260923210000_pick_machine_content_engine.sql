alter table public.picks
  add column if not exists category text,
  add column if not exists source_type text not null default 'user' check (source_type in ('user','system'));

create table if not exists public.pick_machine_queue (
 id uuid primary key default gen_random_uuid(), question text not null check(char_length(question) between 3 and 280),
 choices jsonb not null, category text not null, status text not null default 'draft' check(status in ('draft','approved','published','rejected')),
 featured boolean not null default false, expires_minutes integer, created_by uuid references auth.users(id) on delete set null,
 published_pick_id uuid references public.picks(id) on delete set null, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(), published_at timestamptz,
 constraint pick_machine_choices_valid check(jsonb_typeof(choices)='array' and jsonb_array_length(choices) between 2 and 4)
);
alter table public.pick_machine_queue enable row level security;

create or replace function public.get_pick_machine_queue(p_limit integer default 100)
returns table(id uuid,question text,choices jsonb,category text,status text,featured boolean,expires_minutes integer,created_at timestamptz,published_pick_id uuid)
language plpgsql stable security definer set search_path='' as $$ begin
 if not public.is_pick_admin() then raise exception 'Not authorized'; end if;
 return query select q.id,q.question,q.choices,q.category,q.status,q.featured,q.expires_minutes,q.created_at,q.published_pick_id
 from public.pick_machine_queue q order by q.created_at desc limit greatest(1,least(coalesce(p_limit,100),250)); end; $$;
revoke all on function public.get_pick_machine_queue(integer) from public; grant execute on function public.get_pick_machine_queue(integer) to authenticated;

create or replace function public.admin_add_machine_pick(p_question text,p_choices jsonb,p_category text,p_featured boolean default false,p_expires_minutes integer default 1440)
returns uuid language plpgsql security definer set search_path='' as $$ declare new_id uuid; begin
 if not public.is_pick_admin(array['master','admin']) then raise exception 'Not authorized'; end if;
 if jsonb_typeof(p_choices)<>'array' or jsonb_array_length(p_choices) not between 2 and 4 then raise exception 'PICK needs 2-4 choices'; end if;
 insert into public.pick_machine_queue(question,choices,category,featured,expires_minutes,created_by)
 values(trim(p_question),p_choices,trim(p_category),p_featured,p_expires_minutes,(select auth.uid())) returning id into new_id; return new_id; end; $$;
revoke all on function public.admin_add_machine_pick(text,jsonb,text,boolean,integer) from public; grant execute on function public.admin_add_machine_pick(text,jsonb,text,boolean,integer) to authenticated;

create or replace function public.admin_publish_machine_pick(p_queue_id uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare q public.pick_machine_queue%rowtype; new_pick uuid; new_slug text; item jsonb; pos integer:=0;
begin
 if not public.is_pick_admin(array['master','admin']) then raise exception 'Not authorized'; end if;
 select * into q from public.pick_machine_queue where id=p_queue_id for update;
 if not found then raise exception 'Queue item not found'; end if;
 if q.status='published' then return q.published_pick_id; end if;
 new_slug:=lower(substr(replace(gen_random_uuid()::text,'-',''),1,10));
 insert into public.picks(creator_id,question,slug,expires_at,is_public_browse,is_featured,category,source_type)
 values((select auth.uid()),q.question,new_slug,case when q.expires_minutes is null or q.expires_minutes=0 then null else now()+(q.expires_minutes||' minutes')::interval end,true,q.featured,q.category,'system') returning id into new_pick;
 for item in select value from jsonb_array_elements(q.choices) loop pos:=pos+1; insert into public.pick_choices(pick_id,label,position) values(new_pick,item#>>'{}',pos); end loop;
 update public.pick_machine_queue set status='published',published_pick_id=new_pick,published_at=now(),updated_at=now() where id=p_queue_id; return new_pick; end; $$;
revoke all on function public.admin_publish_machine_pick(uuid) from public; grant execute on function public.admin_publish_machine_pick(uuid) to authenticated;

create or replace function public.admin_reject_machine_pick(p_queue_id uuid)
returns void language plpgsql security definer set search_path='' as $$ begin
 if not public.is_pick_admin(array['master','admin']) then raise exception 'Not authorized'; end if;
 update public.pick_machine_queue set status='rejected',updated_at=now() where id=p_queue_id and status<>'published'; end; $$;
revoke all on function public.admin_reject_machine_pick(uuid) from public; grant execute on function public.admin_reject_machine_pick(uuid) to authenticated;
