<script lang="ts">
	import Toggle from '$lib/ui/Toggle.svelte'
	import { marked } from 'marked'
	import type { SuperForm } from 'sveltekit-superforms'

	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		rows?: number
	}
	let { name, label, description, placeholder, rows = 20 }: TextInputProps = $props()

	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte'

	const form: SuperForm<Record<string, unknown>, any> = getContext('form')

	const { form: formData } = form

	let preview = $state(false)
</script>

<Field {form} {name}>
	<div class="relative flex flex-col gap-2">
		<Control>
			{#snippet children({ props })}
				<div class="flex justify-between">
					<Label class="text-xs font-medium outline-none">
						{label}
					</Label>
					<Toggle text="Preview" name="tab" bind:checked={preview} />
				</div>
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
		{#if preview}
			<div
				class="prose absolute top-6 right-0 bottom-4 left-0 max-w-none overflow-y-auto rounded-md border bg-white p-4"
			>
				{@html marked($formData[name] as string)}
			</div>
		{/if}
	</div>
</Field>
