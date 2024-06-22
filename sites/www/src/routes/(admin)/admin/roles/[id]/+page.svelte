<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/ui/Button.svelte';

	const { data } = $props<{ form: any }>();
	const { form, errors, enhance } = superForm(data.form);
</script>

<form use:enhance method="post" class="mb-4 space-y-6 rounded bg-white px-8 pb-8 pt-6 shadow-md">
	<input type="hidden" id="id" name="id" value={$form.id} />

	<div class="mb-4">
		<label for="name" class="mb-2 block text-sm font-bold text-gray-700">Name:</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={$form.name}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.name}
			<p class="text-xs italic text-red-500">{$errors.name}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="value" class="mb-2 block text-sm font-bold text-gray-700">Value:</label>
		<input
			type="text"
			id="value"
			name="value"
			bind:value={$form.value}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.value}
			<p class="text-xs italic text-red-500">{$errors.value}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="description" class="mb-2 block text-sm font-bold text-gray-700">Description:</label>
		<input
			type="text"
			id="description"
			name="description"
			bind:value={$form.description}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.description}
			<p class="text-xs italic text-red-500">{$errors.description}</p>
		{/if}
	</div>

	<div class="mb-4">
		<label for="permissions" class="mb-2 block text-sm font-bold text-gray-700"
			>Permissions (comma-separated):</label
		>
		<input
			type="text"
			id="permissions"
			name="permissions"
			bind:value={$form.permissions}
			required
			class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		/>
		{#if $errors.permissions}
			<p class="text-xs italic text-red-500">{$errors.permissions}</p>
		{/if}
	</div>

	<div class="mb-4">
		<span class="mb-2 block text-sm font-bold text-gray-700">Active:</span>
		<div class="flex items-center space-x-4">
			<label class="inline-flex items-center">
				<input
					type="radio"
					bind:group={$form.active}
					name="active"
					value={1}
					class="form-radio text-blue-600"
				/>
				<span class="ml-2">Yes</span>
			</label>
			<label class="inline-flex items-center">
				<input
					type="radio"
					bind:group={$form.active}
					name="active"
					value={0}
					class="form-radio text-blue-600"
				/>
				<span class="ml-2">No</span>
			</label>
		</div>
	</div>

	<div class="flex items-center justify-between">
		<Button primary type="submit">Update Role</Button>
	</div>
</form>
