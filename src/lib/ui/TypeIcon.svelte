<script lang="ts">
	import type { Type } from '$lib/types/content'
	import ReadCvLogo from 'phosphor-svelte/lib/ReadCvLogo'
	import Video from 'phosphor-svelte/lib/Video'
	import Package from 'phosphor-svelte/lib/Package'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'
	import Files from 'phosphor-svelte/lib/Files'
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import Link from 'phosphor-svelte/lib/Link'
	import Draft from 'phosphor-svelte/lib/FileDashed'
	import Archive from 'phosphor-svelte/lib/Archive'
	import Published from 'phosphor-svelte/lib/Globe'

	type Props = {
		type: Type
		size?: number | string
		color?: string
	}

	let { type, size = 24, color }: Props = $props()

	const IconMap = $state({
		recipe: ReadCvLogo,
		video: Video,
		library: Package,
		announcement: Megaphone,
		collection: Files,
		event: Calendar,
		link: Link,
		draft: Draft,
		published: Published,
		archive: Archive
	})

	const Icon = $derived(IconMap[type])
</script>

<Icon {size} {color} />
