<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: Used in Markup
import SvelteMarkdown from "svelte-markdown";
// biome-ignore lint/correctness/noUnusedImports: Used in Markup
import Content from "./content.svelte";
export let author: string;
export let lastUpdate: string;
export let views: number;
export let liked = false;
export let likes: number;
export let saved = false;
export let name: string;
export let description: string;
export let preview: string;
export let tags: Array<string> = [];
export let connected = false;
</script>

<Content {...$$props} type="Recipe">
    <SvelteMarkdown source={preview} />
    <br />
    <a href="">Read more...</a>
</Content>
