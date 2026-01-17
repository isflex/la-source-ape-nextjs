#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '..', 'package.json');

const version = process.argv[2];
if (!['3', '4'].includes(version)) {
  console.error('Usage: node switch-zod-version.mjs [3|4]');
  process.exit(1);
}

const zodVersion = version === '3' ? '^3.24.0' : '4.3.5';

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
pkg.pnpm.overrides.zod = zodVersion;

writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Switched zod to ${zodVersion}`);
