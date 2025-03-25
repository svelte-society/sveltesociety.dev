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
				.includes($combobox.filter.toLowerCase().replace(/\s+/g, '')),
		),
	)
</script>

<div class="w-full">
	<div class="relative">
		<span class="inline-block w-full rounded-sm shadow-xs">
			<button
				use:combobox.button
				class="focus:outline-2 focus:outline-sky-200 w-full rounded-md border-2 border-transparent bg-slate-100 py-0.5 pl-2 px-3 text-sm placeholder-slate-500 text-left"
			>
				<div class="flex flex-wrap gap-2">
					{#each $combobox.selected as selected (selected.value)}
						<span class="flex items-center gap-1 rounded-sm bg-white border-1 border-slate-300 px-2 py-0.5">
							<span>{selected.label}</span>
							<div use:combobox.deselect={selected}>
								<X weight="bold" />
							</div>
						</span>
					{/each}
					<input
						use:combobox.input
						placeholder="Start typing a tag name"
						class="w-auto border-none py-0.5 grow text-sm text-gray-900 focus:ring-0"
					/>
				</div>
                
				<span class="pointer-events-none absolute inset-y-0 right-2 flex items-center pr-2">
					<CaretUpDown class="text-gray-500 ml-auto size-4" />
				</span>
			</button>
		</span>
		{#if $combobox.expanded}
            <ul
            use:combobox.items
            class="absolute max-h-60 w-full overflow-auto rounded-md bg-white py-3 px-1 text-sm ring-1 shadow-lg ring-black/5 focus:outline-hidden"
        >
            {#each filtered as value}
                {@const active = $combobox.active === value}
                {@const selected = $combobox.selected.includes(value)}
                <li
                    class="rounded-sm outline-hidden flex h-8 w-full select-none items-center py-3 pl-3 pr-1.5 text-sm capitalize {active
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