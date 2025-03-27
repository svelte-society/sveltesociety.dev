<script lang="ts">
	import { marked } from 'marked'
	import Textarea from './form/Textarea.svelte'
	import Toggle from './Toggle.svelte'
	let { value, name = '' } = $props()

	let preview = $state(false)
</script>

<div class="relative">
	<Textarea {name} placeholder="Enter markdown here" label="Body" rows={20} />
	{#if preview}
		<div
			class="prose absolute top-6 right-0 bottom-4 left-0 max-w-none overflow-y-auto rounded-md border bg-white p-4"
		>
			{@html marked(value)}
		</div>
	{/if}
	<div class="absolute top-0 right-0">
		<Toggle text="Preview" name="tab" bind:checked={preview} />
	</div>
</div>
