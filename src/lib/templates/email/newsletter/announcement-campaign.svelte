<script lang="ts">
	import {
		Html,
		Head,
		Body,
		Preview,
		Container,
		Section,
		Text,
		Heading,
		Hr,
		Link
	} from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button, SponsorSlot } from '$lib/components/email'

	interface Sponsor {
		name: string
		logo: string
		url: string
	}

	interface Props {
		subject?: string
		bodyHtml: string
		ctaText?: string | null
		ctaUrl?: string | null
		baseUrl?: string
		unsubscribeUrl?: string
		sponsors?: Sponsor[]
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		subject = 'Svelte Society Announcement',
		bodyHtml,
		ctaText,
		ctaUrl,
		baseUrl = defaultBaseUrl,
		unsubscribeUrl = 'https://app.useplunk.com/subscribe/{{plunk_id}}',
		sponsors = []
	}: Props = $props()

	const logoUrl = `${baseUrl}/email/logo.svg`
	const aboutUrl = `${baseUrl}/about`
</script>

<Html lang="en">
	<Head>
		<style>
			body {
				font-family:
					Inter,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					sans-serif;
			}
		</style>
	</Head>
	<Preview preview={subject} />
	<Body class="bg-slate-50 m-0 py-0 sm:py-10">
		<Container class="max-w-xl sm:mx-auto">
			<Header {logoUrl} />

			<!-- Content -->
			<Section class="bg-white p-2 sm:p-6 sm:rounded-b-xl sm:shadow-md">
				<!-- Announcement Badge -->
				<Text class="text-purple-600 text-xs uppercase tracking-wide mb-2 text-center font-semibold">
					Announcement
				</Text>

				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					{subject}
				</Heading>

				<!-- Body Content -->
				<!-- SECURITY: bodyHtml is trusted admin-authored content. This is safe because:
				     1. Only authenticated admins can create/edit announcement campaigns
				     2. Content is entered through the admin dashboard
				     3. If sanitization is needed in future, use DOMPurify before storing -->
				<div class="text-slate-700 text-base leading-relaxed">
					{@html bodyHtml}
				</div>

				<!-- CTA Button -->
				{#if ctaText && ctaUrl}
					<Section class="mt-8">
						<Button href={ctaUrl} variant="primary">{ctaText}</Button>
					</Section>
				{/if}

				<!-- Sponsor Slot -->
				<SponsorSlot {sponsors} />

				<Footer {aboutUrl} />

				<!-- Unsubscribe Link -->
				<Hr class="border-0 border-t border-slate-200 my-6" />
				<Text class="text-slate-400 text-xs text-center">
					Don't want to receive these emails?
					<Link href={unsubscribeUrl} class="text-slate-500 underline">Unsubscribe</Link>
				</Text>
			</Section>
		</Container>
	</Body>
</Html>
