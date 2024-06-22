<script lang="ts">
	import type { LayoutData } from './$types';

	let { children } = $props();
</script>

<div class="max-w-2xl">
	<h2 class="mb-4 text-3xl font-bold">Roles</h2>
	{@render children()}
</div>
