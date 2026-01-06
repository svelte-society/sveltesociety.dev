<script lang="ts">
	import { Html, Head, Body, Preview, Container, Section, Text, Heading } from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, InfoBox } from '$lib/components/email'

	interface Props {
		jobTitle?: string
		tierName?: string
		expiresAt?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		jobTitle = 'Senior Svelte Developer',
		tierName = 'Standard',
		expiresAt = 'February 15, 2025',
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
	<Preview preview={`Job posting received: ${jobTitle}`} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Job Posting Received
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					Thank you for submitting your job posting! Your listing is currently being reviewed and
					will go live once it has been accepted.
				</Text>

				<InfoBox>
					<Heading as="h2" class="text-svelte-900 text-xl font-semibold">
						{jobTitle}
					</Heading>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Plan:</span>
						{tierName}
					</Text>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Expires:</span>
						{expiresAt} (once live)
					</Text>
				</InfoBox>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					When candidates apply, you'll receive an email notification with their profile
					information.
				</Text>

				<Text class="text-slate-600 text-base leading-relaxed">
					<span class="font-semibold">Need to update your listing?</span> Simply reply to this email with
					your changes and we'll take care of it.
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
