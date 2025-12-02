<script lang="ts">
	import Recipe from './Recipe.svelte'
	import Library from './Library.svelte'
	import Resource from './Resource.svelte'
	import Video from './Video.svelte'

	import { page } from '$app/state'
</script>

{#if page.params.type === 'recipe'}
	<Recipe />
{:else if page.params.type === 'library'}
	<Library />
{:else if page.params.type === 'video'}
	<Video />
{:else if page.params.type === 'resource'}
	<Resource />
{/if}
