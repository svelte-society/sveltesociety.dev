<script lang="ts">
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import Tags, { type TagType } from '$lib/ui/Tags.svelte'

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

	let Filters = $derived(page.url)

	const getTags = (name: string) => {
		const filter = Filters.searchParams.get(name)
		return filter ? filter.split(',') : []
	}

	const updateTags = (name: string, value: string) => {
		Filters.searchParams.set(name, value)
		goto(Filters.pathname + Filters.search, { replaceState: true })
	}

	const updateCategory = (value: string) => {
		const url = new URL(Filters)
		if (value !== '') url.searchParams.set('category', value)
		else url.searchParams.delete('category')

		goto(url, { keepFocus: true })
	}

	const updateSort = (value: string) => {
		const url = new URL(Filters)
		if (value !== '') url.searchParams.set('sort', value)
		else url.searchParams.delete('sort')

		goto(url, { keepFocus: true })
	}
</script>

<form class="@container grid gap-0.5">
	<div class="mb-4 grid w-full grid-cols-1 gap-2 @md:grid-cols-2">
		<div class="flex w-full flex-col gap-2">
			<label for="category" class="text-xs font-medium outline-none">Category</label>
			<Select
				value={Filters.searchParams.get('category') || categories[0].value}
				name="category"
				onchange={updateCategory}
				options={categories}
				selected={Filters.searchParams.get('category') || ''}
			/>
		</div>
		<div class="flex w-full flex-col gap-2">
			<label for="sort" class="text-xs font-medium outline-none">Sort</label>
			<Select
				value={Filters.searchParams.get('sort') || sort[0].value}
				name="sort"
				onchange={updateSort}
				options={sort}
			/>
		</div>
	</div>
	<div class="flex w-full flex-col gap-2">
		<label for="sort" class="text-xs font-medium outline-none">Tags</label>
		<Tags {tags} />
	</div>
	<div class="sr-only">
		<Button type="submit">Filter</Button>
	</div>
</form>
