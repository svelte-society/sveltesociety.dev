<script lang="ts">
    import Select from '$lib/ui/Select.svelte'
    import Button from '$lib/ui/Button.svelte'

    type Option = {
        label: string
        value: string
    }

    let { categories = [], tags = [], sort = [] }: { categories: Option[], tags: Option[], sort: Option[] } = $props()
    
    let selectedCategory = $state();
    const selectedCategoryLabel = $derived(
		selectedCategory ? categories.find(opt => opt.value === selectedCategory)?.label : categories[0].label
	);

    let selectedTag = $state();
    const selectedTagLabel = $derived(
		selectedTag ? tags.find(opt => opt.value === selectedTag)?.label : tags[0].label
	);

    let selectedSort = $state();
    const selectedSortLabel = $derived(
		selectedSort ? sort.find(opt => opt.value === selectedSort)?.label : sort[0].label
	);
</script>

<form class="flex w-full gap-2 mb-4">
    <div class="flex flex-col gap-2 w-full">
        <label for="category" class="text-xs font-medium outline-none">Category</label>
        <Select name="category" bind:value={selectedCategory} selected={selectedCategoryLabel} options={categories} />
    </div>
    <div class="flex flex-col gap-2 w-full">
        <label for="tag" class="text-xs font-medium outline-none">Tags</label>
        <Select name="tag" bind:value={selectedTag} selected={selectedTagLabel} options={tags} />
    </div>
    <div class="flex flex-col gap-2 w-full">
        <label for="sort" class="text-xs font-medium outline-none">Sort</label>
        <Select name="sort" bind:value={selectedSort} selected={selectedSortLabel} options={sort} />
    </div>
    <div class="sr-only">
        <Button type="submit">Filter</Button>
    </div>
</form>