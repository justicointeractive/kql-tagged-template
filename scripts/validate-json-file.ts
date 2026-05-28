#!/usr/bin/env node
// @ts-check

import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  throw new Error('Usage: node scripts/validate-json-file.ts <file>');
}

JSON.parse(readFileSync(file, 'utf8'));
console.log(`Validated ${file}`);
