<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import { addAccount } from '../data.remote'
</script>

<div class="mx-auto max-w-2xl p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Connect Social Media Account</h1>
		<p class="mt-1 text-sm text-gray-600">
			Add a social media account to enable posting to that platform
		</p>
	</div>

	<div class="rounded-lg bg-white p-6 shadow-sm">
		<form {...addAccount} class="space-y-6">
			<!-- Platform Selection -->
			<div>
				<label for="platform" class="block text-sm font-medium text-gray-700">Platform</label>
				{#each addAccount.fields.platform.issues() as issue}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
				<select
					{...addAccount.fields.platform.as('select')}
					id="platform"
					class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 focus:outline-none"
				>
					<option value="">Select a platform...</option>
					<option value="bluesky">BlueSky</option>
					<option value="nostr" disabled>Nostr (Coming Soon)</option>
					<option value="linkedin" disabled>LinkedIn (Coming Soon)</option>
				</select>
			</div>

			<!-- Display Name -->
			<div>
				<label for="account_name" class="block text-sm font-medium text-gray-700"
					>Display Name</label
				>
				<p class="mt-1 text-xs text-gray-500">A friendly name for this account</p>
				{#each addAccount.fields.account_name.issues() as issue}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
				<input
					{...addAccount.fields.account_name.as('text')}
					id="account_name"
					placeholder="My BlueSky Account"
					class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-none"
				/>
			</div>

			<!-- Handle -->
			<div>
				<label for="account_handle" class="block text-sm font-medium text-gray-700">Handle</label>
				<p class="mt-1 text-xs text-gray-500">Your public username (without @)</p>
				{#each addAccount.fields.account_handle.issues() as issue}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
				<input
					{...addAccount.fields.account_handle.as('text')}
					id="account_handle"
					placeholder="yourusername.bsky.social"
					class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-none"
				/>
			</div>

			<!-- Identifier -->
			<div>
				<label for="identifier" class="block text-sm font-medium text-gray-700">
					Identifier (Email or Handle)
				</label>
				<p class="mt-1 text-xs text-gray-500">The identifier you use to log into BlueSky</p>
				{#each addAccount.fields.identifier.issues() as issue}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
				<input
					{...addAccount.fields.identifier.as('text')}
					id="identifier"
					placeholder="you@example.com"
					class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-none"
				/>
			</div>

			<!-- App Password -->
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">App Password</label>
				<p class="mt-1 text-xs text-gray-500">
					Create an app password in BlueSky Settings → App Passwords
				</p>
				{#each addAccount.fields.password.issues() as issue}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
				<input
					{...addAccount.fields.password.as('password')}
					id="password"
					placeholder="xxxx-xxxx-xxxx-xxxx"
					class="focus:border-svelte-500 mt-1 w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-none"
				/>
			</div>

			<!-- Set as Default -->
			<div class="flex items-center">
				<label class="text-sm text-gray-700">
					<input
						{...addAccount.fields.is_default.as('checkbox')}
						class="text-svelte-600 focus:ring-svelte-500 mr-1.5 h-4 w-4 rounded border-gray-300"
					/>
					Set as default account for this platform
				</label>
			</div>

			<!-- Actions -->
			<div class="flex justify-end space-x-3 border-t pt-4">
				<Button variant="secondary" href="/admin/social/accounts">Cancel</Button>
				<Button type="submit" variant="primary" disabled={!!addAccount.pending}>
					{addAccount.pending ? 'Connecting...' : 'Connect Account'}
				</Button>
			</div>
		</form>
	</div>
</div>
