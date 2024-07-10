<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	const { enhance } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Tag deleted successfully');
				// Optionally, you can reload the page or update the tag list here
			} else {
				toast.error('Failed to delete tag');
			}
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Tag Management</h1>
	<div class="overflow-hidden rounded-lg bg-white shadow-md">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Name</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Slug</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Content Count</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each data.tags as tag}
					<tr>
						<td class="whitespace-nowrap px-6 py-4">{tag.name}</td>
						<td class="whitespace-nowrap px-6 py-4">{tag.slug}</td>
						<td class="whitespace-nowrap px-6 py-4">{tag.contentCount}</td>
						<td class="whitespace-nowrap px-6 py-4">
							<div class="flex items-center space-x-2">
								<a href="/admin/tags/{tag.id}/edit" class="text-indigo-600 hover:text-indigo-900">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Edit tag</title>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
								</a>
								<form method="POST" action="?/deleteTag" use:enhance class="inline">
									<input type="hidden" name="id" value={tag.id} />
									<button type="submit" class="text-red-600 hover:text-red-900">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<title>Delete tag</title>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="mt-4">
		<a
			href="/admin/tags/new"
			class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
		>
			Create New Tag
		</a>
	</div>
</div>
