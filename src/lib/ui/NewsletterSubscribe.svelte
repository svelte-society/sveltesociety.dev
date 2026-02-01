<script lang="ts">
	import Button from './Button.svelte'
	import SidebarCard from './SidebarCard.svelte'
	import { Envelope, Warning } from 'phosphor-svelte'
	import { subscribeNewsletter } from './newsletter.remote'
</script>

<SidebarCard title="Newsletter" padding="compact" data-testid="newsletter-subscribe">
	{#snippet icon()}
		<Envelope weight="bold" class="text-orange-600" />
	{/snippet}

	<p class="text-xs text-gray-600">Get the latest Svelte news and resources delivered weekly.</p>

	<form {...subscribeNewsletter.for('newsletter-sidebar')} class="flex flex-col gap-2">
		<input
			type="email"
			{...subscribeNewsletter.for('newsletter-sidebar').fields.email}
			placeholder="your@email.com"
			disabled={!!subscribeNewsletter.for('newsletter-sidebar').pending}
			class="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-sm placeholder-slate-400 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 disabled:opacity-50"
			data-testid="newsletter-email-input"
		/>

		{#if subscribeNewsletter.for('newsletter-sidebar').fields.email.issues()?.length}
			<div class="flex items-center gap-1 text-xs text-red-600" data-testid="newsletter-error">
				<Warning weight="fill" size={12} />
				<span>{subscribeNewsletter.for('newsletter-sidebar').fields.email.issues()?.[0]?.message}</span>
			</div>
		{/if}

		<Button
			type="submit"
			size="sm"
			disabled={!!subscribeNewsletter.for('newsletter-sidebar').pending}
			data-testid="newsletter-submit"
		>
			{subscribeNewsletter.for('newsletter-sidebar').pending ? 'Subscribing...' : 'Subscribe'}
		</Button>
		<p class="text-xs text-slate-500">
			Data processed by Plunk. <a
				href="/privacy"
				class="text-svelte-900 hover:text-svelte-500 underline">Privacy Policy</a
			>
		</p>
	</form>
</SidebarCard>
