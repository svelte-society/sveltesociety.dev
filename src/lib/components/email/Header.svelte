<script lang="ts">
	import { Section, Row, Column, Img } from 'better-svelte-email'

	interface Props {
		logoUrl: string
	}

	let { logoUrl }: Props = $props()
</script>

<Section class="bg-white px-10 py-8 rounded-t-xl border-b-4 border-svelte-900">
	<Row>
		<Column align="center">
			<Img src={logoUrl} alt="Svelte Society" width="80" height="80" />
		</Column>
	</Row>
</Section>
