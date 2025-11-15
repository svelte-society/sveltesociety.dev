<script lang="ts">
	import { page } from '$app/state'
	import { Image } from '@unpic/svelte'

	let { src, blurhash, ...props } = $props()

	const IS_DEV = page.url.hostname === 'localhost'

	// Check if src is already an absolute URL
	const isAbsoluteUrl = $derived(src.startsWith('http://') || src.startsWith('https://'))
	const absoluteUrl = $derived(isAbsoluteUrl ? src : page.url.origin + src)
	const cdnPrefix = `//wsrv.nl/?url=`

	const url = $derived(IS_DEV ? absoluteUrl : cdnPrefix + absoluteUrl)
</script>

<Image src={url} {...props} background={blurhash} />
