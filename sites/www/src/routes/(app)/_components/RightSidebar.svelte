<script lang="ts">
	import Tags from '$lib/ui/Tags.svelte';

	type Tag = {
		id: string;
		name: string;
		slug: string;
		contentCount: number;
	};

	let { tags }: { tags: Tag[] } = $props();
</script>

<main class="mx-auto mt-8 max-w-md space-y-4 p-4">
	<div class="mb-4 grid grid-cols-[auto_1fr] items-start gap-1">
		<div>
			<h3 class="text-lg font-semibold">Got Svelte News?</h3>
			<p class="mb-4 text-sm">Share with the biggest community of Svelte enthusiasts</p>
		</div>
		<button class="bg-svelte-900 w-28 rounded px-2 py-1 text-white hover:brightness-95">
			<span class="line-height-0">+</span> <span class="text-sm">Submit Post</span>
		</button>
	</div>

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
