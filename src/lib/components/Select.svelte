<script>
	import SvelteSelect from 'svelte-select';

	export let value;
	export let label = '';

	const selectId = label ? `${label.replace(' ', '_').toLowerCase()}_select` : undefined;
</script>

<div class="themed-select">
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
		line-height: 1;
		white-space: nowrap;
		font-size: var(--input-label-size);
		margin-bottom: calc(1em / 3);
	}

	/* Scoped generic svelte-select overrides */

	.themed-select :global(.indicator) {
		/* Centers chevron */
		display: flex;
		height: 100% !important;
		top: 0 !important;
	}

	.themed-select :global(.selectContainer) {
		min-height: var(--input-height);
	}

	.themed-select :global(.clearSelect:hover svg) {
		color: var(--secondary);
	}

	.themed-select :global(.selectedItem) {
		display: flex; /* Centers select value */
		align-items: center;
		font-size: var(--input-font-size);
	}

	.themed-select :global(.listContainer .listItem .item) {
		cursor: pointer;
		padding: 0 var(--s-4); /* Equalizes padding between input/dropdown text */
		font-size: var(--input-font-size);
	}

	.themed-select :global(.selectedItem .selection) {
		line-height: 1;
		overflow: hidden;
		margin-top: var(--ff-optical-4); /* Centers text-line */
	}

	/* Scoped multi svelte-select overrides */

	.themed-select :global(.multiSelect) {
		--padding-y: calc(1em / 3);
		--gap: var(--padding-y);
		--icon-width: 20px;
		--right-padding: calc(var(--icon-width) + var(--padding-y) * 2);
		min-height: var(--input-height);
		gap: var(--gap) !important;
		display: flex !important;
		justify-content: flex-start !important;
		padding: var(--padding-y) var(--right-padding) var(--padding-y) var(--s-4) !important;
		align-items: center !important;
		height: 100% !important;
	}

	.themed-select :global(.clearSelect) {
		cursor: pointer;
		display: flex; /* Centers clear button */
		padding: 0;
	}

	.themed-select :global(.multiSelect:has(.multiSelectItem)) {
		padding: var(--padding-y) var(--right-padding) var(--padding-y) var(--padding-y) !important; /* Changes container padding once there are results */
	}

	.themed-select :global(.multiSelectItem) {
		--delete-icon-width: 25px;
		padding: 0 0 0 var(--s-1) !important;
		height: var(--delete-icon-width) !important;
	}

	.themed-select :global(.multiSelectItem:hover svg) {
		fill: var(--white) !important;
	}

	.themed-select :global(.multiSelectItem_clear) {
		/* Increase the clickable clear area */
		top: unset !important;
		width: var(--delete-icon-width) !important;
		height: var(--delete-icon-width) !important;
		max-width: unset !important;
		cursor: pointer;
	}

	.themed-select :global(.multiSelectItem_label) {
		user-select: none;
		margin-right: 0 !important;
		margin-top: var(--ff-optical-6) !important;
	}

	.themed-select :global(.multiSelectItem_clear svg) {
		padding: calc(var(--s-1) / 2);
	}

	.themed-select :global(input) {
		height: 1em !important;
		overflow-y: hidden;
		position: relative;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-weight: 700 !important;
		font-size: var(--multiselect-placeholder-font-size) !important;
		margin-top: var(--ff-optical-4) !important;
		color: var(--black) !important;
	}

	.themed-select {
		--multiItemActiveBG: var(--secondary);
		--borderHoverColor: var(--secondary);
		--borderFocusColor: var(--secondary);
		--itemIsActiveBG: var(--secondary);
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.themed-select :global(.multiSelectItem) {
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

	.themed-select :global(input) {
		cursor: pointer !important;
		font-family: Overpass;
	}
</style>
