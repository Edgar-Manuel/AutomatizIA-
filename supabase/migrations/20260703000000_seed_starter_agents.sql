-- =============================================================================
-- Seed: two starter-tier agents (Ventas + Marketing).
-- Code lives in src/agents/cold-email-writer and src/agents/instagram-copy-generator.
-- =============================================================================

insert into public.agents (slug, name, description, department, tier_required, credits_cost, model)
values
  (
    'cold-email-writer',
    'Redactor de emails de prospección en frío',
    'Escribe secuencias de 3 emails personalizados por lead.',
    'ventas',
    'starter',
    1,
    'sonnet-4.6'
  ),
  (
    'instagram-copy-generator',
    'Generador de copys para Instagram',
    '5 variantes con hashtags y CTA según tu calendario editorial.',
    'marketing',
    'starter',
    1,
    'sonnet-4.6'
  )
on conflict (slug) do nothing;
