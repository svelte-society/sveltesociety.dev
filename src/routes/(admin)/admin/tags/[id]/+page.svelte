<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import { getTag, updateTag } from './data.remote'

	const data = $derived(await getTag({ id: page.params.id! }))

	updateTag.fields.set({
		id: data.tag.id,
		name: data.tag.name,
		slug: data.tag.slug
	})
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Tag</h1>
	<form {...updateTag} class="space-y-6">
		<input {...updateTag.fields.id.as('hidden', data.tag.id)} />

		<div class="flex flex-col gap-2">
			<label for="name" class="text-xs font-medium">Name</label>
			<input
				{...updateTag.fields.name.as('text')}
				id="name"
				placeholder="Svelte"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			{#each updateTag.fields.name.issues() as issue}
				<p class="text-xs text-red-600">{issue.message}</p>
			{/each}
			<p class="text-xs text-gray-500">Enter the name of the tag</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="slug" class="text-xs font-medium">Slug</label>
			<input
				{...updateTag.fields.slug.as('text')}
				id="slug"
				placeholder="svelte"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			{#each updateTag.fields.slug.issues() as issue}
				<p class="text-xs text-red-600">{issue.message}</p>
			{/each}
			<p class="text-xs text-gray-500">Enter the slug of the tag</p>
		</div>

		<Button width="full" disabled={updateTag.pending}>
			{updateTag.pending ? 'Updating...' : 'Update Tag'}
		</Button>
	</form>
</div>
