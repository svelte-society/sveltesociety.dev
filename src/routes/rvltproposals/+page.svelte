<script>
	import { persist, localStorage } from '@macfja/svelte-persistent-store';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import components from './components.json';
	import List from '$components/ComponentIndex/CardList.svelte';
	import Button from '$components/ComponentIndex/ArrowButton.svelte';
	import Select from '$components/Select.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import { compare, selectSortItems } from '$lib/utils/sort';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Seo from '$lib/components/Seo.svelte';
	import Link from '$layout/Link.svelte';

	let searchValue;
	const tagItems = extractUnique(components, 'tags');
	let filterTag = [];
	let selectedTags = null;
	const categoryItems = [
		{ label: 'All', value: null },
		...extractUnique(components, 'category').filter((cat) => cat.value !== '')
	];
	let selectedCategory = null;
	let filterCategory = null;
	let sorting = 'stars_desc';
	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };
	$: sorting = selectedSorting?.value || 'stars_desc';
	let packageManager = writable('npm');
	onMount(() => {
		packageManager = persist(writable('npm'), localStorage(), 'packageManager');
	});
	const intersection = (array1, array2) => {
		return array1.filter((item) => array2.includes(item));
	};
	$: filterCategory = selectedCategory?.value || null;
	$: dataToDisplay = components
		.filter((component) => {
			if (!searchValue && filterTag.length === 0 && filterCategory === null) return true;
			if (
				(searchValue &&
					!(
						component.title.toLowerCase().includes(searchValue.toLowerCase()) ||
						component.description.toLowerCase().includes(searchValue.toLowerCase())
					)) ||
				(filterTag.length > 0 && intersection(filterTag, component.tags).length === 0) ||
				(filterCategory !== null && component.category !== filterCategory)
			) {
				return false;
			}
			return true;
		})
		.sort(compare(sorting));
	$: categories = extractUnique(dataToDisplay, 'category');
	$: filterTag = selectedTags?.map((obj) => obj.value) || [];

	const categoryId = {
		Animations: 'animations',
		'Data Visualisation': 'data-vis',
		'Design Pattern': 'design-patterns',
		'Design System': 'design-systems',
		'Developer Experience': 'dx',
		'Forms & User Input': 'input',
		Integration: 'integrations',
		'Rich Text Editor': 'text-editors',
		Routers: 'routers',
		Stores: 'stores',
		'SvelteKit Adapters': 'adapters',
		Testing: 'testing',
		'User Interaction': 'ui'
	};
</script>

<Seo title="RVLT Proposals" />

<div class="text-center">
	<h2>Acts of Revolt</h2>
	<p><br /></p>
	Feel free to submit your own
	<a href="https://revolt.cultdao.io/submitProposal" target="_blank">Acts of Revolt</a>.
	<p><br /></p>

	Feel free to join us to explore how
	<a href="https://cultdao.io/rvlt.pdf" target="_blank">Revolt 2 Earn works</a>.
	<p><br /></p>

	<br />
	<p><br /></p>
	<article class="container">
		<ul>
			<Link path="https://discord.gg/wearecultdao">
				<img src="images/discord.svg" alt="" />
				Discord
			</Link>
			<Link path="https://rumble.com/c/c-1902267">
				<img src="images/youtube.svg" alt="" />
				YouTube
			</Link>
			<Link path="https://twitter.com/MrOmodulus">
				<img src="images/twitter.svg" alt="" />
				Twitter
			</Link>
		</ul>
		<ul>
			<Link path="https://doc.cultdao.io/">
				<img src="images/newsletter.svg" alt="" />
				Newsletter
			</Link>
			<Link path="https://www.reddit.com/r/cultdao/">
				<img src="images/reddit.svg" alt="" />
				Reddit
			</Link>
			<Link path="https://www.cultradio.com/">
				<img src="images/radio.svg" alt="" />
				Podcast
			</Link>
		</ul>

		<embed
			src="https://dune.com/embeds/1279330/2192235/161e3edb-480c-451b-835f-078db00181e3"
			width="100%"
			height="700"
		/>

		<p><br /></p>
		<embed
			src="https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254"
			width="100%"
			height="200"
		/>

		<p><br /></p>
		<div style="margin-left: auto; margin-right:auto; width: 50vw">
			<embed
				src="https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722"
				width="100%"
				height="200"
			/>
		</div>

		<!-- <p><br /></p>
<embed
	src="https://dune.com/embeds/1280979/2194908/ec83050f-257e-45b4-a382-f791020293c0"
	width="100%"
	height="700"
/> -->
	</article>
</div>

<!-- <SearchLayout title="RVLT Proposals">
	<section class="controls" slot="controls">
		<div class="inputs">
			<Select bind:value={selectedTags} items={tagItems} isMulti label="Tags" />
			<Select
				label="Category"
				bind:value={selectedCategory}
				items={categoryItems}
				placeholder="Category"
				isClearable={false}
				showIndicator
			/>
			<Select
				items={selectSortItems}
				bind:value={selectedSorting}
				label="Sorting"
				showIndicator
				isClearable={false}
			/>
			<Button small active={$packageManager !== ''}>
				{$packageManager.toUpperCase()}
				<ul slot="menu" role="menu" class="popin no-wrap">
					<li>
						<label><input type="radio" bind:group={$packageManager} value="npm" /> NPM</label>
					</li>
					<li>
						<label><input type="radio" bind:group={$packageManager} value="pnpm" /> PNPM</label>
					</li>
					<li>
						<label><input type="radio" bind:group={$packageManager} value="yarn" /> Yarn</label>
					</li>
				</ul>
			</Button>
		</div>

		<a href="/help/submitting?type=component" class="submit">Submit a component</a>
		<input
			class="searchbar"
			type="text"
			placeholder="Search for components..."
			bind:value={searchValue}
		/>
		<span class="searchbar-count"
			>{dataToDisplay.length} result{#if dataToDisplay.length !== 1}s{/if}</span
		>
	</section>
	<section slot="items">
		{#each categories as category}
			<List
				title={category.label || 'Unclassified'}
				id={categoryId[category.label] || category.label || 'unclassified'}
			>
				{#each dataToDisplay.filter((d) => d.category === category.value) as data}
					<ComponentCard {...data} manager={$packageManager} />
				{/each}
			</List>
		{/each}
	</section>
</SearchLayout> -->
<style>
	article {
		max-width: 1024px;
		display: grid;
		gap: var(--s-10);
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--s-20);
		row-gap: var(--s-5);
		justify-content: space-around;
		text-align: center;
	}
	img {
		width: 128px;
	}

	@media (min-width: 1280px) {
		article {
			gap: var(--s-20);
		}
	}
</style>
