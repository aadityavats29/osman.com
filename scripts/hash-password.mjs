#!/usr/bin/env node
// Generates the STUDIO_PASSWORD_HASH line for demo-mode login.
// Usage: npm run auth:hash -- "your-password"
//
// The dollar signs in a bcrypt hash are escaped as "\$" because Next.js
// expands $VAR references inside .env files — an unescaped hash would be
// silently mangled at load time. Paste the printed line into .env as-is.
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run auth:hash -- "your-password"');
  process.exit(1);
}
const hash = bcrypt.hashSync(password, 12);
console.log("Paste this line into your .env (replacing the existing one):\n");
console.log(`STUDIO_PASSWORD_HASH=${hash.replaceAll("$", "\\$")}`);
