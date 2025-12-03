<script>
	import StatCard from '$lib/ui/admin/StatCard.svelte'
	import QuickAction from '$lib/ui/admin/QuickAction.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import {
		Users,
		FileText,
		ClockClockwise,
		CheckCircle,
		Plus,
		Tag,
		Megaphone,
		ChartLine
	} from 'phosphor-svelte'

	let { data } = $props()
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Dashboard"
		description="Welcome back! Here's what's happening with our community."
		icon={ChartLine}
	/>

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
			icon={FileText}
			iconColor="text-svelte-300"
			href="/admin/content"
			testid="stat-content"
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
</div>
