<script lang="ts">
	import { page } from '$app/state'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank'
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft'
	import CaretRight from 'phosphor-svelte/lib/CaretRight'
	import List from 'phosphor-svelte/lib/List'
	import Plus from 'phosphor-svelte/lib/Plus'
	import { getCalendarPosts } from '../data.remote'
	import { POST_STATUS_CONFIG, PLATFORM_CONFIG } from '$lib/types/social'
	import type { SocialPostStatus, SocialPlatform } from '$lib/types/social'

	// Current date for navigation
	const sp = $derived(page.url.searchParams)
	const viewParam = $derived(sp.get('view') || 'month')
	const yearParam = $derived(parseInt(sp.get('year') || String(new Date().getFullYear())))
	const monthParam = $derived(parseInt(sp.get('month') || String(new Date().getMonth())))

	// Calendar state
	let view = $state<'month' | 'week'>('month')
	let currentDate = $state(new Date())

	// Initialize from URL params
	$effect(() => {
		view = viewParam === 'week' ? 'week' : 'month'
		currentDate = new Date(yearParam, monthParam, 1)
	})

	// Calculate date range for data fetching
	const dateRange = $derived.by(() => {
		const year = currentDate.getFullYear()
		const month = currentDate.getMonth()

		if (view === 'month') {
			// Get first day of month and last day of month
			// Include days from adjacent months that appear in the calendar grid
			const firstDay = new Date(year, month, 1)
			const lastDay = new Date(year, month + 1, 0)

			// Extend to include full weeks
			const startDate = new Date(firstDay)
			startDate.setDate(startDate.getDate() - startDate.getDay())

			const endDate = new Date(lastDay)
			endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

			return {
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString()
			}
		} else {
			// Week view - current week
			const startOfWeek = new Date(currentDate)
			startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
			startOfWeek.setHours(0, 0, 0, 0)

			const endOfWeek = new Date(startOfWeek)
			endOfWeek.setDate(startOfWeek.getDate() + 6)
			endOfWeek.setHours(23, 59, 59, 999)

			return {
				startDate: startOfWeek.toISOString(),
				endDate: endOfWeek.toISOString()
			}
		}
	})

	// Fetch posts for the current date range
	const posts = $derived(await getCalendarPosts(dateRange))

	// Group posts by date
	const postsByDate = $derived.by(() => {
		const grouped = new Map<string, typeof posts>()

		for (const post of posts) {
			const dateStr = post.scheduled_at || post.published_at
			if (dateStr) {
				const date = new Date(dateStr).toDateString()
				if (!grouped.has(date)) {
					grouped.set(date, [])
				}
				grouped.get(date)!.push(post)
			}
		}

		return grouped
	})

	// Calendar grid helpers
	const monthName = $derived(
		currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	)

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	const calendarDays = $derived.by(() => {
		const year = currentDate.getFullYear()
		const month = currentDate.getMonth()
		const firstDay = new Date(year, month, 1)
		const lastDay = new Date(year, month + 1, 0)
		const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = []

		// Add days from previous month
		const startPadding = firstDay.getDay()
		for (let i = startPadding - 1; i >= 0; i--) {
			const date = new Date(year, month, -i)
			days.push({ date, isCurrentMonth: false, isToday: false })
		}

		// Add days of current month
		const today = new Date()
		for (let i = 1; i <= lastDay.getDate(); i++) {
			const date = new Date(year, month, i)
			const isToday = date.toDateString() === today.toDateString()
			days.push({ date, isCurrentMonth: true, isToday })
		}

		// Add days from next month to complete the grid
		const endPadding = 6 - lastDay.getDay()
		for (let i = 1; i <= endPadding; i++) {
			const date = new Date(year, month + 1, i)
			days.push({ date, isCurrentMonth: false, isToday: false })
		}

		return days
	})

	const weekDates = $derived.by(() => {
		const startOfWeek = new Date(currentDate)
		startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
		const dates: { date: Date; isToday: boolean }[] = []
		const today = new Date()

		for (let i = 0; i < 7; i++) {
			const date = new Date(startOfWeek)
			date.setDate(startOfWeek.getDate() + i)
			dates.push({
				date,
				isToday: date.toDateString() === today.toDateString()
			})
		}

		return dates
	})

	// Navigation
	function navigate(direction: 'prev' | 'next') {
		if (view === 'month') {
			if (direction === 'prev') {
				currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
			} else {
				currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
			}
		} else {
			if (direction === 'prev') {
				currentDate = new Date(currentDate.setDate(currentDate.getDate() - 7))
			} else {
				currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7))
			}
		}
	}

	function goToToday() {
		currentDate = new Date()
	}

	function getStatusColor(status: SocialPostStatus): string {
		return POST_STATUS_CONFIG[status]?.color || 'default'
	}

	function getPostsForDate(date: Date) {
		return postsByDate.get(date.toDateString()) || []
	}

	function formatTime(dateStr: string) {
		return new Date(dateStr).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		})
	}
</script>

<div class="container mx-auto space-y-6 px-2 py-6">
	<PageHeader
		title="Social Calendar"
		description="View and manage scheduled social media posts"
		icon={CalendarBlank}
	>
		{#snippet actions()}
			<a
				href="/admin/social"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
			>
				<List class="h-4 w-4" weight="bold" />
				List View
			</a>
			<a
				href="/admin/social/new"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90"
			>
				<Plus class="h-4 w-4" weight="bold" />
				New Post
			</a>
		{/snippet}
	</PageHeader>

	<!-- Calendar Controls -->
	<div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => navigate('prev')}
				class="rounded-lg p-2 hover:bg-gray-100"
				aria-label="Previous"
			>
				<CaretLeft class="h-5 w-5" />
			</button>
			<button
				type="button"
				onclick={() => navigate('next')}
				class="rounded-lg p-2 hover:bg-gray-100"
				aria-label="Next"
			>
				<CaretRight class="h-5 w-5" />
			</button>
			<button
				type="button"
				onclick={goToToday}
				class="ml-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
			>
				Today
			</button>
			<h2 class="ml-4 text-lg font-semibold">{monthName}</h2>
		</div>

		<div class="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
			<button
				type="button"
				onclick={() => (view = 'month')}
				class="rounded-md px-3 py-1.5 text-sm transition-colors"
				class:bg-white={view === 'month'}
				class:shadow-sm={view === 'month'}
				class:font-medium={view === 'month'}
			>
				Month
			</button>
			<button
				type="button"
				onclick={() => (view = 'week')}
				class="rounded-md px-3 py-1.5 text-sm transition-colors"
				class:bg-white={view === 'week'}
				class:shadow-sm={view === 'week'}
				class:font-medium={view === 'week'}
			>
				Week
			</button>
		</div>
	</div>

	<!-- Month View -->
	{#if view === 'month'}
		<div class="overflow-hidden rounded-lg bg-white shadow-sm">
			<!-- Week day headers -->
			<div class="grid grid-cols-7 border-b bg-gray-50">
				{#each weekDays as day}
					<div class="px-2 py-3 text-center text-xs font-medium text-gray-500">{day}</div>
				{/each}
			</div>

			<!-- Calendar grid -->
			<div class="grid grid-cols-7">
				{#each calendarDays as { date, isCurrentMonth, isToday }, i}
					{@const dayPosts = getPostsForDate(date)}
					<div
						class="min-h-[120px] border-b border-r p-2"
						class:bg-gray-50={!isCurrentMonth}
						class:border-r-0={(i + 1) % 7 === 0}
					>
						<div class="mb-1 flex items-center justify-between">
							<span
								class="text-sm"
								class:text-gray-400={!isCurrentMonth}
								class:font-semibold={isToday}
								class:text-svelte-500={isToday}
							>
								{#if isToday}
									<span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-svelte-500 text-white">
										{date.getDate()}
									</span>
								{:else}
									{date.getDate()}
								{/if}
							</span>
							{#if isCurrentMonth}
								<a
									href={`/admin/social/new?date=${date.toISOString().split('T')[0]}`}
									class="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
									title="Create post for this date"
								>
									<Plus class="h-4 w-4" />
								</a>
							{/if}
						</div>

						<!-- Posts for this day -->
						<div class="space-y-1">
							{#each dayPosts.slice(0, 3) as post}
								<a
									href={`/admin/social/${post.id}`}
									class="block truncate rounded bg-gray-100 px-1.5 py-0.5 text-xs hover:bg-gray-200"
									class:bg-green-100={post.status === 'published'}
									class:bg-blue-100={post.status === 'scheduled'}
									class:bg-red-100={post.status === 'failed'}
									title={post.title}
								>
									{post.title}
								</a>
							{/each}
							{#if dayPosts.length > 3}
								<div class="text-xs text-gray-500">+{dayPosts.length - 3} more</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Week View -->
	{#if view === 'week'}
		<div class="overflow-hidden rounded-lg bg-white shadow-sm">
			<!-- Week day headers with dates -->
			<div class="grid grid-cols-7 border-b bg-gray-50">
				{#each weekDates as { date, isToday }, i}
					<div
						class="px-2 py-3 text-center"
						class:bg-svelte-50={isToday}
					>
						<div class="text-xs font-medium text-gray-500">{weekDays[i]}</div>
						<div
							class="mt-1 text-lg"
							class:font-semibold={isToday}
							class:text-svelte-500={isToday}
						>
							{date.getDate()}
						</div>
					</div>
				{/each}
			</div>

			<!-- Week content -->
			<div class="grid grid-cols-7">
				{#each weekDates as { date, isToday }}
					{@const dayPosts = getPostsForDate(date)}
					<div
						class={[
							'min-h-[400px] border-r p-2 last:border-r-0',
							isToday && 'bg-svelte-50/30'
						]}
					>
						<div class="mb-2 flex justify-end">
							<a
								href={`/admin/social/new?date=${date.toISOString().split('T')[0]}`}
								class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
								title="Create post for this date"
							>
								<Plus class="h-4 w-4" />
							</a>
						</div>

						<div class="space-y-2">
							{#each dayPosts as post}
								<a
									href={`/admin/social/${post.id}`}
									class="block rounded-lg border p-2 transition-shadow hover:shadow-md"
									class:border-green-200={post.status === 'published'}
									class:bg-green-50={post.status === 'published'}
									class:border-blue-200={post.status === 'scheduled'}
									class:bg-blue-50={post.status === 'scheduled'}
									class:border-red-200={post.status === 'failed'}
									class:bg-red-50={post.status === 'failed'}
								>
									<div class="mb-1 text-xs font-medium text-gray-500">
										{#if post.scheduled_at}
											{formatTime(post.scheduled_at)}
										{:else if post.published_at}
											{formatTime(post.published_at)}
										{/if}
									</div>
									<div class="text-sm font-medium line-clamp-2">{post.title}</div>
									<div class="mt-1.5 flex flex-wrap gap-1">
										{#each post.platforms as p}
											<span class="rounded bg-gray-200 px-1 py-0.5 text-[10px]">
												{PLATFORM_CONFIG[p.platform]?.label || p.platform}
											</span>
										{/each}
									</div>
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Legend -->
	<div class="flex items-center gap-4 text-sm text-gray-600">
		<span class="font-medium">Legend:</span>
		<div class="flex items-center gap-1.5">
			<span class="h-3 w-3 rounded bg-blue-100"></span>
			<span>Scheduled</span>
		</div>
		<div class="flex items-center gap-1.5">
			<span class="h-3 w-3 rounded bg-green-100"></span>
			<span>Published</span>
		</div>
		<div class="flex items-center gap-1.5">
			<span class="h-3 w-3 rounded bg-red-100"></span>
			<span>Failed</span>
		</div>
		<div class="flex items-center gap-1.5">
			<span class="h-3 w-3 rounded bg-gray-100"></span>
			<span>Draft</span>
		</div>
	</div>
</div>
