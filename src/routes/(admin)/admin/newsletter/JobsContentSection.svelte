<script lang="ts">
	import Checkbox from '$lib/ui/Checkbox.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import { formatSalary } from '$lib/utils/job-formatters'
	import type { JobItemWithContent } from '$lib/types/newsletter'

	interface Props {
		jobs: JobItemWithContent[]
		selectedIds: string[]
		onSelectionChange: (ids: string[]) => void
		introTextField?: any
	}

	let { jobs, selectedIds = $bindable(), onSelectionChange, introTextField }: Props = $props()

	function toggleJob(id: string) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((i) => i !== id)
		} else {
			selectedIds = [...selectedIds, id]
		}
		onSelectionChange(selectedIds)
	}

	function selectAll() {
		selectedIds = jobs.map((j) => j.id)
		onSelectionChange(selectedIds)
	}

	function deselectAll() {
		selectedIds = []
		onSelectionChange(selectedIds)
	}

	function getJobSalary(job: JobItemWithContent): string {
		return (
			formatSalary(
				job.metadata?.salary_min,
				job.metadata?.salary_max,
				job.metadata?.salary_currency
			) || ''
		)
	}
</script>

<div class="space-y-6">
	{#if introTextField}
		<TextArea
			{...introTextField.as('text')}
			label="Introduction Text (Optional)"
			placeholder="Check out these latest job opportunities in the Svelte ecosystem..."
			issues={introTextField.issues()}
			rows={3}
			data-testid="textarea-jobs-intro"
		/>
	{/if}

	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<p class="text-sm font-medium text-gray-700">
				Select Jobs ({selectedIds.length} of {jobs.length} selected)
			</p>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={selectAll}
					class="text-sm text-svelte-600 hover:underline"
				>
					Select All
				</button>
				<span class="text-gray-300">|</span>
				<button
					type="button"
					onclick={deselectAll}
					class="text-sm text-gray-500 hover:underline"
				>
					Clear
				</button>
			</div>
		</div>

		{#if jobs.length > 0}
			<ul class="max-h-96 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
				{#each jobs as job (job.id)}
					<li>
						<button
							type="button"
							onclick={() => toggleJob(job.id)}
							class={[
								'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
								selectedIds.includes(job.id)
									? 'border-green-300 bg-green-50'
									: 'border-gray-200 bg-white hover:border-gray-300'
							]}
						>
							<Checkbox
								checked={selectedIds.includes(job.id)}
								class="mt-0.5"
							/>
							<div class="min-w-0 flex-1">
								<p class="font-medium text-gray-900">{job.title}</p>
								<div class="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
									{#if job.metadata?.company_name}
										<span>{job.metadata.company_name}</span>
									{/if}
									{#if job.metadata?.location}
										<span class="text-gray-300">&bull;</span>
										<span>{job.metadata.location}</span>
									{/if}
								</div>
								<div class="mt-2 flex flex-wrap gap-2">
									{#if job.metadata?.remote_status}
										<span class="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
											{job.metadata.remote_status}
										</span>
									{/if}
									{#if job.metadata?.position_type}
										<span class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
											{job.metadata.position_type}
										</span>
									{/if}
									{#if getJobSalary(job)}
										<span class="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
											{getJobSalary(job)}
										</span>
									{/if}
								</div>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
				No active job listings available.
			</p>
		{/if}
	</div>
</div>
