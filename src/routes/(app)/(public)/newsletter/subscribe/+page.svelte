<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import { Envelope, CheckCircle } from 'phosphor-svelte'
	import { subscribeNewsletter, userDecline } from '$lib/ui/newsletter.remote'
	import { getUser } from '../../../data.remote'

	let user = $derived(await getUser())
</script>

<div class="space-y-4" data-testid="newsletter-subscribe-page">
	{#if subscribeNewsletter.result?.success}
		<div class="flex items-center gap-2 text-green-600" data-testid="newsletter-success">
			<CheckCircle weight="fill" class="size-5" />
			<span class="text-sm">{subscribeNewsletter.result.text}</span>
		</div>
	{:else}
		<div class="flex items-center gap-3">
			<div class="rounded-full bg-orange-100 p-2">
				<Envelope weight="fill" class="size-6 text-orange-600" />
			</div>
			<p class="text-sm text-gray-600">
				Get the latest Svelte news, tutorials, and community updates delivered to your inbox.
			</p>
		</div>

		<form {...subscribeNewsletter} class="space-y-3">
			<Input
				{...subscribeNewsletter.fields.email.as('email')}
				value={user?.email ?? ''}
				placeholder="your@email.com"
				issues={subscribeNewsletter.fields.email.issues()}
			/>
			<div class="flex gap-2">
				<Button
					type="submit"
					disabled={!!subscribeNewsletter.pending}
					data-testid="newsletter-subscribe-btn"
				>
					{subscribeNewsletter.pending ? 'Subscribing...' : 'Yes, subscribe me'}
				</Button>
			</div>
		</form>
		<form {...userDecline} id="decline-form">
			<Button
				type="button"
				variant="ghost"
				disabled={!!userDecline.pending}
				data-testid="newsletter-decline-btn"
			>
				No thanks
			</Button>
		</form>
	{/if}
</div>
