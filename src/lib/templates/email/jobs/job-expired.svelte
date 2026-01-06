<script lang="ts">
	import { Html, Head, Body, Preview, Container, Section, Text, Heading } from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button, InfoBox } from '$lib/components/email'

	interface Props {
		jobTitle?: string
		expiredAt?: string
		renewUrl?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		jobTitle = 'Senior Svelte Developer',
		expiredAt = 'January 15, 2025',
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
	<Preview preview={`Your job posting has expired: ${jobTitle}`} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Job Posting Expired
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					Your job posting on Svelte Society has expired and is no longer visible to candidates.
				</Text>

				<InfoBox>
					<Heading as="h2" class="text-svelte-900 text-xl font-semibold">
						{jobTitle}
					</Heading>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Expired on:</span>
						{expiredAt}
					</Text>
				</InfoBox>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					Still looking for the right candidate? You can repost your job to continue receiving
					applications from our community of Svelte developers.
				</Text>

				<Button href={renewUrl} variant="primary">Repost This Job</Button>

				<Text class="text-slate-600 text-base leading-relaxed text-center">
					If you've already filled the position, no action is needed. Thanks for using Svelte
					Society!
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
