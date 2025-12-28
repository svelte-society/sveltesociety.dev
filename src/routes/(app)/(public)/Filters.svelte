<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import FilterForm from './FilterForm.svelte'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		sort: Option[]
	}

	let { sort }: Props = $props()

	let filters = $derived(page.url)

	const updateSort = (value: string) => {
		const url = new URL(filters)
		if (value !== '') url.searchParams.set('sort', value)
		else url.searchParams.delete('sort')

		goto(url, { keepFocus: true })
	}
</script>

<div class="mb-4 p-2 sm:p-0">
	<FilterForm {sort} {filters} {updateSort} />
</div>
