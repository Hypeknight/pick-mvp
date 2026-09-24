alter table public.picks
  add column if not exists is_public_browse boolean not null default false,
  add column if not exists is_featured boolean not null default false;

create index if not exists picks_public_feed_idx
  on public.picks (is_featured desc, created_at desc)
  where is_public_browse = true and status = 'active';

create or replace function public.get_public_pick_feed(p_limit integer default 20)
returns table(
  id uuid,
  slug text,
  question text,
  expires_at timestamptz,
  created_at timestamptz,
  is_featured boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.slug, p.question, p.expires_at, p.created_at, p.is_featured
  from public.picks p
  where p.is_public_browse = true
    and p.status = 'active'
    and (p.expires_at is null or p.expires_at > now())
  order by p.is_featured desc, p.created_at desc
  limit greatest(1, least(coalesce(p_limit,20),50));
$$;

grant execute on function public.get_public_pick_feed(integer) to anon, authenticated;
