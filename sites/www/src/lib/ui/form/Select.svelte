<script lang="ts">
	type SelectOption = {
		value: string;
		label: string;
	};
	interface SelectProps {
		label?: string;
		value: string;
		description?: string;
		errors?: string;
		initial?: string;
		placeholder?: string;
		options: SelectOption[];
		name: string;
		disabled?: boolean;
	}

	let {
		name,
		value = $bindable(),
		label,
		description,
		placeholder = 'Select an option...',
		errors,
		options = []
	}: SelectProps = $props();
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label class="text-xs font-medium text-slate-800 outline-none" for={name}>{label}</label>
	{/if}
	<div class="relative">
		<select
			bind:value={value}
			{name}
			class="w-full appearance-none rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-8 text-sm text-slate-800"
			class:error={false}
		>
			<option value="" disabled selected hidden>{placeholder}</option>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		<div
			class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700"
		>
			<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
				<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
			</svg>
		</div>
	</div>
	{#if errors}
		<div class="text-xs text-slate-500" class:error={errors}>
			{errors}
		</div>
	{:else if description}
		<div class="text-xs text-slate-500" class:error={false}>
			{description}
		</div>
	{/if}
</div>

<style lang="postcss">
	select.error {
		@apply border-red-300 bg-red-50 text-red-600;
	}
	div .error {
		@apply text-red-600;
	}
	select:disabled {
		@apply cursor-not-allowed text-gray-400;
	}
</style>
