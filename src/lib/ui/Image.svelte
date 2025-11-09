<script lang="ts">
	import { page } from '$app/state'
	import { Image } from '@unpic/svelte'

	let { src, blurhash, ...props } = $props()

	const IS_DEV = page.url.hostname === 'localhost'

	const absoluteUrl = $derived(page.url.origin + src)
	const cdnPrefix = `//wsrv.nl/?url=`

	const url = $derived(IS_DEV ? absoluteUrl : cdnPrefix + absoluteUrl)
</script>

<Image src={url} {...props} background={blurhash} />
