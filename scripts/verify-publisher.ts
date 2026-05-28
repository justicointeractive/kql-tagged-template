#!/usr/bin/env node
// @ts-check

import { readFileSync } from 'node:fs';

const expected = process.env.PUBLISHER_ID?.trim();
if (!expected) {
  throw new Error('PUBLISHER_ID is required');
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
if (packageJson.publisher !== expected) {
  throw new Error(`package.json publisher (${packageJson.publisher}) does not match vsce environment PUBLISHER_ID (${expected})`);
}

console.log(`Verified Marketplace publisher ${expected}`);
