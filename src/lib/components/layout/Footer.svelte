<script lang="ts">
	// get the year for the copyright statement
	var date = new Date();
	var year = date.getFullYear();
</script>

<footer class="p-8 md:p-12 print:hidden">
	<div class="mx-auto grid justify-center justify-items-center gap-2 text-center md:flex md:gap-6">
		<span>&copy; {year} Svelte Society</span>
		<span>•</span>
		<a href="/about">Code of Conduct</a>
		<span>•</span>
		<span>
			Contribute on
			<a href="https://github.com/svelte-society/sveltesociety.dev/" target="_blank" rel="noopener"
				>GitHub</a
			>!
		</span>
	</div>
</footer>

<style>
	footer {
		background-color: var(--accent);
		color: var(--white);
		font-size: var(--font-200);
	}
</style>
