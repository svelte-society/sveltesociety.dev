<script lang="ts">
	import { Section, Row, Column } from 'better-svelte-email'
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
	}

	let { children }: Props = $props()
</script>

<Row class="bg-slate-50 px-4 rounded-lg">
	<Column>
		{@render children()}
	</Column>
</Row>
