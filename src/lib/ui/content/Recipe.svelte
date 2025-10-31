<script lang="ts">
	import type { ContentWithAuthor } from '$lib/types/content'

	let { content }: { content: ContentWithAuthor } = $props()
</script>

<div class="text-sm text-gray-600">Recipe content</div>
