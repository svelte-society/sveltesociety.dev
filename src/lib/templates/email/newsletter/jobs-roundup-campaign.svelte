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
	import { Header, Footer, Button, SponsorSlot } from '$lib/components/email'
	import { formatSalary } from '$lib/utils/job-formatters'

	interface JobItem {
		id: string
		title: string
		slug: string
		description: string | null
		metadata?: {
			company_name?: string
			company_logo?: string
			location?: string
			remote_status?: string
			position_type?: string
			salary_min?: number
			salary_max?: number
			salary_currency?: string
		}
	}

	interface Sponsor {
		name: string
		logo: string
		url: string
	}

	interface Props {
		subject?: string
		introText?: string | null
		jobs?: JobItem[]
		baseUrl?: string
		unsubscribeUrl?: string
		sponsors?: Sponsor[]
	}

	const defaultBaseUrl = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'
	let {
		subject = 'Svelte Society Jobs Roundup',
		introText,
		jobs = [],
		baseUrl = defaultBaseUrl,
		unsubscribeUrl = '{{unsubscribeUrl}}',
		sponsors = []
	}: Props = $props()

	const logoUrl = `${baseUrl}/email/logo.svg`
	const aboutUrl = `${baseUrl}/about`

	function getJobSalary(job: JobItem): string {
		return (
			formatSalary(
				job.metadata?.salary_min,
				job.metadata?.salary_max,
				job.metadata?.salary_currency
			) || ''
		)
	}

	function getJobUrl(job: JobItem): string {
		return `${baseUrl}/jobs/${job.slug}`
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
				<!-- Jobs Badge -->
				<Text class="text-green-600 text-xs uppercase tracking-wide mb-2 text-center font-semibold">
					Jobs Roundup
				</Text>

				<Heading as="h1" class="text-slate-800 text-3xl font-bold mb-6 text-center">
					{subject}
				</Heading>

				{#if introText}
					<Text class="text-slate-600 text-base leading-relaxed mb-6">
						{introText}
					</Text>
				{/if}

				<!-- Job Listings -->
				{#each jobs as job (job.id)}
					<Section class="mb-4 bg-slate-50 rounded-lg p-0 sm:p-4 border border-slate-200">
						<Row class="block sm:table-row">
							{#if job.metadata?.company_logo}
								<Column class="block w-full pb-0 pr-0 sm:table-cell sm:w-16 sm:pr-4 sm:pb-0 align-top">
									<Link href={getJobUrl(job)}>
										<Img
											src={job.metadata.company_logo}
											alt={job.metadata.company_name || 'Company'}
											width="48"
											height="48"
											class="w-12 h-12 rounded-lg object-cover"
										/>
									</Link>
								</Column>
							{/if}
							<Column class="block w-full p-4 pt-2 sm:p-0 sm:table-cell align-top">
								<Heading as="h2" class="text-slate-800 text-lg font-semibold mb-1 mt-0">
									<Link href={getJobUrl(job)} class="text-svelte-900 no-underline hover:underline">
										{job.title}
									</Link>
								</Heading>
								<Text class="text-slate-500 text-sm mb-2 mt-0">
									{job.metadata?.company_name || ''}
									{#if job.metadata?.location}
										&bull; {job.metadata.location}
									{/if}
								</Text>
								<Row class="mb-2">
									{#if job.metadata?.remote_status}
										<Column class="pr-2">
											<Text class="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 m-0">
												{job.metadata.remote_status}
											</Text>
										</Column>
									{/if}
									{#if job.metadata?.position_type}
										<Column class="pr-2">
											<Text class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 m-0">
												{job.metadata.position_type}
											</Text>
										</Column>
									{/if}
								</Row>
								{#if getJobSalary(job)}
									<Text class="text-green-700 text-sm font-medium mb-0 mt-1">
										{getJobSalary(job)}
									</Text>
								{/if}
							</Column>
						</Row>
					</Section>
				{/each}

				{#if jobs.length > 0}
					<Button href={`${baseUrl}/jobs`} variant="primary">View All Jobs</Button>
				{/if}

				<!-- Sponsor Slot -->
				<SponsorSlot {sponsors} />

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
