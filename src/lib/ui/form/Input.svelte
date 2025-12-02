<script lang="ts">
	interface TextInputProps {
		label?: string
		description?: string
		placeholder?: string
		name: string
		type?: string
		'data-testid'?: string
	}
	let { name, label, description, placeholder, type, 'data-testid': testId }: TextInputProps = $props()

	import type { SuperForm } from 'sveltekit-superforms'

	import { Control, Description, Field, FieldErrors, Label } from 'formsnap'
	import { getContext } from 'svelte'

	const form: SuperForm<Record<string, unknown>, any> = getContext('form')

	const { form: formData } = form

	const computedTestId = $derived(testId || `input-${name}`)

	// Handle nested paths like "metadata.link"
	function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
		return path.split('.').reduce<unknown>((acc, key) => {
			if (acc && typeof acc === 'object' && key in acc) {
				return (acc as Record<string, unknown>)[key]
			}
			return undefined
		}, obj)
	}

	function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
		const keys = path.split('.')
		const lastKey = keys.pop()!
		const target = keys.reduce<Record<string, unknown>>((acc, key) => {
			if (!acc[key] || typeof acc[key] !== 'object') {
				acc[key] = {}
			}
			return acc[key] as Record<string, unknown>
		}, obj)
		target[lastKey] = value
	}

	let inputValue = $derived(getNestedValue($formData, name) as string | undefined)

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement
		if (name.includes('.')) {
			setNestedValue($formData, name, target.value)
			// Trigger reactivity
			$formData = { ...$formData }
		} else {
			$formData[name] = target.value
		}
	}
</script>

<Field {form} {name}>
	<div class="flex flex-col gap-2">
		<Control>
			{#snippet children({ props })}
				<Label class="text-xs font-medium outline-none">
					{label}
				</Label>
				<input
					{type}
					class="w-full rounded-md border-2 border-transparent bg-slate-100 px-2 py-1.5 pr-7 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200 data-fs-error:border-red-300 data-fs-error:bg-red-50 data-fs-error:text-red-600"
					{...props}
					value={inputValue ?? ''}
					oninput={handleInput}
					{placeholder}
					data-testid={computedTestId}
				/>
			{/snippet}
		</Control>
		<Description class="text-xs text-slate-500 data-fs-error:sr-only">{description}</Description>
		<FieldErrors class="text-xs text-red-600" />
	</div>
</Field>
