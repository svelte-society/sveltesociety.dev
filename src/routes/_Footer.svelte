<script>
	// get the year for the copyright statement
	var date = new Date();
	var year = date.getFullYear();
</script>

<div class="w-full bg-basics-100">
	<footer class="container mx-auto p-8 md:p-12">
		<div
			class="mx-auto flex flex-col md:flex-row items-center md:justify-between md:w-5/6 lg:w-2/3 xl:w-1/3 2xl:w-1/4"
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
