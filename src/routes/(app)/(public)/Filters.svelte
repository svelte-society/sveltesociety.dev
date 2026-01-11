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

<div>
	<FilterForm {sort} />
</div>
