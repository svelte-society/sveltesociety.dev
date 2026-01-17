<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import GearSix from 'phosphor-svelte/lib/GearSix'
	import Clock from 'phosphor-svelte/lib/Clock'
	import Pause from 'phosphor-svelte/lib/Pause'
	import Play from 'phosphor-svelte/lib/Play'
	import { getQueueSettings, updateQueueSettings, toggleQueuePaused } from '../data.remote'
	import { PLATFORM_CONFIG, PLATFORMS } from '$lib/types/social'
	import type { SocialPlatform, SocialQueueSettings } from '$lib/types/social'

	// Fetch queue settings
	const settings = $derived(await getQueueSettings())

	// Get settings by platform (with fallback to empty)
	function getSettingsForPlatform(platform: SocialPlatform | 'global'): SocialQueueSettings | undefined {
		return settings.find((s) => s.platform === platform)
	}

	// Derived global settings for template use
	const globalSettings = $derived(getSettingsForPlatform('global'))

	// Format posting times for display
	function formatTimes(times: string[]): string {
		return times
			.map((t) => {
				const [h, m] = t.split(':')
				const hour = parseInt(h)
				const ampm = hour >= 12 ? 'PM' : 'AM'
				const hour12 = hour % 12 || 12
				return `${hour12}:${m} ${ampm}`
			})
			.join(', ')
	}

	// Format posting days for display
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	function formatDays(days: number[]): string {
		return days.map((d) => dayNames[d]).join(', ')
	}

	// Timezone options
	const timezoneOptions = [
		{ value: 'America/New_York', label: 'Eastern Time (ET)' },
		{ value: 'America/Chicago', label: 'Central Time (CT)' },
		{ value: 'America/Denver', label: 'Mountain Time (MT)' },
		{ value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
		{ value: 'Europe/London', label: 'London (GMT/BST)' },
		{ value: 'Europe/Paris', label: 'Central European (CET)' },
		{ value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
		{ value: 'UTC', label: 'UTC' }
	]

	// Edit state
	let editingPlatform = $state<SocialPlatform | 'global' | null>(null)
	let editForm = $state({
		posting_times: '',
		posting_days: '',
		min_gap_minutes: 60,
		timezone: 'America/New_York'
	})

	function startEdit(platform: SocialPlatform | 'global') {
		const s = getSettingsForPlatform(platform)
		editForm = {
			posting_times: s?.posting_times.join(', ') ?? '09:00, 12:00, 15:00, 18:00',
			posting_days: s?.posting_days.join(', ') ?? '1, 2, 3, 4, 5',
			min_gap_minutes: s?.min_gap_minutes ?? 60,
			timezone: s?.timezone ?? 'America/New_York'
		}
		editingPlatform = platform
	}

	function cancelEdit() {
		editingPlatform = null
	}

	function parseTimes(input: string): string[] {
		return input
			.split(',')
			.map((t) => t.trim())
			.filter((t) => /^\d{1,2}:\d{2}$/.test(t))
	}

	function parseDays(input: string): number[] {
		return input
			.split(',')
			.map((d) => parseInt(d.trim()))
			.filter((d) => !isNaN(d) && d >= 0 && d <= 6)
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Queue Settings"
		description="Configure posting times, schedules, and queue behavior"
		icon={GearSix}
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

	<!-- Global Settings -->
	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">Global Queue Settings</p>
				</div>
				{#if globalSettings}
					<form {...toggleQueuePaused}>
						<input type="hidden" name="platform" value="global" />
						<input type="hidden" name="is_paused" value={globalSettings.is_paused ? '' : 'on'} />
						<Button
							type="submit"
							variant={globalSettings.is_paused ? 'primary' : 'secondary'}
							size="sm"
						>
							{#if globalSettings.is_paused}
								<Play class="mr-1 h-4 w-4" weight="bold" />
								Resume Queue
							{:else}
								<Pause class="mr-1 h-4 w-4" weight="bold" />
								Pause Queue
							{/if}
						</Button>
					</form>
				{/if}
			</div>
		</div>

		<div class="p-8">
			{#if globalSettings}
				{#if editingPlatform === 'global'}
					<form {...updateQueueSettings} class="space-y-6">
						<input type="hidden" name="platform" value="global" />
						<input
							type="hidden"
							name="posting_times"
							value={JSON.stringify(parseTimes(editForm.posting_times))}
						/>
						<input
							type="hidden"
							name="posting_days"
							value={JSON.stringify(parseDays(editForm.posting_days))}
						/>

						<div class="grid gap-6 sm:grid-cols-2">
							<Input
								label="Posting Times (24h format, comma-separated)"
								name="posting_times_display"
								bind:value={editForm.posting_times}
								placeholder="09:00, 12:00, 15:00, 18:00"
								description="e.g., 09:00, 12:00, 15:00, 18:00"
							/>
							<Input
								label="Posting Days (0=Sun, 6=Sat, comma-separated)"
								name="posting_days_display"
								bind:value={editForm.posting_days}
								placeholder="1, 2, 3, 4, 5"
								description="e.g., 1, 2, 3, 4, 5 for Mon-Fri"
							/>
						</div>

						<div class="grid gap-6 sm:grid-cols-2">
							<Input
								label="Minimum Gap Between Posts (minutes)"
								name="min_gap_minutes"
								type="number"
								bind:value={editForm.min_gap_minutes}
								min={0}
							/>
							<Select
								label="Timezone"
								name="timezone"
								options={timezoneOptions}
								value={editForm.timezone}
								onchange={(e) => (editForm.timezone = (e.target as HTMLSelectElement).value)}
							/>
						</div>

						{#if updateQueueSettings.result?.success}
							<div class="rounded-lg bg-green-50 p-4 text-green-800">
								{updateQueueSettings.result.text}
							</div>
						{/if}

						{#if updateQueueSettings.result && !updateQueueSettings.result.success}
							<div class="rounded-lg bg-red-50 p-4 text-red-800">
								{updateQueueSettings.result.text}
							</div>
						{/if}

						<div class="flex gap-3">
							<Button type="submit" disabled={!!updateQueueSettings.pending}>
								{updateQueueSettings.pending ? 'Saving...' : 'Save Changes'}
							</Button>
							<Button type="button" variant="secondary" onclick={cancelEdit}>
								Cancel
							</Button>
						</div>
					</form>
				{:else}
					<div class="space-y-4">
						<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div>
								<p class="text-xs font-medium text-gray-500">Posting Times</p>
								<p class="mt-1 text-sm">
									{formatTimes(globalSettings.posting_times) || 'Not configured'}
								</p>
							</div>
							<div>
								<p class="text-xs font-medium text-gray-500">Posting Days</p>
								<p class="mt-1 text-sm">
									{formatDays(globalSettings.posting_days) || 'Not configured'}
								</p>
							</div>
							<div>
								<p class="text-xs font-medium text-gray-500">Minimum Gap</p>
								<p class="mt-1 text-sm">{globalSettings.min_gap_minutes} minutes</p>
							</div>
							<div>
								<p class="text-xs font-medium text-gray-500">Timezone</p>
								<p class="mt-1 text-sm">{globalSettings.timezone}</p>
							</div>
						</div>

						<div class="flex items-center gap-2 pt-2">
							<span
								class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
								class:bg-green-100={!globalSettings.is_paused}
								class:text-green-800={!globalSettings.is_paused}
								class:bg-yellow-100={globalSettings.is_paused}
								class:text-yellow-800={globalSettings.is_paused}
							>
								<Clock class="h-3 w-3" />
								{globalSettings.is_paused ? 'Paused' : 'Active'}
							</span>
						</div>

						<Button variant="secondary" size="sm" onclick={() => startEdit('global')}>
							Edit Settings
						</Button>
					</div>
				{/if}
			{:else}
				<p class="text-sm text-gray-500">No global settings configured yet.</p>
				<Button variant="secondary" size="sm" onclick={() => startEdit('global')} class="mt-4">
					Configure Settings
				</Button>
			{/if}
		</div>
	</div>

	<!-- Platform-Specific Settings -->
	<div class="space-y-6">
		<h2 class="text-lg font-semibold text-gray-900">Platform-Specific Overrides</h2>
		<p class="text-sm text-gray-600">
			Override global settings for specific platforms. If not configured, the global settings will be
			used.
		</p>

		<div class="grid gap-6 lg:grid-cols-3">
			{#each PLATFORMS as platform}
				{@const platformSettings = getSettingsForPlatform(platform)}
				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="font-medium text-gray-900">
							{PLATFORM_CONFIG[platform].label}
						</h3>
						{#if platformSettings}
							<span
								class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
								class:bg-green-100={!platformSettings.is_paused}
								class:text-green-700={!platformSettings.is_paused}
								class:bg-yellow-100={platformSettings.is_paused}
								class:text-yellow-700={platformSettings.is_paused}
							>
								{platformSettings.is_paused ? 'Paused' : 'Active'}
							</span>
						{:else}
							<span class="text-xs text-gray-400">Using global</span>
						{/if}
					</div>

					{#if platformSettings}
						{#if editingPlatform === platform}
							<form {...updateQueueSettings} class="space-y-4">
								<input type="hidden" name="platform" value={platform} />
								<input
									type="hidden"
									name="posting_times"
									value={JSON.stringify(parseTimes(editForm.posting_times))}
								/>
								<input
									type="hidden"
									name="posting_days"
									value={JSON.stringify(parseDays(editForm.posting_days))}
								/>

								<Input
									label="Posting Times"
									name="posting_times_display"
									bind:value={editForm.posting_times}
									placeholder="09:00, 12:00"
								/>
								<Input
									label="Posting Days"
									name="posting_days_display"
									bind:value={editForm.posting_days}
									placeholder="1, 2, 3, 4, 5"
								/>
								<Input
									label="Min Gap (min)"
									name="min_gap_minutes"
									type="number"
									bind:value={editForm.min_gap_minutes}
								/>

								<div class="flex gap-2">
									<Button type="submit" size="sm" disabled={!!updateQueueSettings.pending}>
										Save
									</Button>
									<Button type="button" variant="secondary" size="sm" onclick={cancelEdit}>
										Cancel
									</Button>
								</div>
							</form>
						{:else}
							<div class="space-y-2 text-sm">
								<p>
									<span class="text-gray-500">Times:</span>{' '}
									{formatTimes(platformSettings.posting_times)}
								</p>
								<p>
									<span class="text-gray-500">Days:</span>{' '}
									{formatDays(platformSettings.posting_days)}
								</p>
								<p>
									<span class="text-gray-500">Gap:</span>{' '}
									{platformSettings.min_gap_minutes} min
								</p>
							</div>

							<div class="mt-4 flex gap-2">
								<Button
									variant="secondary"
									size="sm"
									onclick={() => startEdit(platform)}
								>
									Edit
								</Button>
								<form {...toggleQueuePaused}>
									<input type="hidden" name="platform" value={platform} />
									<input
										type="hidden"
										name="is_paused"
										value={platformSettings.is_paused ? '' : 'on'}
									/>
									<Button
										type="submit"
										variant={platformSettings.is_paused ? 'primary' : 'secondary'}
										size="sm"
									>
										{platformSettings.is_paused ? 'Resume' : 'Pause'}
									</Button>
								</form>
							</div>
						{/if}
					{:else}
						<p class="mb-4 text-sm text-gray-500">Using global settings</p>
						<Button variant="secondary" size="sm" onclick={() => startEdit(platform)}>
							Add Override
						</Button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
