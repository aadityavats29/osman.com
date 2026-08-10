import "server-only";
import type { Repos } from "./types";
import { createDemoRepos } from "./demo";

/**
 * Backend selection: PostgreSQL via Prisma when DATABASE_URL is configured,
 * otherwise the demo backend (seeded content, in-memory + JSON snapshot).
 * The rest of the app only ever calls getRepos().
 */

const g = globalThis as typeof globalThis & { __osmanRepos?: Repos };

export function getRepos(): Repos {
  if (!g.__osmanRepos) {
    if (process.env.DATABASE_URL) {
      // Lazy import so demo mode never touches @prisma/client at runtime.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createPrismaRepos } = require("./prisma") as typeof import("./prisma");
      g.__osmanRepos = createPrismaRepos();
    } else {
      g.__osmanRepos = createDemoRepos();
    }
  }
  return g.__osmanRepos;
}
