<script lang="ts">
	import type { ClassValue } from 'svelte/elements'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import { avatarVariants, type AvatarSize } from './avatar.variants'

	type Props = {
		src?: string | null
		name?: string
		size?: AvatarSize
		class?: ClassValue
	}

	let { src, name = '', size, class: className }: Props = $props()

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

<div class={[avatarVariants({ size }), className]}>
	<span class="select-none">{getInitials(name)}</span>
	{#if src}
		<img
			src={getCachedImageWithPreset(src, 'avatar')}
			alt={name}
			loading="lazy"
			decoding="async"
			class="absolute inset-0.5 h-[calc(100%-4px)] w-[calc(100%-4px)] rounded-full border-0 object-cover"
		/>
	{/if}
</div>
