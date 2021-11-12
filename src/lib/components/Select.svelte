<script>
	import Svelecte from 'svelecte';

	export let value;
	export let label = '';
</script>

<div class="themed">
	{#if label}
		<span>{label}</span>
	{/if}
	<Svelecte class="themed-svelecte" bind:value {...$$restProps} />
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

	.themed :global(.sv-control) {
		min-height: 62px;
		border: 2px solid var(--dark-gray);
	}
	.themed :global(.sv-control:hover) {
		border: 2px solid var(--secondary);
	}
	.themed :global(.sv-content) {
		padding: calc(13.5px - 4px) var(--s-2);
	}
	.themed :global(.sv-control .indicator-container svg) {
		width: 36px;
		height: 36px;
		fill: var(--dark-gray);
	}
	.themed :global(.sv-control:hover .indicator-container svg) {
		fill: var(--secondary);
	}
	.themed :global(.sv-item) {
		border-radius: 4px;
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
