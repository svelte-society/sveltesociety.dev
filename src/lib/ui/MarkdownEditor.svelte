<script lang="ts">
	import { marked } from 'marked'
	let { value = $bindable(''), name = '' } = $props()

	let tab = $state('write')
</script>

<div class="w-full">
	<div class="flex border-b border-gray-200">
		<button
			type="button"
			class={[
				'border-b-2 px-4 py-2 font-medium text-gray-500 hover:text-gray-700',
				{ 'border-svelte-900 text-svelte-900 hover:text-svelte-500': tab === 'write' }
			]}
			onclick={() => (tab = 'write')}
		>
			Write
		</button>
		<button
			type="button"
			class={[
				'border-b-2 px-4 py-2 font-medium text-gray-500 hover:text-gray-700',
				{ 'border-svelte-900 text-svelte-900 hover:text-svelte-500': tab === 'preview' }
			]}
			onclick={() => (tab = 'preview')}
		>
			Preview
		</button>
	</div>

	{#if tab === 'write'}
		<textarea
			{name}
			bind:value
			placeholder="Enter markdown here"
			class="h-[500px] w-full resize-none bg-slate-100 p-4 font-mono focus:outline-2 focus:outline-sky-200"
		></textarea>
	{:else}
		<div class="prose h-[500px] max-w-none overflow-y-auto rounded-md p-4">
			{@html marked(value)}
		</div>
	{/if}
</div>
