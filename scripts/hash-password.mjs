#!/usr/bin/env node
// Generates a bcrypt hash for STUDIO_PASSWORD_HASH (demo-mode login).
// Usage: npm run auth:hash -- "your-password"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run auth:hash -- "your-password"');
  process.exit(1);
}
console.log(bcrypt.hashSync(password, 12));
