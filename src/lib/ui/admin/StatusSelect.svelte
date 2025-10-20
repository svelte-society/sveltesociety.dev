<script lang="ts">
	import Badge from './Badge.svelte'

	type Props = {
		value: string
		onchange: (value: string) => void
	}

	let { value = 'all', onchange }: Props = $props()

	const statuses = [
		{ value: 'all', label: 'All Statuses', color: 'default' },
		{ value: 'draft', label: 'Draft', color: 'warning' },
		{ value: 'published', label: 'Published', color: 'success' },
		{ value: 'archived', label: 'Archived', color: 'danger' }
	] as const

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement
		onchange(target.value)
	}

	const currentStatus = $derived(statuses.find((s) => s.value === value) || statuses[0])
</script>

<div class="relative">
	<select
		{value}
		onchange={handleChange}
		class="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
	>
		{#each statuses as status}
			<option value={status.value}>{status.label}</option>
		{/each}
	</select>
	<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
		<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
</div>
