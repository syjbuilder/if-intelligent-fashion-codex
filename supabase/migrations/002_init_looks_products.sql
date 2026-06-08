-- 002_init_looks_products.sql — looks, products, look_products
-- docs/DATA_MODEL.md §15.2~15.4. products 캡션 컬럼 확정 (§15.3 메모, AI_PIPELINE §2·§9).

create table public.looks (
  id                  uuid primary key default gen_random_uuid(),
  title               text,
  base_prompt         text not null,
  generated_image_url text not null,                          -- Supabase Storage 경로만 (OpenAI 24h URL 금지)
  season              text,                                   -- spring/summer/fall/winter/all
  situation_tags      text[] not null default '{}',
  mood_tags           text[] not null default '{}',
  color_tags          text[] not null default '{}',
  fit_tags            text[] not null default '{}',
  target_user_tags    text[] not null default '{}',
  visibility          text not null default 'private',        -- private/public
  is_curated          boolean not null default false,
  created_by          uuid references public.users(id) on delete set null,  -- curated는 null
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create trigger looks_set_updated_at before update on public.looks
  for each row execute function public.set_updated_at();
create index looks_curated_visibility_idx on public.looks (is_curated, visibility);  -- Explore 피드
create index looks_situation_tags_idx on public.looks using gin (situation_tags);     -- 상황 검색
create index looks_created_by_idx on public.looks (created_by, created_at desc);       -- 사용자 히스토리

create table public.products (
  id                 uuid primary key default gen_random_uuid(),
  product_name       text not null,
  brand_name         text,
  source_platform    text,                                    -- '29CM','MUSINSA','브랜드자사몰'
  product_url        text not null,
  image_url          text not null,
  price              int,                                     -- KRW
  category           text not null,                           -- top/bottom/dress/outer
  subcategory        text,
  color              text,
  fit                text,                                    -- slim/regular/oversized
  material           text,
  mood_tags          text[] not null default '{}',
  season_tags        text[] not null default '{}',
  situation_tags     text[] not null default '{}',
  caption_simple     text,                                    -- AI_PIPELINE §2 (확정 지점)
  caption_searchable text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create index products_category_subcategory_idx on public.products (category, subcategory);
create index products_source_platform_idx on public.products (source_platform);
create index products_tags_idx on public.products using gin (mood_tags, season_tags, situation_tags);

create table public.look_products (
  id                  uuid primary key default gen_random_uuid(),
  look_id             uuid not null references public.looks(id) on delete cascade,
  product_id          uuid not null references public.products(id) on delete cascade,
  item_role           text not null,                          -- main_top/main_bottom/main_outer/similar/related
  recommendation_type text not null,                          -- main_combo/similar/related
  sort_order          int not null default 0,
  created_at          timestamptz not null default now(),
  unique (look_id, product_id, item_role)
);
