<script lang="ts">
	import Select from '$lib/ui/Select.svelte'

	type Props = {
		value: string
		onchange: (value: string) => void
	}

	let { value = 'all', onchange }: Props = $props()

	const options = [
		{ value: 'all', label: 'All Statuses' },
		{ value: 'pending_review', label: 'Pending Review' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
		{ value: 'archived', label: 'Archived' }
	]
</script>

<Select name="status" {value} {options} {onchange} />
