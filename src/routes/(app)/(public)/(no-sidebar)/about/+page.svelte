<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">About Svelte Society</h1>

	<div class="mb-8">
		<p class="mb-4">
			Svelte Society is a community-driven organization dedicated to promoting and supporting the
			Svelte framework. We bring together developers, enthusiasts, and experts to share knowledge,
			collaborate on projects, and advance the Svelte ecosystem.
		</p>
		<p class="mb-4">
			Our mission is to foster a vibrant and inclusive community where Svelte developers can learn,
			grow, and connect with like-minded individuals.
		</p>
	</div>

	<h2 class="mb-4 text-2xl font-semibold">What We Do</h2>
	<ul class="mb-8 list-disc pl-6">
		<li>Organize meetups and conferences</li>
		<li>Share tutorials and best practices</li>
		<li>Curate Svelte-related resources</li>
		<li>Support open-source Svelte projects</li>
		<li>Facilitate networking among Svelte developers</li>
	</ul>

	<h2 class="mb-4 text-2xl font-semibold">Get Involved</h2>
	<p class="mb-4">There are many ways to get involved with Svelte Society:</p>
	<div class="flex space-x-4">
		<Button primary href="/events">Attend Events</Button>
		<Button secondary href="/submit">Submit Content</Button>
	</div>
</div>
