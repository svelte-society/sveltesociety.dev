<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit'
	import type { HTMLSelectAttributes } from 'svelte/elements'
	import Field from './Field.svelte'

	export type Option = {
		label: string
		value: string
	}

	type Props = {
		options: readonly Option[]
		value?: string | number
		onchange?: (value: string) => void
		'data-testid'?: string
		label?: string
		description?: string
		issues?: RemoteFormIssue[]
	} & HTMLSelectAttributes

	let {
		options,
		value = $bindable<string | number>(),
		onchange,
		'data-testid': testId,
		label,
		description,
		issues,
		...rest
	}: Props = $props()

	// Convert value to string for the select element
	const stringValue = $derived(value?.toString() ?? '')

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement
		value = target.value
		onchange?.(target.value)
	}

	// Auto-generate test ID from name if not explicitly provided
	const name = rest.name as string | undefined
	const computedTestId = $derived(testId ?? (name ? `select-${name}` : undefined))
	const hasErrors = $derived(issues && issues.length > 0)
</script>

<Field {label} {description} {issues}>
	<select bind:value onchange={handleChange} data-testid={computedTestId} class:mt-2={label} class:select-error={hasErrors} {...rest}>
		{#each options as option}
			<option value={option.value}>
				{option.label}
			</option>
		{/each}
	</select>
</Field>

<style>
	/* Base styles for all browsers (Safari fallback) */
	select {
		width: 100%;
		min-width: 9rem;
		padding: 0.25rem 2rem 0.25rem 0.5rem;
		background: rgb(241 245 249); /* slate-100 */
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='%236b7280'%3E%3Cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48a8,8,0,0,0,11.32,11.32Z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		background-size: 1rem;
		border: 2px solid transparent;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		text-align: left;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
	}

	select:focus {
		outline: 2px solid rgb(253 186 116); /* svelte-300 */
	}

	select:disabled {
		cursor: not-allowed;
		background-color: rgb(243 244 246); /* gray-100 */
		color: rgb(107 114 128); /* gray-500 */
	}

	select.select-error {
		border-color: rgb(252 165 165); /* red-300 */
		background-color: rgb(254 242 242); /* red-50 */
	}

	/* Enhanced styles for browsers supporting base-select */
	@supports (appearance: base-select) {
		select,
		::picker(select) {
			appearance: base-select;
		}

		select {
			padding: 0.25rem 0.75rem 0.25rem 0.5rem;
			background-image: none;
		}

		::picker(select) {
			border: none;
			border-radius: 0.75rem;
			background: white;
			padding: 0.75rem 0.25rem;
			box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
			width: anchor-size(width);
		}

		option {
			position: relative;
			display: flex;
			align-items: center;
			height: 2rem;
			padding: 0.75rem 2rem 0.75rem 0.75rem;
			font-size: 0.875rem;
			border-radius: 0.125rem;
			text-transform: capitalize;
		}

		option:hover,
		option:focus {
			background: rgb(243 244 246); /* gray-100 */
		}

		option::checkmark {
			position: absolute;
			right: 0.5rem;
		}

		/* CaretUpDown icon from phosphor-svelte */
		select::picker-icon {
			content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='%236b7280'%3E%3Cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48a8,8,0,0,0,11.32,11.32Z'/%3E%3C/svg%3E");
			width: 1rem;
			height: 1rem;
		}
	}
</style>
