type CommonOpts = {
  max: number;
  idle_timeout: number;
  prepare: boolean;
};

type Componentized = CommonOpts & {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: "require" | "allow" | "prefer" | "verify-full" | false;
};

const COMMON: CommonOpts = {
  max: 10,
  idle_timeout: 20,
  prepare: false,
};

/**
 * Build connection options. Resolution order:
 *  1. Component form (DATABASE_HOST / POSTGRES_HOST). Avoids URL
 *     percent-decoding eating `%` and other reserved characters in passwords.
 *  2. URL form (DATABASE_URL / POSTGRES_URL / POSTGRES_URL_NON_POOLING).
 *
 * POSTGRES_* is the naming the Supabase Vercel integration injects, so the
 * same code resolves locally (via DATABASE_*) and in production on Vercel
 * (via POSTGRES_*) without extra wiring.
 */
export function resolveDbConnection(): Componentized | ({ url: string } & CommonOpts) {
  const host = process.env.DATABASE_HOST ?? process.env.POSTGRES_HOST;
  if (host) {
    const password = process.env.DATABASE_PASSWORD ?? process.env.POSTGRES_PASSWORD;
    if (!password) {
      throw new Error(
        "DATABASE_HOST/POSTGRES_HOST is set but DATABASE_PASSWORD/POSTGRES_PASSWORD is missing.",
      );
    }
    const sslRaw = process.env.DATABASE_SSL ?? "require";
    const ssl: Componentized["ssl"] = sslRaw === "false" ? false : (sslRaw as Componentized["ssl"]);
    return {
      ...COMMON,
      host,
      port: Number(process.env.DATABASE_PORT ?? 5432),
      username: process.env.DATABASE_USER ?? process.env.POSTGRES_USER ?? "postgres",
      password,
      database: process.env.DATABASE_NAME ?? process.env.POSTGRES_DATABASE ?? "postgres",
      ssl,
    };
  }

  const url =
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      "Set DATABASE_URL (or POSTGRES_URL on Vercel) or DATABASE_HOST/POSTGRES_HOST + password. See .env.example.",
    );
  }
  return { ...COMMON, url };
}
