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
		Link,
		Img,
		Row,
		Column
	} from 'better-svelte-email'
	import { dev } from '$app/environment'
	import { Header, Footer, Button } from '$lib/components/email'

	interface ContentItem {
		title: string
		description: string
		type: string
		slug: string
		image?: string | null
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
	<Body class="bg-slate-50 m-0 py-0 sm:py-10">
		<Container class="max-w-xl sm:mx-auto">
			<Header {logoUrl} />

			<!-- Content -->
			<Section class="bg-white p-2 sm:p-6 sm:rounded-b-xl sm:shadow-md">
				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					{subject}
				</Heading>

				{#if introText}
					<Text class="text-slate-600 text-base leading-relaxed mb-6">
						{introText}
					</Text>
				{/if}

				<!-- Content Items -->
				{#each items as item (item.slug)}
					<Section class="mb-4 bg-slate-50 rounded-lg p-0 sm:p-4 border border-slate-200">
						<Row class="block sm:table-row">
							{#if item.image}
								<Column class="block w-full pb-0 pr-0 sm:table-cell sm:w-24 sm:pr-4 sm:pb-0 align-top">
									<Link href={getContentUrl(item)}>
										<Img
											src={item.image}
											alt={item.title}
											width="80"
											height="60"
											class="w-full h-auto rounded-t-lg sm:rounded-md sm:w-20 object-cover"
										/>
									</Link>
								</Column>
							{/if}
							<Column class="block w-full p-4 pt-2 sm:p-0 sm:table-cell align-top">
								<Text class="text-slate-400 text-xs uppercase tracking-wide mb-1 mt-0">
									{item.type}
								</Text>
								<Heading as="h2" class="text-slate-800 text-lg font-semibold mb-2 mt-0">
									<Link href={getContentUrl(item)} class="text-svelte-900 no-underline hover:underline">
										{item.title}
									</Link>
								</Heading>
								<Text class="text-slate-600 text-sm leading-relaxed mb-0">
									{item.description}
								</Text>
							</Column>
						</Row>
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
