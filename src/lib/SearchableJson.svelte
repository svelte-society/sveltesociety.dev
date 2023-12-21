<script lang="ts">
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import CardList from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';
	import Select from '$lib/components/Select.svelte';
	import { packageManager } from '$stores/packageManager';
	import TagsFilter from '$lib/TagsFilter.svelte';

	export let data;
	export let tags;
	export let selectedTags;
	export let displayTitle = '';
	export let displayTitleSingular = '';
	export let submittingType = '';

	let searchValue;
</script>

<Seo title={displayTitle} />

<SearchLayout title={displayTitle}>
	<section slot="controls" class="controls">
		<div class="inputs">
			<Search
				{data}
				bind:query={searchValue}
				sortableFields={[
					{ identifier: 'stars', title: 'Stars', ascending: false },
					{ identifier: 'title', title: 'Name', ascending: true }
				]}
				searchableFields={['title', 'description']}
				on:search={(a) => (data = a.detail.data.items)}
			/>
			<Select
				label="Package manager"
				isClearable={false}
				isSearchable={false}
				showIndicator
				value={{ value: $packageManager }}
				on:select={({ detail }) => ($packageManager = detail.value)}
				items={[
					{ label: 'NPM', value: 'npm' },
					{ label: 'PNPM', value: 'pnpm' },
					{ label: 'Yarn', value: 'yarn' }
				]}
			/>
			<a href="/help/submitting?type={submittingType}" class="submit"
				>Submit a {displayTitleSingular}</a
			>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for {displayTitle.toLowerCase()}..."
			bind:value={searchValue}
		/>
		<span class="searchbar-count"
			>{data.length} result{#if data.length !== 1}s{/if}</span
		>
	</section>
	<section slot="items">
		<TagsFilter {tags} {selectedTags} />
		<CardList title={'Unclassified'} id={'unclassified'}>
			{#each data as cardData}
				<ComponentCard {...cardData} />
			{/each}
		</CardList>
	</section>
</SearchLayout>
