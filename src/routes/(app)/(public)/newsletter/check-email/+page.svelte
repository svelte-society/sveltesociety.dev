<script lang="ts">
	import { Envelope } from 'phosphor-svelte'
	import Button from '$lib/ui/Button.svelte'
</script>

<svelte:head>
	<title>Check Your Email - Svelte Society Newsletter</title>
</svelte:head>

<div class="mx-auto max-w-xl py-12 text-center" data-testid="newsletter-check-email-page">
	<div class="mb-6 flex justify-center">
		<div class="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
			<Envelope size={48} weight="fill" class="text-orange-500" />
		</div>
	</div>

	<h1 class="text-3xl font-bold text-slate-900">Check Your Email</h1>
	<p class="mt-4 text-lg text-slate-600">
		We've sent a confirmation link to your email address. Click the link to complete your
		subscription.
	</p>

	<p class="mt-4 text-sm text-slate-500">
		Didn't receive the email? Check your spam folder or try subscribing again.
	</p>

	<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
		<Button href="/" data-testid="browse-button">Browse Content</Button>
		<Button variant="secondary" href="/newsletter/subscribe" data-testid="try-again-button">
			Try Again
		</Button>
	</div>
</div>
