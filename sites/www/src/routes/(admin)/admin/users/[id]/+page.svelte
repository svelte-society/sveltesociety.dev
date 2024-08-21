<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import Button from '$lib/ui/Button.svelte';
	import Input from '$lib/ui/form/Input.svelte';
	import Select from '$lib/ui/form/Select.svelte';
	import Avatar from '$lib/ui/Avatar.svelte';
	import { schema } from './schema';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, zod(schema));
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">Edit User</h1>
	<form method="POST" use:enhance class="space-y-6">
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
			options={data.roles.map((role) => ({ value: role.id, label: role.name }))}
			bind:value={$form.role}
			errors={$errors.role}
		/>

		<Button primary fullWidth>Update User</Button>
	</form>
</div>
