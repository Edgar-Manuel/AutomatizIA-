function firstSet(names: string[]): string {
  for (const name of names) {
    const v = process.env[name];
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

// Likewise "service_role" -> "secret key".
export const SUPABASE_SERVICE_ROLE_KEY = () =>
  firstSet(["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"]);
