---
name: component-builder
description: Create UI components using tailwind-variants for type-safe styling. Use when creating or editing components in src/lib/ui/.
---

# Component Builder

This skill documents the tailwind-variants pattern used for UI components in this project. All UI components should follow this pattern for consistency and type safety.

## When to Use

Use this skill when:

- Creating new UI components in `src/lib/ui/`
- Refactoring existing components to use tailwind-variants
- Adding new variants to existing components

## Quick Start

Every component needs two files:

1. `componentName.variants.ts` - Variant definitions
2. `ComponentName.svelte` - The component

### Reference Files

- **Canonical example**: `src/lib/ui/Button.svelte` and `src/lib/ui/button.variants.ts`
- **Compound variants example**: `src/lib/ui/Tag.svelte` and `src/lib/ui/tag.variants.ts`
- **Multi-variant example**: `src/lib/ui/ContentCard.svelte` and `src/lib/ui/contentCard.variants.ts`

## Pattern Overview

### Step 1: Create Variants File

```typescript
// componentName.variants.ts
import { tv, type VariantProps } from 'tailwind-variants'

export const componentVariants = tv({
	base: 'common-classes-for-all-variants',
	variants: {
		variant: {
			primary: 'classes-for-primary',
			secondary: 'classes-for-secondary'
		},
		size: {
			sm: 'text-sm px-2',
			md: 'text-base px-4',
			lg: 'text-lg px-6'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md'
	}
})

// Export types for each variant dimension
export type ComponentVariant = VariantProps<typeof componentVariants>['variant']
export type ComponentSize = VariantProps<typeof componentVariants>['size']
```

### Step 2: Use in Component

```svelte
<script lang="ts">
  import type { ClassValue } from 'svelte/elements'
  import { componentVariants, type ComponentVariant, type ComponentSize } from './componentName.variants'

  type Props = {
    variant?: ComponentVariant
    size?: ComponentSize
    class?: ClassValue
  }

  let { variant, size, class: className, ...rest }: Props = $props()
</script>

<div class={[componentVariants({ variant, size }), className]} {...rest}>
  <!-- content -->
</div>
```

## Key Patterns

### Boolean Variants

For on/off states like `active`, `disabled`, `error`:

```typescript
variants: {
  active: {
    true: 'bg-svelte-100 border-svelte-300',
    false: ''
  },
  error: {
    true: 'border-red-300 bg-red-50',
    false: 'border-transparent'
  }
}
```

### Compound Variants

Apply styles only when specific combinations match:

```typescript
compoundVariants: [
	{
		active: true,
		removable: false,
		class: 'hover:bg-svelte-200'
	}
]
```

### Class Merging

Always use array syntax to allow consumer overrides:

```svelte
<div class={[componentVariants({ variant, size }), className]}>
```

## Templates

For copy-paste templates, see [TEMPLATES.md](TEMPLATES.md).
