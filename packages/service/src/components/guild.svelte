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
export let cover: string;
export let members: number;
export let description: string;
export let tags: Array<string> = [];
export let connected = false;
</script>

<Content {...$$props} type="Guild">
    {#if cover}
        <figure>
            <img src={cover}/>
        </figure>
    {/if}
    <strong>{members}</strong> Members
</Content>

<style>
    figure {
        margin: 0;
        padding: 0;
    }

    figure img {
        width: 600px;
        height: 300px;

        border-radius: 8px;
    }
</style>
