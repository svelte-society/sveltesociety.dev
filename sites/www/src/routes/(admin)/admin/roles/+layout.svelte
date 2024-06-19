<script lang="ts">
	import type { LayoutData } from './$types';

	let { children } = $props();
</script>

<h2 class="mb-4 text-3xl font-bold">Roles</h2>
<div class="max-w-2xl">
	{@render children()}
</div>
