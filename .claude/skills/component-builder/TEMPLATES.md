# Component Templates

Copy-paste templates for common component patterns.

## Form Input Template

For text inputs, selects, textareas with error states.

### input.variants.ts

```typescript
import { tv, type VariantProps } from 'tailwind-variants'

export const inputVariants = tv({
	base: 'w-full rounded-md border-2 px-2 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200',
	variants: {
		error: {
			true: 'border-red-300 bg-red-50 text-red-600',
			false: 'border-transparent bg-slate-100'
		},
		size: {
			sm: 'px-2 py-1 text-xs',
			md: 'px-2 py-1.5 text-sm',
			lg: 'px-3 py-2 text-base'
		}
	},
	defaultVariants: {
		error: false,
		size: 'md'
	}
})

export type InputError = VariantProps<typeof inputVariants>['error']
export type InputSize = VariantProps<typeof inputVariants>['size']
```

### Input.svelte

```svelte
<script lang="ts">
  import type { RemoteFormIssue } from '@sveltejs/kit'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { inputVariants, type InputSize } from './input.variants'

  type Props = {
    label?: string
    description?: string
    name: string
    size?: InputSize
    issues?: RemoteFormIssue[]
  } & HTMLInputAttributes

  let { label, description, size, issues, ...rest }: Props = $props()

  const hasErrors = $derived(issues && issues.length > 0)
</script>

<div class="flex flex-col gap-2">
  <label class="text-xs font-medium outline-none">
    {label}
    <input
      class={[inputVariants({ error: hasErrors, size }), 'mt-2']}
      {...rest}
    />
  </label>
  {#if hasErrors}
    {#each issues as issue}
      <div class="text-xs text-red-600">{issue.message}</div>
    {/each}
  {:else if description}
    <div class="text-xs text-slate-500">{description}</div>
  {/if}
</div>
```

---

## Card Template

For card components with visual variants.

### card.variants.ts

```typescript
import { tv, type VariantProps } from 'tailwind-variants'

export const cardVariants = tv({
	base: 'rounded-lg p-4',
	variants: {
		variant: {
			default: 'bg-white border border-slate-200',
			elevated: 'bg-white shadow-md',
			filled: 'bg-slate-50',
			outlined: 'bg-transparent border-2 border-slate-300'
		},
		padding: {
			none: 'p-0',
			sm: 'p-2',
			md: 'p-4',
			lg: 'p-6'
		}
	},
	defaultVariants: {
		variant: 'default',
		padding: 'md'
	}
})

export type CardVariant = VariantProps<typeof cardVariants>['variant']
export type CardPadding = VariantProps<typeof cardVariants>['padding']
```

### Card.svelte

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'
  import { cardVariants, type CardVariant, type CardPadding } from './card.variants'

  type Props = {
    children: Snippet
    variant?: CardVariant
    padding?: CardPadding
    class?: ClassValue
  }

  let { children, variant, padding, class: className }: Props = $props()
</script>

<div class={[cardVariants({ variant, padding }), className]}>
  {@render children()}
</div>
```

---

## Interactive Element Template

For elements with active/selected states using compound variants.

### toggle.variants.ts

```typescript
import { tv, type VariantProps } from 'tailwind-variants'

export const toggleVariants = tv({
	base: 'inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors',
	variants: {
		active: {
			true: 'bg-svelte-100 text-svelte-900',
			false: 'bg-slate-100 text-slate-600'
		},
		disabled: {
			true: 'cursor-not-allowed opacity-50',
			false: 'cursor-pointer'
		}
	},
	compoundVariants: [
		{
			active: false,
			disabled: false,
			class: 'hover:bg-slate-200'
		},
		{
			active: true,
			disabled: false,
			class: 'hover:bg-svelte-200'
		}
	],
	defaultVariants: {
		active: false,
		disabled: false
	}
})

export type ToggleVariants = VariantProps<typeof toggleVariants>
```

### Toggle.svelte

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { toggleVariants } from './toggle.variants'

  type Props = {
    children: Snippet
    active?: boolean
    disabled?: boolean
    onclick?: () => void
  }

  let { children, active = false, disabled = false, onclick }: Props = $props()
</script>

<button
  class={toggleVariants({ active, disabled })}
  {disabled}
  onclick={onclick}
>
  {@render children()}
</button>
```

---

## Button with Link Support Template

For components that can be either `<button>` or `<a>`.

### action.variants.ts

```typescript
import { tv, type VariantProps } from 'tailwind-variants'

export const actionVariants = tv({
	base: 'inline-flex items-center justify-center gap-1 rounded-md font-medium transition-all focus:ring-2 focus:ring-offset-2',
	variants: {
		variant: {
			primary: 'bg-svelte-900 text-white hover:brightness-150 focus:ring-svelte-900',
			secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
			ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
		},
		size: {
			sm: 'px-3 py-1.5 text-sm',
			md: 'px-4 py-2',
			lg: 'px-6 py-3 text-lg'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md'
	}
})

export type ActionVariant = VariantProps<typeof actionVariants>['variant']
export type ActionSize = VariantProps<typeof actionVariants>['size']
```

### Action.svelte

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue, HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
  import { actionVariants, type ActionVariant, type ActionSize } from './action.variants'

  type Props = {
    children: Snippet
    variant?: ActionVariant
    size?: ActionSize
    class?: ClassValue
  } & (({ href: string } & HTMLAnchorAttributes) | ({ href?: never } & HTMLButtonAttributes))

  let { children, variant, size, href, class: className, ...rest }: Props = $props()
</script>

{#if href}
  <a
    class={[actionVariants({ variant, size }), className]}
    {href}
    {...rest as HTMLAnchorAttributes}
  >
    {@render children()}
  </a>
{:else}
  <button
    class={[actionVariants({ variant, size }), className]}
    {...rest as HTMLButtonAttributes}
  >
    {@render children()}
  </button>
{/if}
```

---

## Multi-Variant File Template

When a component has multiple styled sub-elements (like ContentCard).

### complexComponent.variants.ts

```typescript
import { tv, type VariantProps } from 'tailwind-variants'

// Main container variants
export const containerVariants = tv({
	base: 'grid gap-2 rounded-lg',
	variants: {
		layout: {
			list: 'grid-cols-1',
			grid: 'grid-cols-2'
		}
	},
	defaultVariants: {
		layout: 'list'
	}
})

// Title variants (used inside the component)
export const titleVariants = tv({
	base: 'font-bold',
	variants: {
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg'
		}
	},
	defaultVariants: {
		size: 'md'
	}
})

// Description variants (used inside the component)
export const descriptionVariants = tv({
	base: 'text-slate-600',
	variants: {
		truncate: {
			true: 'line-clamp-2',
			false: ''
		}
	},
	defaultVariants: {
		truncate: true
	}
})

export type ContainerLayout = VariantProps<typeof containerVariants>['layout']
export type TitleSize = VariantProps<typeof titleVariants>['size']
```
