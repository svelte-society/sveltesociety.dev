<script>
	import SvelteSelect from 'svelte-select';

	export let value;
	export let label = '';
</script>

<div class="themed">
	{#if label}
		<span>{label}</span>
	{/if}
	<SvelteSelect containerClasses="select-container" bind:value {...$$restProps} on:select />
</div>

<style>
	span {
		font-size: 0.875rem;
	}
	.themed {
		/* --inputFontSize: 0.875rem; */
		--multiItemActiveBG: var(--secondary);
		--borderHoverColor: var(--secondary);
		--borderFocusColor: var(--secondary);
		--itemIsActiveBG: var(--secondary);
		/* --indicatorTop: calc(50% - 13px); */
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.themed :global(.select-container) {
		border: 2px solid var(--dark-gray);
		cursor: pointer;
		flex: 1;
		align-items: center;
		gap: 10px;
		min-width: 150px;
		min-height: 3rem;
	}

	.themed :global(.multiSelectItem) {
		font-size: 0.875rem;
		align-items: center;
		--multiItemBorderRadius: var(--s-1);
		--multiItemHeight: 1.25rem;
		--multiItemMargin: 0;
		--multiItemPadding: 0.2rem 0.3rem;
		--multiClearBG: transparent;
		--multiClearFill: var(--secondary);
		--multiClearHoverBG: transparent;
		/* --multiClearHoverFill: var(--white); */
		/* --multiLabelMargin: 1px 5px 0 0; */
	}

	.themed :global(input) {
		height: 1rem !important;
		cursor: pointer !important;
	}

	.themed :global(.multiSelectItem_clear) {
		position: static;
		cursor: pointer;
	}
</style>
