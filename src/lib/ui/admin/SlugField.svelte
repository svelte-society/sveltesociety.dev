<script lang="ts">
	import Input from '$lib/ui/form/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { generateSlug } from '$lib/admin'

	interface Props {
		nameValue: string
		slugValue: string
		onSlugChange: (value: string) => void
		nameField?: string
		slugField?: string
	}

	let {
		nameValue,
		slugValue,
		onSlugChange,
		nameField = 'name',
		slugField = 'slug'
	}: Props = $props()

	function handleGenerateSlug() {
		if (nameValue && !slugValue) {
			onSlugChange(generateSlug(nameValue))
		}
	}
</script>

<div class="flex gap-2">
	<div class="flex-1">
		<Input
			name={slugField}
			label="Slug"
			placeholder="url-friendly-name"
			description="URL-friendly version of the {nameField}"
			bind:value={slugValue}
			on:change={(e) => onSlugChange(e.currentTarget.value)}
		/>
	</div>
	<div class="flex items-end pb-0.5">
		<Button
			type="button"
			size="sm"
			variant="secondary"
			onclick={handleGenerateSlug}
			disabled={!nameValue}
		>
			Generate
		</Button>
	</div>
</div>
