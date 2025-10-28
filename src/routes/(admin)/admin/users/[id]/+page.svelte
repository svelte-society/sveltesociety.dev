<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import { getUser, updateUser } from './data.remote'

	const data = $derived(await getUser({ id: page.params.id! }))

	updateUser.fields.set({
		id: data.user.id,
		username: data.user.username,
		email: data.user.email || '',
		bio: data.user.bio || '',
		location: data.user.location || '',
		twitter: data.user.twitter || '',
		avatar_url: data.user.avatar_url || '',
		role: data.user.role
	})
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit User</h1>

	<form {...updateUser} class="flex flex-col gap-4">
		<input {...updateUser.fields.id.as('hidden', data.user.id)} />

		<div class="flex flex-col gap-2">
			<label for="username" class="text-xs font-medium">Username</label>
			<input
				{...updateUser.fields.username.as('text')}
				id="username"
				data-testid="input-username"
				placeholder="johndoe"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			{#each updateUser.fields.username.issues() as issue}
				<p class="text-xs text-red-600">{issue.message}</p>
			{/each}
			<p class="text-xs text-gray-500">Enter the user's username</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="email" class="text-xs font-medium">Email</label>
			<input
				{...updateUser.fields.email.as('email')}
				id="email"
				data-testid="input-email"
				placeholder="john@example.com"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			{#each updateUser.fields.email.issues() as issue}
				<p class="text-xs text-red-600">{issue.message}</p>
			{/each}
			<p class="text-xs text-gray-500">Enter the user's email address</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="bio" class="text-xs font-medium">Bio</label>
			<input
				{...updateUser.fields.bio.as('text')}
				id="bio"
				placeholder="A short bio about the user"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			<p class="text-xs text-gray-500">Enter a brief description about the user</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="location" class="text-xs font-medium">Location</label>
			<input
				{...updateUser.fields.location.as('text')}
				id="location"
				placeholder="New York, USA"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			<p class="text-xs text-gray-500">Enter the user's location</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="twitter" class="text-xs font-medium">Twitter</label>
			<input
				{...updateUser.fields.twitter.as('text')}
				id="twitter"
				placeholder="@johndoe"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			/>
			<p class="text-xs text-gray-500">Enter the user's Twitter handle</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="avatar_url" class="text-xs font-medium">Avatar</label>
			<div class="flex items-center gap-4">
				<Avatar src={updateUser.fields.avatar_url.value()} name={updateUser.fields.username.value()} />
				<div class="flex-grow">
					<input
						{...updateUser.fields.avatar_url.as('text')}
						id="avatar_url"
						placeholder="https://example.com/avatar.jpg"
						class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
					/>
				</div>
			</div>
			<p class="text-xs text-gray-500">Enter the URL for the user's avatar</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="role" class="text-xs font-medium">Role</label>
			<select
				{...updateUser.fields.role.as('select')}
				id="role"
				data-testid="select-role"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
			>
				{#each data.roles as role}
					<option value={role.id}>{role.name}</option>
				{/each}
			</select>
			<p class="text-xs text-gray-500">Select the user's role</p>
		</div>

		<div class="mt-8 flex items-center justify-between">
			<Button type="submit" disabled={updateUser.pending} data-testid="update-button">
				{updateUser.pending ? 'Updating...' : 'Update User'}
			</Button>
			<a href="/admin/users" class="text-sm text-gray-600 hover:text-gray-900">Back to Users</a>
		</div>
	</form>
</div>
