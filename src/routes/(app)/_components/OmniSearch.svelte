<script lang="ts">
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { getSearchSuggestions, type SearchSuggestion } from '$lib/ui/filter/data.remote'
	import { getCategoryFromRoute } from '$lib/ui/filter/url-helpers'

	let searchQuery = $state('')
	let inputElement: HTMLInputElement | undefined
	let selectedIndex = $state(-1)

	let existingTypes = $derived(page.url.searchParams.getAll('type'))
	let existingTags = $derived(page.url.searchParams.getAll('tags'))
	let existingAuthors = $derived(page.url.searchParams.getAll('authors'))
	let existingQuery = $derived(page.url.searchParams.get('query') || '')
	let categoryType = $derived(getCategoryFromRoute(page.route.id, page.params))
	let allSuggestions = $derived(await getSearchSuggestions())
	let filteredSuggestions = $derived(filterSuggestions(allSuggestions, searchQuery))

	function filterSuggestions(suggestions: SearchSuggestion[], query: string): SearchSuggestion[] {
		if (!query.trim()) return []
		const lowerQuery = query.toLowerCase()
		return suggestions.filter((s) => s.label.toLowerCase().includes(lowerQuery))
	}

	let availableSuggestions = $derived(
		filteredSuggestions.filter((s) => {
			if (s.type === 'category') return !existingTypes.includes(s.value)
			if (s.type === 'tag') return !existingTags.includes(s.value)
			if (s.type === 'author') return !existingAuthors.includes(s.value)
			return true
		})
	)

	let suggestionRefs: (HTMLAnchorElement | undefined)[] = $state([])

	function buildAddFilterHref(suggestion: SearchSuggestion): string {
		const params = new URLSearchParams(page.url.searchParams)
		if (categoryType) {
			params.append('type', categoryType)
		}
		params.append(suggestion.paramName, suggestion.value)
		params.delete('page')
		return '/?' + params.toString()
	}

	function highlightMatch(text: string, search: string): string {
		if (!search) return text
		const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
		return text.replace(regex, '<mark class="bg-svelte-100 text-svelte-700 rounded-sm">$1</mark>')
	}

	const typeLabels: Record<string, string> = {
		category: 'in Categories',
		tag: 'in Tags',
		author: 'in Authors'
	}

	function clearSearch() {
		searchQuery = ''
		selectedIndex = -1
		inputElement?.focus()
	}

	function buildSearchHref(): string {
		const params = new URLSearchParams(page.url.searchParams)
		if (categoryType) {
			params.append('type', categoryType)
		}
		if (searchQuery.trim()) {
			params.set('query', searchQuery.trim())
		}
		params.delete('page')
		return '/?' + params.toString()
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				if (!availableSuggestions.length) return
				event.preventDefault()
				selectedIndex = (selectedIndex + 1) % availableSuggestions.length
				suggestionRefs[selectedIndex]?.focus()
				break
			case 'ArrowUp':
				if (!availableSuggestions.length) return
				event.preventDefault()
				selectedIndex = selectedIndex <= 0 ? availableSuggestions.length - 1 : selectedIndex - 1
				suggestionRefs[selectedIndex]?.focus()
				break
			case 'Enter':
				if (selectedIndex >= 0 && selectedIndex < availableSuggestions.length) {
					event.preventDefault()
					const suggestion = availableSuggestions[selectedIndex]
					goto(buildAddFilterHref(suggestion), { keepFocus: true })
					clearSearch()
				} else if (searchQuery.trim()) {
					event.preventDefault()
					goto(buildSearchHref(), { keepFocus: true })
					clearSearch()
				}
				break
			case 'Escape':
				selectedIndex = -1
				inputElement?.blur()
				break
		}
	}

	function isSelected(suggestion: SearchSuggestion): boolean {
		const index = availableSuggestions.indexOf(suggestion)
		return index === selectedIndex
	}

	function handleFocus(suggestion: SearchSuggestion) {
		selectedIndex = availableSuggestions.indexOf(suggestion)
	}
</script>

<div class="group/search relative w-full">
	<form method="GET" action="/" data-sveltekit-keepfocus>
		{#each existingTypes as type (type)}
			<input type="hidden" name="type" value={type} />
		{/each}
		{#each existingTags as tag (tag)}
			<input type="hidden" name="tags" value={tag} />
		{/each}
		{#each existingAuthors as author (author)}
			<input type="hidden" name="authors" value={author} />
		{/each}
		{#if existingQuery}
			<input type="hidden" name="query" value={existingQuery} />
		{/if}
		{#if categoryType}
			<input type="hidden" name="type" value={categoryType} />
		{/if}

		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">
				<MagnifyingGlass class="size-5 text-slate-400" />
			</div>
			<input
				bind:this={inputElement}
				type="search"
				name="q"
				placeholder="Search content, tags, authors..."
				autocomplete={browser ? 'off' : 'on'}
				list={browser ? undefined : 'search-suggestions'}
				bind:value={searchQuery}
				onkeydown={handleKeydown}
				data-testid="omni-search-input"
				class="h-8 w-full rounded-md border-none bg-slate-100 pr-14 pl-8 text-base text-slate-800 placeholder-slate-500 focus:outline-2 focus:outline-svelte-300"
			/>
			{#if !browser}
				<datalist id="search-suggestions">
					{#each await getSearchSuggestions() as suggestion (suggestion.type + suggestion.value)}
						<option value="{suggestion.label} ({suggestion.type})"></option>
					{/each}
				</datalist>
			{/if}
			<button
				type="submit"
				class="absolute right-1 top-1/2 -translate-y-1/2 invisible rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 opacity-0 transition-opacity hover:bg-slate-300 group-focus-within/search:visible group-focus-within/search:opacity-100"
			>
				Search
			</button>
		</div>

		{#if browser && searchQuery.trim()}
			<div
				class="invisible absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-opacity group-focus-within/search:visible group-focus-within/search:opacity-100"
			>
				{#if availableSuggestions.length > 0}
					{#each availableSuggestions as suggestion, i (suggestion.type + suggestion.value)}
						<a
							bind:this={suggestionRefs[i]}
							href={buildAddFilterHref(suggestion)}
							data-sveltekit-preload-data={false}
							onpointerdown={(e) => e.preventDefault()}
							onclick={(e) => {
								e.preventDefault()
								goto(buildAddFilterHref(suggestion), { keepFocus: true })
								clearSearch()
							}}
							onkeydown={handleKeydown}
							onfocus={() => handleFocus(suggestion)}
							class="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-svelte-50 focus:bg-svelte-100 focus:outline-none {isSelected(
								suggestion
							)
								? 'bg-svelte-100'
								: ''}"
						>
							<span>{@html highlightMatch(suggestion.label, searchQuery)}</span>
							<span class="text-xs text-slate-600">{typeLabels[suggestion.type]}</span>
						</a>
					{/each}
				{:else}
					<div class="px-2 py-3 text-center text-sm text-slate-500">
						No matching filters found. Press Enter to search content.
					</div>
				{/if}
			</div>
		{/if}
	</form>
</div>
