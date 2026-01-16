<script lang="ts">
	import Button from './Button.svelte'
	import SidebarCard from './SidebarCard.svelte'
	import { Envelope, CheckCircle, Warning } from 'phosphor-svelte'
	import { subscribeNewsletter } from './newsletter.remote'

	let showSuccess = $state(false)
	let errorMessage = $state('')
</script>

<SidebarCard title="Newsletter" padding="compact" data-testid="newsletter-subscribe">
	{#snippet icon()}
		<Envelope weight="bold" class="text-orange-600" />
	{/snippet}

	{#if showSuccess}
		<div class="flex items-center gap-2 text-green-600" data-testid="newsletter-success">
			<CheckCircle weight="fill" />
			<span class="text-xs">Check your email to confirm!</span>
		</div>
	{:else}
		<p class="text-xs text-gray-600">Get the latest Svelte news and resources delivered weekly.</p>

		<form
			{...subscribeNewsletter.enhance(async ({ submit }) => {
				errorMessage = ''
				try {
					await submit()
					if (subscribeNewsletter.result?.success === true) {
						showSuccess = true
					} else {
						errorMessage = subscribeNewsletter.result?.text || 'Failed to subscribe'
					}
				} catch {
					errorMessage = 'An error occurred. Please try again.'
				}
			})}
			class="flex flex-col gap-2"
		>
			<input
				{...subscribeNewsletter.fields.email.as('email')}
				placeholder="your@email.com"
				disabled={!!subscribeNewsletter.pending}
				class="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-sm placeholder-slate-400 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 disabled:opacity-50"
				data-testid="newsletter-email-input"
			/>

			{#if errorMessage || subscribeNewsletter.fields.email.issues()?.length}
				<div class="flex items-center gap-1 text-xs text-red-600" data-testid="newsletter-error">
					<Warning weight="fill" size={12} />
					<span>{errorMessage || subscribeNewsletter.fields.email.issues()?.[0]}</span>
				</div>
			{/if}

			<Button
				type="submit"
				size="sm"
				disabled={!!subscribeNewsletter.pending}
				data-testid="newsletter-submit"
			>
				{subscribeNewsletter.pending ? 'Subscribing...' : 'Subscribe'}
			</Button>
		</form>
	{/if}
</SidebarCard>
