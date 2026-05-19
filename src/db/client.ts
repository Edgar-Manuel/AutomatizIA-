import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type PgClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as {
  __pg?: PgClient;
};

function getPgClient(): PgClient {
  if (globalForDb.__pg) return globalForDb.__pg;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Run `supabase start` and copy the local connection string into .env.local.",
    );
  }
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    prepare: false,
  });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__pg = client;
  }
  return client;
}

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!cachedDb) cachedDb = drizzle(getPgClient(), { schema });
  return cachedDb;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_t, prop, receiver) {
    return Reflect.get(getDb() as object, prop, receiver);
  },
});

export type Db = ReturnType<typeof drizzle<typeof schema>>;
