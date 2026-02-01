<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import { Envelope, CheckCircle } from 'phosphor-svelte'
	import { subscribePageNewsletter, userDecline } from '$lib/ui/newsletter.remote'
	import { getUser } from '../../../data.remote'

	let user = $derived(await getUser())
</script>

<div class="space-y-4 max-w-lg mx-auto" data-testid="newsletter-subscribe-page">
	<h2 class="mb-4 text-xl font-bold">Newsletter</h2>
	{#if subscribePageNewsletter.result?.success}
		<div class="flex items-center gap-2 text-green-600" data-testid="newsletter-success">
			<CheckCircle weight="fill" class="size-5" />
			<span class="text-sm">{subscribePageNewsletter.result.text}</span>
		</div>
	{:else}
		<div class="flex items-center gap-3">
			<div class="rounded-full bg-orange-100 p-2">
				<Envelope weight="fill" class="size-6 text-orange-600" />
			</div>
			<div>
				<p class="text-sm text-gray-600">Stay up to date with the Svelte ecosystem.</p>
			</div>
		</div>

		<ul class="space-y-2 text-sm text-gray-600">
			<li class="flex items-start gap-2">
				<span class="text-svelte-500">•</span>
				<span
					><strong>This Week in Svelte</strong> — A weekly roundup of the best tutorials, libraries, and
					community highlights</span
				>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-svelte-500">•</span>
				<span
					><strong>Featured Jobs</strong> — Hand-picked Svelte job opportunities from top companies</span
				>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-svelte-500">•</span>
				<span
					><strong>Community News</strong> — Announcements, events, and updates from the Svelte team</span
				>
			</li>
		</ul>

		<form {...subscribePageNewsletter} class="space-y-3">
			<Input
				{...subscribePageNewsletter.fields.email.as('email')}
				placeholder="your@email.com"
				issues={subscribePageNewsletter.fields.email.issues()}
			/>
			<div class="mt-3 flex gap-2">
				<Button
					type="submit"
					disabled={!!subscribePageNewsletter.pending}
					data-testid="newsletter-subscribe-btn"
				>
					{subscribePageNewsletter.pending ? 'Subscribing...' : 'Yes, subscribe me'}
				</Button>
				<Button
					variant="ghost"
					disabled={!!userDecline.pending}
					data-testid="newsletter-decline-btn"
					{...userDecline.buttonProps}
				>
					No thanks
				</Button>
			</div>
			<p class="text-xs text-slate-500">
				Newsletter data is processed by Plunk, our email service provider. See our <a
					href="/privacy"
					class="text-svelte-900 hover:text-svelte-500 underline">Privacy Policy</a
				>.
			</p>
		</form>
	{/if}
</div>
