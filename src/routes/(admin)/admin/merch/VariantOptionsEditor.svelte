<script lang="ts">
	type VariantOption = { name: string; values: string[] }
	type VariantMeta = { sku: string; styria_product_code: string }

	let { name, initial = [] }: { name: string; initial?: VariantOption[] } = $props()

	let options = $state<VariantOption[]>(
		initial.length > 0 ? initial.map((o) => ({ name: o.name, values: [...o.values] })) : []
	)

	// Per-variant metadata keyed by label (e.g. "S / Black")
	let variantMeta = $state<Record<string, VariantMeta>>({})

	// Compute cross-product combinations from current options
	let combinations = $derived.by(() => {
		const filtered = options
			.filter((o) => o.name.trim())
			.map((o) => ({ name: o.name.trim(), values: o.values.filter((v) => v.trim()) }))
			.filter((o) => o.values.length > 0)

		if (filtered.length === 0) return []

		let combos: Array<Record<string, string>> = [{}]
		for (const opt of filtered) {
			const next: Array<Record<string, string>> = []
			for (const combo of combos) {
				for (const value of opt.values) {
					next.push({ ...combo, [opt.name]: value })
				}
			}
			combos = next
		}

		return combos.map((option_values) => ({
			label: Object.values(option_values).join(' / '),
			option_values
		}))
	})

	let serialized = $derived.by(() => {
		const filtered = options
			.filter((o) => o.name.trim())
			.map((o) => ({ name: o.name.trim(), values: o.values.filter((v) => v.trim()) }))
			.filter((o) => o.values.length > 0)

		return filtered.length > 0 ? JSON.stringify(filtered) : ''
	})

	let metaSerialized = $derived.by(() => {
		if (combinations.length === 0) return ''
		const hasAny = Object.values(variantMeta).some(
			(m) => m.sku.trim() || m.styria_product_code.trim()
		)
		if (!hasAny) return ''
		return JSON.stringify(variantMeta)
	})

	function addOption() {
		options.push({ name: '', values: [''] })
	}

	function removeOption(index: number) {
		options.splice(index, 1)
	}

	function addValue(optionIndex: number) {
		options[optionIndex].values.push('')
	}

	function removeValue(optionIndex: number, valueIndex: number) {
		options[optionIndex].values.splice(valueIndex, 1)
	}

	// Pre-populate variantMeta for new combinations
	$effect(() => {
		for (const combo of combinations) {
			if (!variantMeta[combo.label]) {
				variantMeta[combo.label] = { sku: '', styria_product_code: '' }
			}
		}
	})
</script>

<input type="hidden" {name} value={serialized} />
<input type="hidden" name="variant_metadata" value={metaSerialized} />

<div class="space-y-3">
	{#each options as option, i (i)}
		<div
			class="rounded-lg border border-gray-200 bg-gray-50 p-3"
			data-testid="variant-option-{i}"
		>
			<div class="mb-2 flex items-center gap-2">
				<input
					type="text"
					bind:value={option.name}
					placeholder="e.g. Size, Color"
					class="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
					data-testid="option-name-{i}"
				/>
				<button
					type="button"
					onclick={() => removeOption(i)}
					class="text-sm text-red-500 hover:text-red-700"
				>
					Remove
				</button>
			</div>

			<div class="ml-2">
				<span class="mb-1 block text-xs text-gray-500">Values</span>
				<div class="flex flex-wrap items-center gap-2">
					{#each option.values as _, vi (vi)}
						<div class="flex items-center gap-1">
							<input
								type="text"
								bind:value={option.values[vi]}
								placeholder="Value"
								class="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
								data-testid="option-value-{i}-{vi}"
							/>
							{#if option.values.length > 1}
								<button
									type="button"
									onclick={() => removeValue(i, vi)}
									class="text-gray-400 hover:text-red-500"
								>
									&times;
								</button>
							{/if}
						</div>
					{/each}
					<button
						type="button"
						onclick={() => addValue(i)}
						class="rounded border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-orange-500 hover:text-orange-600"
						data-testid="add-value-{i}"
					>
						+ Value
					</button>
				</div>
			</div>
		</div>
	{/each}

	<button
		type="button"
		onclick={addOption}
		class="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-orange-500 hover:text-orange-600"
		data-testid="add-variant-type"
	>
		+ Add Variant Type
	</button>
</div>

{#if combinations.length > 0}
	<div class="mt-4">
		<span class="mb-2 block text-sm font-medium text-gray-700">
			Generated Variants ({combinations.length})
		</span>
		<div class="overflow-x-auto rounded-lg border border-gray-200">
			<table class="w-full text-left text-sm">
				<thead class="border-b border-gray-200 bg-gray-50">
					<tr>
						<th class="px-3 py-2 text-xs font-medium text-gray-700">Variant</th>
						<th class="px-3 py-2 text-xs font-medium text-gray-700">SKU</th>
						<th class="px-3 py-2 text-xs font-medium text-gray-700">Styria Code</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each combinations as combo (combo.label)}
						{#if variantMeta[combo.label]}
							<tr>
								<td class="px-3 py-1.5 text-gray-700">{combo.label}</td>
								<td class="px-3 py-1.5">
									<input
										type="text"
										bind:value={variantMeta[combo.label].sku}
										placeholder="SKU"
										class="w-32 rounded border border-gray-300 px-2 py-1 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
									/>
								</td>
								<td class="px-3 py-1.5">
									<input
										type="text"
										bind:value={variantMeta[combo.label].styria_product_code}
										placeholder="Styria code"
										class="w-32 rounded border border-gray-300 px-2 py-1 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
									/>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
