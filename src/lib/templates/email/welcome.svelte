<script lang="ts">
	import { Html, Head, Body, Preview, Container, Section, Text, Heading } from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button } from '$lib/components/email'

	interface Props {
		username?: string
		baseUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let { username = 'Kevin Åberg Kultalahti', baseUrl = defaultBaseUrl }: Props = $props()

	const loginUrl = `${baseUrl}/login`
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
	<Preview preview={`Welcome to Svelte Society, ${username}!`} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<!-- Content -->
			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					Welcome to Svelte Society!
				</Heading>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					Hey {username},
				</Text>

				<Text class="text-slate-600 text-base leading-relaxed mb-4">
					We're thrilled to have you join the Svelte Society community! You're now part of a vibrant
					group of developers who share a passion for building beautiful, performant web
					applications with Svelte.
				</Text>

				<Text class="text-slate-600 text-base leading-relaxed mb-6">
					Here's what you can do now:
				</Text>

				<!-- Feature list -->
				<Section class="mb-6">
					<Text class="text-slate-800 text-sm leading-loose">
						<span class="text-svelte-900 font-semibold">Browse</span> our curated collection of Svelte
						libraries, components, and tools
					</Text>
					<Text class="text-slate-800 text-sm leading-loose">
						<span class="text-svelte-900 font-semibold">Discover</span> recipes and tutorials from
						the community
					</Text>
					<Text class="text-slate-800 text-sm leading-loose">
						<span class="text-svelte-900 font-semibold">Watch</span> videos from Svelte conferences
						and meetups
					</Text>
					<Text class="text-slate-800 text-sm leading-loose">
						<span class="text-svelte-900 font-semibold">Save</span> your favorite resources for later
					</Text>
					<Text class="text-slate-800 text-sm leading-loose">
						<span class="text-svelte-900 font-semibold">Submit</span> your own content to share with
						the community
					</Text>
				</Section>

				<Button href={loginUrl} variant="primary">Start Exploring</Button>

				<Footer {aboutUrl} />
			</Section>
		</Container>
	</Body>
</Html>
