<script lang="ts">
	import {
		Html,
		Head,
		Body,
		Preview,
		Container,
		Section,
		Text,
		Heading
	} from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button, InfoBox } from '$lib/components/email'

	interface Props {
		companyName?: string
		tierName?: string
		expiresAt?: string
		websiteUrl?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		companyName = 'Acme Corp',
		tierName = 'Premium',
		expiresAt = 'February 15, 2025',
		websiteUrl = 'https://example.com',
		baseUrl = defaultBaseUrl
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
	<Preview preview={`Your sponsorship is now live: ${companyName}`} />
	<Body class="m-0 bg-slate-50 py-10">
		<Container class="mx-auto max-w-xl">
			<Header {logoUrl} />

			<Section class="rounded-b-xl bg-white p-10 shadow-md">
				<Heading as="h1" class="mb-6 text-center text-3xl font-bold text-slate-800">
					Your Sponsorship is Live!
				</Heading>

				<Text class="mb-6 text-base leading-relaxed text-slate-600">
					Great news! Your sponsorship has been approved and is now visible to our community of
					Svelte developers.
				</Text>

				<InfoBox>
					<Heading as="h2" class="text-svelte-900 text-xl font-semibold">
						{companyName}
					</Heading>
					<Text class="text-base text-slate-700">
						<span class="font-semibold">Tier:</span>
						{tierName}
					</Text>
					<Text class="text-base text-slate-700">
						<span class="font-semibold">Current Period Ends:</span>
						{expiresAt}
					</Text>
				</InfoBox>

				<Text class="mb-4 text-base leading-relaxed text-slate-600">
					Your company is now featured:
				</Text>

				<Text class="mb-2 text-base text-slate-600">
					- In our sidebar on every page
				</Text>
				<Text class="mb-2 text-base text-slate-600">
					- In our content feed alongside posts from the community
				</Text>
				{#if tierName?.toLowerCase() === 'premium'}
					<Text class="mb-6 text-base text-slate-600">
						- With an enhanced display size as a Premium sponsor
					</Text>
				{:else}
					<Text class="mb-6 text-base text-slate-600">
						- Reaching thousands of Svelte developers
					</Text>
				{/if}

				<Button href={baseUrl} variant="primary">View on Svelte Society</Button>

				<Text class="mt-6 text-center text-base leading-relaxed text-slate-600">
					Want to update your sponsorship details? Simply reply to this email and we'll help you
					out.
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
