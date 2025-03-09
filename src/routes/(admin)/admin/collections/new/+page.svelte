<script lang="ts">
import AutoCompleteTags from '$lib/ui/AutoComplete-Tags.svelte'
import ContentSelector from './ContentSelector.svelte'
import Button from '$lib/ui/Button.svelte'
import Input from '$lib/ui/form/Input.svelte'
import { zod } from 'sveltekit-superforms/adapters'
import { schema } from './schema'

import SuperDebug, { superForm } from 'sveltekit-superforms'
import { slugify } from '$lib/utils/slug'
let { data } = $props()
const { form, errors, enhance } = superForm(data.form, zod(schema))
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Create New Collection</h1>
	<form method="POST" use:enhance class="space-y-6">
		<Input
			name="title"
			label="Title"
			type="text"
			placeholder="Best Rune Tutorials"
			description="Enter the title of the collection"
			bind:value={$form.title}
			errors={$errors.title}
		/>
		<Input
			name="slug"
			label="Slug"
			placeholder="best-rune-tutorials"
			description="Enter the slug of the collection"
			type="text"
			magic={() => slugify($form.title)}
			bind:value={$form.slug}
			errors={$errors.slug}
		/>
		<Input
			name="description"
			label="Description"
			type="text"
			placeholder="Learn how to use the best runes in Svelte"
			description="Enter the description of the collection"
			bind:value={$form.description}
			errors={$errors.description}
		/>
		<div>
			<ContentSelector
				name="children"
				bind:selectedIds={$form.children}
				errors={$errors.children}
				content={data.content}
				description="Select content to add to the collection"
			/>
		</div>
		<div>
			<label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
			<AutoCompleteTags
				tags={data.tags}
				selectedTags={$form.tags}
				placeholder="Type to search or create a tag"
				description="Select tags for this collection"
				errors={$errors.tags}
			/>
		</div>

		<Button primary fullWidth>Create Collection</Button>
	</form>
</div>

<SuperDebug data={$form} />
