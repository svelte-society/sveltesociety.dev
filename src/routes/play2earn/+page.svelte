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
	<h2>Play 2 Earn</h2>

	<p><br /></p>
	Play 2 Earn is inspired by 
	<a href="https://rumble.com/v1lf3yb-revolt-2-earn-in-100-seconds-michael-saylor-talks-about-revolt-2-earn.html" target="_blank">
		Revolt 2 Earn</a>.
	In Revolt 2 Earn you get paid with funds from the RVLT treasury. 
	In Play 2 earn you get paid indirectly by increased 
	<a href="https://coinmarketcap.com/currencies/cult-dao/" target="_blank">
		CULT 
	</a>
	and 
	<a href="https://coinmarketcap.com/currencies/revolt-2-earn/" target="_blank">
	RVLT
	</a>
	prices. <br><br>
	Let us jointly increase the value of CULT and RVLT in a sustainable way by 
	executing the 
	<a href="https://cultplayground.org" target="_blank">
	Game of the Day 
	</a>
	every day. 
	With that we might also make sure good people have the chance to get on board early.
	<p><br /></p>
	The following content is embedded from 
	<a href="https://cultplayground.org" target="_blank">
		cultplayground.org
	</a>
	<p><br /></p>
	<p><br /></p>
	</div>


	<embed type="text/html" src="https://cultplayground.org/" width="100%" height="1700vh" />
<style>
	/* section {
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
	} */
</style>
