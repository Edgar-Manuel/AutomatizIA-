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
 * Build connection options. If DATABASE_HOST is set we use the component form
 * (host/port/user/password/database) which avoids URL percent-decoding eating
 * `%` characters from passwords. Otherwise we fall back to DATABASE_URL.
 */
export function resolveDbConnection(): Componentized | ({ url: string } & CommonOpts) {
  const host = process.env.DATABASE_HOST;
  if (host) {
    const password = process.env.DATABASE_PASSWORD;
    if (!password) {
      throw new Error("DATABASE_HOST is set but DATABASE_PASSWORD is missing.");
    }
    const sslRaw = process.env.DATABASE_SSL ?? "require";
    const ssl: Componentized["ssl"] = sslRaw === "false" ? false : (sslRaw as Componentized["ssl"]);
    return {
      ...COMMON,
      host,
      port: Number(process.env.DATABASE_PORT ?? 5432),
      username: process.env.DATABASE_USER ?? "postgres",
      password,
      database: process.env.DATABASE_NAME ?? "postgres",
      ssl,
    };
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Set DATABASE_URL or DATABASE_HOST/DATABASE_PASSWORD/... See .env.example.");
  }
  return { ...COMMON, url };
}
