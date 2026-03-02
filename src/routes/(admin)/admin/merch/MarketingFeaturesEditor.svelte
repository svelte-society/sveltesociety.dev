<script lang="ts">
	let { name, initial = [] }: { name: string; initial?: string[] } = $props()

	let features = $state<string[]>(initial.length > 0 ? [...initial] : [])

	let serialized = $derived.by(() => {
		const filtered = features.filter((f) => f.trim())
		return filtered.length > 0 ? JSON.stringify(filtered) : ''
	})

	function addFeature() {
		if (features.length >= 15) return
		features.push('')
	}

	function removeFeature(index: number) {
		features.splice(index, 1)
	}
</script>

<input type="hidden" {name} value={serialized} />

<div class="space-y-2">
	{#each features as _, i (i)}
		<div class="flex items-center gap-2">
			<input
				type="text"
				bind:value={features[i]}
				placeholder="e.g. 100% organic cotton"
				class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				data-testid="feature-{i}"
			/>
			<button
				type="button"
				onclick={() => removeFeature(i)}
				class="text-sm text-red-500 hover:text-red-700"
			>
				&times;
			</button>
		</div>
	{/each}

	{#if features.length < 15}
		<button
			type="button"
			onclick={addFeature}
			class="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-orange-500 hover:text-orange-600"
			data-testid="add-feature"
		>
			+ Add Feature
		</button>
	{/if}

	{#if features.length > 0}
		<p class="text-xs text-gray-400">{features.filter((f) => f.trim()).length}/15 features</p>
	{/if}
</div>
