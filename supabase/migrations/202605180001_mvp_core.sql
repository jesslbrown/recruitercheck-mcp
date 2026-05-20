-- RecruiterCheck MVP core schema
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  key_hash text not null unique,
  label text,
  revoked boolean not null default false,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists flagged_domains (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  reason text,
  source text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  api_key_id uuid references api_keys(id) on delete set null,
  tool_name text not null,
  input_payload jsonb not null,
  result_payload jsonb not null,
  risk_score integer,
  risk_level text,
  verdict text,
  created_at timestamptz not null default now()
);

create index if not exists idx_api_keys_key_hash on api_keys(key_hash);
create index if not exists idx_scans_user_created_at on scans(user_id, created_at desc);
create index if not exists idx_scans_tool_created_at on scans(tool_name, created_at desc);
create index if not exists idx_flagged_domains_domain_active on flagged_domains(domain, active);
