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
		billingType?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		companyName = 'Acme Corp',
		tierName = 'Premium',
		billingType = 'monthly',
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
	<Preview preview={`Welcome to Svelte Society Sponsors, ${companyName}!`} />
	<Body class="m-0 bg-slate-50 py-10">
		<Container class="mx-auto max-w-xl">
			<Header {logoUrl} />

			<Section class="rounded-b-xl bg-white p-10 shadow-md">
				<Heading as="h1" class="mb-6 text-center text-3xl font-bold text-slate-800">
					Welcome to Svelte Society!
				</Heading>

				<Text class="mb-6 text-base leading-relaxed text-slate-600">
					Thank you for becoming a sponsor! Your support helps us maintain and grow the Svelte
					community.
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
						<span class="font-semibold">Billing:</span>
						{billingType}
					</Text>
				</InfoBox>

				<Text class="mb-4 text-base leading-relaxed text-slate-600">
					Your sponsorship is currently pending review. Our team will review your submission and
					activate it shortly. You'll receive another email once your sponsorship goes live.
				</Text>

				<Text class="mb-4 text-base leading-relaxed text-slate-600">
					<span class="font-semibold">What happens next?</span>
				</Text>

				<Text class="mb-2 text-base text-slate-600">
					1. Our team reviews your submission (usually within 24 hours)
				</Text>
				<Text class="mb-2 text-base text-slate-600">
					2. Once approved, your sponsorship will be visible to thousands of Svelte developers
				</Text>
				<Text class="mb-6 text-base text-slate-600">
					3. You'll receive a confirmation email when your sponsorship goes live
				</Text>

				<Button href={baseUrl} variant="primary">Visit Svelte Society</Button>

				<Text class="text-center text-base leading-relaxed text-slate-600">
					Have questions? Simply reply to this email and we'll be happy to help.
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
