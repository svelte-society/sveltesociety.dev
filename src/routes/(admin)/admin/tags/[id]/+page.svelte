<script lang="ts">
	import { page } from '$app/state'
	import Input from '$lib/ui/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Tag from 'phosphor-svelte/lib/Tag'
	import { initForm } from '$lib/utils/form.svelte'
	import { getTagById, updateTag } from '../tags.remote'

	const tagId = page.params.id!

	const tag = await getTagById(tagId)

	initForm(updateTag, () => ({
		id: tag.id,
		name: tag.name,
		slug: tag.slug
	}))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader title="Edit Tag" description="Update category tag information" icon={Tag} />

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">Tag Configuration</p>
			</div>
		</div>

		<div class="p-8">
			<form {...updateTag} class="flex flex-col gap-6">
				<input {...updateTag.fields.id.as('hidden', tagId)} />

				<div class="grid gap-6 lg:grid-cols-2">
					<Input
						{...updateTag.fields.name.as('text')}
						label="Name"
						placeholder="Svelte"
						description="Enter the name of the tag"
						issues={updateTag.fields.name.issues()}
						data-testid="input-name"
					/>

					<Input
						{...updateTag.fields.slug.as('text')}
						label="Slug"
						placeholder="svelte"
						description="Enter the slug of the tag"
						issues={updateTag.fields.slug.issues()}
						data-testid="input-slug"
					/>
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button
						type="submit"
						width="full"
						disabled={!!updateTag.pending}
						data-testid="submit-button"
					>
						{updateTag.pending ? 'Updating...' : 'Update Tag'}
					</Button>
					<Button href="/admin/tags" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
