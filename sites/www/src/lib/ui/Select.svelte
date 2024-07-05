<script lang="ts">
	type SelectOption = {
		value: string;
		label: string;
	};

	interface SelectProps {
		options: SelectOption[];
		value?: string;
		placeholder?: string;
		name?: string;
		disabled?: boolean;
		onchange?: ChangeEventHandler;
	}

	let {
		options = [],
		placeholder = 'Select an option',
		name = '',
		value = $bindable(''),
		disabled = false,
		onchange
	}: SelectProps = $props();
</script>

<div class="relative inline-block w-full">
	<select
		{name}
		bind:value
		{onchange}
		{disabled}
		class="
      focus:shadow-outline block w-full appearance-none rounded border border-gray-300
      bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-400 focus:outline-none
      {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    "
	>
		{#if placeholder}
			<option value="" disabled selected hidden>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
		<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
		</svg>
	</div>
</div>
