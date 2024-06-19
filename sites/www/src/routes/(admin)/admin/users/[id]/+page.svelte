<script lang="ts">
	import { toast } from 'svelte-sonner';
	import SuperDebug from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form);

	$effect(() => {
		toast.error(data.form.message);
	});
</script>

<form use:enhance method="post" class="grid gap-2">
	<!-- Hidden input for id -->
	<input type="hidden" id="id" name="id" bind:value={$form.id} />

	<!-- Name field -->
	<div class="grid gap-1">
		<label for="username">Username:</label>
		<input type="text" id="username" name="username" bind:value={$form.username} required />
		<span class="text-red-500">{$errors.username}</span>
	</div>

	<!-- Email field -->
	<div class="grid gap-1">
		<label for="email">Email:</label>
		<input type="email" id="email" name="email" bind:value={$form.email} />
		<span class="text-red-500">{$errors.email}</span>
	</div>

	<!-- Bio field -->
	<div class="grid gap-1">
		<label for="bio">Bio:</label>
		<input type="text" id="bio" name="bio" bind:value={$form.bio} />
		<span class="text-red-500">{$errors.bio}</span>
	</div>

	<!-- Location field -->
	<div class="grid gap-1">
		<label for="location">Location:</label>
		<input type="text" id="location" name="location" bind:value={$form.location} />
		<span class="text-red-500">{$errors.location}</span>
	</div>

	<!-- Twitter field -->
	<div class="grid gap-1">
		<label for="twitter">Twitter:</label>
		<input type="text" id="twitter" name="twitter" bind:value={$form.twitter} />
		<span class="text-red-500">{$errors.twitter}</span>
	</div>

	<!-- Avatar URL field -->
	<div class="grid gap-1">
		<label for="avatar_url">Avatar URL:</label>
		<input type="text" id="avatar_url" name="avatar_url" bind:value={$form.avatar_url} />
		<span class="text-red-500">{$errors.avatar_url}</span>
	</div>

	<!-- Role ID field -->
	<div class="grid gap-1">
		<label for="role_id">Role ID:</label>
		<input type="number" id="role_id" name="role_id" bind:value={$form.role_id} />
		<span class="text-red-500">{$errors.role_id}</span>
	</div>

	<!-- Submit button -->
	<button class="rounded bg-green-400 px-4 py-2 font-bold text-white hover:bg-green-500">
		Edit
	</button>
</form>

<SuperDebug data={$form} />
