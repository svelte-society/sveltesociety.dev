<script lang="ts">
	import { page } from '$app/state'
	import Dialog from '$lib/ui/Dialog/Dialog.svelte'
	import SubscribePage from './newsletter/subscribe/+page.svelte'
	import { getUser } from '../data.remote'

	let { children } = $props()

	let user = $derived(await getUser())

	// Show modal when:
	// 1. Opened via shallow routing (page.state.showNewsletterModal), OR
	// 2. User is logged in and hasn't been asked yet (newsletter_preference is null)
	let showModal = $derived(
		page.state.showNewsletterModal === true ||
			(user && user.newsletter_preference === null)
	)
</script>

{@render children()}

<Dialog id="newsletter-modal" open={showModal} mode="auto" size="md">
	<SubscribePage />
</Dialog>
