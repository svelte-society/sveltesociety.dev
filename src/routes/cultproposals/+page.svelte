<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import components from './cultproposals.json';
	import { compare, selectSortItems } from '$lib/utils/sort';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Select from '$lib/components/Select.svelte';
	import SearchLayout from '$lib/layouts/SearchLayout.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Link from '$layout/Link.svelte';

	let searchValue;

	const tagItems = extractUnique(components, 'tags');
	let filterTag = [];
	let selectedTags = null;

	const categoryItems = [{ label: 'All', value: null }, ...extractUnique(components, 'category')];
	let selectedCategory = null;
	let filterCategory = null;

	let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };
	$: sorting = selectedSorting?.value || 'stars_desc';

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
		Sapper: 'sapper',
		// Svelte: 'svelte',
		// 'Svelte Add': 'adders',
		SvelteKit: 'svelte-kit'
	};
</script>

<Seo title="cultproposals" />
<div class="text-center">
	<h2>CULT Tokenomics</h2>
	<p><br /></p>
	<div
		class="text-center"
		style="width: 85%; margin-left: auto; margin-right: auto; margin-bottom: 10vh"
	>
		<img src="/images/cult-tokenomics.png" alt="" style="width: 100%; text-align:center" />
	</div>

	<h3>CULT Protocol Proposals</h3>
	<p><br /></p>
	Feel free to submit your own
	<a href="https://app.cultdao.io/submitProposal" target="_blank">CULT Protocol Proposals</a>.

	<p><br /></p>
	<embed
		src="https://dune.com/embeds/1280952/2194860/16501603-2aca-4a78-bb92-ddcd9ddedcb6"
		width="100%"
		height="1000"
	/>

	<p><br /></p>
	<p><br /></p>
	<h3>Further Statistics & Insights</h3>
	<p><br /></p>
	A broader overview on CULT statistics can be found in<a
		href="https://dune.com/web3_data/CULT"
		target="_blank"
	>
		this dashboard</a
	>.
	<!-- <p><br /></p>
	<embed
		src="https://dune.com/embeds/1280936/2194836/18828c7c-899f-487e-bc10-779fee1f1026"
		width="100%"
		height="200"
	/> -->

	<p><br /></p>
	<p><br /></p>
	<h3>Basic Info for Newcomers</h3>
	<p><br /></p>

	In order to fully understand the utilites and the tokenomics you might want to read
	<a href="https://cultdao.io/manifesto.pdf" target="_blank"> the manifesto</a>.
	<p><br /></p>

	We are an open friendly community. Feel free to join us:
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
	</article>
</div>
<!-- <SearchLayout title="Cult Proposals">
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

			<a href="/help/submitting?type=template" class="submit">Submit a template</a>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for cultproposals..."
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
					<ComponentCard {...data} />
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
