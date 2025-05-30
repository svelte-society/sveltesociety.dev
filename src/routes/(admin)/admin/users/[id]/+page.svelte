<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zod } from 'sveltekit-superforms/adapters'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Select from '$lib/ui/form/Select.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Avatar from '$lib/ui/Avatar.svelte'
	import { schema } from './schema'

	let { data } = $props()
	const form = superForm(data.form, {
		validators: zod(schema),
		dataType: 'json'
	})

	const { form: formData } = form

	const roleOptions = data.roles.map((role) => ({
		value: role.id,
		label: role.name
	}))
</script>

<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit User</h1>

	<Form {form}>
		<div class="hidden">
			<Input type="hidden" name="id" />
		</div>

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
			name="bio"
			label="Bio"
			placeholder="A short bio about the user"
			description="Enter a brief description about the user"
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

		<div class="space-y-2">
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

		<Select name="role" label="Role" description="Select the user's role" options={roleOptions} />

		<div class="mt-8 flex items-center justify-between">
			<Button primary type="submit">Update User</Button>
			<a href="/admin/users" class="text-sm text-gray-600 hover:text-gray-900">Back to Users</a>
		</div>
	</Form>
</div>
