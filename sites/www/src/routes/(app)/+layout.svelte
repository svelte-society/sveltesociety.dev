<script>

	const { data, children } = $props();
</script>

<nav class="p-4 rounded-md bg-red-100">
	<ul class="flex gap-4">
		<li><a href="/">Home</a></li>
		{#if data.user}
			<li><a href="/account">Profile</a></li>
			<li><a href="/auth/logout">Logout</a></li>
		{:else}
			<li><a href="/auth/github">Log in with GitHub</a></li>
		{/if}
	</ul>
</nav>

{@render children()}
