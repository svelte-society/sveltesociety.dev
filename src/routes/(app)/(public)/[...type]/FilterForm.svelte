<script lang="ts">
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Tags, { type TagType } from '$lib/ui/Tags.svelte'
	import { page } from '$app/state'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		categories: Option[]
		sort: Option[]
		tags: TagType[]
		filters: URL
		updateCategory: (value: string) => void
		updateSort: (value: string) => void
	}

	let { categories, sort, tags, filters, updateCategory, updateSort }: Props = $props()
</script>

<form class="@container grid gap-4">
	<div class="grid w-full grid-cols-1 gap-4 @xs:grid-cols-2">
		<div class="flex w-full flex-col gap-2">
			<label for="category" class="text-xs font-medium outline-none">Category</label>
			<Select
				value={page.params.type || categories[0].value}
				name="category"
				onchange={updateCategory}
				options={categories}
			/>
		</div>
		<div class="flex w-full flex-col gap-2">
			<label for="sort" class="text-xs font-medium outline-none">Sort</label>
			<Select
				value={filters.searchParams.get('sort') || sort[0].value}
				name="sort"
				onchange={updateSort}
				options={sort}
			/>
		</div>
	</div>
	<div class="flex w-full flex-col gap-2">
		<label class="text-xs font-medium outline-none">Tags</label>
		<Tags {tags} />
	</div>
	<div class="sr-only">
		<Button type="submit">Filter</Button>
	</div>
</form>
