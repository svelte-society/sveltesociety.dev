# Unit Test Coverage Options & Strategies

## Overview

This document outlines the available options for measuring and tracking test coverage for our unit tests using Bun's native test runner.

---

## Current Status

- **Test Runner:** Bun Test (native)
- **Coverage Support:** ✅ Built-in (via `--coverage` flag)
- **Current Coverage:** ~93% (tags.test.ts example)

---

## Option 1: Bun Native Coverage (Recommended)

### Pros
- ✅ **Zero configuration** - Built into Bun
- ✅ **Fast** - No additional tooling overhead
- ✅ **Native integration** - Works seamlessly with `bun test`
- ✅ **Multiple formats** - Text and LCOV output
- ✅ **No dependencies** - No need for Istanbul, NYC, or c8

### Cons
- ❌ **No branch coverage** - Only function and line coverage
- ❌ **No HTML reporter** - Need external tool (genhtml) for HTML
- ❌ **Less mature** - Fewer features than Jest/Istanbul

### Basic Usage

#### Text Report (Terminal)
```bash
# Single file
bun test src/lib/server/services/tags.test.ts --coverage

# All tests
bun test src/ --coverage
```

**Output:**
```
-----------------------------------|---------|---------|-------------------
File                               | % Funcs | % Lines | Uncovered Line #s
-----------------------------------|---------|---------|-------------------
All files                          |   93.75 |   92.36 |
 src/lib/server/db/test-helpers.ts |  100.00 |   95.24 |
 src/lib/server/services/tags.ts   |   87.50 |   89.47 | 51-56
-----------------------------------|---------|---------|-------------------
```

#### LCOV Report (For CI/CD)
```bash
bun test src/ --coverage --coverage-reporter=lcov
```

This generates `coverage/lcov.info` which can be:
- Uploaded to **Codecov** or **Coveralls**
- Converted to HTML using `genhtml`
- Used by IDE coverage plugins

#### Both Reports
```bash
bun test src/ --coverage --coverage-reporter=text,lcov
```

### Configuration

Create `bunfig.toml` in project root:

```toml
[test]
# Enable coverage by default
coverage = true

# Output formats: "text", "lcov", or both
coverageReporter = ["text", "lcov"]

# Coverage output directory
coverageDir = "coverage"

# Coverage thresholds (optional)
coverageThreshold = 80
```

---

## Option 2: HTML Coverage Reports

### Using `genhtml` (LCOV to HTML)

**Install lcov:**
```bash
# macOS
brew install lcov

# Ubuntu/Debian
apt-get install lcov
```

**Generate HTML report:**
```bash
# Generate LCOV file
bun test src/ --coverage --coverage-reporter=lcov

# Convert to HTML
genhtml coverage/lcov.info --output-directory coverage/html

# Open in browser
open coverage/html/index.html
```

**Pros:**
- ✅ Visual, interactive coverage reports
- ✅ Line-by-line coverage highlighting
- ✅ Industry standard (same tool used by Jest, Vitest, etc.)

**Cons:**
- ❌ Requires external tool installation
- ❌ Extra build step

### Package.json Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test": "bun test src/",
    "test:coverage": "bun test src/ --coverage",
    "test:coverage:html": "bun test src/ --coverage --coverage-reporter=lcov && genhtml coverage/lcov.info -o coverage/html",
    "test:coverage:open": "bun run test:coverage:html && open coverage/html/index.html"
  }
}
```

---

## Option 3: CI/CD Integration with Codecov/Coveralls

### Codecov (Recommended)

**Pros:**
- ✅ Free for open source
- ✅ PR comments with coverage changes
- ✅ Coverage badges
- ✅ Trend tracking over time
- ✅ Works with LCOV format

**Setup:**

1. **Sign up:** https://about.codecov.io/
2. **Add to GitHub Actions:** (`.github/workflows/unit-tests.yml`)

```yaml
name: Unit Tests

on:
  push:
    branches: [staging]
  pull_request:
    branches: [staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run tests with coverage
        run: bun test src/ --coverage --coverage-reporter=lcov

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

3. **Add badge to README:**
```markdown
[![codecov](https://codecov.io/gh/yourusername/yourrepo/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/yourrepo)
```

### Coveralls

Similar setup, alternative to Codecov:

```yaml
- name: Coveralls
  uses: coverallsapp/github-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    path-to-lcov: ./coverage/lcov.info
```

---

## Option 4: IDE Integration

### Visual Studio Code

**Extension:** [Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters)

**Setup:**
1. Install extension
2. Generate LCOV file: `bun test src/ --coverage --coverage-reporter=lcov`
3. Click "Watch" in status bar
4. Coverage highlights appear in editor gutter (green = covered, red = uncovered)

**Settings (`.vscode/settings.json`):**
```json
{
  "coverage-gutters.coverageFileNames": [
    "coverage/lcov.info"
  ],
  "coverage-gutters.showGutterCoverage": true,
  "coverage-gutters.showLineCoverage": true
}
```

### WebStorm / IntelliJ IDEA

Built-in coverage support:
1. Run tests with coverage: `Run > Run with Coverage`
2. Configure coverage runner to use LCOV file
3. Coverage highlights appear automatically

---

## Option 5: Coverage Thresholds & Enforcement

### Fail Tests if Coverage Drops

Unfortunately, Bun doesn't yet support coverage thresholds via CLI. Options:

#### Option A: Parse Coverage Output (Shell Script)

Create `scripts/check-coverage.sh`:
```bash
#!/bin/bash

# Run tests with coverage
bun test src/ --coverage --coverage-reporter=text | tee coverage.txt

# Extract coverage percentage (example)
COVERAGE=$(grep "All files" coverage.txt | awk '{print $2}' | sed 's/%//')

# Define threshold
THRESHOLD=80

if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
    echo "❌ Coverage ($COVERAGE%) is below threshold ($THRESHOLD%)"
    exit 1
else
    echo "✅ Coverage ($COVERAGE%) meets threshold ($THRESHOLD%)"
    exit 0
fi
```

#### Option B: Use LCOV Parser

```bash
npm install -D lcov-parse
```

Create `scripts/check-coverage.js`:
```javascript
import { parse } from 'lcov-parse'

parse('./coverage/lcov.info', (err, data) => {
  if (err) throw err

  const total = data.reduce((acc, file) => ({
    hit: acc.hit + file.lines.hit,
    found: acc.found + file.lines.found
  }), { hit: 0, found: 0 })

  const coverage = (total.hit / total.found) * 100
  const threshold = 80

  console.log(`Coverage: ${coverage.toFixed(2)}%`)

  if (coverage < threshold) {
    console.error(`❌ Below threshold: ${threshold}%`)
    process.exit(1)
  }

  console.log(`✅ Above threshold: ${threshold}%`)
})
```

**Package.json:**
```json
{
  "scripts": {
    "test:coverage:check": "bun test src/ --coverage --coverage-reporter=lcov && node scripts/check-coverage.js"
  }
}
```

---

## Recommended Setup

### For Local Development

```json
{
  "scripts": {
    "test": "bun test src/",
    "test:watch": "bun test src/ --watch",
    "test:coverage": "bun test src/ --coverage",
    "test:coverage:html": "bun test src/ --coverage --coverage-reporter=lcov && genhtml coverage/lcov.info -o coverage/html && open coverage/html/index.html"
  }
}
```

### For CI/CD

```json
{
  "scripts": {
    "test:ci": "bun test src/ --coverage --coverage-reporter=lcov"
  }
}
```

**GitHub Actions:**
```yaml
- name: Run unit tests
  run: bun run test:ci

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
```

### For IDE Integration

1. Install **Coverage Gutters** extension (VS Code)
2. Generate LCOV on test run
3. Enable "Watch" mode in status bar

---

## Coverage Goals

### Recommended Thresholds

| Category | Target | Priority |
|----------|--------|----------|
| **Services** (business logic) | 85%+ | High |
| **Utilities** | 90%+ | High |
| **Database helpers** | 80%+ | Medium |
| **Type definitions** | N/A | Low |

### What to Cover

**High Priority:**
- ✅ Business logic in services
- ✅ Error handling paths
- ✅ Edge cases (null, empty, boundary conditions)
- ✅ Database operations (CRUD)

**Medium Priority:**
- ✅ Helper functions
- ✅ Validation logic
- ✅ Data transformations

**Low Priority:**
- ⚠️ Type definitions
- ⚠️ Simple getters/setters
- ⚠️ Trivial pass-through functions

---

## Current State Analysis

### Example: tags.test.ts

**Coverage:** 93.75% functions, 92.36% lines

**Uncovered Lines:** 51-56 in `tags.ts` (getAllTags error handler)

**Recommendation:** Add test case that triggers error in getAllTags:
```typescript
test('getAllTags should handle database errors gracefully', () => {
  // Close database to trigger error
  db.close()

  const tags = tagService.getAllTags()
  expect(tags).toEqual([])
})
```

---

## Comparison: Bun vs. Other Tools

| Feature | Bun | Vitest + c8 | Jest + Istanbul |
|---------|-----|-------------|-----------------|
| Setup complexity | ⭐⭐⭐⭐⭐ Zero config | ⭐⭐⭐⭐ Minimal | ⭐⭐⭐ Moderate |
| Speed | ⭐⭐⭐⭐⭐ Fastest | ⭐⭐⭐⭐ Fast | ⭐⭐⭐ Slower |
| Branch coverage | ❌ No | ✅ Yes | ✅ Yes |
| HTML reports | ⚠️ Via genhtml | ✅ Built-in | ✅ Built-in |
| Threshold enforcement | ❌ Manual | ✅ Built-in | ✅ Built-in |
| LCOV output | ✅ Yes | ✅ Yes | ✅ Yes |
| Maturity | ⭐⭐⭐ New | ⭐⭐⭐⭐ Stable | ⭐⭐⭐⭐⭐ Mature |

**Verdict:** Bun's coverage is sufficient for most needs, especially if you don't need branch coverage.

---

## FAQ

### Q: Can I exclude files from coverage?

**A:** Not yet via CLI. Workaround: Structure tests to only cover relevant files, or manually filter LCOV.

### Q: How do I get branch coverage?

**A:** Bun doesn't support branch coverage yet. If critical, consider:
- Using Vitest with c8
- Or accept line coverage as sufficient

### Q: Can I fail CI if coverage drops?

**A:** Yes, via custom script (see Option 5) or Codecov PR checks.

### Q: What about Svelte component coverage?

**A:** Unit tests with Bun cover `.ts` files only. For `.svelte` components:
- Use E2E tests (Playwright) for integration coverage
- Or use Vitest with `@vitest/ui` for component testing

### Q: How much coverage is "enough"?

**A:** Industry standards:
- **60-70%**: Minimum acceptable
- **80%+**: Good
- **90%+**: Excellent
- **100%**: Overkill (diminishing returns)

Focus on critical paths, not arbitrary numbers.

---

## Next Steps

1. ✅ Add coverage script to `package.json`
2. ⬜ Generate HTML reports locally (`genhtml`)
3. ⬜ Set up Codecov for CI/CD
4. ⬜ Install IDE coverage extension (Coverage Gutters)
5. ⬜ Define coverage thresholds per service
6. ⬜ Add coverage badge to README

---

## Conclusion

**Recommended Approach:**

1. **Local Development:** Use `bun test --coverage` with text output
2. **Visual Feedback:** Use `genhtml` for HTML reports when needed
3. **CI/CD:** Upload LCOV to Codecov for tracking and PR comments
4. **IDE:** Use Coverage Gutters extension for real-time feedback
5. **Enforcement:** Add coverage threshold check in CI (custom script)

This provides a lightweight, fast, and practical coverage workflow without sacrificing visibility or quality gates.
