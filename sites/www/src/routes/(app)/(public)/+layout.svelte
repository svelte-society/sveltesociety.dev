<script lang="ts">
	let { data, children } = $props();

	import LeftSidebar from './_components/LeftSidebar.svelte';
	import RightSidebar from './_components/RightSidebar.svelte';
	import Breadcrumb from '$lib/ui/Breadcrumb.svelte';
</script>

<LeftSidebar />

<main class="flex-1 px-4 py-8">
	<Breadcrumb />
	{@render children()}
</main>

<RightSidebar tags={data.tags || []} />
