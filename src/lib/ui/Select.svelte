<script lang="ts">
	import { CaretUpDown, Check } from 'phosphor-svelte'
	import { Select } from 'bits-ui'
	type Option = {
        label: string
        value: string
    }

	type Props = {
		options: Option[]
		value?: Option
		name: string
		selected?: string
		props?: any
	}
	let { options, value = $bindable(), name, selected, props }: Props = $props()
</script>

<Select.Root type="single" bind:value {name}>
	<Select.Trigger {...props} class="data-fs-error:border-red-300 items-center data-fs-error:bg-red-50 data-fs-error:text-red-600 focus:outline-2 focus:outline-sky-200 w-full rounded-md border-2 border-transparent bg-slate-100 py-1 pl-2 px-3  text-sm placeholder-slate-500 text-left grid grid-cols-[1fr_auto]">
		{selected}
		<CaretUpDown class="text-gray-500 ml-auto size-4" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content class="focus-override bg-white shadow-2xl outline-hidden z-50 w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1">
			{#each options as option}
				<Select.Item value={option.value} class="rounded-sm data-highlighted:bg-gray-100 outline-hidden data-disabled:opacity-50 flex h-8 w-full select-none items-center py-3 pl-3 pr-1.5 text-sm capitalize">
					{#snippet children({ selected })}
						{option.label}
						{#if selected}
							<div class="ml-auto">
							<Check />
							</div>
						{/if}
					{/snippet}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Portal>
</Select.Root>