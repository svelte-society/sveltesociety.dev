<script lang="ts">
	import { Avatar } from 'bits-ui'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'

	let { src, name = '' } = $props()

	function getInitials(name: string): string {
		if (!name) return '?'
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}
</script>

<Avatar.Root
	delayMs={200}
	class="data-[status=loaded]:border-svelte-900 bg-svelte-100 h-10 w-10 rounded-full border text-sm font-medium text-slate-700 uppercase hover:opacity-80 data-[status=loading]:border-transparent"
>
	<div
		class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
		<Avatar.Image src={getCachedImageWithPreset(src, 'avatar')} alt={name} />
		<Avatar.Fallback class="border-none">{getInitials(name)}</Avatar.Fallback>
	</div>
</Avatar.Root>
