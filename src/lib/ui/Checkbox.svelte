<script lang="ts">
	import Check from 'phosphor-svelte/lib/Check'

	interface Props {
		checked?: boolean
		disabled?: boolean
		class?: string
		'data-testid'?: string
	}

	let {
		checked = false,
		disabled = false,
		class: className = '',
		'data-testid': testId
	}: Props = $props()
</script>

<span
	role="checkbox"
	aria-checked={checked}
	aria-disabled={disabled}
	class={[
		'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
		checked
			? 'border-svelte-500 bg-svelte-500 text-white'
			: 'border-gray-300 bg-white text-transparent',
		disabled && 'cursor-not-allowed opacity-50',
		className
	]}
	data-testid={testId}
>
	<Check class="h-3.5 w-3.5" weight="bold" />
</span>
