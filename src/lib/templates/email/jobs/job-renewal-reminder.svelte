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
		jobTitle?: string
		companyName?: string
		expiresAt?: string
		daysRemaining?: number
		renewUrl?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		jobTitle = 'Senior Svelte Developer',
		companyName = 'Acme Corp',
		expiresAt = 'January 20, 2025',
		daysRemaining = 7,
		renewUrl = 'https://sveltesociety.dev/jobs/submit',
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
	<Preview preview={`Your job posting expires in ${daysRemaining} days: ${jobTitle}`} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Your Job Posting Expires Soon
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					Just a friendly reminder that your job posting on Svelte Society will expire in {daysRemaining}
					{daysRemaining === 1 ? 'day' : 'days'}.
				</Text>

				<InfoBox>
					<Heading as="h2" class="text-svelte-900 text-xl font-semibold mb-3 mt-0">
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
					Still looking for the perfect candidate? Renew your posting to keep it visible to our
					community of talented Svelte developers.
				</Text>

				<Button href={renewUrl} variant="primary">Renew Your Posting</Button>

				<Text class="text-slate-600 text-base leading-relaxed text-center">
					If you've already filled the position, no action is needed. The posting will automatically
					be removed after it expires.
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
