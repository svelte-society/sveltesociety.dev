<script lang="ts">
	import type { LayoutData } from './$types';

	let { children } = $props();
</script>

<h2 class="mb-4 text-3xl font-bold">Users</h2>
<div class="max-w-3xl">
	{@render children()}
</div>
