// Next.js only inlines NEXT_PUBLIC_* variables into the browser bundle where
// it can see a literal `process.env.NEXT_PUBLIC_FOO` member expression in the
// source. A dynamic lookup like `process.env[name]` is invisible to that
// substitution, so on the client it reads undefined no matter how the project
// is configured. Every public variable is therefore spelled out here once, and
// the lookups below read this map instead of indexing process.env.
const PUBLIC_ENV: Record<string, string | undefined> = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

function firstSet(names: string[]): string {
  for (const name of names) {
    // Public vars come from the inlined map; server-only vars are read from
    // process.env, which is fully populated on the server.
    const v = name.startsWith("NEXT_PUBLIC_") ? PUBLIC_ENV[name] : process.env[name];
    if (v) return v;
  }
  throw new Error(
    `None of ${names.join(", ")} is set. Check your .env.local (locally) or your Vercel project settings.`,
  );
}

export const SUPABASE_URL = () => firstSet(["NEXT_PUBLIC_SUPABASE_URL"]);

// Supabase renamed "anon key" -> "publishable key". The Vercel integration
// injects NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; older setups still use the
// anon name. Accept both so the same code runs everywhere.
export const SUPABASE_ANON_KEY = () =>
  firstSet(["NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]);

// Likewise "service_role" -> "secret key". Server only, never sent to the browser.
export const SUPABASE_SERVICE_ROLE_KEY = () =>
  firstSet(["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"]);
