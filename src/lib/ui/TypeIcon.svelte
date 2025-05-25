<script lang="ts">
	import type { Type } from '$lib/types/content'
	import ReadCvLogo from 'phosphor-svelte/lib/ReadCvLogo'
	import Video from 'phosphor-svelte/lib/Video'
	import Package from 'phosphor-svelte/lib/Package'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'
	import Files from 'phosphor-svelte/lib/Files'
	import Calendar from 'phosphor-svelte/lib/Calendar'

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
		collection: Files,
		event: Calendar
	})

	const Icon = $derived(IconMap[type])
</script>

<Icon {scale} />
