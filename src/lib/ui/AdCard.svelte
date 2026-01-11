<script lang="ts">
	interface Props {
		title: string
		description: string
		buttonText: string
		buttonHref: string
	}

	let { title, description, buttonText, buttonHref }: Props = $props()
</script>

<div data-testid="ad-card" class="rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-6">
	<div class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
		Sponsored
	</div>
	<div class="mx-auto max-w-2xl text-center">
		<h2 class="text-xl font-semibold text-gray-900">{title}</h2>
		<p class="mt-1.5 text-sm text-gray-600">
			{description}
		</p>
		<a
			href={buttonHref}
			class="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900"
		>
			{buttonText}
		</a>
	</div>
</div>
