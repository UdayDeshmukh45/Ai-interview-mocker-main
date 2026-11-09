import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

const connectionString =
  process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

function getDbInstance() {
  if (!connectionString) {
    throw new Error(
      "PostgreSQL connection URI is missing. Please define DATABASE_URL (or NEXT_PUBLIC_DRIZZLE_DB_URL) in your environment variables."
    );
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

let _db = null;

export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      if (!_db) {
        _db = getDbInstance();
      }
      const value = _db[prop];
      return typeof value === "function" ? value.bind(_db) : value;
    },
  }
);
