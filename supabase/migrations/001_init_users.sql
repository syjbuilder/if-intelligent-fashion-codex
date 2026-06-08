-- 001_init_users.sql — users + 공용 updated_at 트리거 + 가입 grant 멱등 trigger
-- docs/DATA_MODEL.md §15.1 / ADR-012(가입 10토큰)·ADR-014(CHECK)·ADR-016(role·가입 멱등)

-- 공용: updated_at 자동 갱신 트리거 함수 (users/looks/products 공유)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.users (
  id            uuid primary key default gen_random_uuid(),  -- Supabase auth.users.id와 1:1
  auth_provider text not null,                                -- 'google','kakao','naver'
  email         text not null unique,
  nickname      text,
  plan_type     text not null default 'free',                -- plans.code 참조
  token_balance int  not null default 0 check (token_balance >= 0),  -- 음수 backstop (ADR-014)
  role          text not null default 'user',                -- 'user','admin' (ADR-016)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- 가입 grant 멱등 (ADR-016): Supabase Auth 신규 가입 시 1회만 10토큰(ADR-012).
-- raw_app_meta_data.provider에서 auth_provider 추출. ON CONFLICT로 중복 이벤트에도 1회만.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, auth_provider, email, token_balance)
  values (
    new.id,
    coalesce(new.raw_app_meta_data->>'provider', 'unknown'),
    new.email,
    10
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
