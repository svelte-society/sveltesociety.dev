<script lang="ts">
	import Select from '$lib/ui/form/Select.svelte'
	import type { ContentStatus } from '$lib/admin'

	interface Props {
		value: ContentStatus
		name?: string
		label?: string
		description?: string
		includeArchived?: boolean
	}

	let {
		value,
		name = 'status',
		label = 'Status',
		description = 'The publication status of this content',
		includeArchived = true
	}: Props = $props()

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'pending_review', label: 'Pending Review' },
		{ value: 'published', label: 'Published' },
		...(includeArchived ? [{ value: 'archived', label: 'Archived' }] : [])
	]
</script>

<Select {name} {label} {description} bind:value options={statusOptions} />
