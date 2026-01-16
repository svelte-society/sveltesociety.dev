<script lang="ts">
	import { Section, Row, Column, Text, Link, Img, Hr } from 'better-svelte-email'

	interface Sponsor {
		name: string
		logo: string
		url: string
	}

	interface Props {
		sponsors?: Sponsor[]
	}

	let { sponsors = [] }: Props = $props()
</script>

{#if sponsors.length > 0}
	<Hr class="border-0 border-t border-slate-200 my-6" />
	<Section class="mb-4">
		<Text class="text-slate-400 text-xs uppercase tracking-wide mb-3 text-center">
			Sponsored by
		</Text>
		<Row>
			{#each sponsors as sponsor (sponsor.name)}
				<Column align="center" class="px-4">
					<Link href={sponsor.url} class="no-underline">
						<Img
							src={sponsor.logo}
							alt={sponsor.name}
							width="80"
							height="40"
							class="object-contain"
						/>
						<Text class="text-slate-600 text-xs mt-1 text-center">{sponsor.name}</Text>
					</Link>
				</Column>
			{/each}
		</Row>
	</Section>
{/if}
