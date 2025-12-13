<script lang="ts">
	import type { Snippet } from 'svelte'
	import { setContext } from 'svelte'

	type Props = {
		id: string
		children: Snippet
	}

	let { id, children }: Props = $props()

	setContext('actions', {
		get id() {
			return id
		}
	})
</script>

<div class="flex items-center gap-1">
	{@render children()}
</div>
