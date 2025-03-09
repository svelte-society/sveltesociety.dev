<script lang="ts">
const { data, children } = $props()

import LeftSidebar from './_components/LeftSidebar.svelte'
import RightSidebar from './_components/RightSidebar.svelte'
import { convertTags } from '$lib/types/content'

// Convert tags to the expected format with string IDs
const formattedTags = data.tags ? convertTags(data.tags) : []
</script>

<LeftSidebar />

<main class="flex-1 px-4 py-8">
	{@render children()}
</main>

<RightSidebar tags={formattedTags} />
