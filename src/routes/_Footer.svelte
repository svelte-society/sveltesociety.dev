<script>
	// get the year for the copyright statement
	var date = new Date();
	var year = date.getFullYear();
</script>

<div class="w-full bg-basics-100">
	<footer class="container mx-auto p-8 md:p-12">
		<div
			class="mx-auto grid gap-2 md:gap-6 md:flex items-center justify-center text-center"
		>
			<span>&copy; {year} Svelte Society</span>
			<span>•</span>
			<a class="underline" href="/about">Code of Conduct</a>
			<span>•</span>
			<span>
				Contribute on
				<a
					class="underline"
					href="https://github.com/svelte-society/sveltesociety.dev/"
					target="_blank"
					rel="noopener">GitHub</a
				>!
			</span>
		</div>
	</footer>
</div>

<style>
	@media print {
		footer {
			display: none;
		}
	}
</style>
