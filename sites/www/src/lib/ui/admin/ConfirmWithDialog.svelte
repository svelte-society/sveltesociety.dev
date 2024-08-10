<script lang="ts">
	import { enhance, applyAction } from '$app/forms';

	let showDialog = $state(false);

	interface Props {
		title: string;
		description: string;
		action: string;
		id: number;
		confirmButtonText?: string;
		cancelButtonText?: string;
	}

	let { title, description, action, id, confirmButtonText, cancelButtonText }: Props = $props();
</script>

<button
	type="button"
	onclick={() => (showDialog = !showDialog)}
	class="text-red-600 hover:text-red-900"
	aria-label="Delete item"
>
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
		></path>
	</svg>
</button>

{#if showDialog}
	<div class="z-5000 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="rounded-lg bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-bold">{title}</h2>
			<p class="mb-4">{description}</p>
			<div class="flex justify-end space-x-2">
				<button
					type="button"
					onclick={() => (showDialog = false)}
					class="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
				>
					{cancelButtonText}
				</button>
				<form
					{action}
					method="POST"
					use:enhance={() => {
						return ({ result }) => {
							if (result.type === 'success') {
								showDialog = false;
							}
							applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={id} />
					<button type="submit" class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
						{confirmButtonText}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
