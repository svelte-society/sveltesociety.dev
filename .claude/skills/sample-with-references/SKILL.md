---
name: sample-with-references
description: Demonstrates progressive disclosure by linking to reference files. Use this pattern when your skill has detailed content that should load on-demand.
---

# Sample Skill with References

This skill demonstrates **progressive disclosure** - keeping the main SKILL.md concise while linking to detailed reference files that Claude loads only when needed.

## When to Use This Pattern

Use reference files when you have:
- Detailed API documentation
- Multiple workflows or domains
- Large code examples
- Configuration references

## Quick Reference

For detailed patterns and examples, see [REFERENCE.md](REFERENCE.md).

## How It Works

1. **Startup**: Only `name` and `description` load into context
2. **Triggered**: Claude reads this SKILL.md (~100-200 tokens)
3. **On-demand**: Claude reads REFERENCE.md only if needed

This keeps token usage low while providing comprehensive documentation.

## File Organization Tips

```
your-skill/
├── SKILL.md           # Overview and navigation (keep under 500 lines)
├── REFERENCE.md       # Detailed reference (loaded on-demand)
├── WORKFLOWS.md       # Step-by-step guides (loaded on-demand)
└── EXAMPLES.md        # Code examples (loaded on-demand)
```

## Best Practices

- Keep references **one level deep** (don't chain REFERENCE.md → ANOTHER.md)
- Use descriptive filenames (not `doc1.md`, `doc2.md`)
- Add a table of contents to files over 100 lines
- Link with relative paths: `[REFERENCE.md](REFERENCE.md)`
