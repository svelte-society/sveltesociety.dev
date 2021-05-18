<script>
	export let title = '';

</script>

<div>
	<h1>{title}</h1>
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		padding: 5vw;
	}

	main {
		text-align: start;
		display: block;
	}

</style>
