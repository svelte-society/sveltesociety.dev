<script module>
export interface Header {
	key: string
	label: string
	sticky?: 'left' | 'right'
}

export interface TableProps<T> {
	headers: Header[]
	items: T[]
	itemKey: keyof T
	renderCell?: Snippet<[item: T, header: Header]>
	renderActions?: Snippet<[item: T]>
}
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	let { headers, items, itemKey, renderCell, renderActions }: TableProps<any> = $props();
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-sm">
	<div class="w-full overflow-x-auto">
		<table class="w-full text-left text-xs text-gray-500">
			<thead class="bg-gray-50 text-xs uppercase text-gray-700">
				<tr>
					{#each headers as header}
						<th
							scope="col"
							class="min-w-[80px] px-3 py-2 {header.sticky
								? `sticky ${header.sticky}-0 z-20 bg-gray-50`
								: ''}"
						>
							{header.label}
						</th>
					{/each}
					<th scope="col" class="sticky right-0 z-20 min-w-[70px] bg-gray-50 px-3 py-2">
						<span class="sr-only">Actions</span>
						<svg
							class="mx-auto h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							></path>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
						</svg>
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each items as item}
					<tr class="hover:bg-gray-50">
						{#each headers as header}
							<td
								class="px-3 py-2 {header.sticky ? `sticky ${header.sticky}-0 z-10 bg-white` : ''}"
							>
								{#if renderCell}
									{@render renderCell(item, header)}
								{:else}
									{item[header.key]}
								{/if}
							</td>
						{/each}
						<td class="sticky right-0 z-10 min-w-[70px] bg-white px-3 py-2">
							<div class="flex justify-center space-x-1">
								{#if renderActions}
									{@render renderActions(item)}
								{:else}
									<form action="?/delete" method="POST" use:enhance>
										<input type="hidden" name="id" value={item[itemKey]} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											aria-label="Delete item"
										>
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</form>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
