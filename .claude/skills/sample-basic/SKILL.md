---
name: sample-basic
description: A minimal example skill demonstrating the required structure. Use this as a template when creating new skills.
---

# Sample Basic Skill

This is a minimal skill template. Replace this content with your own instructions.

## Quick Start

1. Copy this folder and rename it (e.g., `creating-components`)
2. Update the `name` in the YAML frontmatter (lowercase, hyphens only)
3. Write a specific `description` that includes:
   - What the skill does
   - When Claude should use it (trigger phrases)
4. Replace these instructions with your own

## YAML Frontmatter Requirements

```yaml
name:
  - Maximum 64 characters
  - Lowercase letters, numbers, and hyphens only
  - No reserved words: "anthropic", "claude"

description:
  - Maximum 1024 characters
  - Must be non-empty
  - Should describe WHAT and WHEN
```

## Writing Good Instructions

- Be concise (Claude is smart, don't over-explain)
- Use examples over lengthy descriptions
- Keep SKILL.md under 500 lines
- Link to separate files for detailed content

## Example

Here's a simple example of how your skill might work:

```
User: "Help me create a new component"
Claude: [Reads SKILL.md, follows your instructions]
```
