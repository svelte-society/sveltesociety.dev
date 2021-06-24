<script>
	// get the year for the copyright statement
	var date = new Date();
	var year = date.getFullYear();
</script>

<div class="shaded">
	<footer class="wrapper">
		<div class="centered">&copy; {year} Svelte Society
			•
			<a href="/about">Code of Conduct</a>
			•
			Contribute on
			<a
				class="ghlink"
				href="https://github.com/svelte-society/sveltesociety-2021/"
				target="_blank"
				rel="noopener">GitHub</a
			>!
		</div>
	</footer>
</div>

<style>
	.shaded {
		max-width: 100%;
		background: #f3f6f9;
	}

	.centered {
		margin: 0 auto;
	}

	a {
		color: black;
	}

	footer {
		display: flex;
		justify-content: space-between;
		max-width: unset;
		padding: 3em;
	}

	@media only screen and (max-width: 768px) {
		footer {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			max-width: unset;
			padding: 2em;
		}
	}
	@media print {
		footer {
			display: none;
		}
	}
</style>
