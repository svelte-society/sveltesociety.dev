<script lang="ts">
	import Input from '$lib/ui/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import { ADMIN_ROUTES } from '$lib/admin'
	import Tag from 'phosphor-svelte/lib/Tag'
	import { createTag } from '../tags.remote'
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Create New Tag"
		description="Add a new category tag to organize your content"
		icon={Tag}
	/>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Tag Configuration</p>
			</div>
		</div>

		<div class="p-8">
			<form {...createTag} class="flex flex-col gap-6">
				<Input
					{...createTag.fields.name.as('text')}
					label="Name"
					placeholder="Svelte"
					description="Enter the name of the tag"
					issues={createTag.fields.name.issues()}
					data-testid="input-name"
				/>

				<Input
					{...createTag.fields.slug.as('text')}
					label="Slug"
					placeholder="svelte"
					description="URL-friendly version of the name"
					issues={createTag.fields.slug.issues()}
					data-testid="input-slug"
				/>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button
						type="submit"
						width="full"
						disabled={!!createTag.pending}
						data-testid="submit-button"
					>
						{createTag.pending ? 'Creating...' : 'Create Tag'}
					</Button>
					<Button href={ADMIN_ROUTES.tags.list} variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
