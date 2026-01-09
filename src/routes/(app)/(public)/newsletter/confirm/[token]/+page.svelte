<script lang="ts">
	import { CheckCircle, XCircle, Clock } from 'phosphor-svelte'
	import Button from '$lib/ui/Button.svelte'

	let { data } = $props()

	const content = $derived.by(() => {
		switch (data.status) {
			case 'success':
				return {
					icon: CheckCircle,
					iconColor: 'text-green-500',
					bgColor: 'bg-green-100',
					title: 'Subscription Confirmed!',
					message:
						"You're now subscribed to the Svelte Society newsletter. Look out for our updates in your inbox!"
				}
			case 'invalid':
				return {
					icon: XCircle,
					iconColor: 'text-red-500',
					bgColor: 'bg-red-100',
					title: 'Invalid Link',
					message:
						'This confirmation link is invalid or has already been used. Please try subscribing again.'
				}
			default:
				return {
					icon: Clock,
					iconColor: 'text-amber-500',
					bgColor: 'bg-amber-100',
					title: 'Something Went Wrong',
					message: "We couldn't confirm your subscription. Please try again later."
				}
		}
	})
</script>

<svelte:head>
	<title>{content.title} - Svelte Society Newsletter</title>
</svelte:head>

<div class="mx-auto max-w-xl py-12 text-center" data-testid="newsletter-confirm-page">
	<div class="mb-6 flex justify-center">
		<div class="flex h-20 w-20 items-center justify-center rounded-full {content.bgColor}">
			<svelte:component this={content.icon} size={48} weight="fill" class={content.iconColor} />
		</div>
	</div>

	<h1 class="text-3xl font-bold text-slate-900" data-testid="confirm-title">{content.title}</h1>
	<p class="mt-4 text-lg text-slate-600" data-testid="confirm-message">{content.message}</p>
	<div data-testid="confirm-status" data-status={data.status} class="hidden"></div>

	<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
		<Button href="/" data-testid="browse-button">Browse Content</Button>
		{#if data.status !== 'success'}
			<Button variant="secondary" href="/" data-testid="try-again-button">Try Again</Button>
		{/if}
	</div>
</div>
