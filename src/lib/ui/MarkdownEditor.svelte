<script lang="ts">
import { marked } from 'marked'
let { value = $bindable(''), name = '' } = $props()

let tab = $state('write')
</script>

<div class="w-full">
	<div class="flex border-b border-gray-200">
		<button
			type="button"
			class={[{ 'border-b-2 border-svelte-900 text-svelte-900': tab === 'write'}, 'px-4 py-2 font-medium text-gray-500 hover:text-gray-700']}
			onclick={() => (tab = 'write')}
		>
			Write
		</button>
		<button
			type="button"
			class={[{ 'border-b-2 border-svelte-900 text-svelte-900': tab === 'write'}, 'px-4 py-2 font-medium text-gray-500 hover:text-gray-700']}
			onclick={() => (tab = 'preview')}
		>
			Preview
		</button>
	</div>

	<div class="mt-4">
		<textarea
			{name}
			bind:value
			placeholder="Enter markdown here"
			class={[{ 'hidden': tab === 'preview'}, 'display font-mono h-[500px] w-full resize-none rounded-md border p-4 focus:ring-2 focus:ring-blue-500']}
		></textarea>
		{#if tab === 'preview'}
			<div class="prose h-[500px] max-w-none overflow-y-auto rounded-md border bg-gray-50 p-4">
				{@html marked(value)}
			</div>
		{/if}
	</div>
</div>
