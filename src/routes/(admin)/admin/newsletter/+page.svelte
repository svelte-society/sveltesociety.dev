<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Newspaper from 'phosphor-svelte/lib/Newspaper'
	import Plus from 'phosphor-svelte/lib/Plus'
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Newsletter Campaigns"
		description="Create and manage newsletter campaigns"
		icon={Newspaper}
	>
		{#snippet actions()}
			<a
				href="/admin/newsletter/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
				data-testid="new-campaign-button"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Campaign
			</a>
		{/snippet}
	</PageHeader>
</div>
