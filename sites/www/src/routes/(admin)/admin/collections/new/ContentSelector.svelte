<script lang="ts">
import Button from '$lib/ui/Button.svelte'
import Input from '$lib/ui/form/Input.svelte'

interface ContentItem {
	id: number
	title: string
	type: string
}

interface Props {
	selectedIds: number[]
	name: string
	errors?: any
	description?: string
	content: ContentItem[]
}

let { selectedIds = $bindable([]), name, description, errors, content }: Props = $props()
let searchQuery = $state('')
let showModal = $state(false)
let filteredItems = $derived.by(() => {
	return content.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
})

function toggleModal() {
	showModal = !showModal
}

function selectItem(item: ContentItem) {
	if (!selectedIds.includes(item.id)) {
		selectedIds = [...selectedIds, item.id]
	} else {
		unselectItem(item.id)
	}
}

function unselectItem(id: number) {
	selectedIds = selectedIds.filter((itemId: number) => itemId !== id)
}

let selectedItems = $derived.by(() => {
	return selectedIds
		.map((id: number) => content.find((item) => item.id === id))
		.filter(Boolean) as ContentItem[]
})
</script>

<div class="content-selector">
	<div class="mb-4 grid grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_auto]">
		<Input
			disabled
			placeholder="1, 2, 3"
			type="text"
			{description}
			errors={errors?._errors}
			value={selectedIds.join(', ')}
		/>
		<Button type="button" onclick={toggleModal} primary>Select Content</Button>
	</div>
	{#if showModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div
				class="w-full max-w-2xl rounded-lg bg-white p-6"
				role="dialog"
				aria-labelledby="modal-title"
			>
				<h2 id="modal-title" class="mb-4 text-2xl font-bold">Select Content</h2>
				<input
					type="text"
					placeholder="Search content..."
					bind:value={searchQuery}
					class="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<div class="mb-4 max-h-96 overflow-y-auto rounded-md border border-gray-200">
					{#each filteredItems as item}
						<div
							class="flex items-center justify-between border-b border-gray-200 p-3 last:border-b-0 hover:bg-gray-50"
						>
							<span>
								{item.title}
								<span class="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs">{item.type}</span>
							</span>
							<Button
								small
								type="button"
								onclick={() => selectItem(item)}
								secondary={selectedIds.includes(item.id)}
								primary={!selectedIds.includes(item.id)}
								>{selectedIds.includes(item.id) ? 'Remove' : 'Select'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="ml-1"
								>
									{#if selectedIds.includes(item.id)}
										<path d="M18 6 6 18"></path>
										<path d="m6 6 12 12"></path>
									{:else}
										<path d="M20 6 9 17l-5-5"></path>
									{/if}
								</svg></Button
							>
						</div>
					{/each}
				</div>
				<div class="flex justify-end">
					<button
						type="button"
						onclick={toggleModal}
						class="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}
	{#if selectedItems.length > 0}
		<div class="mb-4 overflow-hidden rounded-md border">
			{#each selectedItems as item, index (item.id)}
				<div
					class="flex cursor-move items-center border-b bg-white p-2 last:border-b-0 hover:bg-gray-50"
					data-sveltekit-preload-data="off"
				>
					<span class="mr-3 w-8 text-right text-gray-500">{index + 1}.</span>
					<a href={`/content/${item.id}`} class="mr-2 flex-grow text-blue-600 hover:underline"
						>{item.title}</a
					>
					<span class="mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">{item.type}</span>
					<button
						type="button"
						onclick={() => unselectItem(item.id)}
						class="text-gray-500 hover:text-gray-700"
						aria-label={`Remove ${item.title}`}
					>
						&times;
					</button>
					<input type="checkbox" hidden checked {name} value={item.id} class="hidden" />
				</div>
			{/each}
		</div>
	{/if}
</div>
