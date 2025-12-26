<script lang="ts">
	import CaretRight from 'phosphor-svelte/lib/CaretRight'

	type Item = {
		label: string
		value: string
	}

	type Props = {
		label: string
		items: Item[]
		buildHref: (item: Item) => string
	}

	let { label, items, buildHref }: Props = $props()
</script>

<div class="group/submenu relative">
	<button
		type="button"
		role="menuitem"
		aria-haspopup="true"
		class="group/button flex h-8 w-full items-center justify-between rounded-sm py-3 pr-1.5 pl-3 text-left text-sm outline-hidden hover:bg-svelte-50 focus:bg-svelte-50 group-focus-within/submenu:bg-svelte-50"
	>
		<span>{label}</span>
		<CaretRight class="size-4 text-gray-400 group-hover/button:text-svelte-900 group-focus/button:text-svelte-900 group-focus-within/submenu:text-svelte-900" />
		<span class="sr-only">Open submenu</span>
	</button>
	<div
		role="menu"
		aria-label="{label} options"
		class="invisible absolute left-full top-0 ml-1 min-w-44 rounded-xl bg-white px-1 py-3 opacity-0 shadow-2xl transition-all select-none group-focus-within/submenu:visible group-focus-within/submenu:opacity-100"
	>
		{#each items as item (item.value)}
			<a
				href={buildHref(item)}
				role="menuitem"
				class="flex h-8 w-full items-center rounded-sm py-3 pr-1.5 pl-3 text-sm outline-hidden hover:bg-svelte-50 focus:bg-svelte-50"
			>
				{item.label}
			</a>
		{/each}
	</div>
</div>
