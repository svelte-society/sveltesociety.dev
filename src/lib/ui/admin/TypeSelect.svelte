<script lang="ts">
	import Select from '$lib/ui/Select.svelte'

	type Props = {
		value: string
		onchange: (value: string) => void
	}

	let { value = '', onchange }: Props = $props()

	const options = [
		{ value: '', label: 'All Types' },
		{ value: 'video', label: 'Video' },
		{ value: 'library', label: 'Library' },
		{ value: 'resource', label: 'Resource' },
		{ value: 'announcement', label: 'Announcement' },
		{ value: 'collection', label: 'Collection' },
		{ value: 'recipe', label: 'Recipe' }
	]
</script>

<Select name="type" {value} {options} {onchange} />
