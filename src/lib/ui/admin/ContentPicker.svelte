<script lang="ts">
	import { MagnifyingGlass, Plus } from 'phosphor-svelte'

	interface ContentItem {
		id: string
		title: string
		type: string
		description?: string
	}

	interface Props {
		onSelect?: (content: ContentItem) => void
		'data-testid'?: string
	}

	let { onSelect, 'data-testid': testId = 'content-picker' }: Props = $props()

	let searchQuery = $state('')
	let searchResults = $state<ContentItem[]>([])
	let isSearching = $state(false)
	let debounceTimer: ReturnType<typeof setTimeout> | undefined

	async function searchContent(query: string) {
		if (!query.trim()) {
			searchResults = []
			return
		}

		isSearching = true
		try {
			const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
			const data = await response.json()

			if (data.success) {
				searchResults = data.data.map((hit: any) => ({
					id: hit.document.id,
					title: hit.document.title,
					type: hit.document.type,
					description: hit.document.description
				}))
			}
		} catch (error) {
			console.error('Search error:', error)
			searchResults = []
		} finally {
			isSearching = false
		}
	}

	function handleInput(event: Event) {
		const value = (event.target as HTMLInputElement).value
		searchQuery = value

		// Debounce search
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => {
			searchContent(value)
		}, 300)
	}

	function handleSelect(content: ContentItem) {
		onSelect?.(content)
		searchQuery = ''
		searchResults = []
	}

	function getTypeColor(type: string) {
		switch (type) {
			case 'video':
				return 'bg-red-100 text-red-800'
			case 'library':
				return 'bg-purple-100 text-purple-800'
			case 'recipe':
				return 'bg-green-100 text-green-800'
			case 'resource':
				return 'bg-blue-100 text-blue-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}
</script>

<div class="space-y-2" data-testid={testId}>
	<label class="text-xs font-medium">Add Content</label>
	<div class="relative">
		<MagnifyingGlass class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
		<input
			type="text"
			placeholder="Search for content to add..."
			value={searchQuery}
			oninput={handleInput}
			class="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
			data-testid="content-picker-search"
		/>
	</div>

	{#if isSearching}
		<p class="py-2 text-center text-sm text-slate-500">Searching...</p>
	{:else if searchResults.length > 0}
		<ul class="max-h-60 overflow-y-auto rounded-md border border-slate-200 bg-white">
			{#each searchResults as content (content.id)}
				<li class="border-b border-slate-100 last:border-b-0">
					<button
						type="button"
						onclick={() => handleSelect(content)}
						class="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
						data-testid="content-picker-result"
					>
						<Plus class="size-4 shrink-0 text-slate-400" />
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="truncate text-sm font-medium text-slate-900">{content.title}</span>
								<span
									class={[
										'shrink-0 rounded px-1.5 py-0.5 text-xs font-medium capitalize',
										getTypeColor(content.type)
									]}
								>
									{content.type}
								</span>
							</div>
							{#if content.description}
								<p class="truncate text-xs text-slate-500">{content.description}</p>
							{/if}
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{:else if searchQuery.trim()}
		<p class="py-2 text-center text-sm text-slate-500">No content found</p>
	{/if}
</div>
