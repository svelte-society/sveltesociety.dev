<script lang="ts">
	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		rows?: number
	}
	let { name, label, description, placeholder, rows = 4 }: TextInputProps = $props()

	import type { SuperForm } from 'sveltekit-superforms'

	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte'

	const form: SuperForm<Record<string, unknown>, any> = getContext('form')

	const { form: formData } = form
</script>

<Field {form} {name}>
	<div class="flex flex-col gap-2">
		<Control>
			{#snippet children({ props })}
				<Label class="text-xs font-medium outline-none">
					{label}
				</Label>
				<textarea
					{rows}
					class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200 data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600"
					{...props}
					bind:value={$formData[name]}
					{placeholder}
				></textarea>
			{/snippet}
		</Control>
		<Description class="text-xs text-slate-500 data-fs-error:sr-only">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>
