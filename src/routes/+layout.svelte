<script>
	import '../app.css'
	import { onNavigate } from '$app/navigation'

	let { children } = $props()

	onNavigate((navigation) => {
		if (!document.startViewTransition) return

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	})
</script>

<svelte:head>
	<script
		defer
		src="https://umami.sveltesociety.dev/script.js"
		data-website-id="d91db9d2-f32f-4781-a861-efba1953edea"
	></script>
</svelte:head>

{@render children()}
