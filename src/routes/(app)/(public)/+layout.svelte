<script lang="ts">
	import { page } from '$app/state'
	import Dialog from '$lib/ui/Dialog/Dialog.svelte'
	import SubscribePage from './newsletter/subscribe/+page.svelte'
	import { getUser } from '../data.remote'

	let { children } = $props()

	let user = $derived(await getUser())
</script>

{@render children()}

<Dialog id="newsletter-modal" open={page.state.showNewsletterModal} mode="auto" size="md">
	<SubscribePage />
</Dialog>
