<script lang="ts">
	import { MagnifyingGlass, Plus } from 'phosphor-svelte'
	import { searchContent } from './content-picker.remote'

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
	let debouncedQuery = $state('')
	let debounceTimer: ReturnType<typeof setTimeout> | undefined

	function handleInput(event: Event) {
		const value = (event.target as HTMLInputElement).value
		searchQuery = value

		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => {
			debouncedQuery = value
		}, 300)
	}

	function handleSelect(content: ContentItem) {
		onSelect?.(content)
		searchQuery = ''
		debouncedQuery = ''
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
	<label for="search_query" class="text-xs font-medium">Add Content</label>
	<div class="relative">
		<MagnifyingGlass class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
		<input
			name="search_query"
			type="text"
			placeholder="Search for content to add..."
			value={searchQuery}
			oninput={handleInput}
			class="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm placeholder-slate-400 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
			data-testid="content-picker-search"
		/>
	</div>

	<svelte:boundary>
		{#if $effect.pending()}
			<p class="py-2 text-center text-sm text-slate-500">Searching...</p>
		{/if}

		{#snippet failed()}
			<p class="py-2 text-center text-sm text-red-500">Search failed</p>
		{/snippet}

		{@const results = await searchContent({ search: debouncedQuery, limit: 20 })}
		{#if results.length > 0}
			<ul class="max-h-60 overflow-y-auto rounded-md border border-slate-200 bg-white">
				{#each results as content (content.id)}
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
		{:else}
			<p class="py-2 text-center text-sm text-slate-500">No content found</p>
		{/if}
	</svelte:boundary>
</div>
