<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit'

	interface Props {
		issues?: RemoteFormIssue[]
		description?: string
		error?: string
	}

	let { issues, description, error }: Props = $props()

	const hasErrors = $derived((issues && issues.length > 0) || !!error)
</script>

{#if hasErrors}
	{#if error}
		<div class="text-xs text-red-600">{error}</div>
	{/if}
	{#if issues}
		{#each issues as issue, i (i)}
			<div class="text-xs text-red-600">{issue.message}</div>
		{/each}
	{/if}
{:else if description}
	<div class="text-xs text-slate-500">{description}</div>
{/if}
