<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props<T> {
		action: boolean
		header: (classes: string) => ReturnType<Snippet>
		row: (item: T, classes: string) => ReturnType<Snippet>
		actionCell?: (item: T) => ReturnType<Snippet>
		data: Array<T>
		emptyMessage: string
		testId?: string
	}
	let { action = false, header, row, actionCell, data, emptyMessage, testId }: Props<any> = $props()
</script>

{#if data.length === 0}
	<div class="mt-8 text-center" data-testid={testId ? `${testId}-empty` : 'table-empty'}>
		<p class="text-gray-500">{emptyMessage}</p>
	</div>
{:else}
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" data-testid={testId}>
		<div class="w-full overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead class="border-b border-gray-200 bg-gray-50/50">
					<tr>
						{@render header('px-4 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider')}
						{#if action && actionCell}
							<th scope="col" class="px-4 py-3.5 text-right">
								<span class="sr-only">Actions</span>
								<svg
									class="inline-block h-4 w-4 text-gray-400"
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
						{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 bg-white">
					{#each data as item}
						<tr class="transition-colors hover:bg-gray-50/50" data-testid="{testId ? `${testId}-row` : 'table-row'}">
							{@render row(item, 'px-4 py-4 text-gray-900')}
							{#if action && actionCell}
								<td class="px-4 py-4">
									<div class="flex items-center justify-end gap-1.5">
										{@render actionCell(item)}
									</div>
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
