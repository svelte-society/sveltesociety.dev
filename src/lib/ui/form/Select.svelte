<script lang="ts">
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

	import type { SuperForm } from 'sveltekit-superforms'
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte';
	import { Select } from 'bits-ui';

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
					<Select.Trigger {...props} class="data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600 focus:outline-2 focus:outline-sky-200 w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm placeholder-slate-500">
						{selectedOptionLabel}
					</Select.Trigger>
					<Select.Content>
						{#each options as option}
							<Select.Item value={option.value}>
								{option.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Control>
		<Description class="data-fs-error:sr-only text-xs text-slate-500">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>