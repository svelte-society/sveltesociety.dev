<script lang="ts">
	import { page } from '$app/state'
	import Input from '$lib/ui/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import User from 'phosphor-svelte/lib/User'
	import { initForm } from '$lib/utils/form.svelte'
	import { getUserById, getRoleOptions, updateUserRole } from '../users.remote'

	const userId = page.params.id!

	const user = await getUserById(userId)

	const roleForm = updateUserRole.for(userId)

	initForm(roleForm, () => ({
		role: user.role
	}))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="User Details"
		description="View user information and manage role"
		icon={User}
	/>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">User Profile</p>
			</div>
		</div>

		<div class="p-8">
			<div class="flex flex-col gap-6">
				<div class="grid gap-6 lg:grid-cols-2">
					<Input
						name="username"
						value={user.username}
						label="Username"
						disabled
						data-testid="input-username"
					/>

					<Input
						name="email"
						value={user.email ?? ''}
						label="Email"
						disabled
						data-testid="input-email"
					/>

					<Input
						name="location"
						value={user.location ?? ''}
						label="Location"
						disabled
						data-testid="input-location"
					/>

					<Input
						name="twitter"
						value={user.twitter ?? ''}
						label="Twitter"
						disabled
						data-testid="input-twitter"
					/>

					<div class="lg:col-span-2">
						<Input name="bio" value={user.bio ?? ''} label="Bio" disabled data-testid="input-bio" />
					</div>

					<div class="space-y-2 lg:col-span-2">
						<label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar</label>
						<div class="flex items-center gap-4">
							<Avatar src={user.avatar_url} name={user.username} />
							<div class="grow">
								<Input
									name="avatar_url"
									value={user.avatar_url ?? ''}
									disabled
									data-testid="input-avatar_url"
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-4 border-t border-gray-200 pt-6">
					<form {...roleForm} class="flex items-end gap-4">
						<div class="flex grow flex-col gap-2">
							<label class="text-xs font-medium outline-none" for="role">Role</label>
							<select
								{...roleForm.fields.role.as('number')}
								data-testid="select-role"
								class="w-full appearance-none rounded-md border-2 border-transparent bg-slate-100 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M213.66%20101.66l-80%2080a8%208%200%2001-11.32%200l-80-80a8%208%200%200111.32-11.32L128%20164.69l74.34-74.35a8%208%200%200111.32%2011.32z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat px-2 py-1.5 pr-8 text-sm focus:outline-2 focus:outline-sky-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
							>
								{#each await getRoleOptions() as { label, value }}
									<option value={value.toString()}>{label}</option>
								{/each}
							</select>

							<p class="text-xs text-slate-500">Select the user's role</p>
						</div>
						<Button type="submit" disabled={!!roleForm.pending} data-testid="submit-button">
							{roleForm.pending ? 'Updating...' : 'Update Role'}
						</Button>
					</form>
				</div>

				<div class="mt-4 border-t border-gray-200 pt-6">
					<Button href="/admin/users" variant="secondary">Back to Users</Button>
				</div>
			</div>
		</div>
	</div>
</div>
