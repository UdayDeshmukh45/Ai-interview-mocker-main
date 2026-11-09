import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!dbUrl) {
  console.warn(
    "Warning: DATABASE_URL (or NEXT_PUBLIC_DRIZZLE_DB_URL) is not defined in environment variables. Drizzle Kit commands require a valid connection URL."
  );
}

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl || "",
  },
};
