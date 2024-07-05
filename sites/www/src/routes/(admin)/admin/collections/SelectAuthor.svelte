<script lang="ts">
	import { Combobox } from 'bits-ui';

	let { selectedAuthorId = null }: { selectedAuthorId: number | null } = $props();

	let authors: { id: number; name: string }[] = [];
	let inputValue = $state('');
	let touchedInput = $state(false);

	async function fetchAuthors() {
		// Replace this with your actual API call
		// This is just a placeholder
		return [
			{ id: 1, name: 'John Doe' },
			{ id: 2, name: 'Jane Smith' },
			{ id: 3, name: 'Alice Johnson' }
			// ... more authors
		];
	}

	let filteredAuthors = $derived.by(() => {
		return inputValue && touchedInput
			? authors.filter((author) => author.name.toLowerCase().includes(inputValue.toLowerCase()))
			: authors;
	});

	function handleSelect(event: CustomEvent<{ id: number; name: string }>) {
		selectedAuthorId = event.detail.id;
		inputValue = event.detail.name;
	}
</script>

<Combobox.Root items={filteredAuthors} bind:inputValue bind:touchedInput on:select={handleSelect}>
	<div class="relative">
		<svg
			class="text-muted-foreground h-5 w-5 -translate-y-1/2"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
			<circle cx="12" cy="7" r="4"></circle>
		</svg>
		<Combobox.Input
			class="border-input placeholder:text-muted-foreground focus:ring-ring inline-flex h-10 w-full truncate rounded-md border bg-white px-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
			placeholder="Search for an author"
			aria-label="Search for an author"
		/>
		<svg
			class="text-muted-foreground absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m7 15 5 5 5-5" />
			<path d="m7 9 5-5 5 5" />
		</svg>
	</div>

	<Combobox.Content
		class="border-input bg-background w-full rounded-md border px-1 py-3 shadow-md outline-none"
		sideOffset={8}
	>
		{#each filteredAuthors as author (author.id)}
			<Combobox.Item
				class="data-[highlighted]:bg-accent flex h-10 w-full select-none items-center rounded-sm py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75"
				value={author}
			>
				{author.name}
				<Combobox.ItemIndicator class="ml-auto">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				</Combobox.ItemIndicator>
			</Combobox.Item>
		{:else}
			<span class="block px-5 py-2 text-sm text-muted-foreground"> No authors found </span>
		{/each}
	</Combobox.Content>
	<Combobox.HiddenInput name="authorId" />
</Combobox.Root>

{#if selectedAuthorId}
	<input type="hidden" name="author_id" value={selectedAuthorId} />
{/if}
