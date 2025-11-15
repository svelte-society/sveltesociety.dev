<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import PageHeader from '$lib/ui/admin/PageHeader.svelte'
	import User from 'phosphor-svelte/lib/User'

	let { data } = $props()
	const form = superForm(data.form, {
		dataType: 'json'
	})

	const { form: formData } = form

	const roleOptions = data.roles.map((role) => ({
		value: role.id,
		label: role.name
	}))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
	<PageHeader
		title="Edit User"
		description="Update user information and permissions"
		icon={User}
	/>

	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
		<div class="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
			<div class="flex items-center gap-3">
				<div class="h-1 w-12 rounded-full bg-gradient-to-r from-svelte-500 to-svelte-300"></div>
				<p class="text-sm font-medium text-gray-600">User Profile</p>
			</div>
		</div>

		<div class="p-8">
			<Form {form}>
			<div class="hidden">
				<Input type="hidden" name="id" />
			</div>

			<div class="grid gap-6 lg:grid-cols-2">
				<Input
					name="username"
					label="Username"
					placeholder="johndoe"
					description="Enter the user's username"
				/>

				<Input
					name="email"
					label="Email"
					placeholder="john@example.com"
					description="Enter the user's email address"
				/>

				<Input
					name="location"
					label="Location"
					placeholder="New York, USA"
					description="Enter the user's location"
				/>

				<Input
					name="twitter"
					label="Twitter"
					placeholder="@johndoe"
					description="Enter the user's Twitter handle"
				/>

				<div class="lg:col-span-2">
					<Input
						name="bio"
						label="Bio"
						placeholder="A short bio about the user"
						description="Enter a brief description about the user"
					/>
				</div>

				<div class="space-y-2 lg:col-span-2">
					<label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar</label>
					<div class="flex items-center gap-4">
						<Avatar src={$formData.avatar_url} name={$formData.username} />
						<div class="flex-grow">
							<Input
								name="avatar_url"
								placeholder="https://example.com/avatar.jpg"
								description="Enter the URL for the user's avatar"
							/>
						</div>
					</div>
				</div>

				<div class="lg:col-span-2">
					<Select name="role" label="Role" description="Select the user's role" options={roleOptions} />
				</div>
			</div>

				<div class="mt-8 flex gap-4 border-t border-gray-200 pt-6">
					<Button type="submit" width="full">Update User</Button>
					<Button href="/admin/users" variant="secondary">Cancel</Button>
				</div>
			</Form>
		</div>
	</div>
</div>
