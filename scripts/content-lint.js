/**
 * content-lint.js ,  Content compliance linter for medicalbillreader.com
 * Scans src/**\/*.{tsx,ts} for:
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
  console.error(`  ❌ ${rel}:${line} ,  ${msg}`);
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
        "Medical/financial advice claim detected ,  this site must never claim to provide medical or financial advice"
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("🏥 Medical Bill Reader content lint\n");

const srcFiles = getFiles(resolve(ROOT, "src"), [".tsx", ".ts"]);
const contentFiles = getFiles(resolve(ROOT, "content"), [".md"]);
const files = [...srcFiles, ...contentFiles];

console.log(`  Scanning ${files.length} source and editorial files...\n`);

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  checkMedicalFinancialAdviceClaims(file, lines);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(50));
if (failures > 0) {
  console.error(`\n💥 ${failures} content issue(s) found ,  fix before deploying.\n`);
  process.exit(1);
} else {
  console.log("\n🎉 All content checks passed.\n");
  process.exit(0);
}
