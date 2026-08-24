import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7's CLI does NOT auto-load .env when a prisma.config.ts exists.
// Load it here (native Node, no dependency); optional so CI/Vercel — where
// real environment variables are injected — work without a .env file.
try {
  process.loadEnvFile();
} catch {
  /* no .env present — fine */
}

/**
 * Prisma 7 configuration. The database connection URL lives in the environment
 * (DATABASE_URL) — never in the schema or in code. When DATABASE_URL is not set
 * the app runs in demo mode and Prisma is never invoked at runtime.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    // Migrations need a DIRECT connection — Neon's pooled endpoint (pgbouncer)
    // breaks Prisma Migrate's locking. The running app uses the pooled
    // DATABASE_URL; migrations prefer DATABASE_URL_UNPOOLED when present.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
  },
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "npx tsx prisma/seed.ts",
  },
});
