<script lang="ts">
	import { Calendar, DayGrid } from '@event-calendar/core'

	interface Post {
		id: string
		contentTitle: string
		platform: string
		scheduledAt: Date | null
	}

	interface Props {
		posts: Post[]
		onPostClick?: (post: Post) => void
	}

	let { posts, onPostClick }: Props = $props()

	function getPlatformColor(platform: string) {
		switch (platform) {
			case 'bluesky':
				return '#3b82f6' // blue-500
			case 'nostr':
				return '#eab308' // yellow-500
			case 'linkedin':
				return '#22c55e' // green-500
			default:
				return '#6b7280' // gray-500
		}
	}

	// Transform posts to calendar events
	const events = $derived(
		posts
			.filter((post) => post.scheduledAt !== null)
			.map((post) => ({
				id: post.id,
				title: post.contentTitle,
				start: post.scheduledAt,
				end: post.scheduledAt, // Same as start for point-in-time events
				backgroundColor: getPlatformColor(post.platform),
				extendedProps: {
					platform: post.platform,
					post: post
				}
			}))
	)

	const options = $derived({
		view: 'dayGridMonth',
		events: events,
		height: 'auto',
		headerToolbar: {
			start: 'prev,next today',
			center: 'title',
			end: ''
		},
		buttonText: {
			today: 'Today'
		},
		eventClick: (info: any) => {
			if (onPostClick && info.event.extendedProps?.post) {
				onPostClick(info.event.extendedProps.post)
			}
		},
		eventTimeFormat: {
			hour: 'numeric',
			minute: '2-digit',
			meridiem: 'short'
		},
		displayEventTime: true,
		displayEventEnd: false,
		dayMaxEvents: 3,
		moreLinkText: (n: number) => `+${n} more`
	})
</script>

<div class="rounded-lg bg-white p-4 shadow-sm">
	<Calendar plugins={[DayGrid]} {options} />
</div>

<style>
	:global(.ec) {
		--ec-bg-color: #ffffff;
		--ec-border-color: #e5e7eb;
		--ec-text-color: #1f2937;
		--ec-button-bg-color: #f3f4f6;
		--ec-button-border-color: #d1d5db;
		--ec-button-text-color: #374151;
		--ec-button-active-bg-color: #e5e7eb;
		--ec-button-active-text-color: #111827;
		--ec-today-bg-color: #dbeafe;
		--ec-highlight-color: #3b82f6;
	}

	:global(.ec-toolbar) {
		margin-bottom: 1rem;
	}

	:global(.ec-button) {
		font-size: 0.875rem;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
	}

	:global(.ec-title) {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
	}

	:global(.ec-day-head) {
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
		padding: 0.5rem;
	}

	:global(.ec-day) {
		border-color: #e5e7eb;
	}

	:global(.ec-event) {
		font-size: 0.75rem;
		border-radius: 0.25rem;
		padding: 0.125rem 0.25rem;
		margin-bottom: 0.125rem;
	}

	:global(.ec-event-title) {
		font-weight: 500;
	}

	:global(.ec-event-time) {
		font-size: 0.625rem;
		opacity: 0.8;
	}
</style>
