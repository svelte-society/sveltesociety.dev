<script>
	export const primary = false;
	export let active = false;
	export let small = false;
</script>

<span>
	Package Manager
	<div on:click class:small>
		<span>
			<slot />
		</span>
		<div class="arrow" class:active />
		<section class="popin"><slot name="menu" /></section>
	</div>
</span>

<style>
	div {
		font-size: 1rem;
		border: 2px solid var(--dark-gray);
		border-radius: 3px;
		background-color: white;
		color: var(--dark-gray);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 13.5px var(--s-2);
		position: relative;
	}
	div.small {
		font-size: var(--font-100);
	}
	div:hover {
		cursor: pointer;
		border-color: var(--secondary);
		color: var(--secondary);
	}

	.arrow {
		margin-left: 25px;
		height: 16px;
		-webkit-mask: url(/images/right-arrow.svg) no-repeat center;
		mask: url(/images/right-arrow.svg) no-repeat center;
		background-color: var(--dark-gray);
	}
	div:hover .arrow {
		background-color: var(--secondary);
	}
	.arrow.active {
		background-color: var(--dark-gray);
	}

	.popin {
		min-width: 250px;
		width: 100%;
		font-size: var(--font-100);
		display: none;
		position: absolute;
		left: var(--s-4);
		top: 100%;
		z-index: 100;
		margin: 0;
		padding: 0;
		border: 2px solid var(--secondary);
		border-radius: 5px;
		background: white;
	}
	div:hover .popin:not(:empty) {
		display: block;
	}

	span {
		font-size: 0.875rem;
	}

	@media screen and (min-width: 700px) {
		.popin {
			left: 95%;
			top: var(--s-4);
		}
	}
</style>
