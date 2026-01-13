<script lang="ts">
	import { toast } from 'svelte-sonner'
	import ContentPicker from '$lib/ui/admin/ContentPicker.svelte'
	import Trash from 'phosphor-svelte/lib/Trash'
	import TextArea from '$lib/ui/TextArea.svelte'
	import { getContentTypeColor } from '$lib/utils/content-type-colors'

	interface ContentItem {
		id: string
		title: string
		type: string
		custom_description?: string | null
	}

	interface Props {
		items: ContentItem[]
		field: any
	}

	let { items, field }: Props = $props()

	function handleAddContent(content: { id: string; title: string; type: string }) {
		if (items.some((c) => c.id === content.id)) {
			toast.error('Content already added')
			return
		}
		items = [...items, content]
	}

	function handleRemoveContent(id: string) {
		items = items.filter((c) => c.id !== id)
	}
</script>

<div class="space-y-6">
	<ContentPicker onSelect={handleAddContent} />

	<fieldset class="space-y-2">
		<legend class="text-xs font-medium">Selected Content ({items.length})</legend>
		{#if items.length > 0}
			<ul class="space-y-2">
				{#each items as item, i (item.id)}
					<li
						class="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
					>
						<div class="min-w-0 flex-1 grid gap-4">
							<div class="flex items-center gap-2">
								<span class="truncate text-sm font-medium text-slate-900">
									{item.title}
								</span>
								<span
									class={[
										'shrink-0 rounded px-1.5 py-0.5 text-xs font-medium capitalize',
										getContentTypeColor(item.type)
									]}
								>
									{item.type}
								</span>
							</div>
							<input {...field[i].id.as('hidden', item.id)} />
							<TextArea
								{...field[i].custom_description.as('text')}
								label="Content Piece Text"
								placeholder="Enter some text about this content piece"
								issues={field[i].custom_description.issues()}
								data-testid="textarea-intro-text"
								rows={4}
							/>
						</div>
						<button
							type="button"
							onclick={() => handleRemoveContent(item.id)}
							class="shrink-0 rounded p-1 text-red-500 hover:bg-red-50"
							title="Remove"
						>
							<Trash class="size-4" />
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="py-4 text-center text-sm text-slate-500">
				No content added yet. Search above to add content.
			</p>
		{/if}
	</fieldset>
</div>
