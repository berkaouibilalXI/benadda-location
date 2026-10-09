// Finds imports that work on Windows/macOS but break on Linux (the GitHub runner):
//  - the file name differs only by upper/lower case from what git tracks
//  - the file is not tracked by git at all (never committed)
// Usage: node scripts/check-case.mjs     (run from the project root, after `git add`)
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const tracked = new Set(execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean))
const trackedList = [...tracked]
const suffixes = ['', '.js', '.jsx', '.mjs', '.json', '.css', '/index.js', '/index.jsx']
const importRe = /(?:from\s+|import\s*\(\s*|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g

let problems = 0
for (const file of trackedList.filter((f) => /^(src|scripts)\/.*\.(jsx?|mjs)$/.test(f))) {
  const code = fs.readFileSync(file, 'utf8')
  for (const [, spec] of code.matchAll(importRe)) {
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec))
    if (suffixes.some((s) => tracked.has(base + s))) continue
    const sameButCase = trackedList.find((t) => suffixes.some((s) => t.toLowerCase() === (base + s).toLowerCase()))
    problems++
    console.log(
      `✗ ${file}\n    imports "${spec}"\n    ${
        sameButCase
          ? `git tracks it as "${sameButCase}" (different upper/lower case)`
          : 'no such file is tracked by git (not committed? run: git add <file>)'
      }`,
    )
  }
}
console.log(problems ? `\n${problems} problem(s) found.` : '✓ Every relative import matches a tracked file exactly.')
process.exit(problems ? 1 : 0)
