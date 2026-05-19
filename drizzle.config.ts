import { defineConfig } from "drizzle-kit";

const host = process.env.DATABASE_HOST;

const dbCredentials = host
  ? {
      host,
      port: Number(process.env.DATABASE_PORT ?? 5432),
      user: process.env.DATABASE_USER ?? "postgres",
      password: requireEnv("DATABASE_PASSWORD"),
      database: process.env.DATABASE_NAME ?? "postgres",
      ssl:
        (process.env.DATABASE_SSL ?? "require") === "false"
          ? false
          : ({ rejectUnauthorized: false } as const),
    }
  : { url: requireEnv("DATABASE_URL") };

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle/migrations",
  dbCredentials,
  verbose: true,
  strict: true,
});

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `${name} is not set. Either set DATABASE_URL or DATABASE_HOST/DATABASE_PASSWORD/...`,
    );
  }
  return v;
}
