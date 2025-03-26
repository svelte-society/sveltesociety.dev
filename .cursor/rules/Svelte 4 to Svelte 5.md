I'm using svelte 5 instead of svelte 4 here is an overview of the changes.

# .cursorrunes for Svelte 5

## Overview of Changes

Svelte 5 introduces runes, a set of advanced primitives for controlling reactivity. The runes replace certain non-runes features and provide more explicit control over state and effects.

Snippets, along with render tags, help create reusable chunks of markup inside your components, reducing duplication and enhancing maintainability.

## Event Handlers in Svelte 5

In Svelte 5, event handlers are treated as standard HTML properties rather than Svelte-specific directives, simplifying their use and integrating them more closely with the rest of the properties in the component.

### Svelte 4 vs. Svelte 5:

**Before (Svelte 4):**

```html
<script>
	let count = 0
	$: double = count * 2
	$: {
		if (count > 10) alert('Too high!')
	}
</script>
<button on:click="{()" ="">count++}> {count} / {double}</button>
```

**After (Svelte 5):**

```html
<script lang="ts">
	// Define state with runes
	let count: number = $state(0)

	// Option 1: Using $derived for computed values
	let double: number = $derived(count * 2)

	// Option 2: Using $derived.by to use functions when derivating values
	let tripleOrQuadruple: number = $derived.by(() => {
		return count % 2 === 0 ? count * 3 : count * 4
	})

	// Reactive effects using runes
	$effect(() => {
		if (count > 10) alert('Too high!')
	})
</script>

<!-- Standard HTML event attributes instead of Svelte directives -->
<button onclick="{()" ="">count++}> {count} / {double}</button>

<!-- Alternatively, you can compute values inline -->
<!-- <button onclick={() => count++}>
  {count} / {count * 2}
</button> -->
```

## Key Differences:

1. **Reactivity is Explicit**:

   - Svelte 5 uses `$state()` to explicitly mark reactive variables
   - `$derived()` replaces `$:` for computed values
   - `$effect()` replaces `$: {}` blocks for side effects

2. **Event Handling is Standardized**:

   - Svelte 4: `on:click={handler}`
   - Svelte 5: `onclick={handler}`

3. **NEVER Import Runes**:

   - Do not ever import from 'svelte': `import { $state, $effect, $derived, $props, $slots } from 'svelte';`

4. **No More Event Modifiers**:
   - Svelte 4: `on:click|preventDefault={handler}`
   - Svelte 5: `onclick={e => { e.preventDefault(); handler(e); }}`

This creates clearer, more maintainable components compared to Svelte 4's previous syntax by making reactivity explicit and using standardized web platform features.

### <slots> vs snippets

In Svelte 5 you do not use slots anymore. You use snippets. Here's an example of what a snippet can look like:

```html
<!-- App.svelte -->
<script>
	import SomeComponent from './SomeComponent.svelte'
</script>

{#snippet Name({ text })}
<span>{text}</span>
{/snippet}

<SomeComponent name="{Name}" text="Eric"></SomeComponent>
```

```html
<!-- SomeComponent.svelte -->
<script>
	let { name, text } = $props()
</script>

{@render name(text)}
```

### Complex State

Use classes to handle complex state management. Here's an example:

```typescript
// counter.svelte.ts - must end with *svelte.ts*
class Counter {
	count = $state(0)
	double = $derived(this.count * 2)

	incrementor = $state(1)
	increment() {
		this.count += this.incrementor
	}
	reset() {
		this.count = 0
	}
	resetIncrementor() {
		this.incrementor = 1
	}
}
export const counter = new Counter()
```
