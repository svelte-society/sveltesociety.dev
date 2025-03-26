<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import SuperDebug from 'sveltekit-superforms'
	import Select from '$lib/ui/form/Select.svelte'
	import { options, schema } from './schema'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { zodClient } from 'sveltekit-superforms/adapters'
	let { data } = $props()

	const form = superForm(data.form, {
		resetForm: true,
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		validators: zodClient(schema)
	})

	const { form: formData, submitting } = form
</script>

<div class="mx-auto grid max-w-3xl gap-6">
	<h1 class="mb-6 text-2xl font-bold">Submit a new resource</h1>
	<p class="text-sm">
		Before making a submission, please ensure that the resource you are submitting is not already
		listed on the site. Use the search bar to check if the resource is already listed.
	</p>
	<Form {form} action="?/submit">
		<Input
			placeholder="Enter a title..."
			name="title"
			label="Title"
			description="Enter the title of your content submission"
		/>
		<Textarea
			placeholder="Enter a description..."
			name="description"
			label="Description"
			description="Enter the description of your content submission."
		/>
		<Select
			name="type"
			label="Type"
			description="Select the type of content you are submitting"
			{options}
		/>
		<Input
			placeholder="Enter the URL"
			name="url"
			label="Url"
			description="The URL for the resource you are submitting."
		/>
		<Input
			placeholder="Enter the GitHub repo"
			name="github_repo"
			label="GitHub Repository"
			description="Enter the GitHub repo for the resource you are submitting."
		/>
		<Textarea
			placeholder="Enter notes"
			name="notes"
			label="Notes"
			description="Enter the notes for the resource you are submitting."
		/>
		<Button type="submit" primary disabled={$submitting}
			>{$submitting ? 'Submitting...' : 'Submit'}</Button
		>
	</Form>
</div>

<SuperDebug data={$formData} />
