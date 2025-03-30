<script lang="ts">
	import type { Type } from '$lib/types/content'
	import { ReadCvLogo, Video, Package, Megaphone, Image, Files } from 'phosphor-svelte'

	type Props = {
		type: Type
		scale?: number
	}

	let { type, scale = 1 }: Props = $props()

	const IconMap = $state({
		recipe: ReadCvLogo,
		video: Video,
		library: Package,
		announcement: Megaphone,
		showcase: Image,
		collection: Files
	})

	const Icon = $derived(IconMap[type])
</script>

<Icon {scale} />
