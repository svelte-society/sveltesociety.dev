<script lang="ts">
	import { toast } from 'svelte-sonner'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import MarkdownEditor from '$lib/ui/MarkdownEditor.svelte'
	import Select from '$lib/ui/Select.svelte'
	import ImageUpload from '$lib/ui/ImageUpload.svelte'
	import { getCachedImageWithPreset } from '$lib/utils/image-cache'
	import type { RemoteForm } from '@sveltejs/kit'

	interface Props {
		form: RemoteForm<any, any>
		contentId: string
		content: any
	}

	let { form, contentId, content }: Props = $props()

	const metadata = $derived(content?.metadata || {})

	const positionTypes = [
		{ value: 'full-time', label: 'Full-Time' },
		{ value: 'part-time', label: 'Part-Time' },
		{ value: 'contract', label: 'Contract' },
		{ value: 'internship', label: 'Internship' }
	]

	const seniorityLevels = [
		{ value: 'entry', label: 'Entry Level' },
		{ value: 'junior', label: 'Junior' },
		{ value: 'mid', label: 'Mid-Level' },
		{ value: 'senior', label: 'Senior' },
		{ value: 'principal', label: 'Principal / Staff' }
	]

	const remoteOptions = [
		{ value: 'remote', label: 'Remote' },
		{ value: 'hybrid', label: 'Hybrid' },
		{ value: 'on-site', label: 'On-Site' }
	]

	const currencyOptions = [
		{ value: 'USD', label: 'USD ($)' },
		{ value: 'EUR', label: 'EUR' },
		{ value: 'GBP', label: 'GBP' }
	]

	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	const formatPrice = (cents: number | undefined) => {
		if (!cents) return 'N/A'
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(cents / 100)
	}
</script>

<!-- Payment/Tier Information (Read-only) -->
<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
	<h3 class="mb-3 text-sm font-semibold text-blue-900">Payment Information</h3>
	<div class="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
		<div>
			<span class="text-blue-700">Tier:</span>
			<span class="ml-1 font-medium text-blue-900">{metadata.tier_name || 'N/A'}</span>
		</div>
		<div>
			<span class="text-blue-700">Payment ID:</span>
			<span class="ml-1 font-mono text-xs text-blue-900">{metadata.payment_id || 'N/A'}</span>
		</div>
		<div>
			<span class="text-blue-700">Expires:</span>
			<span class="ml-1 font-medium text-blue-900">{formatDate(metadata.expires_at)}</span>
		</div>
		<div>
			<span class="text-blue-700">Created:</span>
			<span class="ml-1 font-medium text-blue-900">{formatDate(content?.created_at)}</span>
		</div>
	</div>
</div>

<form
	{...form.enhance(async ({ submit }) => {
		try {
			const result = await submit()
			if (result?.success === true || form.result?.success === true) {
				toast.success('Job updated successfully!')
			} else {
				toast.error(result?.text || form.result?.text || 'Failed to update job')
			}
		} catch {
			toast.error('Failed to update job')
		}
	})}
	enctype="multipart/form-data"
	class="flex flex-col gap-6"
>
	<input type="hidden" name="id" value={contentId} />

	<!-- Status -->
	<div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
		<h3 class="mb-3 text-sm font-semibold text-slate-900">Publication Status</h3>
		<div class="max-w-xs">
			<Select
				{...form.fields.status.as('select')}
				options={[
					{ value: 'draft', label: 'Draft' },
					{ value: 'pending_review', label: 'Pending Review' },
					{ value: 'published', label: 'Published' },
					{ value: 'archived', label: 'Archived' }
				]}
				data-testid="select-status"
			/>
			<p class="mt-1 text-xs text-slate-500">
				Set to "Published" to make this job listing visible
			</p>
		</div>
	</div>

	<!-- Company Information -->
	<div class="rounded-lg border border-slate-200 p-4">
		<h3 class="mb-4 text-sm font-semibold text-slate-900">Company Information</h3>
		<div class="grid gap-4 sm:grid-cols-2">
			<Input
				{...form.fields.company_name.as('text')}
				label="Company Name"
				placeholder="Acme Inc."
				issues={form.fields.company_name.issues()}
				data-testid="input-company-name"
			/>

			<Input
				{...form.fields.employer_email.as('email')}
				label="Contact Email"
				placeholder="jobs@acme.com"
				issues={form.fields.employer_email.issues()}
				data-testid="input-employer-email"
			/>

			<Input
				{...form.fields.company_website.as('url')}
				label="Company Website"
				placeholder="https://acme.com"
				issues={form.fields.company_website.issues()}
				data-testid="input-company-website"
			/>

			<div class="flex flex-col gap-2">
				<ImageUpload
					{...form.fields.company_logo.as('file')}
					label="Company Logo"
					description="Upload a new logo to replace the current one"
					issues={form.fields.company_logo.issues()}
					data-testid="input-company-logo"
				/>
				{#if metadata.company_logo}
					<div class="flex items-center gap-2">
						<img
							src={getCachedImageWithPreset(metadata.company_logo, 'thumbnail')}
							alt="Current company logo"
							class="h-16 w-16 rounded border border-slate-200 object-contain bg-white"
						/>
						<span class="text-xs text-slate-500">Current logo</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Job Details -->
	<div class="rounded-lg border border-slate-200 p-4">
		<h3 class="mb-4 text-sm font-semibold text-slate-900">Job Details</h3>
		<div class="flex flex-col gap-4">
			<div class="grid gap-4 sm:grid-cols-2">
				<Input
					{...form.fields.title.as('text')}
					label="Job Title"
					placeholder="Senior Svelte Developer"
					issues={form.fields.title.issues()}
					data-testid="input-title"
				/>

				<Input
					{...form.fields.slug.as('text')}
					label="URL Slug"
					placeholder="senior-svelte-developer"
					issues={form.fields.slug.issues()}
					data-testid="input-slug"
				/>
			</div>

			<TextArea
				{...form.fields.description.as('text')}
				label="Short Description"
				placeholder="Brief overview of the role (shown in listings)"
				issues={form.fields.description.issues()}
				rows={3}
				data-testid="textarea-description"
			/>

			<MarkdownEditor
				{...form.fields.body.as('text')}
				label="Full Job Description"
				placeholder="Detailed job requirements, responsibilities, benefits, etc."
				description="Use markdown to format the job description"
				issues={form.fields.body?.issues()}
				data-testid="textarea-body"
			/>

			<div class="grid gap-4 sm:grid-cols-2">
				<Select
					{...form.fields.position_type.as('select')}
					label="Position Type"
					options={positionTypes}
					data-testid="select-position-type"
				/>

				<Select
					{...form.fields.seniority_level.as('select')}
					label="Seniority Level"
					options={seniorityLevels}
					data-testid="select-seniority-level"
				/>
			</div>
		</div>
	</div>

	<!-- Location -->
	<div class="rounded-lg border border-slate-200 p-4">
		<h3 class="mb-4 text-sm font-semibold text-slate-900">Location</h3>
		<div class="flex flex-col gap-4">
			<div class="max-w-xs">
				<Select
					{...form.fields.remote_status.as('select')}
					label="Remote Status"
					options={remoteOptions}
					data-testid="select-remote-status"
				/>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<Input
					{...form.fields.location.as('text')}
					label="Office Location"
					placeholder="San Francisco, CA"
					issues={form.fields.location.issues()}
					data-testid="input-location"
				/>

				<Input
					{...form.fields.remote_restrictions.as('text')}
					label="Location Requirements"
					placeholder="e.g., US-only, EU timezone"
					issues={form.fields.remote_restrictions.issues()}
					data-testid="input-remote-restrictions"
				/>
			</div>
		</div>
	</div>

	<!-- Compensation -->
	<div class="rounded-lg border border-slate-200 p-4">
		<h3 class="mb-4 text-sm font-semibold text-slate-900">Compensation</h3>
		<div class="grid gap-4 sm:grid-cols-3">
			<Input
				{...form.fields.salary_min.as('text')}
				type="number"
				label="Minimum Salary"
				placeholder="80000"
				issues={form.fields.salary_min.issues()}
				data-testid="input-salary-min"
			/>

			<Input
				{...form.fields.salary_max.as('text')}
				type="number"
				label="Maximum Salary"
				placeholder="120000"
				issues={form.fields.salary_max.issues()}
				data-testid="input-salary-max"
			/>

			<Select
				{...form.fields.salary_currency.as('select')}
				label="Currency"
				options={currencyOptions}
				data-testid="select-salary-currency"
			/>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-4">
		<Button type="submit" width="full" disabled={!!form.pending}>
			{form.pending ? 'Saving...' : 'Update Job'}
		</Button>
		<Button href="/admin/content" variant="secondary">Cancel</Button>
	</div>
</form>
