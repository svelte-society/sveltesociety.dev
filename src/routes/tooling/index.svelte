<script>
	import ComponentCard from '$lib/components/ComponentIndex/Card.svelte';
	import List from '$lib/components/ComponentIndex/CardList.svelte';
	import Button from '$lib/components/ComponentIndex/ArrowButton.svelte';
	import tools from './tools.json';
	import { compare } from '$lib/utils/sort';

	const tags = Array.from(new Set(tools.map((item) => item.tags).flat()));
	const allCategories = Array.from(new Set(tools.map((item) => item.category).flat()));

	let searchValue,
		searchTag,
		filterTag = [],
		filterCategory = null,
		sorting = 'added_desc';

	const intersection = (array1, array2) => {
		return array1.filter((item) => array2.includes(item));
	};

	$: dataToDisplay = tools
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
	$: tagSearchResult = searchTag ? tags.filter((item) => item.includes(searchTag)) : tags;
	$: categories = Array.from(new Set(dataToDisplay.map((item) => item.category)));
</script>

<svelte:head>
	<title>Tooling - Svelte Society</title>
</svelte:head>

<main class="wrapper">
	<h1>Tooling</h1>
	<div class="controls">
		<div class="inputs">
			<Button active={filterTag.length > 0}>
				Tags {#if filterTag.length > 0}<small>({filterTag.length})</small>{/if}
				<ul slot="menu" role="menu" class="popin">
					<li class="tag-search">
						<input placeholder="Search for tags..." bind:value={searchTag} />
					</li>
					{#each tagSearchResult as tag}
						<li>
							<label><input type="checkbox" bind:group={filterTag} value={tag} /> {tag}</label>
						</li>
					{/each}
				</ul>
			</Button>
			<Button active={filterCategory !== null}>
				Categories
				<ul slot="menu" role="menu" class="popin">
					<li>
						<label><input type="radio" bind:group={filterCategory} value={null} /> All</label>
					</li>
					{#each allCategories as category}
						<li>
							<label
								><input type="radio" bind:group={filterCategory} value={category} />
								{category || 'Unclassified'}</label
							>
						</li>
					{/each}
				</ul>
			</Button>
			<Button on:click={() => (location.href = '/help/components')}>Submit a tool</Button>
			<Button active={sorting !== ''}>
				Sort
				<ul slot="menu" role="menu" class="popin no-wrap">
					<li>
						<label
							><input type="radio" bind:group={sorting} value="added_desc" /> Last Added first</label
						>
					</li>
					<li>
						<label><input type="radio" bind:group={sorting} value="added_asc" /> Oldest first</label
						>
					</li>
					<li>
						<label><input type="radio" bind:group={sorting} value="stars_desc" /> Stars Desc</label>
					</li>
					<li>
						<label><input type="radio" bind:group={sorting} value="stars_asc" /> Stars Asc</label>
					</li>
					<li>
						<label><input type="radio" bind:group={sorting} value="name_asc" /> Name Asc</label>
					</li>
					<li>
						<label><input type="radio" bind:group={sorting} value="name_desc" /> Name Desc</label>
					</li>
				</ul>
			</Button>
		</div>

		<input
			class="searchbar"
			type="text"
			placeholder="Search for templates..."
			bind:value={searchValue}
		/>
		<span class="searchbar-count"
			>{dataToDisplay.length} result{#if dataToDisplay.length !== 1}s{/if}</span
		>
	</div>
	<hr />
	{#each categories as category}
		<List title={category || 'Unclassified'}>
			{#each dataToDisplay.filter((d) => d.category === category) as data}
				<ComponentCard {...data} />
			{/each}
		</List>
	{/each}
</main>

<style>
	h1 {
		@apply text-5xl;
	}

	hr {
		margin-block: 4rem;
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: Overpass;
		position: relative;
	}

	.inputs {
		display: grid;
		grid-template-columns: repeat(4, auto);
		grid-gap: 0.5rem;
		margin-right: 2rem;
	}

	.searchbar {
		height: 100%;
		width: 35%;
		font-family: Overpass;
		border-width: 0;
		background: #f3f6f9 url(/images/search-icon.svg) 98% no-repeat;
		margin: 0;
		padding: 10px 15px;
	}

	.searchbar-count {
		position: absolute;
		top: 100%;
		right: 0;
	}

	ul.popin {
		padding: 0.5ex;
		margin: 0;
		font-size: 0.7em;
		max-height: 50vh;
		overflow-y: auto;
	}

	ul.popin li {
		list-style: none;
		padding: 0;
		margin: 0;
		text-transform: capitalize;
	}
	ul.popin li:hover {
		background: #eee;
		border-radius: 3px;
	}
	ul.popin li.tag-search {
		position: sticky;
		top: -0.5ex;
		margin: 0 -0.5ex;
		padding: 0.5ex;
		border-radius: 4px;
		background: white;
	}
	ul.popin li.tag-search input {
		margin: 0;
		background: #f3f6f9;
		width: 100%;
		min-width: 15ch;
	}
	ul.popin li.tag-search:hover {
		background: white;
	}
	ul.popin.no-wrap li {
		white-space: nowrap;
	}

	ul.popin li label {
		display: flex;
		align-items: center;
		line-height: 0.7rem;
		padding: 0.8ex;
	}

	ul.popin li input {
		flex: 0;
		margin: 0 1ex 0 0;
	}

	@media screen and (max-width: 1024px) {
		.controls {
			flex-flow: column-reverse;
		}

		.inputs {
			align-self: flex-start;
			width: 100%;
			grid-template-columns: repeat(3, auto);
		}

		.searchbar {
			align-self: flex-end;
			margin-bottom: 1ex;
		}
	}

	@media screen and (max-width: 700px) {
		.controls {
			align-items: stretch;
		}

		.inputs {
			grid-template-columns: auto;
		}

		.searchbar {
			width: auto;
			align-self: stretch;
		}
	}
</style>
