<script>
	import SvelteSelect from 'svelte-select';

	export let value;
	export let label = '';

	const selectId = label ? `${label.replace(' ', '_').toLowerCase()}_select` : undefined;
</script>

<div class="themed themed-select">
	{#if label}
		<label for={selectId}>{label}</label>
	{/if}
	<SvelteSelect
		id={selectId}
		containerClasses="select-container"
		bind:value
		{...$$restProps}
		on:select
	/>
</div>

<style>
	label {
		white-space: nowrap;
		font-size: 0.875rem;
		margin-bottom: calc(1em / 3);
	}

	/* New - Start */

	.themed :global(.indicator) {
		display: flex; /* Centers chevron */
	}

	.themed-select :global(.clearSelect) {
		display: flex; /* Centers clear button */
	}

	.themed-select :global(.clearSelect:hover svg) {
		color: var(--secondary);
	}

	.themed-select :global(.selectedItem) {
		display: flex; /* Centers select value */
		align-items: center;
		font-size: 1.125rem;
	}

	.themed-select :global(.listContainer .listItem .item) {
		cursor: pointer;
		padding: 0 1rem; /* Equalizes padding between input/dropdown text */
	}

	.themed-select :global(.selectedItem .selection) {
		line-height: 1;
		margin-top: calc(1em / 4); /* Centers line-height */
	}

	.themed :global(.multiSelectItem_clear) {
		top: unset !important;
		cursor: pointer;
	}

	.themed :global(.multiSelectItem_label) {
		user-select: none;
	}

	.themed :global(.multiSelectItem:hover svg) {
		fill: var(--white) !important;
	}

	.themed :global(.multiSelect) {
		--padding: calc(1em / 3);
		--gap: var(--padding);
		--icon-width: 20px;
		--right-padding: calc(var(--icon-width) + var(--padding) * 2);

		gap: var(--gap) !important;
		display: flex !important;
		justify-content: flex-start !important;
		padding: var(--padding) var(--right-padding) var(--padding) var(--padding) !important;
		align-items: center !important;
		height: 100% !important;
	}

	.themed :global(.select-container) {
		border: 2px solid var(--dark-gray);
		cursor: pointer;
		align-items: center;
		height: max-content;
		gap: 10px;
	}

	/* New - End */

	.themed {
		/* --inputFontSize: 0.875rem; */
		--multiItemActiveBG: var(--secondary);
		--borderHoverColor: var(--secondary);
		--borderFocusColor: var(--secondary);
		--itemIsActiveBG: var(--secondary);
		position: relative;
		display: flex;
		flex-direction: column;
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
</style>
