<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import FilterDropdown from '$lib/ui/filter/FilterDropdown.svelte'
	import LinkSelect from '$lib/ui/filter/LinkSelect.svelte'
	import ActiveFilters from '$lib/ui/filter/ActiveFilters.svelte'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		sort: Option[]
	}

	let { sort }: Props = $props()
</script>

<form class="@container grid gap-4">
	<div class="grid w-full grid-cols-1 gap-4 @xs:grid-cols-2">
		<div class="flex w-full flex-col gap-2">
			<span class="text-xs font-medium">Filter</span>
			<FilterDropdown />
		</div>
		<div class="flex w-full flex-col gap-2">
			<span class="text-xs font-medium">Sort</span>
			<LinkSelect options={sort} paramName="sort" defaultValue={sort[0]?.value} />
		</div>
	</div>
	<ActiveFilters />
	<div class="sr-only">
		<Button type="submit">Filter</Button>
	</div>
</form>
