<script lang="ts">
	import SuperDebug from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form);
</script>

<form use:enhance method="post" class="grid gap-2">
	<input type="hidden" id="id" name="id" value={$form.id} />
	<div class="grid gap-1">
		<label for="name">Name:</label>
		<input type="text" id="name" name="name" bind:value={$form.name} required />
		<span class="text-red-500">{$errors.name}</span>
	</div>
	<div class="grid gap-1">
		<label for="value">Value:</label>
		<input type="text" id="value" name="value" bind:value={$form.value} required />
		<span class="text-red-500">{$errors.value}</span>
	</div>
	<div class="grid gap-1">
		<label for="description">Description:</label>
		<input
			type="text"
			id="description"
			name="description"
			bind:value={$form.description}
			required
		/>
		<span class="text-red-500">{$errors.description}</span>
	</div>
	<div class="grid gap-1">
		<label for="permissions">Permissions (comma-separated):</label>
		<input
			type="text"
			id="permissions"
			name="permissions"
			bind:value={$form.permissions}
			required
		/>
		<span class="text-red-500">{$errors.permissions}</span>
	</div>
	<div class="grid grid-cols-2 gap-1">
		<label>
			<input bind:group={$form.active} type="radio" name="active" id="active" value={1} /> Yes
		</label>
		<label>
			<input bind:group={$form.active} type="radio" name="active" id="active" value={0} /> No
		</label>
	</div>
	<button class="rounded bg-green-400 px-4 py-2 font-bold text-white hover:bg-green-500">
		Create
	</button>
</form>

<SuperDebug data={$form} />
