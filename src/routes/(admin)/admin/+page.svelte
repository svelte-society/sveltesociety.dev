<script>
	import StatCard from '$lib/ui/admin/StatCard.svelte'
	import QuickAction from '$lib/ui/admin/QuickAction.svelte'
	import { Users, FileText, ClockClockwise, CheckCircle, Plus, MagnifyingGlass, Tag, Megaphone } from 'phosphor-svelte'

	let { data } = $props()

	// Calculate some dynamic metrics for better UX
	const contentPerUser = data.users > 0 ? Math.round(data.content / data.users * 10) / 10 : 0
	const moderationPending = data.moderation_queue > 0
</script>

<!-- Welcome Header -->
<div class="mb-8">
	<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
	<p class="mt-2 text-gray-600">Welcome back! Here's what's happening with your community.</p>
</div>

<!-- Key Statistics -->
<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
	<StatCard
		title="Total Users"
		value={data.users.toLocaleString()}
		subtitle="Registered members"
		icon={Users}
		iconColor="text-svelte-500"
		href="/admin/users"
		testid="stat-users"
	/>
	<StatCard
		title="Total Content"
		value={data.content.toLocaleString()}
		subtitle="{contentPerUser} items per user"
		icon={FileText}
		iconColor="text-svelte-300"
		href="/admin/content"
		testid="stat-content"
	/>
	<StatCard
		title="Moderation Queue"
		value={data.moderation_queue}
		subtitle={moderationPending ? 'Items awaiting review' : 'All caught up!'}
		icon={ClockClockwise}
		iconColor={moderationPending ? 'text-orange-600' : 'text-svelte-500'}
		href="/admin/moderation"
		testid="stat-moderation"
	/>
	<StatCard
		title="Published"
		value={data.content - data.moderation_queue}
		subtitle="Live content items"
		icon={CheckCircle}
		iconColor="text-svelte-900"
		href="/admin/content?status=published"
		testid="stat-published"
	/>
</div>

<!-- Quick Actions -->
<div class="mb-8">
	<h2 class="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<QuickAction
			title="Add Content"
			description="Create new content item"
			icon={Plus}
			href="/admin/content/new"
			iconColor="text-svelte-500"
			bgColor="bg-svelte-50"
			testid="quick-action-add-content"
		/>
		<QuickAction
			title="Review Queue"
			description="Moderate pending submissions"
			icon={ClockClockwise}
			href="/admin/moderation"
			iconColor="text-orange-600"
			bgColor="bg-orange-50"
			testid="quick-action-moderation"
		/>
		<QuickAction
			title="Manage Tags"
			description="Organize content categories"
			icon={Tag}
			href="/admin/tags"
			iconColor="text-svelte-300"
			bgColor="bg-svelte-100"
			testid="quick-action-tags"
		/>
		<QuickAction
			title="Announcements"
			description="Post community updates"
			icon={Megaphone}
			href="/admin/announcements"
			iconColor="text-svelte-900"
			bgColor="bg-svelte-100"
			testid="quick-action-announcements"
		/>
	</div>
</div>

<!-- Recent Activity / Additional Metrics -->
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<!-- Content Overview -->
	<div class="rounded-xl bg-white p-6 shadow-sm">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold text-gray-900">Content Overview</h3>
			<a href="/admin/content" class="text-sm font-medium text-svelte-500 hover:text-svelte-900">
				View all →
			</a>
		</div>
		<div class="space-y-3">
			<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
				<span class="text-sm text-gray-600">Published</span>
				<span class="font-semibold text-svelte-500">{data.content - data.moderation_queue}</span>
			</div>
			<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
				<span class="text-sm text-gray-600">Pending Review</span>
				<span class="font-semibold text-orange-600">{data.moderation_queue}</span>
			</div>
			<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
				<span class="text-sm text-gray-600">Total Items</span>
				<span class="font-semibold text-gray-900">{data.content}</span>
			</div>
		</div>
	</div>

	<!-- System Health -->
	<div class="rounded-xl bg-white p-6 shadow-sm">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold text-gray-900">System Status</h3>
			<span class="inline-flex items-center rounded-full bg-svelte-100 px-3 py-1 text-xs font-medium text-svelte-900">
				<span class="mr-1.5 h-2 w-2 rounded-full bg-svelte-500"></span>
				All systems operational
			</span>
		</div>
		<div class="space-y-3">
			<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
				<span class="text-sm text-gray-600">Active Users</span>
				<span class="font-semibold text-gray-900">{data.users}</span>
			</div>
			<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
				<span class="text-sm text-gray-600">Avg. Content per User</span>
				<span class="font-semibold text-gray-900">{contentPerUser}</span>
			</div>
			<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
				<span class="text-sm text-gray-600">Moderation Rate</span>
				<span class="font-semibold text-gray-900">
					{data.content > 0 ? Math.round((1 - data.moderation_queue / data.content) * 100) : 100}%
				</span>
			</div>
		</div>
	</div>
</div>
