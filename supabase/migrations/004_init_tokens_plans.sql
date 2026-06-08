-- 004_init_tokens_plans.sql — token_transactions, plans + free/pro/max 시드
-- docs/DATA_MODEL.md §15.8~15.9 / ADR-012(토큰 단위)·ADR-014(멱등성)

create table public.token_transactions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.users(id) on delete cascade,
  transaction_type      text not null,                        -- grant/spend/refund/expire
  amount                int not null,                         -- spend 음수, grant/refund 양수 (generation spend=-10)
  reason                text not null,                        -- generation/more_like_this/demo_prompt/monthly_grant 등
  related_generation_id uuid references public.generation_history(id),
  idempotency_key       text,                                 -- X-Idempotency-Key (spend/refund 필수, cron은 null)
  created_at            timestamptz not null default now()
);
-- 멱등성 (ADR-014): idempotency_key가 NULL이 아닐 때만 (user_id, key) 유일 (partial unique).
create unique index token_transactions_idempotency_uniq
  on public.token_transactions (user_id, idempotency_key)
  where idempotency_key is not null;
create index token_transactions_user_idx on public.token_transactions (user_id, created_at desc);

create table public.plans (
  code                text primary key,                       -- free/pro/max
  display_name        text not null,
  monthly_token_grant int not null default 0,                 -- 의미는 ADR-012
  monthly_price_krw   int not null default 0,
  max_saved_looks     int,                                    -- null = 무제한 (Max)
  features            jsonb not null default '{}',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

-- V0 초기 시드 (ADR-012 기준, free=Pro=5 누적 슬롯은 의도된 설계 — Pro 차별화는 V0 Extended)
insert into public.plans (code, display_name, monthly_token_grant, monthly_price_krw, max_saved_looks, features, is_active) values
  ('free', '무료', 10,  0,     5,    '{}'::jsonb, true),
  ('pro',  'Pro',  100, 9900,  5,    '{"advanced_filters":true}'::jsonb, true),
  ('max',  'Max',  200, 19900, null, '{"advanced_filters":true,"unlimited_saved":true}'::jsonb, true);
