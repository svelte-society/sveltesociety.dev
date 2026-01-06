<script lang="ts">
	import {
		Html,
		Head,
		Body,
		Preview,
		Container,
		Section,
		Row,
		Column,
		Text,
		Heading,
		Link
	} from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, InfoBox } from '$lib/components/email'
	import type { Snippet } from 'svelte'

	interface Props {
		previewText: string
		details: Snippet
		followUpMessage?: string
		receiptUrl?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		previewText,
		details,
		followUpMessage,
		receiptUrl,
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
	<Preview preview={previewText} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<!-- Success indicator -->
				<Section class="mb-6">
					<Row>
						<Column align="center">
							<Text
								class="rounded-full p-4 max-w-10 bg-emerald-500 text-white text-3xl font-bold text-center mx-auto"
							>
								&#10003;
							</Text>
						</Column>
					</Row>
				</Section>

				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Payment Confirmed
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					Thank you for your payment! Here are the details:
				</Text>

				<InfoBox>
					{@render details()}
				</InfoBox>

				{#if receiptUrl}
					<Row class="mb-6">
						<Column align="center">
							<Link href={receiptUrl} class="text-svelte-900 underline font-medium">
								View your receipt &rarr;
							</Link>
						</Column>
					</Row>
				{/if}

				{#if followUpMessage}
					<Text class="text-slate-600 text-base leading-relaxed">
						{followUpMessage}
					</Text>
				{/if}

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
