-- =============================================================================
-- AutomatizIA, Phase 1 walking skeleton
-- Tables, enums, indexes, RLS policies, trigger for new user bootstrap,
-- and atomic credit charge function.
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type subscription_tier as enum ('free', 'starter', 'business', 'scale');
create type subscription_status as enum ('active', 'past_due', 'canceled', 'trialing');
create type department as enum ('ventas', 'marketing', 'atencion_cliente', 'operaciones', 'rrhh', 'finanzas');
create type agent_tier as enum ('starter', 'business', 'scale');
create type agent_model as enum ('haiku-4.5', 'sonnet-4.6', 'opus-4.7');
create type execution_status as enum ('pending', 'running', 'succeeded', 'failed');
create type credit_reason as enum (
  'signup_bonus',
  'agent_execution',
  'agent_refund',
  'stripe_topup',
  'adjustment'
);

-- -----------------------------------------------------------------------------
-- users (mirror of auth.users for app-level data)
-- -----------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- organizations (in Phase 1: 1 user = 1 org, owner_id non-null)
-- -----------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);
create index organizations_owner_id_idx on public.organizations(owner_id);

-- -----------------------------------------------------------------------------
-- subscriptions (Stripe wires in Phase 2; for now we default to 'free')
-- -----------------------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  tier subscription_tier not null default 'free',
  status subscription_status not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- credits: balance (cached) + immutable ledger
-- -----------------------------------------------------------------------------
create table public.credit_balances (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  delta integer not null,
  reason credit_reason not null,
  agent_execution_id uuid,
  idempotency_key text unique,
  created_at timestamptz not null default now()
);
create index credit_ledger_org_idx on public.credit_ledger(organization_id, created_at desc);

-- -----------------------------------------------------------------------------
-- agents catalog (one row per slug; code lives in src/agents/<slug>)
-- -----------------------------------------------------------------------------
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  department department not null,
  tier_required agent_tier not null,
  credits_cost integer not null check (credits_cost > 0),
  model agent_model not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- agent_executions
-- -----------------------------------------------------------------------------
create table public.agent_executions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  agent_id uuid not null references public.agents(id),
  agent_slug text not null,
  status execution_status not null default 'pending',
  input jsonb not null,
  output jsonb,
  error_message text,
  model_used text,
  input_tokens integer,
  output_tokens integer,
  cache_read_tokens integer,
  cache_write_tokens integer,
  credits_charged integer not null default 0,
  duration_ms integer,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index agent_executions_org_idx on public.agent_executions(organization_id, created_at desc);
create index agent_executions_user_idx on public.agent_executions(user_id, created_at desc);

alter table public.credit_ledger
  add constraint credit_ledger_execution_fk
  foreign key (agent_execution_id)
  references public.agent_executions(id)
  on delete set null;

-- -----------------------------------------------------------------------------
-- updated_at trigger helper
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subscriptions_touch_updated_at
before update on public.subscriptions
for each row execute function public.touch_updated_at();

create trigger credit_balances_touch_updated_at
before update on public.credit_balances
for each row execute function public.touch_updated_at();

-- =============================================================================
-- New user bootstrap
-- On auth.users INSERT: create public.users row, default org, free subscription,
-- credit balance with 20 credits welcome bonus + matching ledger entry.
-- =============================================================================
create or replace function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  base_slug text;
  candidate_slug text;
  collision integer;
  suffix integer := 0;
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );

  base_slug := regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'org';
  end if;
  candidate_slug := base_slug;
  loop
    select count(*) into collision from public.organizations where slug = candidate_slug;
    exit when collision = 0;
    suffix := suffix + 1;
    candidate_slug := base_slug || '-' || suffix::text;
  end loop;

  insert into public.organizations (owner_id, name, slug)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), candidate_slug)
  returning id into new_org_id;

  insert into public.subscriptions (organization_id, tier, status)
  values (new_org_id, 'free', 'active');

  insert into public.credit_balances (organization_id, balance)
  values (new_org_id, 20);

  insert into public.credit_ledger (organization_id, delta, reason, idempotency_key)
  values (new_org_id, 20, 'signup_bonus', 'signup_bonus:' || new_org_id::text);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =============================================================================
-- Atomic credit charge
-- Locks the balance row, validates funds, decrements balance, inserts ledger.
-- Returns the new balance. Raises 'insufficient_credits' if not enough.
-- Idempotent via unique key on credit_ledger.
-- =============================================================================
create or replace function public.charge_credits(
  p_organization_id uuid,
  p_amount integer,
  p_agent_execution_id uuid,
  p_idempotency_key text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_new_balance integer;
  v_existing uuid;
begin
  if p_amount <= 0 then
    raise exception 'amount_must_be_positive' using errcode = '22023';
  end if;

  -- idempotency short-circuit
  select id into v_existing
  from public.credit_ledger
  where idempotency_key = p_idempotency_key;
  if v_existing is not null then
    select balance into v_new_balance
    from public.credit_balances
    where organization_id = p_organization_id;
    return v_new_balance;
  end if;

  select balance into v_balance
  from public.credit_balances
  where organization_id = p_organization_id
  for update;

  if v_balance is null then
    raise exception 'organization_not_found' using errcode = 'P0002';
  end if;

  if v_balance < p_amount then
    raise exception 'insufficient_credits' using errcode = 'P0001';
  end if;

  update public.credit_balances
  set balance = balance - p_amount
  where organization_id = p_organization_id
  returning balance into v_new_balance;

  insert into public.credit_ledger (organization_id, delta, reason, agent_execution_id, idempotency_key)
  values (p_organization_id, -p_amount, 'agent_execution', p_agent_execution_id, p_idempotency_key);

  return v_new_balance;
end;
$$;

-- Reverse a previously charged amount (used when agent execution fails).
create or replace function public.refund_credits(
  p_organization_id uuid,
  p_amount integer,
  p_agent_execution_id uuid,
  p_idempotency_key text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_balance integer;
  v_existing uuid;
begin
  if p_amount <= 0 then
    raise exception 'amount_must_be_positive' using errcode = '22023';
  end if;

  select id into v_existing
  from public.credit_ledger
  where idempotency_key = p_idempotency_key;
  if v_existing is not null then
    select balance into v_new_balance
    from public.credit_balances
    where organization_id = p_organization_id;
    return v_new_balance;
  end if;

  update public.credit_balances
  set balance = balance + p_amount
  where organization_id = p_organization_id
  returning balance into v_new_balance;

  if v_new_balance is null then
    raise exception 'organization_not_found' using errcode = 'P0002';
  end if;

  insert into public.credit_ledger (organization_id, delta, reason, agent_execution_id, idempotency_key)
  values (p_organization_id, p_amount, 'agent_refund', p_agent_execution_id, p_idempotency_key);

  return v_new_balance;
end;
$$;

-- =============================================================================
-- Row Level Security
-- Default: deny. We add explicit per-table policies tied to organization membership.
-- In Phase 1, membership = (organizations.owner_id = auth.uid()).
-- A future organization_members table will replace this predicate in Phase 2+.
-- =============================================================================

alter table public.users enable row level security;
alter table public.organizations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.credit_balances enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.agents enable row level security;
alter table public.agent_executions enable row level security;

-- users: user can read and update their own row
create policy users_self_read on public.users
  for select using (id = auth.uid());
create policy users_self_update on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());

-- organizations: owner reads/updates their own org, no inserts via client
create policy orgs_owner_read on public.organizations
  for select using (owner_id = auth.uid());
create policy orgs_owner_update on public.organizations
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- subscriptions: read only for org owner
create policy subs_owner_read on public.subscriptions
  for select using (
    organization_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- credit_balances: read only for org owner
create policy balances_owner_read on public.credit_balances
  for select using (
    organization_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- credit_ledger: read only for org owner
create policy ledger_owner_read on public.credit_ledger
  for select using (
    organization_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- agents catalog: any authenticated user can read active agents
create policy agents_authenticated_read on public.agents
  for select using (auth.role() = 'authenticated' and is_active = true);

-- agent_executions: org owner can read their own org executions
create policy executions_owner_read on public.agent_executions
  for select using (
    organization_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- Mutations on credits and executions are funneled through server actions using the
-- service_role key, which bypasses RLS. No client-side INSERT/UPDATE policies.

-- =============================================================================
-- Seed: the single Phase 1 agent (Google reviews responder)
-- =============================================================================
insert into public.agents (slug, name, description, department, tier_required, credits_cost, model)
values (
  'google-reviews-responder',
  'Generador de respuestas a reseñas Google',
  'Responde a reseñas con el tono de tu negocio en 6 segundos.',
  'atencion_cliente',
  'business',
  2,
  'sonnet-4.6'
)
on conflict (slug) do nothing;
