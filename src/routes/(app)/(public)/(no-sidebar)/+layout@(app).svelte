<script lang="ts">
	let { children } = $props()
</script>

<main class="mx-auto max-w-4xl flex-1 px-4 py-8">
	{@render children()}
</main>
