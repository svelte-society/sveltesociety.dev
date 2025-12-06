<script lang="ts">
	import { page } from '$app/state'
	import Input from '$lib/ui/Input.svelte'
	import Select from '$lib/ui/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import User from 'phosphor-svelte/lib/User'
	import { getUserById, getActiveRoles, updateUser } from '../users.remote'

	const userId = page.params.id!

	const user = $derived(await getUserById(userId))
	const roles = $derived(await getActiveRoles())
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader title="Edit User" description="Update user information and permissions" icon={User} />

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">User Profile</p>
			</div>
		</div>

		<div class="p-8">
			<form {...updateUser} class="flex flex-col gap-6">
				<input {...updateUser.fields.id.as('hidden', userId)} />

				<div class="grid gap-6 lg:grid-cols-2">
					<Input
						{...updateUser.fields.username.as('text')}
						label="Username"
						placeholder="johndoe"
						description="Enter the user's username"
						issues={updateUser.fields.username.issues()}
						data-testid="input-username"
					/>

					<Input
						{...updateUser.fields.email.as('text')}
						label="Email"
						placeholder="john@example.com"
						description="Enter the user's email address"
						issues={updateUser.fields.email.issues()}
						data-testid="input-email"
					/>

					<Input
						{...updateUser.fields.location.as('text')}
						label="Location"
						placeholder="New York, USA"
						description="Enter the user's location"
						issues={updateUser.fields.location.issues()}
						data-testid="input-location"
					/>

					<Input
						{...updateUser.fields.twitter.as('text')}
						label="Twitter"
						placeholder="@johndoe"
						description="Enter the user's Twitter handle"
						issues={updateUser.fields.twitter.issues()}
						data-testid="input-twitter"
					/>

					<div class="lg:col-span-2">
						<Input
							{...updateUser.fields.bio.as('text')}
							label="Bio"
							placeholder="A short bio about the user"
							description="Enter a brief description about the user"
							issues={updateUser.fields.bio.issues()}
							data-testid="input-bio"
						/>
					</div>

					<div class="space-y-2 lg:col-span-2">
						<label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar</label>
						<div class="flex items-center gap-4">
							<Avatar src={user.avatar_url} name={user.username} />
							<div class="grow">
								<Input
									{...updateUser.fields.avatar_url.as('text')}
									placeholder="https://example.com/avatar.jpg"
									description="Enter the URL for the user's avatar"
									issues={updateUser.fields.avatar_url.issues()}
									data-testid="input-avatar_url"
								/>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-2 lg:col-span-2">
						<label class="text-xs font-medium outline-none" for="role_display">Role</label>
						<input type="hidden" name="role" value={updateUser.fields.role.value()} />
						<Select name="role_display" options={roles} testId="select-role" />
						<p class="text-xs text-slate-500">Select the user's role</p>
					</div>
				</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button
						type="submit"
						width="full"
						disabled={!!updateUser.pending}
						data-testid="submit-button"
					>
						{updateUser.pending ? 'Updating...' : 'Update User'}
					</Button>
					<Button href="/admin/users" variant="secondary">Cancel</Button>
				</div>
			</form>
		</div>
	</div>
</div>
