<script lang="ts">
import Input from '$lib/ui/form/Input.svelte'
import Select from '$lib/ui/form/Select.svelte'

let { data } = $props()
</script>

<div class="grid gap-6">
	<Input
		placeholder="Enter a title..."
		name="title"
		label="Title"
		description="Enter the title of your content submission"
		error="This field is required"
	/>
	<Input
		placeholder="Text"
		name="description"
		label="Description"
		description="Enter the description of your recipe"
		error="This field is required"
	/>
	<Select
		name="tags"
		label="Tags"
		description="Select the tags for your content"
		options={[
			{ value: '1', label: 'Tag 1' },
			{ value: '2', label: 'Tag 2' }
		]}
		error="This field is required"
	/>
</div>
