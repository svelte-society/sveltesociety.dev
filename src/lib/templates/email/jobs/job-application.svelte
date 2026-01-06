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
		Link
	} from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button, InfoBox } from '$lib/components/email'

	interface Props {
		greeting?: string
		jobTitle: string
		applicantName: string
		applicantEmail: string
		applicantProfileUrl: string
		message?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		greeting = 'Hello',
		jobTitle = 'Senior Svelte Developer',
		applicantName = 'Test Usersson',
		applicantEmail = 'test.usersson@gmail.com',
		applicantProfileUrl = 'https://sveltesociety.dev/user/kevmodrome',
		message = 'I was super interested in this job post!',
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
	<Preview preview={`New application for ${jobTitle} from ${applicantName}`} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					New Job Application
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					{greeting},
				</Text>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					Great news! You have received a new application for your job posting:
				</Text>

				<Heading as="h2" class="text-svelte-900 text-2xl font-semibold mb-6 text-center">
					{jobTitle}
				</Heading>

				<Heading as="h3" class="text-slate-800 text-lg font-semibold mb-3">
					Applicant Details
				</Heading>

				<InfoBox>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Name:</span>
						{applicantName}
					</Text>
					<Text class="text-slate-700 text-base">
						<span class="font-semibold">Email:</span>
						<Link href={`mailto:${applicantEmail}`} class="text-svelte-900 underline">
							{applicantEmail}
						</Link>
					</Text>
				</InfoBox>

				{#if message}
					<Heading as="h3" class="text-slate-800 text-lg font-semibold mb-3 mt-6">
						Message from applicant
					</Heading>
					<Section class="border-l-4 border-svelte-900 pl-4 my-4">
						<Text class="text-slate-600 text-base leading-relaxed italic">
							{message}
						</Text>
					</Section>
				{/if}

				<Button href={applicantProfileUrl} variant="primary">View Applicant Profile</Button>

				<Text class="text-slate-600 text-base leading-relaxed text-center">
					You can respond directly to the applicant by replying to their email address above.
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
