<script lang="ts">
import { superForm } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import Input from '$lib/ui/form/Input.svelte'
import Button from '$lib/ui/Button.svelte'
import Select from '$lib/ui/Select.svelte'
import Avatar from '$lib/ui/Avatar.svelte'
import { schema } from './schema'

let { data } = $props()
const { form, errors, enhance } = superForm(data.form, {
	validators: zod(schema),
	dataType: 'json'
})

// Convert numeric role IDs to strings for the Select component
const roleOptions = data.roles.map((role) => ({ 
	value: String(role.id), 
	label: role.name 
}));

// Create a string version of the role for binding
let roleValue = $state(String($form.role));
</script>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold">Edit User</h1>

	<form method="POST" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />

		<Input
			name="username"
			label="Username"
			type="text"
			placeholder="johndoe"
			description="Enter the user's username"
			bind:value={$form.username}
			errors={$errors.username}
		/>

		<Input
			name="email"
			label="Email"
			type="email"
			placeholder="john@example.com"
			description="Enter the user's email address"
			bind:value={$form.email}
			errors={$errors.email}
		/>

		<Input
			name="bio"
			label="Bio"
			type="textarea"
			placeholder="A short bio about the user"
			description="Enter a brief description about the user"
			bind:value={$form.bio}
			errors={$errors.bio}
		/>

		<Input
			name="location"
			label="Location"
			type="text"
			placeholder="New York, USA"
			description="Enter the user's location"
			bind:value={$form.location}
			errors={$errors.location}
		/>

		<Input
			name="twitter"
			label="Twitter"
			type="text"
			placeholder="@johndoe"
			description="Enter the user's Twitter handle"
			bind:value={$form.twitter}
			errors={$errors.twitter}
		/>

		<div class="space-y-2">
			<label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar</label>
			<div class="flex items-center space-x-4">
				<Avatar src={$form.avatar_url} name={$form.username} />
				<Input
					name="avatar_url"
					type="text"
					placeholder="https://example.com/avatar.jpg"
					description="Enter the URL for the user's avatar"
					bind:value={$form.avatar_url}
					errors={$errors.avatar_url}
				/>
			</div>
		</div>

		<Select
			name="role"
			label="Role"
			description="Select the user's role"
			options={roleOptions}
			bind:value={roleValue}
			errors={$errors.role}
		/>
		<input type="hidden" name="role" value={Number(roleValue)} />

		<Button primary fullWidth>Update User</Button>
	</form>
</div>
