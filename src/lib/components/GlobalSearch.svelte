<script lang="ts">
	import type { SearchItem } from '$lib/items';
	import { MIN_SEARCH_CHARS, search } from '$lib/items';
	import { afterNavigate } from '$app/navigation';

	let value = '';
	let result: Array<SearchItem> = [];
	let input;
	$: if (value.length >= MIN_SEARCH_CHARS) {
		result = search(value);
	} else {
		result = [];
	}

	function close() {
		value = '';
		input.blur();
	}

	afterNavigate(close);

	function start(event: KeyboardEvent) {
		if (event.ctrlKey && event.code === 'KeyK') {
			open();
		}

		if (event.code === 'Escape') {
			close();
		}
	}
	export function open() {
		input.focus();
	}
</script>

<svelte:window on:keydown={start} />

<div on:click|self={close}>
	<input bind:this={input} type="search" bind:value />

	{#if value.length >= MIN_SEARCH_CHARS}
		<ul>
			{#each result as item}
				<li data-type={item.type}>
					<a href={item.url}>{item.title}</a><br /><span>{item.description}</span>
				</li>
			{:else}
				<li>No results</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	div {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--s-4);
		gap: var(--s-4);
		backdrop-filter: blur(4px) saturate(0.5);
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;

		top: 0;
		bottom: 100%;
		overflow: hidden;
		opacity: 0;

		transition: opacity 0ms;
	}
	div:focus-within,
	div:focus-visible {
		inset: 0;
		opacity: 1;
		transition: opacity 200ms;
	}
	input {
		font-size: 1.2rem;
		padding: var(--s-2);
	}
	ul {
		overflow-y: auto;
		padding: var(--s-4);
		mask-image: linear-gradient(
			to bottom,
			transparent 0,
			black var(--s-4),
			black calc(100% - var(--s-4)),
			transparent
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 0,
			black var(--s-4),
			black calc(100% - var(--s-4)),
			transparent
		);
	}
	li {
		padding: var(--s-2);
		box-shadow: var(--shadow-short);
		margin-bottom: var(--s-2);
		background: var(--white);
		border-radius: 6px;
	}
	li[data-type]::before {
		content: attr(data-type);
		font-size: 0.6em;
		background: var(--dark-gray);
		padding: var(--s-1) var(--s-1);
		border-radius: 4px;
		color: var(--white);
		margin-right: 0.6ex;
	}
	span {
		color: var(--dark-gray);
		font-size: 0.6em;
	}
	li a[href^='http']::after {
		content: '↗';
		color: var(--dark-gray);
	}

	@media (min-width: 1280px) {
		div {
			padding: var(--s-8);
		}
		div > * {
			max-width: 1000px;
			width: max-content;
		}
	}
</style>
