import "server-only";
import type { Repos } from "./types";
import { createDemoRepos } from "./demo";
import { createPrismaRepos } from "./prisma";

/**
 * Backend selection: PostgreSQL via Prisma when DATABASE_URL is configured,
 * otherwise the demo backend (seeded content, in-memory + JSON snapshot).
 * The rest of the app only ever calls getRepos().
 *
 * Static imports on purpose: the generated Prisma client is engine-less and
 * safe to load in demo mode (nothing connects until a query runs), and a
 * dynamic require() would not survive the production bundler.
 */

const g = globalThis as typeof globalThis & { __osmanRepos?: Repos };

export function getRepos(): Repos {
  if (!g.__osmanRepos) {
    g.__osmanRepos = process.env.DATABASE_URL
      ? createPrismaRepos()
      : createDemoRepos();
  }
  return g.__osmanRepos;
}
