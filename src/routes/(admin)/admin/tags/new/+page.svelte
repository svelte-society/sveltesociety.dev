<script lang="ts">
	import { ADMIN_ROUTES } from '$lib/admin'
	import Button from '$lib/ui/Button.svelte'
	import { createTag } from '../data.remote'
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">New Tag</h1>

	<form {...createTag} class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="name" class="text-xs font-medium">Name</label>
			<input
				{...createTag.fields.name.as('text')}
				id="name"
				placeholder="Svelte"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			{#each createTag.fields.name.issues() as issue}
				<p class="text-xs text-red-600">{issue.message}</p>
			{/each}
			<p class="text-xs text-gray-500">Enter the name of the tag</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="slug" class="text-xs font-medium">Slug</label>
			<input
				{...createTag.fields.slug.as('text')}
				id="slug"
				placeholder="svelte"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			{#each createTag.fields.slug.issues() as issue}
				<p class="text-xs text-red-600">{issue.message}</p>
			{/each}
			<p class="text-xs text-gray-500">URL-friendly version of the name</p>
		</div>

		<div class="mt-6 flex gap-4">
			<Button type="submit" width="full" disabled={createTag.pending}>
				{createTag.pending ? 'Saving...' : 'Create Tag'}
			</Button>
			<Button href={ADMIN_ROUTES.tags.list} variant="secondary">Cancel</Button>
		</div>
	</form>
</div>
