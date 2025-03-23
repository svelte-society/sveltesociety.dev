<script lang="ts">
	import { CaretUpDown, Check } from 'phosphor-svelte'
	import type { SuperForm } from 'sveltekit-superforms'
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte';
	import { Select } from 'bits-ui';

	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
        options: {
            label: string,
            value: string
        }[]
	}
	let {
		name,
		label,
		description,
		placeholder,
        options
	}: TextInputProps = $props()

	const form: SuperForm<Record<string, string>, any> = getContext('form')

    const { form: formData } = form

    const selectedOptionLabel = $derived(
		$formData[name] ? options.find(opt => opt.value === $formData[name])?.label : placeholder
	);
</script>

<Field {form} {name}>
	<div class="flex flex-col gap-2">
		<Control>
			{#snippet children({ props })}
				<Label class="text-xs font-medium outline-none">
					{label}
				</Label>
				<Select.Root type="single" bind:value={$formData[name]} name={props.name}>
					<Select.Trigger {...props} class="data-fs-error:border-red-300 items-center data-fs-error:bg-red-50 data-fs-error:text-red-600 focus:outline-2 focus:outline-sky-200 w-full rounded-md border-2 border-transparent bg-slate-100 py-1 pl-2 px-3  text-sm placeholder-slate-500 text-left grid grid-cols-[1fr_auto]">
						{selectedOptionLabel}
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
			{/snippet}
		</Control>
		<Description class="data-fs-error:sr-only text-xs text-slate-500">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>