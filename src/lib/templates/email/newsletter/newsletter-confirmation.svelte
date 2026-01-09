<script lang="ts">
	import { Html, Head, Body, Preview, Container, Section, Text, Heading } from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button, InfoBox } from '$lib/components/email'

	interface Props {
		baseUrl?: string
		token: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let { baseUrl = defaultBaseUrl, token = 'just-a-placeholder-token' }: Props = $props()

	const logoUrl = `${baseUrl}/email/logo.svg`
	const aboutUrl = `${baseUrl}/about`
	const confirmationUrl = `${baseUrl}/newsletter/confirm/${token}`
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
	<Preview preview="Confirm your Svelte Society newsletter subscription" />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Confirm Your Subscription
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					Thanks for subscribing to the Svelte Society newsletter! Please confirm your email address
					by clicking the button below.
				</Text>

				<InfoBox>
					<Text class="text-slate-700 text-sm">
						This link will expire in <strong>24 hours</strong>. If you didn't request this
						subscription, you can safely ignore this email.
					</Text>
				</InfoBox>

				<Button href={confirmationUrl} variant="primary">Confirm Subscription</Button>

				<Text class="text-slate-500 text-sm text-center mt-6">
					Or copy and paste this link into your browser:
				</Text>
				<Text class="text-slate-400 text-xs text-center break-all">
					{confirmationUrl}
				</Text>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
