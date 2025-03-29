<script lang="ts">
	import { ReadCvLogo, Video, Package, Megaphone, Image, Files } from 'phosphor-svelte'

	type Props = {
		type: 'recipe' | 'video' | 'library' | 'announcement' | 'showcase'
	}

	let { type }: Props = $props()

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

<Icon />
