<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import Collapsible from '$lib/ui/Collapsible.svelte'
	import FilterForm from './FilterForm.svelte'
	import FunnelSimple from 'phosphor-svelte/lib/FunnelSimple'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		sort: Option[]
	}

	let { sort }: Props = $props()

	let filters = $derived(page.url)
	let filtersOpen = $state(false)

	const updateSort = (value: string) => {
		const url = new URL(filters)
		if (value !== '') url.searchParams.set('sort', value)
		else url.searchParams.delete('sort')

		goto(url, { keepFocus: true })
	}
</script>

<div class="mb-4">
	<!-- Mobile collapsible filters -->
	<Collapsible
		title={filtersOpen ? 'Hide Filters' : 'Show Filters'}
		bind:open={filtersOpen}
		showOnMobile={true}
		showOnDesktop={false}
	>
		{#snippet icon()}
			<FunnelSimple size={20} class="text-gray-600" />
		{/snippet}
		{#snippet children()}
			<div class="mb-4">
				<FilterForm {sort} {filters} {updateSort} />
			</div>
		{/snippet}
	</Collapsible>

	<!-- Desktop non-collapsible filters -->
	<div class="hidden p-2 sm:block">
		<FilterForm {sort} {filters} {updateSort} />
	</div>
</div>
