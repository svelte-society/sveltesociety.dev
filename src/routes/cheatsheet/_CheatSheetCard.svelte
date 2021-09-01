<script lang="ts">
	import './highlight.css';
	import { HighlightSvelte } from 'svelte-highlight';
	import { fly } from 'svelte/transition';

	export let title = '';
	export let content = '';
	export let doc = '';
	export let repl = '';
	let isCopied = false;
	function copy() {
		const element = document.getElementById(title).firstChild;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(element.innerText);
			isCopied = true;
			setTimeout(() => (isCopied = false), 1500);
		}
	}
</script>

<div class="card">
	<header class="title">
		<h2>{title}</h2>
		<span class="circles" />
	</header>

	<section class="links">
		{#if isCopied}
			<span transition:fly={{ x: 20 }}> Copied to clipboard </span>
		{/if}

		<button on:click={copy} aria-label="Copy to clipboard" title="Copy to clipboard">📋</button>
		<a href={doc} target="_blank" title="Go to documentation">📃</a>
		<a href={repl} target="_blank" title="See in REPL">💻</a>
	</section>

	<section class="content">
		<HighlightSvelte id={title} code={content} />
	</section>
</div>

<style>
	.card {
		box-shadow: var(--shadow-dreamy);
		background: var(--white);
		border-radius: 10px;
		flex: 0 1 30%;
	}
	.title {
		background-color: var(--secondary);
		padding: var(--s-4);
    color: var(--white);
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 48px;
		max-width: 100%;
		border-radius: 10px 10px 0 0;
	}
	h2 {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: var(--font-200);
	}
	.circles {
		display: block;
		width: var(--s-5);
		height: var(--s-5);
		border-radius: 50%;
		background-color: var(--primary);
		box-shadow: 25px 0 0 0 var(--caution), 50px 0 0 0 var(--success);
		margin-right: 50px;
		margin-left: 20px;
	}
	.card > .links {
		display: flex;
		justify-content: flex-end;
		padding: 10px;
		padding-bottom: 0;
		color: var(--link-color);
		font-size: 0.8rem;
	}
	.links > a {
		font-size: 1.25rem;
		margin-left: 20px;
		text-decoration: none;
	}
	button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.25rem;
	}
	.card > .content {
		display: block;
		padding: 0 var(--s-2);
		height: calc(100% - 48px);
		overflow-x: auto;
		font-size: 0.8rem;
	}
	@media (max-width: 484px) {
		.title > h2 {
			font-size: 0.8em;
		}
	}
</style>
