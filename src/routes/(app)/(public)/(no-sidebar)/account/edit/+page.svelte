<!-- sites/www/src/routes/(app)/(account)/account/edit/+page.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import Button from '$lib/ui/Button.svelte'

	let { data } = $props()
	const { form, errors, enhance } = superForm(data.form)
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-2xl font-bold">Edit Profile</h1>

	<form use:enhance method="post" class="space-y-6 rounded-lg bg-white p-6 shadow-md">
		<div class="space-y-2">
			<label for="name" class="mb-2 block text-sm font-bold text-gray-700">Name:</label>
			<input
				type="text"
				id="name"
				name="name"
				bind:value={$form.name}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.name}<p class="text-xs text-red-500 italic">{$errors.name}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="username" class="mb-2 block text-sm font-bold text-gray-700">Username:</label>
			<input
				type="text"
				id="username"
				name="username"
				bind:value={$form.username}
				required
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.username}<p class="text-xs text-red-500 italic">{$errors.username}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="bio" class="mb-2 block text-sm font-bold text-gray-700">Bio:</label>
			<textarea
				id="bio"
				name="bio"
				bind:value={$form.bio}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			></textarea>
			{#if $errors.bio}<p class="text-xs text-red-500 italic">{$errors.bio}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="location" class="mb-2 block text-sm font-bold text-gray-700">Location:</label>
			<input
				type="text"
				id="location"
				name="location"
				bind:value={$form.location}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.location}<p class="text-xs text-red-500 italic">{$errors.location}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="twitter" class="mb-2 block text-sm font-bold text-gray-700">Twitter:</label>
			<input
				type="text"
				id="twitter"
				name="twitter"
				bind:value={$form.twitter}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
			{#if $errors.twitter}<p class="text-xs text-red-500 italic">{$errors.twitter}</p>{/if}
		</div>

		<div class="flex items-center justify-between">
			<Button primary type="submit">Update Profile</Button>
		</div>
	</form>
</div>
