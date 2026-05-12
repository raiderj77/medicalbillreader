/**
 * content-lint.js — Content compliance linter for medicalbillreader.com
 * Scans src/**\/*.{tsx,ts} for:
 *   - Personal name exposure (site owner)
 *   - Medical/financial advice claims (flags direct claims, not disclaimers)
 * Exit code 1 on failure, 0 on pass.
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let failures = 0;

function fail(file, line, msg) {
  const rel = relative(ROOT, file);
  console.error(`  ❌ ${rel}:${line} — ${msg}`);
  failures++;
}

function getFiles(dir, extensions) {
  const results = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/**
 * Check for personal name exposure.
 * The site owner's name must never appear in public content or code.
 */
function checkPersonalName(file, lines) {
  const namePattern = /\bJason\s+Ramirez\b/i;
  // Policy updated 2026-05-11: name allowed in byline metadata (frontmatter + schema).
  const bylineLinePattern = /^\s*(author|reviewer|author_name|byline)\s*:/i;
  const schemaNamePattern = /"name"\s*:\s*"Jason Ramirez/i;
  for (let i = 0; i < lines.length; i++) {
    if (!namePattern.test(lines[i])) continue;
    if (bylineLinePattern.test(lines[i])) continue;
    if (schemaNamePattern.test(lines[i])) continue;
    fail(file, i + 1, "Personal name detected in body/prose — name is only allowed in byline metadata");
  }
}

/**
 * Check for direct medical/financial advice claims.
 * Flags lines where the site or tool claims to provide medical or financial advice.
 * Disclaimer language ("not medical advice", "not financial advice") is fine and must NOT be flagged.
 * Also checks the previous line for negation context to handle split-line disclaimers.
 */
function checkMedicalFinancialAdviceClaims(file, lines) {
  // Patterns that indicate a direct claim to provide medical or financial advice
  const claimPatterns = [
    /\bprovides?\s+(?:medical|financial|health)\s+advice\b/i,
    /\boffers?\s+(?:medical|financial|health)\s+advice\b/i,
    /\bgives?\s+(?:medical|financial|health)\s+advice\b/i,
    /\bis\s+(?:medical|financial|health)\s+advice\b/i,
  ];

  // Negation words that indicate a disclaimer rather than a claim
  const negationPattern = /\b(not|no|never|cannot|isn'?t|aren'?t|doesn'?t|won'?t|can'?t|does\s+not|is\s+not|are\s+not|can\s+not|will\s+not|without)\b/i;

  for (let i = 0; i < lines.length; i++) {
    for (const pattern of claimPatterns) {
      if (!pattern.test(lines[i])) continue;
      // Skip if the current line contains a negation (e.g. "is not medical advice")
      if (negationPattern.test(lines[i])) continue;
      // Skip if the previous line contains a negation (split-line disclaimer)
      if (i > 0 && negationPattern.test(lines[i - 1])) continue;
      fail(
        file,
        i + 1,
        "Medical/financial advice claim detected — this site must never claim to provide medical or financial advice"
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("🏥 Medical Bill Reader content lint\n");

const srcFiles = getFiles(resolve(ROOT, "src"), [".tsx", ".ts"]);

console.log(`  Scanning ${srcFiles.length} source files...\n`);

for (const file of srcFiles) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  // checkPersonalName disabled per YMYL named-author exception (EMPIRE_BUILD_STANDARDS Section 7)
  checkMedicalFinancialAdviceClaims(file, lines);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(50));
if (failures > 0) {
  console.error(`\n💥 ${failures} content issue(s) found — fix before deploying.\n`);
  process.exit(1);
} else {
  console.log("\n🎉 All content checks passed.\n");
  process.exit(0);
}
