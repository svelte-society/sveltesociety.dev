<script lang="ts">
	import type { Snippet } from 'svelte'
	import { setContext } from 'svelte'
	import { fromStore } from 'svelte/store'
	import type { SuperForm } from 'sveltekit-superforms'

	interface Props {
		form: SuperForm<any>
		action?: string
		children: Snippet
	}
	let { form, action, children }: Props = $props()

	const { enhance } = form

	setContext('form', form)
</script>

<form method="POST" {action} use:enhance class="flex flex-col gap-4">
	{@render children()}
</form>
