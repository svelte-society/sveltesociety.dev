<script lang="ts">
import Button from '$lib/ui/Button.svelte'
import Input from '$lib/ui/form/Input.svelte'
import { zod } from 'sveltekit-superforms/adapters'
import { schema } from '../new/schema'
import { superForm } from 'sveltekit-superforms'
import { slugify } from '$lib/utils/slug'
let { data } = $props()
const { form, errors, enhance } = superForm(data.form, zod(schema))
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Tag</h1>
	<form method="POST" use:enhance class="space-y-6">
		<input type="hidden" name="id" bind:value={$form.id} />
		<Input
			name="name"
			label="Name"
			type="text"
			placeholder="Svelte"
			description="Enter the name of the tag"
			bind:value={$form.name}
			errors={$errors.name}
		/>
		<Input
			name="slug"
			label="Slug"
			type="text"
			placeholder="svelte"
			description="Enter the slug of the tag"
			magic={() => slugify($form.name)}
			bind:value={$form.slug}
			errors={$errors.slug}
		/>
		<Button primary fullWidth>Update Tag</Button>
	</form>
</div>
