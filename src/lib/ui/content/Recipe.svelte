<script lang="ts">
	import type { Content } from '$lib/types/content'
	import type { CardVariant } from '../contentCard.variants'

	interface Props {
		content: Content
		variant?: CardVariant
	}

	let { content, variant = 'list' }: Props = $props()
</script>

{#if variant === 'detail' && content.rendered_body}
	<div class="prose prose-sm min-w-0 max-w-none text-gray-700">
		{@html content.rendered_body}
	</div>
{/if}
