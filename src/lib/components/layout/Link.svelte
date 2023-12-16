<script lang="ts">
	export let path: string;
	export let active = false;
</script>

<li>
	<a href={path} class:active class="nav-item">
		<slot />
	</a>
</li>

<style>
	li {
		text-transform: uppercase;
	}
	a {
		text-decoration: none;
		border-bottom: transparent;
		color: var(--inherit);
		transition: var(--link-transition);
		font-size: var(--font-200);
	}

	a.nav-item {
		letter-spacing: 0.05rem;
		font-weight: 400;
	}
	li a:hover {
		border-bottom: 4px solid var(--primary);
	}
	.active {
		border-bottom: 4px solid var(--primary);
	}
</style>
