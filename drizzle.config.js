/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:5bTfSHq3FZGC@ep-lucky-rain-a56bh5lq.us-east-2.aws.neon.tech/AI-interview?sslmode=require",
  },
};
