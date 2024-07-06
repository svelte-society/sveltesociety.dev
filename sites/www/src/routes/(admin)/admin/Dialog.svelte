<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog } from 'bits-ui';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	type Props = {
		children: Snippet;
		title: string;
		description: string;
		cancel: string;
		confirm: string;
		action?: string;
		id?: string | number;
	};

	const { children, title, description, cancel, confirm, action, id }: Props = $props();

	const enhance_return =
		() =>
		async ({ result }) => {
			if (result.type === 'success') {
				invalidateAll();
				await applyAction(result);
			}
		};
</script>

<Dialog.Root>
	<Dialog.Trigger class="font-medium text-red-600 hover:text-red-800"><slot /></Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
		<Dialog.Content
			class="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-xl"
		>
			<Dialog.Title class="mb-2 text-lg font-semibold text-gray-900">{title}</Dialog.Title>
			<Dialog.Description class="mb-4 text-sm text-gray-500">
				{description}
			</Dialog.Description>
			<div class="flex justify-end space-x-2">
				<Dialog.Close
					class="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300"
				>
					{cancel}
				</Dialog.Close>
				<form {action} method="POST" use:enhance={enhance_return}>
					<input type="hidden" name="id" value={id} />
					<button
						class="rounded-md bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
					>
						{confirm}
					</button>
				</form>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
