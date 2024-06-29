<script lang="ts">
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
export let embed: string;
export let tags: Array<string> = [];
export let connected = false;
</script>

<Content type="Video" {...$$props}>
    <iframe id="player" width="600" height="340"
            src={embed}
             style="border:none"></iframe>
</Content>

<style>
    iframe {
        border-radius: 8px;
    }
</style>
