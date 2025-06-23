<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { type TagType } from '$lib/ui/Tags.svelte'
	import { Collapsible } from 'bits-ui'
	import { slide } from 'svelte/transition'
	import FilterForm from './FilterForm.svelte'

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
	let isOpen = $state(false)

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
<div class="sm:hidden">
	<Collapsible.Root bind:open={isOpen}>
		<Collapsible.Trigger
			class="focus:outline-svelte-300 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-[background-color] hover:bg-slate-100 focus:outline-2 focus:outline-offset-2"
		>
			<span class="font-medium text-gray-900">
				{isOpen ? 'Hide Filters' : 'Show Filters'}
			</span>
			<svg
				class="h-4 w-4 text-gray-500 transition-transform duration-200"
				class:rotate-180={isOpen}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</Collapsible.Trigger>

		<Collapsible.Content forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div
						transition:slide={{ duration: 200 }}
						{...props}
						class="mt-4 rounded-lg border border-slate-200 bg-white p-4"
					>
						<FilterForm {categories} {sort} {tags} {filters} {updateCategory} {updateSort} />
					</div>
				{/if}
			{/snippet}
		</Collapsible.Content>
	</Collapsible.Root>
</div>

<!-- Desktop non-collapsible filters -->
<div class="hidden rounded-lg border border-slate-200 bg-white p-4 sm:block">
	<FilterForm {categories} {sort} {tags} {filters} {updateCategory} {updateSort} />
</div>
