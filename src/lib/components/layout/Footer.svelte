<script lang="ts">
	// get the year for the copyright statement
	var date = new Date();
	var year = date.getFullYear();
</script>

<footer>
	<div class="grid mx-auto gap-2 justify-items-center justify-center text-center md:flex md:gap-6">
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
		padding: var(--s-8);
		font-size: var(--font-200);
	}
	@media (min-width: 768px) {
		footer {
			padding: var(--s-12);
		}
	}
	@media print {
		footer {
			display: none;
		}
	}
</style>
