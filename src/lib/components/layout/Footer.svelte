<script>
	var date = new Date();
	var year = date.getFullYear();
</script>

<footer>
	<div class="container">
		<span>
			<a
				class="underline"
				href="https://cultdao.io"
				target="_blank"
				rel="noopener">cultdao.io</a
			>
		</span>
		<span>•</span>
		<span>&copy; {year} CULT Magazine</span>
		<span>•</span>
		<span>
			<a
				class="underline"
				href="https://github.com/michael-spengler/cultmagazine"
				target="_blank"
				rel="noopener">GitHub</a
			>
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
	.container {
		display: grid;
		gap: var(--s-2);
		justify-items: center;
		justify-content: center;
		text-align: center;
	}
	@media (min-width: 768px) {
		footer {
			padding: var(--s-12);
		}
		.container {
			display: flex;
			gap: var(--s-6);
		}
	}
	@media print {
		footer {
			display: none;
		}
	}
</style>
