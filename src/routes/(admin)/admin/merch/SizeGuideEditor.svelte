<script lang="ts">
	type SizeGuide = { headers: string[]; rows: string[][] }

	let { name, initial = null }: { name: string; initial?: SizeGuide | null } = $props()

	let headers = $state<string[]>(initial?.headers ? [...initial.headers] : [])
	let rows = $state<string[][]>(initial?.rows ? initial.rows.map((r) => [...r]) : [])

	let serialized = $derived.by(() => {
		if (headers.length === 0 || !headers.some((h) => h.trim())) return ''
		return JSON.stringify({ headers, rows })
	})

	function addColumn() {
		headers.push('')
		for (const row of rows) {
			row.push('')
		}
	}

	function removeColumn(index: number) {
		headers.splice(index, 1)
		for (const row of rows) {
			row.splice(index, 1)
		}
		if (headers.length === 0) {
			rows.length = 0
		}
	}

	function addRow() {
		rows.push(headers.map(() => ''))
	}

	function removeRow(index: number) {
		rows.splice(index, 1)
	}

	function startGuide() {
		headers.push('Size', 'Chest (cm)', 'Length (cm)')
		rows.push(['', '', ''])
	}
</script>

<input type="hidden" {name} value={serialized} />

{#if headers.length > 0}
	<div class="overflow-x-auto rounded-lg border border-gray-200" data-testid="size-guide-table">
		<table class="w-full text-sm">
			<thead class="bg-gray-50">
				<tr>
					{#each headers as _, hi (hi)}
						<th class="px-2 py-2">
							<div class="flex items-center gap-1">
								<input
									type="text"
									bind:value={headers[hi]}
									placeholder="Header"
									class="w-full rounded border border-gray-300 px-2 py-1 text-xs font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
									data-testid="guide-header-{hi}"
								/>
								<button
									type="button"
									onclick={() => removeColumn(hi)}
									class="shrink-0 text-gray-400 hover:text-red-500"
								>
									&times;
								</button>
							</div>
						</th>
					{/each}
					<th class="w-8"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each rows as _, ri (ri)}
					<tr>
						{#each rows[ri] as __, ci (ci)}
							<td class="px-2 py-1">
								<input
									type="text"
									bind:value={rows[ri][ci]}
									class="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
									data-testid="guide-cell-{ri}-{ci}"
								/>
							</td>
						{/each}
						<td class="px-2 py-1">
							<button
								type="button"
								onclick={() => removeRow(ri)}
								class="text-gray-400 hover:text-red-500"
							>
								&times;
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-2 flex gap-2">
		<button
			type="button"
			onclick={addRow}
			class="rounded border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-orange-500 hover:text-orange-600"
			data-testid="add-guide-row"
		>
			+ Add Row
		</button>
		<button
			type="button"
			onclick={addColumn}
			class="rounded border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-orange-500 hover:text-orange-600"
			data-testid="add-guide-column"
		>
			+ Add Column
		</button>
	</div>
{:else}
	<button
		type="button"
		onclick={startGuide}
		class="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-orange-500 hover:text-orange-600"
		data-testid="add-size-guide"
	>
		+ Add Size Guide
	</button>
{/if}
