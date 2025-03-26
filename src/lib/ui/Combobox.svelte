<script lang="ts">
	import { createCombobox } from 'svelte-headlessui'
	import { CaretUpDown, Check, X } from 'phosphor-svelte'

	type Option = {
		label: string
		value: string
	}

	let { tags }: { tags: Option[] } = $props()

	const combobox = createCombobox({ label: 'People', selected: [] })

	let filtered = $derived(
		tags.filter((tag) =>
			tag.label
				.toLowerCase()
				.replace(/\s+/g, '')
				.includes($combobox.filter.toLowerCase().replace(/\s+/g, ''))
		)
	)
</script>

<div class="w-full">
	<div class="relative">
		<span class="inline-block w-full rounded-sm shadow-xs">
			<button
				use:combobox.button
				class="w-full rounded-md border-2 border-transparent bg-slate-100 px-3 py-0.5 pl-2 text-left text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200"
			>
				<div class="flex flex-wrap gap-2">
					{#each $combobox.selected as selected (selected.value)}
						<span
							class="flex items-center gap-1 rounded-sm border-1 border-slate-300 bg-white px-2 py-0.5"
						>
							<span>{selected.label}</span>
							<div use:combobox.deselect={selected}>
								<X weight="bold" />
							</div>
						</span>
					{/each}
					<input
						use:combobox.input
						placeholder="Start typing a tag name"
						class="w-auto grow border-none py-0.5 text-sm text-gray-900 focus:ring-0"
					/>
				</div>

				<span class="pointer-events-none absolute inset-y-0 right-2 flex items-center pr-2">
					<CaretUpDown class="ml-auto size-4 text-gray-500" />
				</span>
			</button>
		</span>
		{#if $combobox.expanded}
			<ul
				use:combobox.items
				class="absolute max-h-60 w-full overflow-auto rounded-md bg-white px-1 py-3 text-sm shadow-lg ring-1 ring-black/5 focus:outline-hidden"
			>
				{#each filtered as value}
					{@const active = $combobox.active === value}
					{@const selected = $combobox.selected.includes(value)}
					<li
						class="flex h-8 w-full items-center rounded-sm py-3 pr-1.5 pl-3 text-sm capitalize outline-hidden select-none {active
							? 'bg-gray-100'
							: ''}"
						use:combobox.item={{ value }}
					>
						{value.label}
						{#if selected}
							<div class="ml-auto">
								<Check />
							</div>
						{/if}
					</li>
				{:else}
					<li class="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900">
						<span class="block truncate font-normal">Nothing found</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
