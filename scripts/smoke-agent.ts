import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { googleReviewsResponder } from "@/agents/google-reviews-responder";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing env var: ${name}`);
  return value;
}

const supa = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const sql = postgres({
  host: requireEnv("DATABASE_HOST"),
  port: Number(process.env.DATABASE_PORT),
  user: requireEnv("DATABASE_USER"),
  password: requireEnv("DATABASE_PASSWORD"),
  database: requireEnv("DATABASE_NAME"),
  ssl: "require",
  prepare: false,
  max: 1,
});

const email = `smoke-${Date.now()}@automatizia.dev`;
let userId: string | null = null;

try {
  const created = await supa.auth.admin.createUser({
    email,
    password: "Smoke2026!Pass",
    email_confirm: true,
  });
  if (created.error) throw created.error;
  userId = created.data.user.id;
  console.log("user:", userId, email);

  await new Promise((r) => setTimeout(r, 600));

  const [org] = await sql<{ id: string }[]>`
    select id from public.organizations where owner_id = ${userId} limit 1
  `;
  if (!org) throw new Error("trigger did not create org");
  console.log("org:", org.id);

  const [agentRow] = await sql<{ id: string }[]>`
    select id from public.agents where slug = 'google-reviews-responder'
  `;

  const executionId = randomUUID();
  await sql`
    insert into public.agent_executions
      (id, organization_id, user_id, agent_id, agent_slug, status, input, model_used, credits_charged)
    values
      (${executionId}, ${org.id}, ${userId}, ${agentRow.id}, 'google-reviews-responder', 'running',
       ${sql.json({ review: "smoke test", rating: 3, businessName: "Smoke", tone: "cercano-profesional" })}::jsonb,
       'sonnet-4.6', 0)
  `;

  const [charge] = await sql<{ new_balance: number }[]>`
    select public.charge_credits(${org.id}::uuid, 2::int, ${executionId}::uuid, ${`exec:${executionId}:charge`}) as new_balance
  `;
  console.log("balance after charge:", charge.new_balance);

  const output = await googleReviewsResponder.execute(
    {
      review:
        "Vinimos por el cumpleaños de mi madre. La comida estuvo bien pero el camarero tardó 40 minutos en traernos las bebidas, y se equivocó dos veces con el postre.",
      rating: 3,
      reviewerName: "Lucía",
      businessName: "La Tasca de Pepe",
      tone: "cercano-profesional",
    },
    { organizationId: org.id, userId: userId, executionId },
  );

  console.log("variants:", output.variants.length);
  for (const v of output.variants) {
    console.log(`  [${v.label}] ${v.text.slice(0, 80)}...`);
  }

  await sql`
    update public.agent_executions
    set status = 'succeeded', output = ${sql.json(output as unknown as Record<string, unknown>)}::jsonb,
        completed_at = now(), credits_charged = 2
    where id = ${executionId}
  `;

  const [bal] = await sql<{ balance: number }[]>`
    select balance from public.credit_balances where organization_id = ${org.id}
  `;
  console.log("final balance:", bal.balance);

  const ledger = await sql<{ delta: number; reason: string }[]>`
    select delta, reason from public.credit_ledger
    where organization_id = ${org.id}
    order by created_at
  `;
  console.log("ledger:", ledger);

  console.log("SMOKE_OK", JSON.stringify({ balance: bal.balance, ledgerCount: ledger.length }));
} catch (e) {
  console.error("SMOKE_FAIL:", e instanceof Error ? e.message : e);
  process.exitCode = 1;
} finally {
  if (userId) {
    try {
      await supa.auth.admin.deleteUser(userId);
      console.log("cleaned up user");
    } catch (e) {
      console.error("cleanup error:", e);
    }
  }
  await sql.end();
  process.exit();
}
