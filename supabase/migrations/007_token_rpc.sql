-- 007_token_rpc.sql — consume_tokens()·refund_tokens() (ADR-014, docs/DATA_MODEL.md §15.12)
-- 동시 요청·더블클릭의 이중 차감·음수 잔액·환불 누락을 단일 트랜잭션 + 행 잠금으로 차단.
-- 새 테이블 없음 — users·token_transactions만 사용. ADR-012 차감 양/개수는 불변(방식만 안전화).

-- 토큰 차감: 생성 호출 전 선차감. p_amount는 항상 10 (ADR-012).
create or replace function public.consume_tokens(
  p_user_id uuid,
  p_amount int,
  p_reason text,
  p_idempotency_key text,
  p_related_generation_id uuid
) returns public.token_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.token_transactions;
  v_balance  int;
  v_tx       public.token_transactions;
begin
  -- 1) 사용자 행 잠금 (동시 차감 직렬화)
  select token_balance into v_balance from public.users where id = p_user_id for update;
  if not found then
    raise exception 'user not found: %', p_user_id;
  end if;

  -- 2) 멱등성: 같은 (user_id, idempotency_key) 기존 거래가 있으면 차감 없이 그대로 반환
  if p_idempotency_key is not null then
    select * into v_existing from public.token_transactions
      where user_id = p_user_id and idempotency_key = p_idempotency_key
      limit 1;
    if found then
      return v_existing;
    end if;
  end if;

  -- 3) 잔액 확인 (부족 시 서버는 402 매핑)
  if v_balance < p_amount then
    raise exception 'insufficient token balance: % < %', v_balance, p_amount
      using errcode = 'P0001';
  end if;

  -- 4) spend 거래 기록 (음수 amount)
  insert into public.token_transactions
    (user_id, transaction_type, amount, reason, idempotency_key, related_generation_id)
  values
    (p_user_id, 'spend', -p_amount, p_reason, p_idempotency_key, p_related_generation_id)
  returning * into v_tx;

  -- 5) 잔액 차감 (CHECK (token_balance >= 0)가 최종 backstop)
  update public.users set token_balance = token_balance - p_amount where id = p_user_id;

  return v_tx;
end;
$$;

-- 토큰 환불: 생성 실패·룩 3장 미달(all-or-nothing) 시 전액(10) 환불.
create or replace function public.refund_tokens(
  p_user_id uuid,
  p_amount int,
  p_idempotency_key text,
  p_related_generation_id uuid
) returns public.token_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.token_transactions;
  v_tx       public.token_transactions;
begin
  -- 1) 사용자 행 잠금
  perform 1 from public.users where id = p_user_id for update;
  if not found then
    raise exception 'user not found: %', p_user_id;
  end if;

  -- 2) 멱등성: 환불 키(예: 원 spend 키 + ':refund')로 기존 환불 있으면 그대로 반환(이중 환불 방지)
  if p_idempotency_key is not null then
    select * into v_existing from public.token_transactions
      where user_id = p_user_id and idempotency_key = p_idempotency_key
      limit 1;
    if found then
      return v_existing;
    end if;
  end if;

  -- 3) refund 거래 기록 (양수 amount)
  insert into public.token_transactions
    (user_id, transaction_type, amount, reason, idempotency_key, related_generation_id)
  values
    (p_user_id, 'refund', p_amount, 'generation', p_idempotency_key, p_related_generation_id)
  returning * into v_tx;

  -- 4) 잔액 복구
  update public.users set token_balance = token_balance + p_amount where id = p_user_id;

  return v_tx;
end;
$$;

-- 서버(service_role)만 호출 — anon/authenticated 직접 실행 차단.
revoke all on function public.consume_tokens(uuid, int, text, text, uuid) from public, anon, authenticated;
revoke all on function public.refund_tokens(uuid, int, text, uuid) from public, anon, authenticated;
