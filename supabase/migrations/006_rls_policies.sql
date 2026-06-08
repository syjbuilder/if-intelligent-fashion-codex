-- 006_rls_policies.sql — 전 테이블 RLS enable + SELECT 정책 (ADR-016, docs/DATA_MODEL.md §15.11)
-- 공통 원칙: 읽기는 본인/공개만. 쓰기 정책은 두지 않는다 → 기본 deny + service_role(서버 라우트)만 bypass.
-- (모든 write는 src/app/api/ 서버 라우트가 service_role 키로 수행 — RLS는 클라 직접 쓰기 차단 마지막 방어선.)

alter table public.users enable row level security;
create policy users_select_own on public.users
  for select using (auth.uid() = id);

alter table public.looks enable row level security;
create policy looks_select_public_or_own on public.looks
  for select using ((is_curated and visibility = 'public') or created_by = auth.uid());

alter table public.products enable row level security;
create policy products_select_all on public.products
  for select using (true);

alter table public.look_products enable row level security;
create policy look_products_select_inherit on public.look_products
  for select using (exists (
    select 1 from public.looks l
    where l.id = look_id
      and ((l.is_curated and l.visibility = 'public') or l.created_by = auth.uid())
  ));

alter table public.saved_looks enable row level security;
create policy saved_looks_select_own on public.saved_looks
  for select using (user_id = auth.uid());

alter table public.generation_history enable row level security;
create policy generation_history_select_own on public.generation_history
  for select using (user_id = auth.uid());

alter table public.prompt_intents enable row level security;
create policy prompt_intents_select_own on public.prompt_intents
  for select using (user_id = auth.uid());

alter table public.token_transactions enable row level security;
create policy token_transactions_select_own on public.token_transactions
  for select using (user_id = auth.uid());

alter table public.plans enable row level security;
create policy plans_select_all on public.plans
  for select using (true);

alter table public.payments enable row level security;
create policy payments_select_own on public.payments
  for select using (user_id = auth.uid());
