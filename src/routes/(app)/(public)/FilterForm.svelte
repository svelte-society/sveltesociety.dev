<script lang="ts">
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Tags, { type TagType } from '$lib/ui/Tags.svelte'
	import FilterDropdown from '$lib/ui/filter/FilterDropdown.svelte'
	import ActiveFilters from '$lib/ui/filter/ActiveFilters.svelte'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		sort: Option[]
		tags: TagType[]
		filters: URL
		updateSort: (value: string) => void
	}

	let { sort, tags, filters, updateSort }: Props = $props()
</script>

<form class="@container grid gap-4">
	<div class="grid w-full grid-cols-1 gap-4 @xs:grid-cols-2">
		<div class="flex w-full flex-col gap-2">
			<label class="text-xs font-medium outline-none">Filter</label>
			<FilterDropdown />
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
	<ActiveFilters />
	<!-- Tags only shown on mobile, hidden on desktop (lg and up) -->
	<div class="flex w-full flex-col gap-2 lg:hidden">
		<p class="text-xs font-medium outline-none">Tags</p>
		<Tags {tags} />
	</div>
	<div class="sr-only">
		<Button type="submit">Filter</Button>
	</div>
</form>
