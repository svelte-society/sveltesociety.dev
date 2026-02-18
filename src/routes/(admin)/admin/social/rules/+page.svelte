<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Robot from 'phosphor-svelte/lib/Robot'
	import Play from 'phosphor-svelte/lib/Play'
	import Pause from 'phosphor-svelte/lib/Pause'
	import { getRules, deleteRule, toggleRuleActive } from '../data.remote'
	import { PLATFORM_CONFIG } from '$lib/types/social'
	import type { SocialPlatform, SocialAutoRule } from '$lib/types/social'

	const { rules, total } = $derived(await getRules())

	const triggerTypeLabels: Record<string, string> = {
		content_published: 'Content Published',
		sponsor_activated: 'Sponsor Activated',
		job_published: 'Job Published'
	}

	const triggerTypeColors: Record<string, string> = {
		content_published: 'amber',
		sponsor_activated: 'purple',
		job_published: 'success'
	}

	function getPlatformList(platforms: SocialPlatform[]): string {
		return platforms.map((p) => PLATFORM_CONFIG[p]?.label || p).join(', ')
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Auto-Posting Rules"
		description="Configure automatic post creation when content is published"
		icon={Robot}
	>
		{#snippet actions()}
			<a
				href="/admin/social"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
			>
				Back to Posts
			</a>
			<a
				href="/admin/social/rules/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90"
				data-testid="new-rule-button"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Rule
			</a>
		{/snippet}
	</PageHeader>

	{#if rules && rules.length > 0}
		<Table action={true} data={rules} testId="auto-rules-table" emptyMessage="No auto-posting rules configured">
			{#snippet header(classes)}
				<th class={classes}>Name</th>
				<th class={[classes, 'text-center']}>Trigger</th>
				<th class={classes}>Content Filter</th>
				<th class={classes}>Platforms</th>
				<th class={[classes, 'text-center']}>Status</th>
				<th class={classes}>Created</th>
			{/snippet}
			{#snippet row(rule: SocialAutoRule, classes: string)}
				<td class="{classes} font-medium">
					<a
						href={`/admin/social/rules/${rule.id}`}
						class="hover:text-svelte-500"
						data-testid="rule-edit-link"
					>
						{rule.name}
					</a>
					{#if rule.description}
						<p class="text-xs text-gray-500 mt-0.5">{rule.description}</p>
					{/if}
				</td>
				<td class={[classes, 'text-center']}>
					<Badge
						color={triggerTypeColors[rule.trigger_type] || 'default'}
						text={triggerTypeLabels[rule.trigger_type] || rule.trigger_type}
					/>
				</td>
				<td class={classes}>
					{#if rule.content_type_filter}
						<span class="capitalize">{rule.content_type_filter}</span>
					{:else}
						<span class="text-gray-400">All types</span>
					{/if}
					{#if rule.tag_filter && rule.tag_filter.length > 0}
						<div class="mt-1 flex flex-wrap gap-1">
							{#each rule.tag_filter as tag}
								<span class="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
									#{tag}
								</span>
							{/each}
						</div>
					{/if}
				</td>
				<td class={classes}>
					<span class="text-sm">{getPlatformList(rule.platforms)}</span>
				</td>
				<td class={[classes, 'text-center']}>
					<form {...toggleRuleActive} class="inline">
						<input type="hidden" name="id" value={rule.id} />
						{#if !rule.is_active}
							<input type="hidden" name="is_active" value="on" />
						{/if}
						<button
							type="submit"
							class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors"
							class:bg-green-100={rule.is_active}
							class:text-green-800={rule.is_active}
							class:hover:bg-green-200={rule.is_active}
							class:bg-gray-100={!rule.is_active}
							class:text-gray-600={!rule.is_active}
							class:hover:bg-gray-200={!rule.is_active}
						>
							{#if rule.is_active}
								<Play class="h-3 w-3" weight="fill" />
								Active
							{:else}
								<Pause class="h-3 w-3" weight="fill" />
								Paused
							{/if}
						</button>
					</form>
				</td>
				<td class={classes}>
					{formatRelativeDate(rule.created_at)}
				</td>
			{/snippet}
			{#snippet actionCell(rule: SocialAutoRule)}
				<Actions id={rule.id}>
					<Action.Edit href={`/admin/social/rules/${rule.id}`} />
					<Action.Delete form={deleteRule} confirm={`Delete rule "${rule.name}"?`} />
				</Actions>
			{/snippet}
		</Table>
	{:else}
		<div class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
			<Robot class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-4 text-lg font-medium text-gray-900">No auto-posting rules yet</h3>
			<p class="mt-2 text-sm text-gray-500">
				Create rules to automatically generate social posts when content is published.
			</p>
			<a
				href="/admin/social/rules/new"
				class="mt-6 inline-flex items-center gap-2 rounded-lg bg-svelte-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-svelte-600"
			>
				<Plus class="h-4 w-4" weight="bold" />
				Create First Rule
			</a>
		</div>
	{/if}
</div>
