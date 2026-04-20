#!/usr/bin/env python3
"""
WS2 medicalbillreader.com — enable named author (YMYL exception).

Two surgical edits:
1. scripts/content-lint.js: disable checkPersonalName call on this YMYL repo.
   EMPIRE_BUILD_STANDARDS.md Section 7 requires named author for Full YMYL sites
   (Tier 3). Medical Bill Reader is Tier 3, so the personal-name block that applies
   to non-YMYL Empire sites is explicitly inverted here.

2. src/app/layout.tsx:
   - metadata.authors: generic string -> "Jason Ramirez"
   - webAppJsonLd.author.name: generic -> "Jason Ramirez"
   - webAppJsonLd.author.jobTitle: "Web Professional" -> "Healthcare Technology Analyst"

Idempotent: re-running is a no-op if already patched.
"""
import sys
from pathlib import Path

_here = Path(__file__).resolve().parent
REPO = _here.parent if _here.name == "scripts" else Path.cwd()


def patch(path, old, new, label):
    p = REPO / path
    if not p.exists():
        return False, f"FAIL  {label}: file not found ({path})"
    content = p.read_text(encoding="utf-8")
    if new in content:
        return True, f"SKIP  {label}: already patched"
    if old not in content:
        return False, f"FAIL  {label}: pattern not found (file may have drifted)"
    p.write_text(content.replace(old, new, 1), encoding="utf-8")
    return True, f"OK    {label}: patched"


def main():
    print(f"Repo root: {REPO}\n")
    results = []

    # ------------------------------------------------------------------
    # 1. content-lint.js: disable checkPersonalName
    # ------------------------------------------------------------------
    old_lint = (
        '  const lines = content.split("\\n");\n'
        "  checkPersonalName(file, lines);\n"
        "  checkMedicalFinancialAdviceClaims(file, lines);"
    )
    new_lint = (
        '  const lines = content.split("\\n");\n'
        "  // checkPersonalName is intentionally disabled on this YMYL repo.\n"
        "  // EMPIRE_BUILD_STANDARDS.md Section 7 requires named author attribution for\n"
        "  // Full YMYL sites (Tier 3). Medical Bill Reader is Tier 3; blocking the site\n"
        "  // owner's name here would contradict the YMYL named-author exception.\n"
        "  // checkPersonalName(file, lines);\n"
        "  checkMedicalFinancialAdviceClaims(file, lines);"
    )
    results.append(patch(
        "scripts/content-lint.js", old_lint, new_lint,
        "content-lint.js: disable checkPersonalName"
    ))

    # ------------------------------------------------------------------
    # 2a. layout.tsx: metadata.authors
    # ------------------------------------------------------------------
    results.append(patch(
        "src/app/layout.tsx",
        'authors: [{ name: "Built by an experienced web professional" }],',
        'authors: [{ name: "Jason Ramirez" }],',
        "layout.tsx: metadata.authors"
    ))

    # ------------------------------------------------------------------
    # 2b. layout.tsx: webAppJsonLd.author block (name + jobTitle)
    # ------------------------------------------------------------------
    old_author = (
        '  author: {\n'
        '    "@type": "Person",\n'
        '    name: "Built by an experienced web professional",\n'
        '    jobTitle: "Web Professional",\n'
        '    url: "https://medicalbillreader.com/about",\n'
        '  },'
    )
    new_author = (
        '  author: {\n'
        '    "@type": "Person",\n'
        '    name: "Jason Ramirez",\n'
        '    jobTitle: "Healthcare Technology Analyst",\n'
        '    url: "https://medicalbillreader.com/about",\n'
        '  },'
    )
    results.append(patch(
        "src/app/layout.tsx", old_author, new_author,
        "layout.tsx: webAppJsonLd.author"
    ))

    # Summary
    print()
    any_fail = False
    for ok, msg in results:
        print(f"  {msg}")
        if not ok:
            any_fail = True
    print()
    return 1 if any_fail else 0


if __name__ == "__main__":
    sys.exit(main())
