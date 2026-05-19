# AutomatizIA

SaaS B2B que agrupa agentes de IA listos para usar, organizados por departamento,
para PYMEs hispanohablantes.

Estado: **Fase 1, walking skeleton**. Landing pública + auth + un agente real
("Generador de respuestas a reseñas Google") ejecutándose contra Anthropic API
con descuento atómico de créditos.

## Stack

- Next.js 16 (App Router) + TypeScript estricto
- Tailwind v4 + Biome (lint + format)
- Supabase (Postgres + Auth) en local
- Drizzle ORM (queries tipadas, schema en `src/db/schema`)
- Anthropic SDK con prompt caching
- pnpm como package manager
- Vitest para tests

## Setup local

```bash
# 1. Dependencias
pnpm install

# 2. Variables de entorno
cp .env.example .env.local
# Rellena ANTHROPIC_API_KEY. El resto vienen del paso 3.

# 3. Supabase local (necesitas Docker corriendo)
pnpm supabase:start
# Cuando termine te imprime las claves. Copia anon key y service_role
# en .env.local (NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY).
# La migración inicial (supabase/migrations/) se aplica automáticamente.

# 4. Arranca el dev server
pnpm dev
```

Abre `http://localhost:3000`, regístrate en `/signup`, abre el agente y ejecuta.

### Comandos útiles

```bash
pnpm dev              # Next dev
pnpm build            # build producción
pnpm typecheck        # tsc --noEmit
pnpm lint             # biome check
pnpm lint:fix         # biome check --write
pnpm test             # vitest run
pnpm test:watch       # vitest watch

pnpm supabase:start   # arranca postgres + auth en local
pnpm supabase:stop    # detiene servicios locales
pnpm supabase:reset   # resetea la base y reaplica migraciones
pnpm supabase:types   # regenera tipos TypeScript de Supabase

pnpm db:studio        # drizzle studio UI
```

## Arquitectura

```
src/
├── app/
│   ├── (auth)/{login,signup}     # páginas públicas de auth
│   ├── (app)/                    # app autenticada, layout con sidebar+topbar
│   │   ├── page.tsx              # dashboard
│   │   ├── agents/[slug]/page.tsx
│   │   └── billing/page.tsx
│   ├── auth/callback/route.ts    # OAuth callback Supabase
│   ├── layout.tsx                # fuentes + globals
│   └── page.tsx                  # landing pública
├── agents/                       # un directorio por agente
│   ├── _contract.ts              # interfaz Agent
│   ├── _registry.ts              # mapa slug -> agente
│   └── google-reviews-responder/
├── components/
│   ├── agents/agent-runner.tsx   # form dinámico + render
│   ├── app/{sidebar,topbar}.tsx
│   ├── auth/auth-form.tsx
│   └── landing/                  # secciones de la landing
├── db/
│   ├── schema/                   # drizzle, una tabla por archivo
│   └── client.ts                 # cliente postgres-js + drizzle
├── lib/
│   ├── anthropic/                # cliente SDK + routing modelo
│   ├── auth/session.ts           # getSession, requireSession
│   ├── credits/                  # charge atómica + budgets
│   ├── supabase/                 # clientes server/browser
│   ├── errors.ts                 # AppError + traducción Anthropic
│   └── logger.ts                 # pino
├── server/
│   └── actions/                  # server actions
├── middleware.ts                 # protección de rutas
└── tests/                        # vitest
supabase/
├── config.toml
└── migrations/
    └── 20260519000000_init.sql   # schema + RLS + funciones + seed
```

## Decisiones tomadas

- **1 usuario = 1 organización** en Fase 1. Las invitaciones y los roles llegan en Fase 2.
- **Trigger en `auth.users`**: al registrarse se crean `users` + `organizations` + `subscriptions` + `credit_balances` + entrada de `credit_ledger` con 20 créditos de bienvenida.
- **Cobro atómico de créditos** via función Postgres `charge_credits` con `for update` sobre `credit_balances`. La función es idempotente por `idempotency_key`. Si la ejecución falla, se reembolsa con `refund_credits`.
- **RLS** estricto por defecto. Las mutaciones críticas pasan por Server Actions con el `service_role` key.
- **Agentes** viven como código TypeScript en `src/agents/<slug>` y se registran manualmente en `_registry.ts`. La tabla `agents` solo expone metadata para listar y para el FK de `agent_executions`.
- **Sin streaming** en walking skeleton. La respuesta de Anthropic se devuelve completa en el Server Action. Streaming en una iteración posterior.
- **Google OAuth** cableado pero deshabilitado por `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=false`.

## Deuda técnica conocida

- Streaming de la respuesta de Anthropic (pendiente).
- Test de la lógica atómica de créditos contra una base real (los tests actuales son unitarios sobre los helpers de error y los budgets).
- Onboarding guiado tras el primer signup.
- Las migraciones de Drizzle (`drizzle-kit generate`) no están conectadas a `supabase/migrations`. Mantenemos las dos fuentes de verdad: schema TS en `src/db/schema` (para queries), SQL hand-crafted en `supabase/migrations` (para deploy).
