<script>
	import Svelecte from 'svelecte';
	import components from '../components/components.json';
	import templates from '../templates/templates.json';
	import tools from '../tools/tools.json';
	import { onMount, tick } from 'svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { extractUnique } from '$lib/utils/extractUnique';

	const repoURL = 'https://github.com/svelte-society/sveltesociety.dev';
	const types = ['Component', 'Template', 'Tool'].map((t) => ({
		label: t,
		value: t.toLowerCase()
	}));

	const data = {
		component: {
			tags: extractUnique(components, 'tags'),
			categories: [...extractUnique(components, 'category').filter((cat) => cat.label !== '')]
		},
		template: {
			tags: extractUnique(templates, 'tags'),
			categories: extractUnique(templates, 'category')
		},
		tool: {
			tags: extractUnique(tools, 'tags'),
			categories: extractUnique(tools, 'category')
		}
	};

	let clipboardCopy = false;
	const copy = () => {
		copyToClipboard(JSON.stringify(jsonSnippet, null, 4)).then(() => (clipboardCopy = false));
		clipboardCopy = true;
	};

	let type = types[0].value;
	let title = 'svelte-lorem-ipsum';
	let url = 'https://github.com/sveltejs/svelte-lorem-ipsum';
	let description = 'A dummy text generator that does not exist';
	let npm = 'svelte-lorem-ipsum';
	let addedOn = todaysDate();
	let category;
	let tags;

	$: pathName = `${type}s`;
	$: jsonSnippet = {
		title,
		url,
		description,
		npm,
		addedOn,
		category: category || undefined,
		tags: tags,
		stars: 0
	};

	$: currentTags = data[type].tags;
	$: currentCategories = data[type].categories;

	onMount(() => {
		const typeQuery = new URLSearchParams(location.search).get('type');
		const typeObj = types.find((t) => t.value == typeQuery) || types[0];
		type = typeObj.value;
	});

	function padWithZero(date) {
		return date.toString().padStart(2, '0');
	}

	function todaysDate() {
		const date = new Date();
		const day = padWithZero(date.getDate());
		const month = padWithZero(date.getMonth() + 1);
		const year = date.getFullYear();
		const sep = '-';
		return [year, month, day].join(sep);
	}

	async function clearCategoryAndTags() {
		await tick();
		category = null;
		tags = null;
	}
</script>

<h1>Submitting a new component</h1>
<p>
	To add a new component on the website, the process is rather simple. You have to add a snippet in
	the appropriate file.
</p>

<h2>Generating file contents snippet</h2>
<p>
	Each component is represented by a JSON Object. Use the generator below to generate the Object.
</p>

<p><code>*</code> marked fields are required</p>
<div class="json-generator themed-svelecte">
	<div class="input-wrapper">
		<label for="type">Type:</label>
		<div>
			<Svelecte id="type" options={types} bind:value={type} on:change={clearCategoryAndTags} />
			<span class="input-helper">The type of snippet to generate</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="title" class="required">Title:</label>
		<div>
			<input id="title" type="text" required bind:value={title} />
			<span class="input-helper">Name of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="url">URL:</label>
		<div>
			<input id="url" type="url" bind:value={url} />
			<span class="input-helper">The URL where to find it</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="desc">Description:</label>
		<div>
			<input id="desc" type="text" bind:value={description} />
			<span class="input-helper">A short description of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="npm">NPM:</label>
		<div>
			<input id="npm" type="text" bind:value={npm} />
			<span class="input-helper">The npm name of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="adden-on" class="required">Added On:</label>
		<div>
			<input id="adden-on" type="date" required bind:value={addedOn} />
			<span class="input-helper">
				The date when the component have been added on the website (generally it’s today)
			</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="category">Category:</label>
		<div>
			<Svelecte id="category" options={currentCategories} bind:value={category} />
			<span class="input-helper">The category of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="tags" class="required">Tags:</label>
		<div>
			<Svelecte id="category" options={currentTags} multiple bind:value={tags} />
			<span class="input-helper">A list of tags</span>
		</div>
	</div>
</div>

<h2>JSON Snippet</h2>
<pre>
	{JSON.stringify(jsonSnippet,null,4)}<button on:click={copy}>{clipboardCopy ? 'Copied' : 'Copy'}</button>
</pre>
<br />
Copy this snippet and add it to
<a href="{repoURL}/blob/staging/src/routes/{pathName}/{pathName}.json">{pathName}.json</a>. You can
propose your changes
<a href="{repoURL}/edit/staging/src/routes/{pathName}/{pathName}.json">directly in GitHub</a>.

<style>
	.json-generator,
	pre {
		max-width: var(--s-max);
		padding: var(--s-4);
		border-radius: 14px;
		background-color: #f3f6f9;
	}

	.json-generator {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--s-4) var(--s-20);
		padding-block: var(--s-5);
	}

	.themed-svelecte :global(.svelecte-control) {
		--sv-item-color: #000;
		--sv-min-height: 43px;
		--sv-border: 2px solid var(--dark-gray);
		--sv-active-border: 2px solid var(--secondary);
		--sv-item-active-bg: var(--secondary);
		--sv-item-active-color: #fff;
		--sv-item-btn-icon: #fff;
		--sv-item-selected-bg: var(--secondary);
		--sv-item-btn-bg: var(--secondary);
		--sv-item-btn-bg-hover: #b32d00;
	}
	.themed-svelecte :global(.svelecte-control .sv-content) {
		padding-left: 16px;
	}
	.themed-svelecte :global(.svelecte-control .sv-content.has-multiSelection) {
		--sv-item-color: #fff;
	}
	.themed-svelecte :global(.sv-item) {
		border-radius: 5px;
		overflow: hidden;
	}
	.input-wrapper {
		--borderRadius: 5px;
		--border: 2px solid var(--dark-gray);
		--borderFocusColor: var(--secondary);
		--borderHoverColor: var(--secondary);
		--itemIsActiveBG: var(--secondary);
		--multiItemActiveBG: var(--secondary);
		--indicatorColor: var(--dark-gray);
		--indicatorTop: calc(50% - 13px);

		display: flex;
		gap: var(--s-4);
	}

	.input-wrapper label {
		min-width: 10ch;
	}

	.input-wrapper > div {
		display: flex;
		flex-grow: 1;
		gap: var(--s-1);
		flex-direction: column;
	}

	input {
		width: 100%;
		padding: var(--s-2) 16px;
		border: var(--border);
		border-radius: var(--borderRadius);
		font-size: inherit;
	}

	input:hover,
	input:focus {
		outline: none;
		border-color: var(--borderFocusColor);
	}

	.input-helper {
		color: var(--dark-gray);
		font-size: var(--font-100);
	}

	.required::after {
		content: '*';
		color: var(--error);
	}

	pre {
		position: relative;
	}

	pre button {
		position: absolute;
		top: var(--s-4);
		right: var(--s-4);
		padding: var(--s-1);
		border: none;
		border-radius: 5px;
		color: var(--white);
		background-color: var(--primary-color);
		cursor: pointer;
	}

	@media screen and (max-width: 700px) {
		.json-generator {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media screen and (max-width: 450px) {
		.input-wrapper {
			flex-direction: column;
			gap: var(--s-1);
		}
	}
</style>
