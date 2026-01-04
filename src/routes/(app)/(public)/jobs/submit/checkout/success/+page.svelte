<script lang="ts">
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import Clock from 'phosphor-svelte/lib/Clock'
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight'
	import Spinner from 'phosphor-svelte/lib/Spinner'

	let { data } = $props()

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}
</script>

<svelte:head>
	<title>
		{data.status === 'success' ? 'Payment Received!' : 'Processing Payment...'}
	</title>
</svelte:head>

<div class="mx-auto max-w-xl py-12 text-center">
	{#if data.status === 'processing'}
		<div class="mb-6 flex justify-center">
			<div class="animate-spin">
				<Spinner size={64} class="text-orange-500" />
			</div>
		</div>
		<h1 class="text-2xl font-bold text-slate-900">Processing Your Payment</h1>
		<p class="mt-4 text-slate-600">{data.message}</p>
		<p class="mt-2 text-sm text-slate-500">
			This page will automatically refresh when your payment is confirmed.
		</p>

		<!-- Auto-refresh after 3 seconds -->
		<script>
			setTimeout(() => {
				window.location.reload()
			}, 3000)
		</script>
	{:else}
		<div class="mb-6 flex justify-center">
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
				<CheckCircle size={48} weight="fill" class="text-green-600" />
			</div>
		</div>

		<h1 class="text-3xl font-bold text-slate-900">Payment Received!</h1>

		<p class="mt-4 text-lg text-slate-600">
			Thank you for submitting <strong>{data.job?.title}</strong>.
		</p>

		<div class="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-6 text-left">
			<div class="flex items-start gap-3">
				<Clock size={24} class="mt-0.5 shrink-0 text-orange-600" />
				<div>
					<h2 class="font-semibold text-orange-900">Pending Review</h2>
					<p class="mt-1 text-sm text-orange-800">
						Your job posting is currently being reviewed by our team. We'll publish it within 24
						hours and send you a confirmation email once it's live.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-left">
			<h2 class="mb-4 font-semibold">Job Details</h2>
			<dl class="space-y-3 text-sm">
				<div class="flex justify-between">
					<dt class="text-slate-500">Plan</dt>
					<dd class="font-medium">{data.tier?.name}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-slate-500">Duration</dt>
					<dd class="font-medium">{data.tier?.duration_days} days</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-slate-500">Expires</dt>
					<dd class="font-medium">{data.expiresAt ? formatDate(data.expiresAt) : 'N/A'}</dd>
				</div>
			</dl>
		</div>

		<div class="mt-6">
			<a
				href="/jobs"
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
			>
				Browse All Jobs
				<ArrowRight size={18} />
			</a>
		</div>

		<div class="mt-8 rounded-lg bg-slate-50 p-4 text-left text-sm text-slate-600">
			<h3 class="mb-2 font-medium text-slate-700">What happens next?</h3>
			<ul class="space-y-2">
				<li class="flex items-start gap-2">
					<Clock size={16} class="mt-0.5 shrink-0 text-slate-400" />
					<span> We'll review your job posting within 24 hours. </span>
				</li>
				<li class="flex items-start gap-2">
					<Clock size={16} class="mt-0.5 shrink-0 text-slate-400" />
					<span>
						Once approved, your job will be visible to thousands of Svelte developers.
					</span>
				</li>
				<li class="flex items-start gap-2">
					<Clock size={16} class="mt-0.5 shrink-0 text-slate-400" />
					<span> A confirmation email has been sent to your inbox. </span>
				</li>
			</ul>
		</div>
	{/if}
</div>
