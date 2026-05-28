#!/usr/bin/env node
// @ts-check

import { readFileSync, writeFileSync } from 'node:fs';

const version = process.env.VERSION?.trim();
if (!version) {
  throw new Error('VERSION is required');
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
packageJson.version = version;
writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(`Set package.json version to ${version}`);
