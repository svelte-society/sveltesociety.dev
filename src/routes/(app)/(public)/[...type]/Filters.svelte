<script lang="ts">
    import Select from '$lib/ui/Select.svelte'
    import Button from '$lib/ui/Button.svelte'
    import { X } from 'phosphor-svelte'
	import Combobox from '$lib/ui/Combobox.svelte';
    
    type Option = {
        label: string
        value: string
    }

    let { categories, tags, sort }: { categories: Option[], tags: Option[], sort: Option[] } = $props()
    
    let selectedCategory = $state();
    const selectedCategoryLabel = $derived(
		selectedCategory ? categories.find(opt => opt.value === selectedCategory)?.label : categories[0].label
	);

    let selectedTag = $state();
    const selectedTagLabel = $derived(
		selectedTag ? tags.find(opt => opt.value === selectedTag)?.label : 'Select a tag'
	);

    let selectedSort = $state();
    const selectedSortLabel = $derived(
		selectedSort ? sort.find(opt => opt.value === selectedSort)?.label : sort[0].label
	);

    let selectedFilters = $state<Option[]>(tags);

    $effect(() => {
        if (selectedTag) {
            // add tag from tags to selectedTags if it's not already in there
            if (!selectedFilters.find(opt => opt.value === selectedTag)) {
                selectedFilters.push(tags.find(opt => opt.value === selectedTag));
            }
            selectedTag = undefined;
        } 
    })

    const removeFilter = (filter: Option) => {
        selectedFilters = selectedFilters.filter(f => f.value !== filter.value);

        // Focus management - move to next tag or previous if it was the last
        setTimeout(() => {
        const tagElements = document.querySelectorAll('[data-tag-button]');
        if (tagElements.length > 0) {
            const nextIndex = Math.min(index, tagElements.length - 1);
            tagElements[nextIndex].focus();
        }
        }, 0);
    }
</script>

<div class="grid gap-4 mb-4">    
    <form class="grid gap-0.5">
        <div class="flex w-full gap-2 mb-4">
            <div class="flex flex-col gap-2 w-full">
                <label for="category" class="text-xs font-medium outline-none">Category</label>
                <Select name="category" bind:value={selectedCategory} selected={selectedCategoryLabel} options={categories} />
            </div>
            <div class="flex flex-col gap-2 w-full">
                <label for="sort" class="text-xs font-medium outline-none">Sort</label>
                <Select name="sort" bind:value={selectedSort} selected={selectedSortLabel} options={sort} />
            </div>
        </div>
        <div class="flex flex-col gap-2 w-full">
            <label for="sort" class="text-xs font-medium outline-none">Tags</label>
            <Combobox {tags} />
        </div>
        <div class="sr-only">
            <Button type="submit">Filter</Button>
        </div>
    </form>
</div>