import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 configuration. The database connection URL lives in the environment
 * (DATABASE_URL) — never in the schema or in code. When DATABASE_URL is not set
 * the app runs in demo mode and Prisma is never invoked at runtime.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "npx tsx prisma/seed.ts",
  },
});
