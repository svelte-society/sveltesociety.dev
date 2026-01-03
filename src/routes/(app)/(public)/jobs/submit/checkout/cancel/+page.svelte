<script lang="ts">
	import XCircle from 'phosphor-svelte/lib/XCircle'
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft'
</script>

<svelte:head>
	<title>Payment Cancelled | Svelte Jobs</title>
</svelte:head>

<div class="mx-auto max-w-xl py-12 text-center">
	<div class="mb-6 flex justify-center">
		<div class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
			<XCircle size={48} class="text-slate-400" />
		</div>
	</div>

	<h1 class="text-2xl font-bold text-slate-900">Payment Cancelled</h1>

	<p class="mt-4 text-slate-600">
		Your payment was cancelled and you have not been charged.
	</p>

	<div class="mt-8 space-y-3">
		<a
			href="/jobs/submit"
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
			data-testid="try-again-link"
		>
			<ArrowLeft size={18} />
			Try Again
		</a>

		<a
			href="/jobs"
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
		>
			Browse Jobs
		</a>
	</div>

	<p class="mt-8 text-sm text-slate-500">
		Having trouble? Contact us at{' '}
		<a href="mailto:support@sveltesociety.dev" class="text-orange-600 hover:underline">
			support@sveltesociety.dev
		</a>
	</p>
</div>
