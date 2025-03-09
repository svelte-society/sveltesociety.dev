<script lang="ts">
import Input from '$lib/ui/form/Input.svelte'
import Select from '$lib/ui/form/Select.svelte'

let { data } = $props()
let selectedTag = $state('');
</script>

<div class="grid gap-6">
	<Input
		placeholder="Enter a title..."
		name="title"
		label="Title"
		description="Enter the title of your content submission"
		errors={[]}
		type="text"
	/>
	<Input
		placeholder="Text"
		name="description"
		label="Description"
		description="Enter the description of your recipe"
		errors={[]}
		type="text"
	/>
	<Select
		name="tags"
		label="Tags"
		description="Select the tags for your content"
		options={[
			{ value: '1', label: 'Tag 1' },
			{ value: '2', label: 'Tag 2' }
		]}
		errors=""
		bind:value={selectedTag}
	/>
</div>
