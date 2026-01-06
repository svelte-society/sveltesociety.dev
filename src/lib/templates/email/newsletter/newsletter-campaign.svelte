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
		Hr,
		Link
	} from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button } from '$lib/components/email'

	interface ContentItem {
		title: string
		description: string
		type: string
		slug: string
	}

	interface Props {
		subject?: string
		introText?: string
		items?: ContentItem[]
		baseUrl?: string
		unsubscribeUrl?: string
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		subject = 'Svelte Society Newsletter',
		introText = '',
		items = [],
		baseUrl = defaultBaseUrl,
		unsubscribeUrl = 'https://app.useplunk.com/subscribe/{{plunk_id}}'
	}: Props = $props()

	const logoUrl = `${baseUrl}/email/logo.svg`
	const aboutUrl = `${baseUrl}/about`

	function getContentUrl(item: ContentItem): string {
		const typeRoutes: Record<string, string> = {
			video: 'videos',
			library: 'libraries',
			recipe: 'recipes',
			resource: 'resources',
			announcement: 'announcements'
		}
		const route = typeRoutes[item.type] || item.type
		return `${baseUrl}/${route}/${item.slug}`
	}
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
	<Preview preview={subject} />
	<Body class="bg-slate-50 m-0 py-10">
		<Container class="max-w-xl mx-auto">
			<Header {logoUrl} />

			<!-- Content -->
			<Section class="bg-white p-10 rounded-b-xl shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					{subject}
				</Heading>

				{#if introText}
					<Text class="text-slate-600 text-base leading-relaxed mb-6">
						{introText}
					</Text>
				{/if}

				<!-- Content Items -->
				{#each items as item, i (item.slug)}
					{#if i > 0}
						<Hr class="border-0 border-t border-slate-200 my-6" />
					{/if}

					<Section class="mb-4">
						<Text class="text-slate-400 text-xs uppercase tracking-wide mb-1">
							{item.type}
						</Text>
						<Heading as="h2" class="text-slate-800 text-xl font-semibold mb-2">
							<Link href={getContentUrl(item)} class="text-svelte-900 no-underline hover:underline">
								{item.title}
							</Link>
						</Heading>
						<Text class="text-slate-600 text-sm leading-relaxed">
							{item.description}
						</Text>
					</Section>
				{/each}

				{#if items.length > 0}
					<Button href={baseUrl} variant="primary">Visit Svelte Society</Button>
				{/if}

				<Footer {aboutUrl} />

				<!-- Unsubscribe Link -->
				<Hr class="border-0 border-t border-slate-200 my-6" />
				<Text class="text-slate-400 text-xs text-center">
					Don't want to receive these emails?
					<Link href={unsubscribeUrl} class="text-slate-500 underline">Unsubscribe</Link>
				</Text>
			</Section>
		</Container>
	</Body>
</Html>
