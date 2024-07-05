<script lang="ts">
	interface SwitchProps {
		checked: boolean;
		disabled?: boolean;
		name?: string;
		label?: string;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		name = '',
		label = ''
	}: SwitchProps = $props();
</script>

<label
	class="inline-flex cursor-pointer items-center {disabled ? 'cursor-not-allowed opacity-50' : ''}"
>
	<div class="relative">
		<input type="checkbox" class="sr-only" {name} bind:checked {disabled} />
		<div
			class="h-6 w-10 rounded-full bg-gray-200 shadow-inner transition-colors duration-300 ease-in-out
        {checked ? 'bg-blue-500' : 'bg-gray-200'}
        {disabled ? 'opacity-50' : ''}"
		></div>
		<div
			class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out
        {checked ? 'translate-x-full transform' : ''}"
		></div>
	</div>
	{#if label}
		<span class="ml-3 text-sm font-medium text-gray-700">{label}</span>
	{/if}
</label>
