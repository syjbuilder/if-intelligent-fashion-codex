-- 005_init_payments.sql — payments (V0 Extended, V0 Core 미사용)
-- docs/DATA_MODEL.md §15.10

create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id),
  plan_code           text not null references public.plans(code),
  provider            text not null,                          -- 'toss','kakaopay' 등
  provider_payment_id text not null,                          -- PG 트랜잭션 ID
  amount_krw          int not null,
  status              text not null,                          -- pending/paid/failed/refunded
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);
create index payments_user_idx on public.payments (user_id, created_at desc);
