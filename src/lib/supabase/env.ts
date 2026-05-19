function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set. Check your .env.local.`);
  return v;
}

export const SUPABASE_URL = () => required("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const SUPABASE_SERVICE_ROLE_KEY = () => required("SUPABASE_SERVICE_ROLE_KEY");
