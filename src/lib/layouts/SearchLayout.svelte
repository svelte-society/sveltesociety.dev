<script>
	export let title;
</script>

<h1>{title}</h1>
<slot name="controls" />
<hr />
<slot name="items" />

<style>
	hr {
		margin-block: var(--s-8);
	}
</style>
