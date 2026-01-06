<script lang="ts">
	import { Html, Head, Body, Preview, Container, Section, Text, Heading } from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button, InfoBox } from '$lib/components/email'

	interface Props {
		jobTitle?: string
		companyName?: string
		expiresAt?: string
		jobUrl?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		jobTitle = 'Senior Svelte Developer',
		companyName = 'Acme Corp',
		expiresAt = 'February 15, 2025',
		jobUrl = 'https://sveltesociety.dev/jobs/senior-svelte-developer',
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
	<Preview preview={`Your job posting is now live: ${jobTitle}`} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Your Job Posting is Live!
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					Great news! Your job posting has been approved and is now visible to our community of
					Svelte developers.
				</Text>

				<InfoBox>
					<Heading as="h2" class="text-svelte-900 text-xl font-semibold">
						{jobTitle}
					</Heading>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Company:</span>
						{companyName}
					</Text>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Expires:</span>
						{expiresAt}
					</Text>
				</InfoBox>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					You'll receive email notifications when candidates apply for this position. Make sure to
					check your inbox regularly!
				</Text>

				<Button href={jobUrl} variant="primary">View Your Job Posting</Button>

				<Text class="text-slate-600 text-base leading-relaxed text-center">
					Need to make changes? Simply reply to this email and we'll help you out.
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
