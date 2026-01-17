<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import ChartLine from 'phosphor-svelte/lib/ChartLine'
	import TrendUp from 'phosphor-svelte/lib/TrendUp'
	import Clock from 'phosphor-svelte/lib/Clock'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import XCircle from 'phosphor-svelte/lib/XCircle'
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt'
	import { getAnalytics } from '../data.remote'
	import { PLATFORM_CONFIG, POST_TYPE_CONFIG, POST_STATUS_CONFIG } from '$lib/types/social'
	import { formatRelativeDate } from '$lib/utils/date'

	const analytics = $derived(await getAnalytics())

	// Format percentage
	function formatPercent(value: number, total: number): string {
		if (total === 0) return '0%'
		return `${Math.round((value / total) * 100)}%`
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Analytics"
		description="Social media post statistics and performance"
		icon={ChartLine}
	>
		{#snippet actions()}
			<a
				href="/admin/social"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
			>
				Back to Posts
			</a>
		{/snippet}
	</PageHeader>

	<!-- Summary Cards -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
		<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Total Posts</p>
					<p class="mt-1 text-3xl font-bold text-gray-900">{analytics.summary.total}</p>
				</div>
				<div class="rounded-full bg-gray-100 p-3">
					<PaperPlaneTilt class="h-6 w-6 text-gray-600" weight="fill" />
				</div>
			</div>
		</div>

		<div class="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-green-700">Published</p>
					<p class="mt-1 text-3xl font-bold text-green-800">{analytics.summary.published}</p>
					<p class="mt-1 text-xs text-green-600">
						{formatPercent(analytics.summary.published, analytics.summary.total)} of total
					</p>
				</div>
				<div class="rounded-full bg-green-100 p-3">
					<CheckCircle class="h-6 w-6 text-green-600" weight="fill" />
				</div>
			</div>
		</div>

		<div class="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-blue-700">Scheduled</p>
					<p class="mt-1 text-3xl font-bold text-blue-800">{analytics.summary.scheduled}</p>
					<p class="mt-1 text-xs text-blue-600">
						{formatPercent(analytics.summary.scheduled, analytics.summary.total)} of total
					</p>
				</div>
				<div class="rounded-full bg-blue-100 p-3">
					<Clock class="h-6 w-6 text-blue-600" weight="fill" />
				</div>
			</div>
		</div>

		<div class="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-amber-700">Drafts</p>
					<p class="mt-1 text-3xl font-bold text-amber-800">{analytics.summary.draft}</p>
					<p class="mt-1 text-xs text-amber-600">
						{formatPercent(analytics.summary.draft, analytics.summary.total)} of total
					</p>
				</div>
				<div class="rounded-full bg-amber-100 p-3">
					<TrendUp class="h-6 w-6 text-amber-600" weight="fill" />
				</div>
			</div>
		</div>

		<div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-red-700">Failed</p>
					<p class="mt-1 text-3xl font-bold text-red-800">{analytics.summary.failed}</p>
					<p class="mt-1 text-xs text-red-600">
						{formatPercent(analytics.summary.failed, analytics.summary.total)} of total
					</p>
				</div>
				<div class="rounded-full bg-red-100 p-3">
					<XCircle class="h-6 w-6 text-red-600" weight="fill" />
				</div>
			</div>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Platform Breakdown -->
		<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">By Platform</h2>
			{#if analytics.byPlatform.length > 0}
				<div class="space-y-4">
					{#each analytics.byPlatform as platform}
						{@const config = PLATFORM_CONFIG[platform.platform as keyof typeof PLATFORM_CONFIG]}
						<div class="rounded-lg border border-gray-100 p-4">
							<div class="flex items-center justify-between mb-2">
								<span class="font-medium text-gray-900">{config?.label ?? platform.platform}</span>
								<span class="text-sm text-gray-500">{platform.total} posts</span>
							</div>
							<div class="flex gap-4 text-sm">
								<div class="flex items-center gap-1">
									<span class="h-2 w-2 rounded-full bg-green-500"></span>
									<span class="text-gray-600">{platform.published} published</span>
								</div>
								{#if platform.failed > 0}
									<div class="flex items-center gap-1">
										<span class="h-2 w-2 rounded-full bg-red-500"></span>
										<span class="text-gray-600">{platform.failed} failed</span>
									</div>
								{/if}
							</div>
							<!-- Progress bar -->
							<div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
								<div class="flex h-full">
									<div class="h-full bg-green-500" style:width="{platform.total > 0 ? (platform.published / platform.total) * 100 : 0}%"></div>
									<div class="h-full bg-red-500" style:width="{platform.total > 0 ? (platform.failed / platform.total) * 100 : 0}%"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-gray-500">No platform data available yet.</p>
			{/if}
		</div>

		<!-- Post Type Breakdown -->
		<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">By Content Type</h2>
			{#if analytics.byType.length > 0}
				<div class="space-y-3">
					{#each analytics.byType as type}
						{@const config = POST_TYPE_CONFIG[type.post_type as keyof typeof POST_TYPE_CONFIG]}
						{@const percentage = analytics.summary.total > 0 ? (type.count / analytics.summary.total) * 100 : 0}
						<div class="rounded-lg border border-gray-100 p-4">
							<div class="flex items-center justify-between mb-2">
								<span class="font-medium text-gray-900 capitalize">{config?.label ?? type.post_type}</span>
								<span class="text-sm text-gray-500">{type.count} posts ({Math.round(percentage)}%)</span>
							</div>
							<div class="h-2 overflow-hidden rounded-full bg-gray-100">
								<div
									class="h-full bg-svelte-500"
									style:width="{percentage}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-gray-500">No content type data available yet.</p>
			{/if}
		</div>
	</div>

	<!-- Activity Over Time -->
	<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold text-gray-900">Activity (Last 30 Days)</h2>
		{#if analytics.postsOverTime.length > 0 || analytics.publishedOverTime.length > 0}
			<div class="space-y-6">
				<!-- Simple bar chart representation -->
				<div>
					<div class="mb-2 flex items-center justify-between text-sm">
						<span class="text-gray-600">Posts Created</span>
						<span class="text-gray-900 font-medium">
							{analytics.postsOverTime.reduce((sum, d) => sum + d.count, 0)} total
						</span>
					</div>
					<div class="flex h-16 items-end gap-1">
						{#each analytics.postsOverTime as day}
							{@const maxCount = Math.max(...analytics.postsOverTime.map(d => d.count), 1)}
							{@const height = (day.count / maxCount) * 100}
							<div
								class="flex-1 rounded-t bg-svelte-500 opacity-70 hover:opacity-100 transition-opacity"
								style:height="{height}%"
								title="{day.date}: {day.count} posts"
							></div>
						{/each}
					</div>
					<div class="mt-1 flex justify-between text-xs text-gray-400">
						<span>{analytics.postsOverTime[0]?.date ?? ''}</span>
						<span>{analytics.postsOverTime[analytics.postsOverTime.length - 1]?.date ?? ''}</span>
					</div>
				</div>

				{#if analytics.publishedOverTime.length > 0}
					<div>
						<div class="mb-2 flex items-center justify-between text-sm">
							<span class="text-gray-600">Posts Published</span>
							<span class="text-gray-900 font-medium">
								{analytics.publishedOverTime.reduce((sum, d) => sum + d.count, 0)} total
							</span>
						</div>
						<div class="flex h-16 items-end gap-1">
							{#each analytics.publishedOverTime as day}
								{@const maxCount = Math.max(...analytics.publishedOverTime.map(d => d.count), 1)}
								{@const height = (day.count / maxCount) * 100}
								<div
									class="flex-1 rounded-t bg-green-500 opacity-70 hover:opacity-100 transition-opacity"
									style:height="{height}%"
									title="{day.date}: {day.count} published"
								></div>
							{/each}
						</div>
						<div class="mt-1 flex justify-between text-xs text-gray-400">
							<span>{analytics.publishedOverTime[0]?.date ?? ''}</span>
							<span>{analytics.publishedOverTime[analytics.publishedOverTime.length - 1]?.date ?? ''}</span>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-gray-500">No activity in the last 30 days.</p>
		{/if}
	</div>

	<!-- Recent Posts -->
	<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold text-gray-900">Recent Posts</h2>
		{#if analytics.recentPosts.length > 0}
			<div class="space-y-3">
				{#each analytics.recentPosts as post}
					<a
						href={`/admin/social/${post.id}`}
						class="block rounded-lg border border-gray-100 p-4 transition-colors hover:border-gray-200 hover:bg-gray-50"
					>
						<div class="flex items-start justify-between">
							<div class="flex-1 min-w-0">
								<p class="font-medium text-gray-900 truncate">{post.title}</p>
								<div class="mt-1 flex flex-wrap items-center gap-2 text-sm">
									<Badge
										color={POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG]?.color ?? 'default'}
										text={POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG]?.label ?? post.status}
									/>
									<span class="text-gray-400">·</span>
									<span class="text-gray-500 capitalize">{post.post_type}</span>
									<span class="text-gray-400">·</span>
									<span class="text-gray-500">{formatRelativeDate(post.created_at)}</span>
								</div>
							</div>
							<div class="ml-4 flex gap-1">
								{#each post.platforms as platform, i}
									{@const status = post.platform_statuses[i]}
									{@const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]}
									<span
										class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
										class:bg-green-100={status === 'published'}
										class:text-green-800={status === 'published'}
										class:bg-red-100={status === 'failed'}
										class:text-red-800={status === 'failed'}
										class:bg-gray-100={status !== 'published' && status !== 'failed'}
										class:text-gray-600={status !== 'published' && status !== 'failed'}
									>
										{config?.label ?? platform}
									</span>
								{/each}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-gray-500">No recent posts.</p>
		{/if}
	</div>
</div>
