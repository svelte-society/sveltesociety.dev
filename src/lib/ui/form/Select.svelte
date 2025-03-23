<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms'
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte';
	import Select from '$lib/ui/Select.svelte'

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
				<Select {options} {name} bind:value={$formData[name]} {props} selected={selectedOptionLabel} />
				
			{/snippet}
		</Control>
		<Description class="data-fs-error:sr-only text-xs text-slate-500">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>