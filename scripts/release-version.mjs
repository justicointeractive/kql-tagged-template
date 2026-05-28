#!/usr/bin/env node
// @ts-check

import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';

/**
 * @typedef {object} Version
 * @property {string} value
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 */

const semverRe = /^v?(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/** @param {unknown} value @returns {Version | null} */
function parseVersion(value) {
  const raw = String(value ?? '').trim();
  const match = raw.match(semverRe);
  if (!match) return null;
  return {
    value: raw.replace(/^v/, ''),
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

/** @param {Version} a @param {Version} b */
function compareVersions(a, b) {
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

/** @param {string[]} args */
function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

/** @param {string[]} args */
function gitQuiet(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

/** @returns {Version | null} */
function readPackageVersion() {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  return parseVersion(packageJson.version);
}

/** @returns {Version[]} */
function semverTagsPointingAtHead() {
  return git(['tag', '--points-at', 'HEAD'])
    .split(/\n/)
    .map(parseVersion)
    .filter((version) => version !== null)
    .sort(compareVersions);
}

/** @returns {Version[]} */
function existingSemverTags() {
  return git(['tag', '--list', 'v[0-9]*.[0-9]*.[0-9]*'])
    .split(/\n/)
    .map(parseVersion)
    .filter((version) => version !== null);
}

/** @param {string} tag */
function assertTagIsAvailableOrAtHead(tag) {
  try {
    const taggedSha = gitQuiet(['rev-list', '-n', '1', tag]);
    const headSha = git(['rev-parse', 'HEAD']);
    if (taggedSha !== headSha) {
      throw new Error(`${tag} already exists at ${taggedSha}, not ${headSha}`);
    }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'status' in error && error.status === 128) {
      return;
    }
    throw error;
  }
}

/** @param {Map<string, string>} outputs */
function writeOutputs(outputs) {
  const outputFile = process.env.GITHUB_OUTPUT;
  const body = [...outputs].map(([key, value]) => `${key}=${value}`).join('\n') + '\n';
  if (outputFile) {
    appendFileSync(outputFile, body);
  }
  for (const [key, value] of outputs) {
    console.log(`${key}=${value}`);
  }
}

git(['fetch', '--tags', 'origin']);

const inputVersion = process.env.INPUT_VERSION?.trim();
let selected = inputVersion ? parseVersion(inputVersion) : null;
if (inputVersion && !selected) {
  throw new Error(`Invalid version input: ${inputVersion}`);
}

if (!selected) {
  const headTags = semverTagsPointingAtHead();
  if (headTags.length > 0) {
    selected = headTags.at(-1) ?? null;
  }
}

if (!selected) {
  const tags = existingSemverTags();
  const packageVersion = readPackageVersion();
  if (packageVersion) tags.push(packageVersion);

  const latest = tags.sort(compareVersions).at(-1) ?? { major: 0, minor: 0, patch: 0, value: '0.0.0' };
  selected = {
    major: latest.major,
    minor: latest.minor,
    patch: latest.patch + 1,
    value: `${latest.major}.${latest.minor}.${latest.patch + 1}`,
  };
}

const tag = `v${selected.value}`;
assertTagIsAvailableOrAtHead(tag);
writeOutputs(new Map([
  ['version', selected.value],
  ['tag', tag],
]));
