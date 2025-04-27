<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms'

	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { Combobox } from 'bits-ui'
	import { getContext } from 'svelte'
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown'
	import Check from 'phosphor-svelte/lib/Check'
	import TagIcon from 'phosphor-svelte/lib/Tag'

	import type { Component } from 'svelte'

	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		type?: string
		options: { label: string; value: string }[]
		value?: string[]
		Icon?: Component
	}
	let { name, label, description, placeholder, options, Icon = TagIcon }: TextInputProps = $props()
	const form: SuperForm<Record<string, any>, any> = getContext('form')

	const { form: formData } = form

	let searchValue = $state('')

	const filteredOptions = $derived(
		searchValue === ''
			? options
			: options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
	)
</script>

<Field {form} {name}>
	<div class="flex flex-col gap-2">
		<Control>
			{#snippet children({ props })}
				<Label class="text-xs font-medium outline-none">
					{label}
				</Label>
				<Combobox.Root
					bind:value={$formData[name]}
					{name}
					type="multiple"
					onValueChange={(o) => {
						if (!o) searchValue = ''
					}}
				>
					<Combobox.Trigger>
						<div class="relative">
							<Icon class="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-slate-500" />
							<Combobox.Input
								clearOnDeselect
								oninput={(e) => (searchValue = e.currentTarget.value)}
								{placeholder}
								aria-label={placeholder}
								class="w-full rounded-md border-2 border-transparent bg-slate-100 px-7 py-1.5 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200 data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600"
							/>
							<CaretUpDown
								class="absolute top-1/2 right-2 size-4 -translate-y-1/2 text-slate-500"
							/>
						</div>
					</Combobox.Trigger>
					<Combobox.Portal>
						<Combobox.Content
							class="focus-override z-50 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-select-anchor-width)] rounded-xl bg-white px-1 py-3 shadow-2xl outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
						>
							{#each filteredOptions as option, index (option.value)}
								<Combobox.Item
									value={option.value}
									label={option.label}
									class="flex h-8 w-full items-center rounded-sm py-3 pr-1.5 pl-3 text-sm capitalize outline-hidden select-none data-disabled:opacity-50 data-highlighted:bg-gray-100"
								>
									{#snippet children({ selected })}
										{option.label}
										{#if selected}
											<div class="ml-auto">
												<Check />
											</div>
										{/if}
									{/snippet}
								</Combobox.Item>
							{/each}
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			{/snippet}
		</Control>
		<Description class="text-xs text-slate-500 data-fs-error:sr-only">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>
