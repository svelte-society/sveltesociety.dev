<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Table from '$lib/ui/admin/Table.svelte'
	import AdminList from '$lib/ui/admin/AdminList.svelte'
	import { getAccounts, deleteAccount } from './data.remote'

	const accounts = $derived(await getAccounts())

	const platformBadgeColor = (platform: string) => {
		switch (platform) {
			case 'bluesky':
				return 'info'
			case 'nostr':
				return 'warning'
			case 'linkedin':
				return 'success'
			default:
				return 'default'
		}
	}
</script>

<AdminList
	title="Social Media Accounts"
	newHref="/admin/social/accounts/new"
	newLabel="Connect Account"
>
	{#if accounts.length === 0}
		<div class="rounded-md bg-gray-50 p-8 text-center">
			<p class="mb-4 text-gray-600">No accounts connected yet</p>
			<Button variant="primary" href="/admin/social/accounts/new">
				Connect Your First Account
			</Button>
		</div>
	{:else}
		<Table action={true} data={accounts}>
			{#snippet header(classes)}
				<th scope="col" class={classes}>Platform</th>
				<th scope="col" class={classes}>Account</th>
				<th scope="col" class={classes}>Handle</th>
				<th scope="col" class={classes}>Status</th>
				<th scope="col" class={classes}>Default</th>
			{/snippet}
			{#snippet row(account, classes)}
				<td class={classes}>
					<Badge text={account.platform} color={platformBadgeColor(account.platform)} />
				</td>
				<td class={classes}>
					<span class="font-medium text-gray-900">{account.account_name}</span>
				</td>
				<td class={classes}>
					<span class="text-gray-600">@{account.account_handle}</span>
				</td>
				<td class={classes}>
					{#if account.is_active}
						<Badge text="Active" color="success" />
					{:else}
						<Badge text="Inactive" color="default" />
					{/if}
				</td>
				<td class={classes}>
					{#if account.is_default}
						<Badge text="Default" color="primary" />
					{:else}
						<span class="text-gray-400">-</span>
					{/if}
				</td>
			{/snippet}
			{#snippet actionCell(account)}
				<form {...deleteAccount.for(account.id)}>
					<Button
						size="sm"
						variant="error"
						name="id"
						value={account.id}
						type="submit"
						disabled={!!deleteAccount.pending}
					>
						{deleteAccount.pending ? 'Deleting...' : 'Delete'}
					</Button>
				</form>
			{/snippet}
		</Table>
	{/if}
</AdminList>
