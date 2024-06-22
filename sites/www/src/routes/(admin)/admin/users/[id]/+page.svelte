<script lang="ts">
	import { Select } from 'bits-ui';
	import Button from '$lib/ui/Button.svelte';
	import Avatar from '$lib/ui/Avatar.svelte';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form);

	console.log(data);

	$effect(() => {
		toast.error(data.form.message);
	});
</script>

<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
	<input type="hidden" id="id" name="id" bind:value={$form.id} />

	<div class="space-y-2">
		<label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
		<input
			type="text"
			id="username"
			name="username"
			bind:value={$form.username}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.username}
			<p class="text-xs italic text-red-500">{$errors.username}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={$form.email}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.email}
			<p class="text-xs italic text-red-500">{$errors.email}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="bio" class="block text-sm font-medium text-gray-700">Bio:</label>
		<input
			type="text"
			id="bio"
			name="bio"
			bind:value={$form.bio}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.bio}
			<p class="text-xs italic text-red-500">{$errors.bio}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="location" class="block text-sm font-medium text-gray-700">Location:</label>
		<input
			type="text"
			id="location"
			name="location"
			bind:value={$form.location}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.location}
			<p class="text-xs italic text-red-500">{$errors.location}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="twitter" class="block text-sm font-medium text-gray-700">Twitter:</label>
		<input
			type="text"
			id="twitter"
			name="twitter"
			bind:value={$form.twitter}
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
		/>
		{#if $errors.twitter}
			<p class="text-xs italic text-red-500">{$errors.twitter}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="avatar_url" class="block text-sm font-medium text-gray-700">Avatar URL:</label>
		<div class="flex items-center space-x-4">
			<Avatar src={$form.avatar_url} name={$form.username} />
			<input
				type="text"
				id="avatar_url"
				name="avatar_url"
				bind:value={$form.avatar_url}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			/>
		</div>
		{#if $errors.avatar_url}
			<p class="text-xs italic text-red-500">{$errors.avatar_url}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<div class="space-y-2">
			<label for="role" class="block text-sm font-medium text-gray-700">Role:</label>
			<Select.Root name="role_id" bind:selected={$form.role_id}>
				<Select.Trigger
					class="mt-1 block h-10 w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					aria-label="Select a role"
				>
					<Select.Value class="text-sm" placeholder="Select a role" />
				</Select.Trigger>
				<Select.Content
					class="mt-1 rounded-md border border-gray-300 bg-white shadow-lg"
					sideOffset={4}
				>
					{#each data.roles as role}
						<Select.Item
							class="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
							value={role.value}
							label={role.name}
						>
							{role.name}
							<Select.ItemIndicator class="ml-auto">
								<Check class="h-4 w-4 text-indigo-600" />
							</Select.ItemIndicator>
						</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input name="role_id" />
			</Select.Root>
		</div>
	</div>

	<div class="pt-4">
		<Button primary type="submit">Edit User</Button>
	</div>
</form>

<SuperDebug data={$form} />
