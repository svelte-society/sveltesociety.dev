<script lang="ts">
	import './highlight.css';
	import { HighlightSvelte } from 'svelte-highlight';
	import { fly } from 'svelte/transition';

	export let title = '';
	export let content = '';
	export let doc = '';
	export let repl = '';
	let isCopied = false;
	function copy(): void {
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

		<button on:click={copy} aria-label="Copy to clipborad">📋</button>
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
		background: #f8f8f8;
		width: fit-content;
		border-radius: 10px;
		margin-left: 10px;
		margin-bottom: 10px;
		flex: 1;
	}
	.title {
		background-color: firebrick;
		padding: var(--space-fixed-200);
		color: #ffffff;
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
		font-size: 1em;
	}
	.circles {
		display: block;
		width: var(--space-fixed-300);
		height: var(--space-fixed-300);
		border-radius: 50%;
		background-color: var(--color-red);
		box-shadow: 25px 0 0 0 var(--color-yellow), 50px 0 0 0 var(--color-green);
		margin-right: 50px;
		margin-left: 20px;
	}
	.card > .links {
		display: flex;
		justify-content: flex-end;
		padding: 10px;
		padding-bottom: 0;
		color: var(--color-red);
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
		padding: 0 var(--space-fixed-200);
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
