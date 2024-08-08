<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Tags from '$lib/ui/Tags.svelte';

	type Tag = {
		id: string;
		name: string;
		slug: string;
		contentCount: number;
	};

	let { tags }: { tags: Tag[] } = $props();
</script>

<main class="mx-auto mt-8 max-w-xs space-y-4 p-4">
	<div class="mb-4 grid grid-cols-[1fr_auto] items-start gap-1">
		<h3 class="text-lg font-semibold">Interested in contributing?</h3>
		<Button href="/submit" primary small icon_left="plus">Submit Post</Button>
	</div>
	<p class="mb-4 text-sm">Share with the biggest community of Svelte enthusiasts</p>

	<div>
		<h3 class="text-md mb-2 font-semibold">Tags</h3>
		<input
			type="text"
			placeholder="Search Tags"
			class="w-full rounded border-none bg-slate-100 p-2 text-xs"
		/>
	</div>

	<div>
		<h3 class="text-md mb-2 font-semibold">Popular tags</h3>
		<Tags {tags} />
	</div>

	<div class="mb-4 rounded bg-amber-100 p-3 text-sm">
		<p>
			Welcome to Svelte Society, homepage for everything Svelte. Try navigate left menu to filter by
			specific
		</p>
	</div>

	<div class="rounded bg-slate-200 p-4">
		<h3 class="text-md mb-2 font-bold">Our sponsors:</h3>
		<ul class="flex flex-wrap gap-2 text-sm">
			<li>ACME Inc.</li>
			<li>John Doe Inc.</li>
		</ul>
	</div>
</main>
