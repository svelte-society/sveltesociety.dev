<script lang="ts">
	import { Section, Row, Column, Img } from 'better-svelte-email'

	interface Props {
		logoUrl: string
	}

	let { logoUrl }: Props = $props()
</script>

<Section class="bg-white px-2 py-2 sm:px-6 sm:py-4 sm:rounded-t-xl border-b-4 border-svelte-900">
	<Row>
		<Column align="center">
			<Img src={logoUrl} alt="Svelte Society" width="80" height="80" />
		</Column>
	</Row>
</Section>
