<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { type TagType } from '$lib/ui/Tags.svelte'
	import Collapsible from '$lib/ui/Collapsible.svelte'
	import FilterForm from './FilterForm.svelte'
	import FunnelSimple from 'phosphor-svelte/lib/FunnelSimple'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		categories: Option[]
		sort: Option[]
		tags: TagType[]
	}

	let { categories, sort, tags }: Props = $props()

	let filters = $derived(page.url)
	let filtersOpen = $state(false)

	const updateCategory = (value: string) => {
		const url = new URL(filters)

		const newPath = value !== '' ? `/${value}` : '/'

		const newUrl = new URL(newPath, url.origin)

		url.searchParams.forEach((paramValue, paramKey) => {
			if (paramKey !== 'category') {
				newUrl.searchParams.set(paramKey, paramValue)
			}
		})

		goto(newUrl, { keepFocus: true })
	}

	const updateSort = (value: string) => {
		const url = new URL(filters)
		if (value !== '') url.searchParams.set('sort', value)
		else url.searchParams.delete('sort')

		goto(url, { keepFocus: true })
	}
</script>

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
		<FilterForm {categories} {sort} {tags} {filters} {updateCategory} {updateSort} />
	{/snippet}
</Collapsible>

<!-- Desktop non-collapsible filters -->
<div
	class="sticky top-0 z-10 hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:block"
>
	<FilterForm {categories} {sort} {tags} {filters} {updateCategory} {updateSort} />
</div>
