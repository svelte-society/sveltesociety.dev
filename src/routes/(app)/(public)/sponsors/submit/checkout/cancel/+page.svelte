<script lang="ts">
	import XCircle from 'phosphor-svelte/lib/XCircle'
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft'
</script>

<svelte:head>
	<title>Payment Cancelled | Svelte Society</title>
</svelte:head>

<div class="mx-auto max-w-xl py-12 text-center">
	<div class="mb-6 flex justify-center">
		<div class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
			<XCircle size={48} class="text-slate-400" />
		</div>
	</div>

	<h1 class="text-3xl font-bold text-slate-900">Payment Cancelled</h1>

	<p class="mt-4 text-lg text-slate-600">Your sponsorship application was not completed.</p>

	<p class="mt-2 text-slate-500">No charges were made to your account.</p>

	<div class="mt-8 space-y-4">
		<a
			href="/sponsors/submit"
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
		>
			<ArrowLeft size={18} />
			Try Again
		</a>

		<a
			href="/sponsors/submit"
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
		>
			View Sponsorship Options
		</a>
	</div>

	<div class="mt-8 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
		<p>
			Having trouble? <a href="mailto:sponsors@sveltesociety.dev" class="text-orange-600 hover:underline">Contact us</a> and we'll help you out.
		</p>
	</div>
</div>
