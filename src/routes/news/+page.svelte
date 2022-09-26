<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import SearchLayout from '$layouts/SearchLayout.svelte';
	import news from './news.json';
	import Select from '$lib/components/Select.svelte';
	import { extractUnique } from '$lib/utils/extractUnique';
	// import { compare, selectSortItems } from '$lib/utils/sort';
	import components from '../news/news.json';
	import Seo from '$lib/components/Seo.svelte';
	import Link from '$layout/Link.svelte';

	let searchValue;

	const tagItems = extractUnique(news, 'tags');
	let filterTag = [];
	let selectedTags = null;

	const categoryItems = [{ label: 'All', value: null }, ...extractUnique(components, 'category')];
	let selectedCategory = null;
	let filterCategory = null;

	// let selectedSorting = { value: 'stars_desc', label: 'Stars Desc' };
	// $: sorting = selectedSorting?.value || 'stars_desc';

	const intersection = (array1, array2) => {
		return array1.filter((item) => array2.includes(item));
	};

	$: dataToDisplay = news.filter((component) => {
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
	});
	// .sort(compare(sorting));

	$: categories = extractUnique(dataToDisplay, 'category');
	$: filterTag = selectedTags?.map((obj) => obj.value) || [];

	const categoryId = {
		'Bundler Plugins': 'bundling',
		Debugging: 'debugging',
		'Editor Extensions': 'editor-support',
		'Linting and Formatting': 'code-quality',
		Preprocessors: 'preprocessors'
	};
</script>

<Seo title="CULT News" />

<div class="text-center">
	<h2>CULT News</h2>

	<p><br /></p>
	Please add CULT news via
	<a href="https://www.youtube.com/watch?v=8lGpZkjnkt4" target="_blank"> pull request</a>.
	<p><br /></p>
	The latest CULT statistics can be found via
	<a href="https://dune.com/web3_data/CULT" target="_blank"> this link</a>.
	<p><br /></p>
	Until the CULT News Feed is sufficiently automated, the best way to stay up to date is to follow some
	of teh many and to join our community.<br /><br />
	<p><br /></p>

	<a href="https://twitter.com/MERP40400977" target="_blank"> MERP - #TALKABOUTCULT</a> <br /><br />
	<a href="https://twitter.com/MrOmodulus" target="_blank"> Mr O</a> <br /><br />
	<a href="https://twitter.com/Artorias_eth" target="_blank"> Artorias</a> <br /><br />
	<a href="https://twitter.com/iamcomingundone" target="_blank"> Holly</a>
	<p><br /><br /></p>
	<p><br /><br /></p>

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
	<!-- <a href="asdf"></a>  -->

	<p><br /><br /></p>
	<p><br /><br /></p>
	<h3>CULT News Filter</h3>

	<SearchLayout title="">
		<section slot="controls" class="controls">
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
				<!-- <Select
					items={selectSortItems}
					bind:value={selectedSorting}
					label="Sorting"
					showIndicator
					isClearable={false}
				/> -->
			</div>

			<div class="text-center">
				<input
					style="width: 100%"
					class="searchbar text-center"
					type="text"
					placeholder="Search through cultnews..."
					bind:value={searchValue}
				/>
			</div>
		</section>
		<section slot="items">
			{#each categories as newsEntry}
				<List
					title={newsEntry.label || 'Unclassified'}
					id={categoryId[newsEntry.label] || newsEntry.label || 'unclassified'}
				>
					{#each dataToDisplay.filter((d) => d.category === newsEntry.value) as data}
						<ComponentCard {...data} />
					{/each}
				</List>
			{/each}
		</section>
	</SearchLayout>
	<p><br /></p>
	<h3>New CULT Shops Going Live</h3>
	<br /><br />
	<a href="https://dripxkarip.com" target="_blank"> dripxkarip.com</a><br /><br />
	<a href="https://www.shop2revolt.com" target="_blank"> shop2revolt.com</a><br /><br />
	<a href="https://www.cultdaodizayn.com" target="_blank"> cultdaodizayn.com</a>

	<p><br /></p>
	<p><br /></p>
	<h3>revolt.cultoshi.com is Optimizing the Voting Process</h3>
	<embed type="text/html" src="https://revolt.cultoshi.com/" width="100%" height="1100vh" />
	<p><br /></p>
	<p><br /></p>
	<h3>CULT Chat Feature Under Construction</h3>
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	<p><br /></p>
	<p><br /></p>
	<h3>CULT Market Feature Under Construction</h3>
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.
</div>

<style>
	section {
		display: grid;
		gap: var(--s-5);
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
</style>
