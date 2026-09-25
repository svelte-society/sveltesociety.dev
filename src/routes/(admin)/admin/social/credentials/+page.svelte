<script lang="ts">
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import { DialogTrigger, ConfirmDialog } from '$lib/ui/Dialog'
	import Key from 'phosphor-svelte/lib/Key'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Trash from 'phosphor-svelte/lib/Trash'
	import Warning from 'phosphor-svelte/lib/Warning'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import XCircle from 'phosphor-svelte/lib/XCircle'
	import {
		getCredentials,
		checkEncryption,
		createCredential,
		updateCredential,
		deleteCredential,
		toggleCredentialActive
	} from '../data.remote'
	import { PLATFORM_CONFIG, PLATFORMS } from '$lib/types/social'
	import type { SocialPlatform } from '$lib/types/social'

	// Fetch data
	const credentials = $derived(await getCredentials())
	const encryption = $derived(await checkEncryption())

	// UI state
	let showAddForm = $state(false)
	let editingId = $state<string | null>(null)
	let deleteDialogOpen = $state(false)
	let deleteCredentialId = $state<string | null>(null)

	// Add form state
	let newPlatform = $state<SocialPlatform>('twitter')
	let newAccountName = $state('')
	// Twitter
	let newTwitterAccessToken = $state('')
	let newTwitterRefreshToken = $state('')
	// Bluesky
	let newBlueskyIdentifier = $state('')
	let newBlueskyPassword = $state('')
	// LinkedIn
	let newLinkedinAccessToken = $state('')
	let newLinkedinRefreshToken = $state('')

	// Edit form state
	let editAccountName = $state('')
	// Twitter
	let editTwitterAccessToken = $state('')
	let editTwitterRefreshToken = $state('')
	// Bluesky
	let editBlueskyIdentifier = $state('')
	let editBlueskyPassword = $state('')
	// LinkedIn
	let editLinkedinAccessToken = $state('')
	let editLinkedinRefreshToken = $state('')

	const platformOptions = PLATFORMS.map((p) => ({
		value: p,
		label: PLATFORM_CONFIG[p].label
	}))

	function resetAddForm() {
		newPlatform = 'twitter'
		newAccountName = ''
		newTwitterAccessToken = ''
		newTwitterRefreshToken = ''
		newBlueskyIdentifier = ''
		newBlueskyPassword = ''
		newLinkedinAccessToken = ''
		newLinkedinRefreshToken = ''
		showAddForm = false
	}

	// Reset form when credentials are successfully added
	$effect(() => {
		if (createCredential.result?.success) {
			// Reset form fields and hide the form
			newPlatform = 'twitter'
			newAccountName = ''
			newTwitterAccessToken = ''
			newTwitterRefreshToken = ''
			newBlueskyIdentifier = ''
			newBlueskyPassword = ''
			newLinkedinAccessToken = ''
			newLinkedinRefreshToken = ''
			showAddForm = false
		}
	})

	// Reset edit form when credentials are successfully updated
	$effect(() => {
		if (updateCredential.result?.success) {
			editingId = null
		}
	})

	function startEdit(cred: (typeof credentials)[0]) {
		editingId = cred.id
		editAccountName = cred.account_name
		// Clear all credential fields (they need to be re-entered for security)
		editTwitterAccessToken = ''
		editTwitterRefreshToken = ''
		editBlueskyIdentifier = ''
		editBlueskyPassword = ''
		editLinkedinAccessToken = ''
		editLinkedinRefreshToken = ''
	}

	function cancelEdit() {
		editingId = null
	}

	function openDeleteDialog(id: string) {
		deleteCredentialId = id
		deleteDialogOpen = true
	}

	// Get grouped credentials by platform
	const groupedCredentials = $derived(
		PLATFORMS.map((platform) => ({
			platform,
			label: PLATFORM_CONFIG[platform].label,
			credentials: credentials.filter((c) => c.platform === platform)
		}))
	)

	// Isolated delete form for each credential
	function getDeleteForm(id: string) {
		return deleteCredential.for(id)
	}
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Platform Credentials"
		description="Manage API credentials for social media platforms"
		icon={Key}
	>
		{#snippet actions()}
			<a
				href="/admin/social"
				class="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
				data-testid="back-button"
			>
				Back to Posts
			</a>
		{/snippet}
	</PageHeader>

	<!-- Encryption Warning -->
	{#if !encryption.available}
		<div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
			<div class="flex items-start gap-3">
				<Warning class="h-6 w-6 flex-shrink-0 text-amber-600" weight="fill" />
				<div>
					<h3 class="font-medium text-amber-900">Encryption Not Configured</h3>
					<p class="mt-1 text-sm text-amber-700">
						To store credentials securely, you need to set the <code
							class="rounded bg-amber-100 px-1">SOCIAL_CREDENTIALS_KEY</code
						> environment variable. Generate a key with:
					</p>
					<pre class="mt-2 rounded bg-amber-100 p-2 text-xs text-amber-800">openssl rand -hex 32</pre>
				</div>
			</div>
		</div>
	{/if}

	<!-- Add New Credential -->
	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
					<p class="text-sm font-medium text-gray-600">Add New Credentials</p>
				</div>
				{#if !showAddForm}
					<Button
						variant="primary"
						size="sm"
						onclick={() => (showAddForm = true)}
						disabled={!encryption.available}
						data-testid="add-credential-button"
					>
						<Plus class="mr-1 h-4 w-4" />
						Add Credentials
					</Button>
				{/if}
			</div>
		</div>

		<!-- Success message shown even after form closes -->
		{#if createCredential.result?.success && !showAddForm}
			<div class="p-8">
				<div class="rounded-lg bg-green-50 p-4 text-green-800" data-testid="add-success-message">
					{createCredential.result.text}
				</div>
			</div>
		{/if}

		{#if showAddForm}
			<div class="p-8">
				<form {...createCredential} class="space-y-6">
					<div class="grid gap-6 sm:grid-cols-2">
						<Select
							label="Platform"
							name="platform"
							options={platformOptions}
							bind:value={newPlatform}
							data-testid="select-platform"
						/>
						<Input
							label="Account Name"
							name="account_name"
							bind:value={newAccountName}
							placeholder="e.g., @sveltesociety"
							required
							data-testid="input-account-name"
						/>
					</div>

					<!-- Platform-specific fields -->
					{#if newPlatform === 'twitter'}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<h4 class="mb-4 font-medium text-gray-900">Twitter/X Credentials</h4>
							<p class="mb-4 text-sm text-gray-600">
								Enter your Twitter API v2 OAuth 2.0 credentials. You can get these from the <a
									href="https://developer.twitter.com/en/portal/dashboard"
									target="_blank"
									class="text-svelte-500 hover:underline">Twitter Developer Portal</a
								>.
							</p>
							<div class="grid gap-4">
								<Input
									label="Access Token"
									name="twitter_access_token"
									type="password"
									bind:value={newTwitterAccessToken}
									placeholder="Enter access token"
									required
									data-testid="input-twitter-access-token"
								/>
								<Input
									label="Refresh Token (optional)"
									name="twitter_refresh_token"
									type="password"
									bind:value={newTwitterRefreshToken}
									placeholder="Enter refresh token"
									data-testid="input-twitter-refresh-token"
								/>
							</div>
						</div>
					{:else if newPlatform === 'bluesky'}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<h4 class="mb-4 font-medium text-gray-900">Bluesky Credentials</h4>
							<p class="mb-4 text-sm text-gray-600">
								Enter your Bluesky handle and an <a
									href="https://bsky.app/settings/app-passwords"
									target="_blank"
									class="text-svelte-500 hover:underline">App Password</a
								>. Do not use your main account password.
							</p>
							<div class="grid gap-4 sm:grid-cols-2">
								<Input
									label="Handle or DID"
									name="bluesky_identifier"
									bind:value={newBlueskyIdentifier}
									placeholder="e.g., sveltesociety.bsky.social"
									required
									data-testid="input-bluesky-identifier"
								/>
								<Input
									label="App Password"
									name="bluesky_password"
									type="password"
									bind:value={newBlueskyPassword}
									placeholder="Enter app password"
									required
									data-testid="input-bluesky-password"
								/>
							</div>
						</div>
					{:else if newPlatform === 'linkedin'}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<h4 class="mb-4 font-medium text-gray-900">LinkedIn Credentials</h4>
							<p class="mb-4 text-sm text-gray-600">
								Enter your LinkedIn OAuth 2.0 credentials. You can get these from the <a
									href="https://www.linkedin.com/developers/apps"
									target="_blank"
									class="text-svelte-500 hover:underline">LinkedIn Developer Portal</a
								>.
							</p>
							<div class="grid gap-4">
								<Input
									label="Access Token"
									name="linkedin_access_token"
									type="password"
									bind:value={newLinkedinAccessToken}
									placeholder="Enter access token"
									required
									data-testid="input-linkedin-access-token"
								/>
								<Input
									label="Refresh Token (optional)"
									name="linkedin_refresh_token"
									type="password"
									bind:value={newLinkedinRefreshToken}
									placeholder="Enter refresh token"
									data-testid="input-linkedin-refresh-token"
								/>
							</div>
						</div>
					{/if}

					{#if createCredential.result?.success}
						<div class="rounded-lg bg-green-50 p-4 text-green-800">
							{createCredential.result.text}
						</div>
					{/if}

					{#if createCredential.result && !createCredential.result.success}
						<div class="rounded-lg bg-red-50 p-4 text-red-800">
							{createCredential.result.text}
						</div>
					{/if}

					<div class="flex gap-3">
						<Button type="submit" disabled={!!createCredential.pending} data-testid="submit-button">
							{createCredential.pending ? 'Adding...' : 'Add Credentials'}
						</Button>
						<Button type="button" variant="secondary" onclick={resetAddForm}>Cancel</Button>
					</div>
				</form>
			</div>
		{/if}
	</div>

	<!-- Credentials by Platform -->
	<div class="space-y-6">
		<h2 class="text-lg font-semibold text-gray-900">Configured Credentials</h2>

		{#each groupedCredentials as group}
			<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-100 px-6 py-4">
					<h3 class="font-medium text-gray-900">{group.label}</h3>
				</div>

				{#if group.credentials.length === 0}
					<div class="p-6 text-center text-sm text-gray-500" data-testid="no-credentials-{group.platform}">
						No credentials configured for {group.label}
					</div>
				{:else}
					<div class="divide-y divide-gray-100">
						{#each group.credentials as cred}
							<div class="p-6" data-testid="credential-row-{cred.id}">
								{#if editingId === cred.id}
									<!-- Edit Form -->
									<form {...updateCredential} class="space-y-4">
										<input type="hidden" name="id" value={cred.id} />

										<div class="grid gap-4 sm:grid-cols-2">
											<Input
												label="Account Name"
												name="account_name"
												bind:value={editAccountName}
												required
												data-testid="input-edit-account-name"
											/>
										</div>

										<!-- Platform-specific fields -->
										{#if cred.platform === 'twitter'}
											<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
												<p class="mb-4 text-sm text-gray-600">
													Enter new credentials to update (required for security).
												</p>
												<div class="grid gap-4">
													<Input
														label="Access Token"
														name="twitter_access_token"
														type="password"
														bind:value={editTwitterAccessToken}
														placeholder="Enter new access token"
														required
														data-testid="input-edit-twitter-access-token"
													/>
													<Input
														label="Refresh Token (optional)"
														name="twitter_refresh_token"
														type="password"
														bind:value={editTwitterRefreshToken}
														placeholder="Enter new refresh token"
														data-testid="input-edit-twitter-refresh-token"
													/>
												</div>
											</div>
										{:else if cred.platform === 'bluesky'}
											<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
												<p class="mb-4 text-sm text-gray-600">
													Enter new credentials to update (required for security).
												</p>
												<div class="grid gap-4 sm:grid-cols-2">
													<Input
														label="Handle or DID"
														name="bluesky_identifier"
														bind:value={editBlueskyIdentifier}
														placeholder="Enter identifier"
														required
														data-testid="input-edit-bluesky-identifier"
													/>
													<Input
														label="App Password"
														name="bluesky_password"
														type="password"
														bind:value={editBlueskyPassword}
														placeholder="Enter new app password"
														required
														data-testid="input-edit-bluesky-password"
													/>
												</div>
											</div>
										{:else if cred.platform === 'linkedin'}
											<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
												<p class="mb-4 text-sm text-gray-600">
													Enter new credentials to update (required for security).
												</p>
												<div class="grid gap-4">
													<Input
														label="Access Token"
														name="linkedin_access_token"
														type="password"
														bind:value={editLinkedinAccessToken}
														placeholder="Enter new access token"
														required
														data-testid="input-edit-linkedin-access-token"
													/>
													<Input
														label="Refresh Token (optional)"
														name="linkedin_refresh_token"
														type="password"
														bind:value={editLinkedinRefreshToken}
														placeholder="Enter new refresh token"
														data-testid="input-edit-linkedin-refresh-token"
													/>
												</div>
											</div>
										{/if}

										{#if updateCredential.result?.success}
											<div class="rounded-lg bg-green-50 p-4 text-green-800">
												{updateCredential.result.text}
											</div>
										{/if}

										{#if updateCredential.result && !updateCredential.result.success}
											<div class="rounded-lg bg-red-50 p-4 text-red-800">
												{updateCredential.result.text}
											</div>
										{/if}

										<div class="flex gap-3">
											<Button
												type="submit"
												disabled={!!updateCredential.pending}
												data-testid="save-button"
											>
												{updateCredential.pending ? 'Saving...' : 'Save Changes'}
											</Button>
											<Button type="button" variant="secondary" onclick={cancelEdit}>
												Cancel
											</Button>
										</div>
									</form>
								{:else}
									<!-- Display Mode -->
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4">
											<div>
												<p class="font-medium text-gray-900">{cred.account_name}</p>
												<div class="mt-1 flex items-center gap-3 text-sm text-gray-500">
													{#if cred.is_active}
														<span
															class="inline-flex items-center gap-1 text-green-600"
															data-testid="status-active"
														>
															<CheckCircle class="h-4 w-4" weight="fill" />
															Active
														</span>
													{:else}
														<span
															class="inline-flex items-center gap-1 text-gray-400"
															data-testid="status-inactive"
														>
															<XCircle class="h-4 w-4" />
															Inactive
														</span>
													{/if}
													{#if cred.last_used_at}
														<span>Last used: {new Date(cred.last_used_at).toLocaleDateString()}</span
														>
													{/if}
													{#if cred.last_error}
														<span class="text-red-600">Error: {cred.last_error}</span>
													{/if}
												</div>
											</div>
										</div>

										<div class="flex items-center gap-2">
											<!-- Toggle Active -->
											<form {...toggleCredentialActive}>
												<input type="hidden" name="id" value={cred.id} />
												<input
													type="hidden"
													name="is_active"
													value={cred.is_active ? '' : 'on'}
												/>
												<Button
													type="submit"
													variant={cred.is_active ? 'secondary' : 'primary'}
													size="sm"
													disabled={!!toggleCredentialActive.pending}
													data-testid="toggle-active-button"
												>
													{cred.is_active ? 'Deactivate' : 'Activate'}
												</Button>
											</form>

											<!-- Edit -->
											<Button
												variant="secondary"
												size="sm"
												onclick={() => startEdit(cred)}
												data-testid="edit-button"
											>
												Edit
											</Button>

											<!-- Delete -->
											<DialogTrigger
												onclick={() => openDeleteDialog(cred.id)}
												variant="danger"
												size="sm"
												data-testid="delete-button"
											>
												<Trash class="h-4 w-4" />
											</DialogTrigger>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#snippet confirmDelete()}
	{#if deleteCredentialId}
		{@const remove = getDeleteForm(deleteCredentialId)}
		<form
			{...remove.enhance(async ({ submit }) => {
				await submit()
				deleteDialogOpen = false
				deleteCredentialId = null
			})}
		>
			<Button type="submit" variant="danger" disabled={!!remove.pending} data-testid="confirm-delete-button">
				{remove.pending ? 'Deleting...' : 'Delete Credentials'}
			</Button>
		</form>
	{/if}
{/snippet}

<ConfirmDialog
	id="delete-credential-dialog"
	bind:open={deleteDialogOpen}
	title="Delete Credentials"
	description="Are you sure you want to delete these credentials? This action cannot be undone."
	confirm={confirmDelete}
/>
