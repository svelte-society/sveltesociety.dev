<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms'
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte'
	import Select from '$lib/ui/Select.svelte'

	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		disabled?: boolean
		options: {
			label: string
			value: string
		}[]
		testId?: string
	}
	let {
		name,
		label,
		description,
		placeholder,
		options,
		disabled = false,
		testId
	}: TextInputProps = $props()

	const computedTestId = $derived(testId || `select-${name}`)

	const form: SuperForm<Record<string, string>, any> = getContext('form')

	const { form: formData } = form

	const selectedOptionLabel = $derived(
		$formData[name] ? options.find((opt) => opt.value === $formData[name])?.label : placeholder
	)
</script>

<Field {form} {name}>
	<div class="flex flex-col gap-2">
		<Control>
			{#snippet children({ props })}
				<Label class="text-xs font-medium outline-none">
					{label}
				</Label>
				<Select
					{options}
					{name}
					bind:value={$formData[name]}
					props={{ ...props, placeholder }}
					{disabled}
					testId={computedTestId}
				/>
			{/snippet}
		</Control>
		<Description class="text-xs text-slate-500 data-fs-error:sr-only">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>
