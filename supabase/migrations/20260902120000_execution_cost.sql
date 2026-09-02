-- -----------------------------------------------------------------------------
-- Per-execution cost tracking.
--
-- The token columns already existed on agent_executions but were never
-- written. This adds the money column that goes with them: the Anthropic list
-- price of the run in micro dollars (1e-6 USD), stored as an integer so no
-- floating point rounding is persisted.
-- -----------------------------------------------------------------------------

alter table public.agent_executions
  add column if not exists cost_usd_micros integer;

comment on column public.agent_executions.cost_usd_micros is
  'Anthropic list-price cost of this execution in micro dollars (1e-6 USD).';

-- Unit economics are always read per organization over a time range: what did
-- this customer cost us this month versus the credits they spent.
create index if not exists agent_executions_cost_idx
  on public.agent_executions (organization_id, created_at desc)
  where cost_usd_micros is not null;
