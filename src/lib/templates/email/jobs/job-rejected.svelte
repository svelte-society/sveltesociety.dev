<script lang="ts">
	import { Html, Head, Body, Preview, Container, Section, Text, Heading } from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button, InfoBox } from '$lib/components/email'

	interface Props {
		jobTitle?: string
		rejectionReason?: string
		supportEmail?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		jobTitle = 'Senior Svelte Developer',
		rejectionReason = 'The job posting does not meet our community guidelines.',
		supportEmail = 'support@sveltesociety.dev',
		baseUrl = defaultBaseUrl
	}: Props = $props()

	const submitUrl = `${baseUrl}/jobs/submit`
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
	<Preview preview={`Update on your job posting: ${jobTitle}`} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Job Posting Not Approved
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					We've reviewed your job posting and unfortunately we're unable to publish it at this time.
				</Text>

				<InfoBox>
					<Heading as="h2" class="text-svelte-900 text-xl font-semibold">
						{jobTitle}
					</Heading>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Reason:</span>
						{rejectionReason}
					</Text>
				</InfoBox>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					If you believe this was a mistake or would like to revise your posting, please reply to
					this email or contact us at {supportEmail}. We're happy to help you get your job listing
					published.
				</Text>

				<Button href={submitUrl} variant="primary">Submit a New Posting</Button>

				<Text class="text-slate-600 text-base leading-relaxed text-center">
					We appreciate your interest in reaching the Svelte community and hope to work with you
					soon.
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
