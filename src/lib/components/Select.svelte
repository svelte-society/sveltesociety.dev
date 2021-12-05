<script>
	import Svelecte from 'svelecte';

	export let value;
	export let label = '';
</script>

<div class="themed">
	{#if label}
		<span>{label}</span>
	{/if}
	<Svelecte bind:value {...$$restProps} />
</div>

<style>
	span {
		font-size: 0.875rem;
	}
	.themed {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.themed :global(.svelecte-control) {
		--sv-min-height: 62px;
		--sv-border: 2px solid var(--dark-gray);
		--sv-active-border: 2px solid var(--secondary);
		--sv-item-active-bg: var(--secondary);
		--sv-item-active-color: #fff;
		--sv-item-btn-icon: #fff;
		--sv-item-selected-bg: var(--secondary);
		--sv-item-btn-bg: var(--secondary);
		--sv-item-btn-bg-hover: #b32d00;
	}
	.themed :global(.svelecte-control .sv-content) {
		padding: calc(13.5px - 4px) var(--s-2);
	}
	.themed :global(.svelecte-control .sv-content.has-multiSelection) {
		--sv-item-color: #fff;
	}
	.themed :global(.sv-item) {
		border-radius: 5px;
		overflow: hidden;
	}

	.themed :global(.sv-control .indicator-container svg) {
		width: 36px;
		height: 36px;
		fill: var(--dark-gray);
	}
	.themed :global(.sv-control:hover .indicator-container svg) {
		fill: var(--secondary);
	}
	.themed :global(a.sv-item-btn) {
		border-width: 0;
	}
	.themed :global(a.sv-item-btn svg) {
		height: 20px;
		width: 20px;
		max-width: 20px;
	}
</style>
