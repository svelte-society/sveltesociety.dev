<script lang="ts">
	export let title: string;
	export let variant: string;
	export let click: () => void = undefined;
</script>

<div on:click={click} on:keypress={click} class={variant} role="button" tabindex="0">{title}</div>

<style>
	div {
		/* max-width: 33%; */
		padding: 2px 12px;
		border-radius: 5px;
		font-family: Overpass;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		line-height: 150%;
		text-align: center;
		margin-right: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.red {
		color: #ff3e01;
		background: #ffdbcf;
	}
	.blue {
		color: #158fff;
		background: #ddefff;
	}

	.copy {
		color: #ff6f01;
		background: #ffe9cf;
		cursor: copy;
	}
</style>
