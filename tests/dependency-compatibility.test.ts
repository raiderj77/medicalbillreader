import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const requireHere = createRequire(import.meta.url);
const requireMatter = createRequire(requireHere.resolve('gray-matter'));
const requireYaml = createRequire(requireMatter.resolve('js-yaml'));
const yamlCli = join(dirname(requireMatter.resolve('js-yaml/package.json')), 'bin/js-yaml.js');

describe('patched dependency consumers', () => {
  it('retains gray-matter YAML parsing with the dependency-free argparse 2 bridge', () => {
    expect(requireYaml('argparse/package.json').version).toBe('2.0.1');
    expect(requireYaml('argparse/package.json').dependencies ?? {}).toEqual({});
    const matter = requireHere('gray-matter');
    const parsed = matter('---\ntitle: "Owned fixture"\ntags:\n  - first\n  - second\nenabled: true\n---\nBody preserved.\n');
    expect(parsed.data).toEqual({ title: 'Owned fixture', tags: ['first', 'second'], enabled: true });
    expect(parsed.content).toBe('Body preserved.\n');
  });

  it('retains the js-yaml 3 CLI parsing, help and invalid-option paths', () => {
    const run = (args: string[], input = '') => spawnSync(process.execPath, [yamlCli, ...args], { input, encoding: 'utf8', timeout: 3000 });
    const parsed = run([], 'label: owned\ncount: 2\n');
    expect(parsed.status).toBe(0);
    expect(JSON.parse(parsed.stdout)).toEqual({ label: 'owned', count: 2 });
    const help = run(['--help']);
    expect(help.status).toBe(0);
    expect(help.stdout).toContain('usage:');
    const invalid = run(['--not-an-option']);
    expect(invalid.status).toBe(2);
    expect(invalid.stderr).toMatch(/unrecognized arguments/i);
  });

  it('loads the patched sharp binary through the Next.js consumer', async () => {
    const requireNext = createRequire(requireHere.resolve('next/package.json'));
    const sharp = requireNext('sharp');
    expect(sharp.versions.sharp).toBe('0.35.5');
    const result = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#ffffff' } })
      .resize(1, 1).png().toBuffer({ resolveWithObject: true });
    expect(result.info.width).toBe(1);
    expect(result.info.height).toBe(1);
    expect(result.info.format).toBe('png');
  });
});
