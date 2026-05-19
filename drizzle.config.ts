import { defineConfig } from "drizzle-kit";

const host = process.env.DATABASE_HOST ?? process.env.POSTGRES_HOST;
const urlEnv =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_URL_NON_POOLING;

const dbCredentials = host
  ? {
      host,
      port: Number(process.env.DATABASE_PORT ?? 5432),
      user: process.env.DATABASE_USER ?? process.env.POSTGRES_USER ?? "postgres",
      password: requireValue(
        "DATABASE_PASSWORD/POSTGRES_PASSWORD",
        process.env.DATABASE_PASSWORD ?? process.env.POSTGRES_PASSWORD,
      ),
      database: process.env.DATABASE_NAME ?? process.env.POSTGRES_DATABASE ?? "postgres",
      ssl:
        (process.env.DATABASE_SSL ?? "require") === "false"
          ? false
          : ({ rejectUnauthorized: false } as const),
    }
  : { url: requireValue("DATABASE_URL/POSTGRES_URL", urlEnv) };

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle/migrations",
  dbCredentials,
  verbose: true,
  strict: true,
});

function requireValue(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is not set. Either set DATABASE_URL/POSTGRES_URL or DATABASE_HOST/POSTGRES_HOST + password.`,
    );
  }
  return value;
}
