-- 008_users_email_nullable.sql — users.email을 선택값으로 완화 (ADR-019, docs/DATA_MODEL.md §15.1)
-- 일반(비-비즈) Kakao 앱은 account_email 동의항목을 쓸 수 없어(KOE205) 이메일 없는 가입이 발생한다.
-- email NOT NULL을 풀고, 가입 trigger가 빈 문자열을 null로 정규화하도록 보강. unique 제약은 유지
-- (Postgres는 null을 서로 구별 → 이메일 없는 가입 다건 허용). 차감/grant 로직(ADR-012/014) 불변.

alter table public.users alter column email drop not null;

-- 가입 grant 트리거 보강: 이메일 없는 provider(kakao 비-비즈) 대응 — 빈 문자열→null 정규화.
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
    nullif(new.email, ''),
    10
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
