-- 003_init_saved_history.sql — saved_looks, prompt_intents, generation_history
-- docs/DATA_MODEL.md §15.5~15.7. (prompt_intents를 generation_history보다 먼저 — FK 순서)

create table public.saved_looks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  look_id    uuid not null references public.looks(id) on delete cascade,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  unique (user_id, look_id)
);

create table public.prompt_intents (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  raw_prompt     text not null,
  parsed_json    jsonb not null,                              -- LLM 파싱 결과 전체
  season         text,
  situation_tags text[] not null default '{}',
  mood_tags      text[] not null default '{}',
  budget         int,                                         -- KRW
  created_at     timestamptz not null default now()
);

create table public.generation_history (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.users(id) on delete cascade,
  prompt                text not null,
  interpreted_prompt_id uuid references public.prompt_intents(id),
  generated_look_id     uuid references public.looks(id),     -- 실패 시 null
  status                text not null,                        -- pending/success/failed
  parent_history_id     uuid references public.generation_history(id),  -- mini-action turn (ADR-009)
  trigger_type          text not null default 'fresh',        -- fresh/regenerate/chip_refine/more_like_this
  pipeline_source       text,                                 -- curated_only/mixed/generated_only (telemetry, UI 비노출)
  match_score           real,                                 -- B-path 매칭 점수 (AI_PIPELINE §4)
  created_at            timestamptz not null default now()
);
create index generation_history_user_idx on public.generation_history (user_id, created_at desc);
