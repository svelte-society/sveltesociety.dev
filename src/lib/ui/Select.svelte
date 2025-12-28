<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		options: Option[]
		value?: string
		onchange?: (value: string) => void
		'data-testid'?: string
	} & HTMLSelectAttributes

	let {
		options,
		value = $bindable(),
		onchange,
		'data-testid': testId,
		...rest
	}: Props = $props()

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement
		value = target.value
		onchange?.(target.value)
	}

	const computedTestId = $derived(testId)
</script>

<select bind:value onchange={handleChange} data-testid={computedTestId} {...rest}>
	{#each options as option}
		<option value={option.value}>
			{option.label}
		</option>
	{/each}
</select>

<style>
	select,
	::picker(select) {
		appearance: base-select;
	}

	select {
		width: 100%;
		min-width: 9rem;
		padding: 0.25rem 0.75rem 0.25rem 0.5rem;
		background: rgb(241 245 249); /* slate-100 */
		border: 2px solid transparent;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		text-align: left;
		cursor: pointer;
	}

	select:focus {
		outline: 2px solid rgb(253 186 116); /* svelte-300 */
	}

	select:disabled {
		cursor: not-allowed;
		background: rgb(243 244 246); /* gray-100 */
		color: rgb(107 114 128); /* gray-500 */
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
		display: flex;
		align-items: center;
		height: 2rem;
		padding: 0.75rem 0.375rem 0.75rem 0.75rem;
		font-size: 0.875rem;
		border-radius: 0.125rem;
		text-transform: capitalize;
	}

	option:hover,
	option:focus {
		background: rgb(243 244 246); /* gray-100 */
	}

	option::checkmark {
		margin-left: auto;
	}
</style>
