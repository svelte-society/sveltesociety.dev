<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date'
	import Table from '$lib/ui/admin/Table.svelte'
	import { Actions, Action } from '$lib/ui/admin/Actions'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass'
	import Select from '$lib/ui/Select.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import {
		getSponsors,
		activateSponsor,
		pauseSponsor,
		cancelSponsor,
		type SponsorWithSubscription
	} from './data.remote'
	import Handshake from 'phosphor-svelte/lib/Handshake'
	import Play from 'phosphor-svelte/lib/Play'
	import Pause from 'phosphor-svelte/lib/Pause'
	import X from 'phosphor-svelte/lib/X'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

	let searchQuery = $state(page.url.searchParams.get('search') || '')
	let selectedStatus = $state(page.url.searchParams.get('status') || 'all')
	let currentPage = $state(parseInt(page.url.searchParams.get('page') || '1'))

	let debounceTimer: ReturnType<typeof setTimeout> | null = null
	let debouncedSearch = $state(page.url.searchParams.get('search') || '')

	const statusOptions = [
		{ value: 'all', label: 'All Statuses' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'active', label: 'Active' },
		{ value: 'paused', label: 'Paused' },
		{ value: 'expired', label: 'Expired' },
		{ value: 'cancelled', label: 'Cancelled' }
	]

	function handleSearchInput(value: string) {
		searchQuery = value

		if (debounceTimer) {
			clearTimeout(debounceTimer)
		}

		debounceTimer = setTimeout(() => {
			debouncedSearch = value
			currentPage = 1
			updateURL()
		}, 300)
	}

	function handleStatusChange(value: string) {
		selectedStatus = value
		currentPage = 1
		updateURL()
	}

	function updateURL() {
		const params = new URLSearchParams()
		if (debouncedSearch) params.set('search', debouncedSearch)
		if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus)
		if (currentPage > 1) params.set('page', currentPage.toString())

		goto(`?${params.toString()}`, { replaceState: true, noScroll: true, keepFocus: true })
	}

	const { sponsors, pagination } = $derived(
		await getSponsors({
			search: debouncedSearch || undefined,
			status: selectedStatus as
				| 'pending'
				| 'active'
				| 'paused'
				| 'expired'
				| 'cancelled'
				| 'all',
			page: currentPage
		})
	)

	const colorMap = new Map([
		['pending', 'warning'],
		['active', 'success'],
		['paused', 'info'],
		['expired', 'danger'],
		['cancelled', 'danger']
	])

	function getStatusColor(status: string): string {
		return colorMap.get(status) || 'default'
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Sponsors"
		description="Manage sponsor subscriptions and profiles"
		icon={Handshake}
	/>

	<div class="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<MagnifyingGlass class="h-5 w-5 text-gray-500" />
			</div>
			<input
				type="text"
				value={searchQuery}
				oninput={(e) => handleSearchInput(e.currentTarget.value)}
				placeholder="Search sponsors..."
				class="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-10 text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-svelte-500 focus:ring-2 focus:ring-svelte-500 focus:ring-offset-0 sm:text-sm"
			/>
		</div>

		<div class="w-full sm:w-48">
			<Select
				name="status"
				value={selectedStatus}
				options={statusOptions}
				onchange={handleStatusChange}
			/>
		</div>
	</div>

	{#if sponsors}
		<Table action={true} data={sponsors} emptyMessage="No sponsors found.">
			{#snippet header(classes)}
				<th scope="col" class={classes}>Company</th>
				<th scope="col" class={[classes, 'text-center']}>Status</th>
				<th scope="col" class={classes}>Tier</th>
				<th scope="col" class={classes}>Email</th>
				<th scope="col" class={classes}>Created</th>
			{/snippet}
			{#snippet row(item: SponsorWithSubscription, classes)}
				<td class="whitespace-nowrap {classes}">
					<a href={`/admin/sponsors/${item.id}`} class="flex items-center gap-3">
						<img
							src={getCachedImageWithPreset(item.logo_url, 'thumbnail')}
							alt="{item.company_name} logo"
							class="h-10 w-10 rounded border border-gray-200 object-contain"
						/>
						<div>
							<div class="font-medium text-gray-900">{item.company_name}</div>
							<div class="max-w-xs truncate text-xs text-gray-500">{item.tagline}</div>
						</div>
					</a>
				</td>
				<td class={classes}>
					<a href={`/admin/sponsors/${item.id}`}>
						<Badge color={getStatusColor(item.status)} text={item.status} />
					</a>
				</td>
				<td class={classes}>
					<a href={`/admin/sponsors/${item.id}`}>
						{#if item.tier_name}
							<span class="text-sm">{item.tier_name}</span>
							{#if item.billing_type}
								<span class="ml-1 text-xs text-gray-500">({item.billing_type})</span>
							{/if}
						{:else}
							<span class="text-gray-400">-</span>
						{/if}
					</a>
				</td>
				<td class={classes}>
					<a href={`/admin/sponsors/${item.id}`}>
						{item.contact_email || '-'}
					</a>
				</td>
				<td class={classes}>
					<a href={`/admin/sponsors/${item.id}`}>
						{formatRelativeDate(item.created_at)}
					</a>
				</td>
			{/snippet}
			{#snippet actionCell(item: SponsorWithSubscription)}
				<Actions id={item.id}>
					<Action.Edit href={`/admin/sponsors/${item.id}`} />
					{#if item.status === 'pending'}
						<Action.Button
							icon={Play}
							form={activateSponsor}
							variant="success"
							tooltip="Activate"
							testId="activate-sponsor-button"
						/>
					{:else if item.status === 'active'}
						<Action.Button
							icon={Pause}
							form={pauseSponsor}
							variant="warning"
							tooltip="Pause"
							testId="pause-sponsor-button"
						/>
					{:else if item.status === 'paused'}
						<Action.Button
							icon={Play}
							form={activateSponsor}
							variant="success"
							tooltip="Reactivate"
							testId="reactivate-sponsor-button"
						/>
					{/if}
					{#if item.status !== 'cancelled' && item.status !== 'expired'}
						<Action.Button
							icon={X}
							form={cancelSponsor}
							variant="danger"
							tooltip="Cancel"
							testId="cancel-sponsor-button"
						/>
					{/if}
				</Actions>
			{/snippet}
		</Table>

		{#if pagination}
			<Pagination count={pagination.count} perPage={pagination.perPage} />
		{/if}
	{/if}
</div>
