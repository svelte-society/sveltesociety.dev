<script>
	export let path, active;
</script>

<li>
	<a href={path} class:active class="nav-item">
		<slot />
	</a>
</li>

<style>
	/* a {
		color: black;
		font-size: var(--font-100);
		text-decoration: none;
		border-bottom: 4px solid transparent;
		transition: border-bottom 0.2s;
	}
	a.nav-item {
		letter-spacing: 0.05rem;
		font-weight: lighter;
	}
	li {
		display: inline-block;
		margin: 0 0.5rem;
	}
	li a {
		text-transform: uppercase;
	}

	li a:hover {
		border-bottom: 4px solid var(--color);
	} */
	.active {
		border-bottom: 4px solid var(--color);
	}
</style>
