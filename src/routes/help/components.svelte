<script>
	import components from '../components/components.json';

	const allTags = Array.from(new Set(components.map((item) => item.tags).flat()));
	const tagItems = allTags.map((t) => ({ label: t, value: t }));
	const allCategories = [
		'Boilerplate',
		'Data Visualisation',
		'Design Pattern',
		'Design System',
		'Developer Experience',
		'Forms & User Input',
		'Integration',
		'Routers',
		'Stores',
		'Testing',
		'User Interaction'
	];
	const categoryItems = allCategories.map((cat) => ({ label: cat, value: cat }));

	let clipboardCopy = false;
	const copyToClipboard = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				clipboardCopy = true;
				setTimeout(() => (clipboardCopy = false), 1000);
			})
			.catch(() => alert('Clipboard copy Permission denied'));
	};

	let title = 'svelte-calender';
	let url = 'https://github.com/6eDesign/svelte-calendar';
	let description = 'A lightweight date picker with neat animations and a unique UX';
	let npm = 'svelte-calender';
	let image = '';
	let category = 'Forms & User Input';
	let tags = ['components and libraries', 'time and date'];
	let addedOn = '';

	$: jsonSnippet = {
		title,
		url,
		description,
		npm,
		tags,
		image,
		addedOn,
		category
	};
</script>

<h1>How to submit a new component?</h1>
<p>
	To add a new component on the website, the process is rather simple. You have to add your
	component in <a
		href="https://github.com/svelte-society/sveltesociety.dev/blob/master/src/routes/components/components.json"
	>
		components.json
	</a>
</p>

<h2>Forking the project</h2>
<p>
	You can fork the <a href="https://github.com/svelte-society/sveltesociety.dev/">
		GitHub project
	</a>, add your component and then propose a Pull request.
</p>

<h2>Edit the file</h2>
<p>
	You can edit and propose your changes <a
		href="https://github.com/svelte-society/sveltesociety.dev/edit/master/src/pages/components/components.json"
	>
		directly in GitHub
	</a>
</p>

<h2>What information should I give ?</h2>
<p>
	Each component is represented by a JSON Object. Use the generator below to generate the JSON
	Object.
</p>

<h2>Generator</h2>
<p><code>*</code> marked fields are required</p>
<div class="json-generator">
	<div class="input-wrapper">
		<label for="title">Title*:</label>
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
			<input id="desc" type="url" bind:value={description} />
			<span class="input-helper">A short description of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="npm">NPM:</label>
		<div>
			<input id="npm" type="url" bind:value={npm} />
			<span class="input-helper">The npm name of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="img">Image:</label>
		<div>
			<input id="img" type="url" bind:value={image} />
			<span class="input-helper">An image to quickly view what your component is all about</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="adden-on">Added On*:</label>
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
			<select id="category" bind:value={category}>
				{#each categoryItems as category}
					<option value={category.value}>{category.label}</option>
				{/each}
			</select>
			<span class="input-helper">The category of the component</span>
		</div>
	</div>
	<div class="input-wrapper">
		<label for="tags">Tags*:</label>
		<div>
			<select id="tags" multiple required bind:value={tags}>
				{#each tagItems as tag}
					<option value={tag.value}>{tag.label}</option>
				{/each}
			</select>
			<span class="input-helper">A list of tags</span>
		</div>
	</div>
</div>

<h2>JSON Snippet</h2>
<pre>
  {JSON.stringify(jsonSnippet,null,4)}
  <button on:click={() => copyToClipboard(JSON.stringify(jsonSnippet,null,4))}>{clipboardCopy ? 'Copied' : 'Copy'}</button>
</pre>

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
	}

	.input-wrapper {
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

	input,
	select {
		width: 100%;
		padding: var(--s-2);
		border: 1px solid var(--gray);
		border-radius: 5px;
		font-size: inherit;
	}

	select[multiple] {
		padding: 0;
	}

	select[multiple] option {
		padding: var(--s-2);
	}

	.input-helper {
		color: var(--dark-gray);
		font-size: var(--font-100);
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
