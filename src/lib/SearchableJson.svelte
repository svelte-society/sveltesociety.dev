<script lang="ts">
	import slugify from '@sindresorhus/slugify';
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import CardList from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Seo from '$lib/components/Seo.svelte';
	import Search from '$lib/components/Search.svelte';
	import Select from '$lib/components/Select.svelte';
	import { packageManager } from '$stores/packageManager';
	import { page } from "$app/stores";

	export let data;
	export let displayTitle = '';
	export let displayTitleSingular = '';
	export let submittingType = '';

	let searchValue;

	const tags = []
	data.forEach((item) => {
		item.tags.forEach((tag) => {
			if (!tags.includes(tag)) {
				tags.push(tag)
			}
		})
	})
</script>

<Seo title={displayTitle} />

<SearchLayout title={displayTitle}>
	<section slot="controls" class="controls">
		<div class="inputs">
			<Search
				data={data}
				bind:query={searchValue}
				sortableFields={[
					{ identifier: 'stars', title: 'Stars', ascending: false },
					{ identifier: 'title', title: 'Name', ascending: true }
				]}
				searchableFields={['title', 'description']}
				facetsConfig={[
					{
						title: 'Category',
						identifier: 'category'
					},
					{
						title: 'Tags',
						identifier: 'tags',
						isMulti: true
					}
				]}
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
		{#each tags as tag}
		<a href={`${$page.url.pathname}?tags=${tag}`}>{tag}</a>
	{/each}
			<CardList
				title={'Unclassified'}
				id={'unclassified'}
			>
				{#each data as cardData}
					<ComponentCard {...cardData} />
				{/each}
			</CardList>
	</section>
</SearchLayout>
