<script lang="ts" generics="T">
	import type { Type } from '$lib/types/content'

	interface TextInputProps {
		label?: string
		description?: string
		options: { label: string; value: string; type: string }[]
		name: string
	}
	let { name, label, description, options }: TextInputProps = $props()

	import type { SuperForm } from 'sveltekit-superforms'

	import { Control, Description, Legend, Fieldset, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte'
	import TypeIcon from '$lib/ui/TypeIcon.svelte'

	const form: SuperForm<Record<string, unknown>, any> = getContext('form')

	const { form: formData } = form
</script>

<Fieldset {form} {name} class="flex flex-col gap-4">
	<Legend class="text-xs font-medium outline-none">{label}</Legend>
	<div class="mt-2 flex gap-2">
		{#each options as option}
			<Control>
				{#snippet children({ props })}
					<Label
						class={[
							'grid cursor-pointer gap-2 rounded-lg border-2 border-slate-200 p-4 px-6 text-slate-500 transition-colors duration-75 hover:border-slate-400 hover:text-slate-700',
							$formData[name] === option.value &&
								'border-slate-900 text-slate-900 hover:border-slate-900'
						]}
					>
						<TypeIcon type={option.type} size={64} color="currentColor" />
						<span class="mx-auto">{option.label}</span>
						<input
							{...props}
							type="radio"
							bind:group={$formData[name]}
							value={option.value}
							class="sr-only"
						/>
					</Label>
				{/snippet}
			</Control>
		{/each}
	</div>
	<Description class="text-xs text-slate-500 data-fs-error:sr-only">{description}</Description>
	<FieldErrors class="text-xs text-red-600" />
</Fieldset>
