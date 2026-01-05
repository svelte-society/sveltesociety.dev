<script lang="ts">
	interface Props {
		title?: string
		description?: string
		buttonText?: string
		buttonHref?: string
	}

	let {
		title = 'Hiring Svelte Developers?',
		description = 'Reach thousands of Svelte developers looking for their next opportunity.',
		buttonText = 'Post a Job Starting at $199',
		buttonHref = '/jobs/submit'
	}: Props = $props()
</script>

<div class="rounded-lg bg-gradient-to-r from-svelte-50 to-svelte-100 p-6">
	<div class="mx-auto max-w-2xl text-center">
		<h2 class="text-xl font-semibold text-svelte-900">{title}</h2>
		<p class="mt-1.5 text-sm text-svelte-500">
			{description}
		</p>
		<a
			href={buttonHref}
			class="mt-3 inline-flex items-center gap-2 rounded-lg bg-svelte-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-svelte-900"
		>
			{buttonText}
		</a>
	</div>
</div>
