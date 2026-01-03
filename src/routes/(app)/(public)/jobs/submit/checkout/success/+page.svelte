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
		{data.status === 'success' ? 'Job Posted Successfully!' : 'Processing Payment...'}
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
		<div
			class="mb-6 flex justify-center"
		>
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
				<CheckCircle size={48} weight="fill" class="text-green-600" />
			</div>
		</div>

		<h1 class="text-3xl font-bold text-slate-900">Your Job is Live!</h1>

		<p class="mt-4 text-lg text-slate-600">
			<strong>{data.job?.title}</strong> has been published successfully.
		</p>

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

		<div class="mt-6 space-y-3">
			<a
				href="/jobs/{data.job?.slug}"
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
				data-testid="view-job-link"
			>
				View Your Job Listing
				<ArrowRight size={18} />
			</a>

			<a
				href="/jobs"
				class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
			>
				Browse All Jobs
			</a>
		</div>

		<div class="mt-8 rounded-lg bg-slate-50 p-4 text-left text-sm text-slate-600">
			<h3 class="mb-2 font-medium text-slate-700">What happens next?</h3>
			<ul class="space-y-2">
				<li class="flex items-start gap-2">
					<Clock size={16} class="mt-0.5 shrink-0 text-slate-400" />
					<span>
						Your job is now visible to thousands of Svelte developers.
					</span>
				</li>
				<li class="flex items-start gap-2">
					<Clock size={16} class="mt-0.5 shrink-0 text-slate-400" />
					<span>
						You'll receive email notifications when candidates apply.
					</span>
				</li>
				<li class="flex items-start gap-2">
					<Clock size={16} class="mt-0.5 shrink-0 text-slate-400" />
					<span>
						A confirmation email has been sent to your inbox.
					</span>
				</li>
			</ul>
		</div>
	{/if}
</div>
