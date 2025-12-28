<script lang="ts">
	import FilterForm from './FilterForm.svelte'

	type Option = {
		label: string
		value: string
	}

	type Props = {
		sort: Option[]
	}

	let { sort }: Props = $props()
</script>

<div class="mb-4 p-2 sm:p-0">
	<FilterForm {sort} />
</div>
