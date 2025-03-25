<script lang="ts">
import Button from '$lib/ui/Button.svelte'
import Tags from '$lib/ui/Tags.svelte'

type Tag = {
	id: string
	name: string
	slug: string
}

const { tags }: { tags: Tag[] } = $props()
</script>

<div class="@container space-y-4">
	<div class="mb-4 grid grid-cols-1 @xs:grid-cols-[1fr_auto] items-start gap-1">
		<h3 class="text-lg font-semibold">Interested in contributing?</h3>
		<Button href="/submit" primary small icon_left="plus">Submit Post</Button>
	</div>
	<p class="mb-4 text-sm">Share with the biggest community of Svelte enthusiasts in the world</p>

	<div>
		<h3 class="text-md mb-2 font-semibold">Popular tags</h3>
		<Tags {tags} />
	</div>

	<div class="rounded bg-amber-100 p-3 text-xs min-w-0">
		<p class="text-wrap">
			Welcome to Svelte Society, homepage for everything Svelte. Find what you're looking for in the left
			menu!
		</p>
	</div>

	<div class="rounded bg-gray-50 border-slate-200 border-1 text-sm px-4 py-2 grid gap-2">
		<h3 class="text-md font-bold">Our sponsors:</h3>
		<ul class="flex flex-wrap gap-2">
			<li>ACME Inc.</li>
			<li>John Doe Inc.</li>
		</ul>
	</div>
</div>
