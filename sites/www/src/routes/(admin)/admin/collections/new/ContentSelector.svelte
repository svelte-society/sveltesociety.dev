<script lang="ts">
	import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	interface ContentItem {
		id: number;
		title: string;
		type: string;
	}

	let { selectedIds = $bindable([]), name } = $props<{ selectedIds: number[]; name: string }>();
	let searchQuery = $state('');
	let showModal = $state(false);
	let contentItems: ContentItem[] = $state([]);
	let filteredItems = $derived.by(() => {
		return contentItems.filter((item) =>
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	const flipDurationMs = 200;

	function toggleModal() {
		showModal = !showModal;
		if (showModal) {
			searchContent();
		}
	}

	async function searchContent() {
		// TODO: Implement actual API call to search content
		contentItems = [
			{ id: 1, title: 'Recipe 1', type: 'recipe' },
			{ id: 2, title: 'Video Tutorial', type: 'video' },
			{ id: 3, title: 'Blog Post', type: 'blog' },
			{ id: 4, title: 'Library Book', type: 'library' },
			{ id: 5, title: 'Collection Summer', type: 'collection' }
		];
	}

	function selectItem(item: ContentItem) {
		if (!selectedIds.includes(item.id)) {
			selectedIds = [...selectedIds, item.id];
		} else {
			unselectItem(item.id);
		}
	}

	function unselectItem(id: number) {
		selectedIds = selectedIds.filter((itemId: number) => itemId !== id);
	}

	let selectedItems = $derived.by(() => {
		return selectedIds
			.map((id) => contentItems.find((item) => item.id === id))
			.filter(Boolean) as ContentItem[];
	});
</script>

<div class="content-selector">
	<div class="mb-4 flex items-center space-x-2">
		<input
			type="text"
			readonly
			value={selectedIds.join(', ')}
			placeholder="Selected content IDs"
			class="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<button
			type="button"
			onclick={toggleModal}
			class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Select Content
		</button>
	</div>
	<div class="mb-4 overflow-hidden rounded-md border">
		{#each selectedItems as item, index (item.id)}
			<div
				class="flex cursor-move items-center border-b bg-white p-2 last:border-b-0 hover:bg-gray-50"
				animate:flip={{ duration: flipDurationMs }}
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
					class="text-gray-500 hover:text-gray-700 focus:outline-none"
					aria-label={`Remove ${item.title}`}
				>
					&times;
				</button>
				<input type="checkbox" hidden checked {name} value={item.id} class="hidden" />
			</div>
		{/each}
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
							<button
								type="button"
								onclick={() => selectItem(item)}
								class={`rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
									selectedIds.includes(item.id)
										? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
										: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
								}`}
							>
								{#if selectedIds.includes(item.id)}
									<span class="flex items-center">
										Unselect
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
											<path d="M18 6 6 18"></path>
											<path d="m6 6 12 12"></path>
										</svg>
									</span>
								{:else}
									<span class="flex items-center">
										Select
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
											<path d="M20 6 9 17l-5-5"></path>
										</svg>
									</span>
								{/if}
							</button>
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
</div>
