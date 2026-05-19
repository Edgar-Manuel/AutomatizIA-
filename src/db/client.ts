import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { resolveDbConnection } from "./connection";
import * as schema from "./schema";

type PgClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as {
  __pg?: PgClient;
};

function getPgClient(): PgClient {
  if (globalForDb.__pg) return globalForDb.__pg;
  const cfg = resolveDbConnection();
  const client = "url" in cfg ? postgres(cfg.url, cfg) : postgres(cfg);
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
