<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let tags = [
		{ id: 'svelte5', name: 'Svelte5' },
		{ id: 'runes', name: 'Runes' }
	];
</script>

<ContentCard
	title="Working with Actions in Svelte5"
	description="SvelteKit is a great tool for building modern web applications..."
	type="Recipe"
	author="John Doe"
	time="2 days ago"
	views="11114"
	likes="10"
	{tags}
	slug="working-with-actions-in-svelte5"
>
	Placeholder children content</ContentCard
>
