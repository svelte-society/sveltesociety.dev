<script lang="ts">
import Input from '$lib/ui/form/Input.svelte'
import Dialog from '$lib/ui/Dialog.svelte'
import { zod } from 'sveltekit-superforms/adapters'
import { schema } from '../new/schema'
import { superForm } from 'sveltekit-superforms'
import { slugify } from '$lib/utils/slug'
let { data } = $props()
const { form, errors, enhance } = superForm(data.form, zod(schema))

// Content fetching and selection logic
interface ContentItem {
    id: string | number
    title: string
    description?: string
    type?: string
    status?: string
}

let isLoading = $state(false)
let contentItems: ContentItem[] = $state(data.searchResults || [])
let searchQuery = $state('')
let errorMessage = $state('')

function toggleSelection(id: string | number) {
    // Convert to number since our schema requires numbers in the children array
    const numId = typeof id === 'string' ? parseInt(id, 10) : id
    
    if ($form.children.includes(numId)) {
        $form.children = $form.children.filter(i => i !== numId)
    } else {
        $form.children = [...$form.children, numId]
    }
}

let dialogOpen = $state(false)
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit Collection</h1>
	<form method="POST" action="?/update" use:enhance class="space-y-6">
		<input type="hidden" name="id" bind:value={$form.id} />
		<Input
			name="title"
			label="Title"
			type="text"
			placeholder="Best Rune Tutorials"
			description="Enter the title of the collection"
			bind:value={$form.title}
			errors={$errors.title}
		/>
		<Input
			name="slug"
			label="Slug"
			placeholder="best-rune-tutorials"
			description="Enter the slug of the collection"
			type="text"
			magic={() => slugify($form.title)}
			bind:value={$form.slug}
			errors={$errors.slug}
		/>
		<Input
			name="description"
			label="Description"
			type="textarea"
			placeholder="Learn how to use the best runes in Svelte"
			description="Enter the description of the collection"
			bind:value={$form.description}
			errors={$errors.description}
		/>
		<div>
			<Dialog 
				bind:open={dialogOpen}
				triggerText="Select Content"
				title="Add Content to Collection"
				description="Select items to include in this collection"
				confirmText="Apply"
				contentClass="sm:max-w-[700px]"
				triggerClass="bg-svelte-500 hover:bg-svelte-900 focus-visible:ring-svelte-900 text-white"
				confirmClass="bg-svelte-500 hover:bg-svelte-900 focus-visible:ring-svelte-900 text-white"
			>
				{#snippet content()}
					<div class="py-2">
						<form method="POST" action="?/search" use:enhance class="mb-4 flex gap-2">
							<input 
								type="text" 
								name="search"
								placeholder="Search content..." 
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-svelte-500 focus:outline-none focus:ring-1 focus:ring-svelte-500"
								bind:value={searchQuery}
							/>
							<button 
								type="submit"
								class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
							>
								Search
							</button>
						</form>
						
						<div class="max-h-[400px] overflow-y-auto">
							{#if isLoading}
								<div class="flex h-40 items-center justify-center">
									<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-svelte-500"></div>
									<span class="ml-2">Loading content...</span>
								</div>
							{:else if errorMessage}
								<div class="flex h-40 items-center justify-center">
									<p class="text-red-500">{errorMessage}</p>
								</div>
							{:else if contentItems.length === 0}
								<div class="flex h-40 items-center justify-center">
									<p class="text-gray-500">No content found</p>
								</div>
							{:else}
								<ul class="divide-y divide-gray-200">
									{#each contentItems as item}
										<li class="py-3">
											<label class="flex items-start hover:bg-svelte-100 p-2 rounded-md cursor-pointer">
												<input 
													type="checkbox" 
													class="mt-1 h-4 w-4 rounded border-gray-300 text-svelte-500 focus:ring-svelte-500"
													checked={$form.children.includes(typeof item.id === 'string' ? parseInt(item.id, 10) : item.id)}
													onchange={() => toggleSelection(item.id)}
												/>
												<div class="ml-3">
													<div class="font-medium">{item.title}</div>
													{#if item.description}
														<div class="text-sm text-gray-500 line-clamp-2">{item.description}</div>
													{/if}
													<div class="mt-1 flex items-center">
														{#if item.type}
															<span class="mr-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
																{item.type}
															</span>
														{/if}
														{#if item.status}
															<span class={`mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
																{item.status}
															</span>
														{/if}
													</div>
												</div>
											</label>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				{/snippet}
			</Dialog>
			
			{#if $form.children && $form.children.length > 0}
				<div class="mt-3">
					<p class="text-sm font-medium text-gray-700">Selected Items: {$form.children.length}</p>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each $form.children as id}
							{#if data.content.find(item => {
                                const itemId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
                                return itemId === id;
                            })}
								<div class="flex items-center rounded-md bg-svelte-100 px-3 py-1 text-sm">
									{data.content.find(item => {
                                        const itemId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
                                        return itemId === id;
                                    })?.title}
									<button 
										type="button"
										class="ml-2 text-svelte-500 hover:text-svelte-900"
										onclick={() => {
											$form.children = $form.children.filter(i => i !== id);
										}}
									>
										&times;
									</button>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{:else}
				<p class="mt-3 text-sm text-gray-500">No content selected. Click "Select Content" to add items.</p>
			{/if}
            
            {#if $errors.children}
                <p class="mt-1 text-sm text-red-500">{$errors.children?._errors}</p>
            {/if}
		</div>
		<button
			type="submit"
			class="w-full rounded-md bg-svelte-500 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-svelte-900 focus:outline-none focus:ring-2 focus:ring-svelte-500 focus:ring-offset-2"
		>
			Update Collection
		</button>
	</form>
</div>
