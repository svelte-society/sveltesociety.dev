<script lang="ts">
	import SvelteSelect from 'svelte-select';
	import components from '../../components/components.json';
	import templates from '../../templates/templates.json';
	import tools from '../../tools/tools.json';
	import { onMount, tick } from 'svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { extractUnique } from '$lib/utils/extractUnique';
	import Seo from '$lib/components/Seo.svelte';

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
		copyToClipboard(JSON.stringify(jsonSnippet, null, '\t')).then(() => (clipboardCopy = false));
		clipboardCopy = true;
	};

	let type = types[0];
	let title = 'svelte-lorem-ipsum';
	let url = 'https://svelte-lorem-ipsum.dev';
	let description = 'A dummy text generator that does not exist';
	let npm = 'svelte-lorem-ipsum';
	let category;
	let tags;
	let repository = 'https://github.com/sveltejs/svelte-lorem-ipsum';

	$: pathName = `${type.value}s`;
	$: jsonSnippet = {
		title,
		url: url ? url : undefined,
		repository: repository ? repository : undefined,
		description,
		npm: npm ? npm : undefined,
		category: category?.value,
		tags: tags?.map((tag) => tag.value)
	};

	$: currentTags = data[type.value].tags;
	$: currentCategories = data[type.value].categories;

	onMount(() => {
		const typeQuery = new URLSearchParams(location.search).get('type');
		type = types.find((t) => t.value == typeQuery) || types[0];
	});

	async function clearCategoryAndTags() {
		await tick();
		category = null;
		tags = null;
	}
</script>

<Seo title="Submit component" />

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
<div class="json-generator">
	<div class="input-wrapper">
		<label for="type">Type:</label>
		<div>
			<SvelteSelect
				id="type"
				items={types}
				isClearable={false}
				showIndicator
				bind:value={type}
				on:select={clearCategoryAndTags}
			/>
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
		<label for="repository">Repository:</label>
		<div>
			<input id="repository" type="url" bind:value={repository} />
			<span class="input-helper">URL where code live.<br />Also used for star count update</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="url">URL:</label>
		<div>
			<input id="url" type="url" bind:value={url} />
			<span class="input-helper"
				>The URL where to find it.<br />If it's the same as Repository, it can be omitted</span
			>
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
		<label for="category">Category:</label>
		<div>
			<SvelteSelect
				id="category"
				items={currentCategories}
				isClearable={false}
				showIndicator
				bind:value={category}
			/>
			<span class="input-helper">The category of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="tags" class="required">Tags:</label>
		<div>
			<SvelteSelect id="category" items={currentTags} showIndicator isMulti bind:value={tags} />
			<span class="input-helper">A list of tags</span>
		</div>
	</div>
</div>

<h2>JSON Snippet</h2>
<pre>
{JSON.stringify(jsonSnippet, null, '\t')}<button on:click={copy}
		>{clipboardCopy ? 'Copied' : 'Copy'}</button
	>
</pre>
<br />
Copy this snippet and add it to
<a href="{repoURL}/blob/main/src/routes/{pathName}/{pathName}.json">{pathName}.json</a>. You can
propose your changes
<a href="{repoURL}/edit/main/src/routes/{pathName}/{pathName}.json">directly in GitHub</a>.

<style>
	.json-generator,
	pre {
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
