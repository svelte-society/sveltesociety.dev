<script lang="ts">
	import Button from './Button.svelte'
	import { Envelope, CheckCircle, Warning } from 'phosphor-svelte'

	let email = $state('')
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle')
	let errorMessage = $state('')

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		if (!email.trim()) {
			status = 'error'
			errorMessage = 'Please enter an email address'
			return
		}

		status = 'loading'

		try {
			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim() })
			})

			const data = await response.json()

			if (data.success) {
				status = 'success'
				email = ''
			} else {
				status = 'error'
				errorMessage = data.error || 'Failed to subscribe'
			}
		} catch {
			status = 'error'
			errorMessage = 'An error occurred. Please try again.'
		}
	}
</script>

<div
	class="grid gap-2 rounded border border-slate-200 bg-gray-50 px-4 py-3 text-sm"
	data-testid="newsletter-subscribe"
>
	<div class="flex items-center gap-2">
		<Envelope weight="bold" class="text-orange-600" />
		<h3 class="font-bold">Newsletter</h3>
	</div>

	{#if status === 'success'}
		<div class="flex items-center gap-2 text-green-600" data-testid="newsletter-success">
			<CheckCircle weight="fill" />
			<span class="text-xs">Check your email to confirm!</span>
		</div>
	{:else}
		<p class="text-xs text-gray-600">Get the latest Svelte news and resources delivered weekly.</p>

		<form onsubmit={handleSubmit} class="flex flex-col gap-2">
			<input
				type="email"
				bind:value={email}
				placeholder="your@email.com"
				disabled={status === 'loading'}
				class="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-sm placeholder-slate-400 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 disabled:opacity-50"
				data-testid="newsletter-email-input"
			/>

			{#if status === 'error'}
				<div
					class="flex items-center gap-1 text-xs text-red-600"
					data-testid="newsletter-error"
				>
					<Warning weight="fill" size={12} />
					<span>{errorMessage}</span>
				</div>
			{/if}

			<Button
				type="submit"
				size="sm"
				disabled={status === 'loading'}
				data-testid="newsletter-submit"
			>
				{status === 'loading' ? 'Subscribing...' : 'Subscribe'}
			</Button>
		</form>
	{/if}
</div>
