<script>
	export let path, active;
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
    color: var(--inherit);
    transition: border-bottom .2s;
    font-size: var(--font-100);
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
