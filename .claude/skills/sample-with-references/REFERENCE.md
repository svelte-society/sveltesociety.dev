# Reference Documentation

This file is loaded on-demand when Claude needs detailed information.

## Contents

- [Pattern 1: Domain-Specific Organization](#pattern-1-domain-specific-organization)
- [Pattern 2: Workflow Steps](#pattern-2-workflow-steps)
- [Pattern 3: Code Examples](#pattern-3-code-examples)

---

## Pattern 1: Domain-Specific Organization

When your skill covers multiple domains, organize by domain:

```
bigquery-skill/
├── SKILL.md
└── reference/
    ├── finance.md      # Revenue, billing metrics
    ├── sales.md        # Pipeline, opportunities
    └── product.md      # Usage analytics
```

Claude reads only the relevant domain file based on the user's request.

---

## Pattern 2: Workflow Steps

For complex multi-step processes, provide checklists:

```markdown
## Deployment Workflow

Copy this checklist and track progress:

- [ ] Step 1: Run tests
- [ ] Step 2: Build production bundle
- [ ] Step 3: Deploy to staging
- [ ] Step 4: Verify staging
- [ ] Step 5: Deploy to production
```

---

## Pattern 3: Code Examples

Provide concrete input/output examples:

**Example 1: Simple case**

```
Input: "Create a button component"
Output: Creates Button.svelte with props, styles, accessibility
```

**Example 2: Complex case**

```
Input: "Create a data table with sorting and filtering"
Output: Creates DataTable.svelte with:
- Column definitions
- Sort state management
- Filter inputs
- Pagination
```

---

## Tips for Reference Files

1. **Keep sections independent** - Claude may read only one section
2. **Use clear headings** - Helps Claude navigate to relevant content
3. **Include examples** - More effective than lengthy explanations
4. **Stay under 1000 lines** - Split into multiple files if larger
