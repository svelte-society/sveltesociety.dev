<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { z } from 'zod'
	import Form from '$lib/ui/form/Form.svelte'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import Button from '$lib/ui/Button.svelte'
	import Switch from '$lib/ui/Switch.svelte'
	import { toast } from 'svelte-sonner'

	let { data } = $props()

	// Schema for bulk import form
	const bulkImportSchema = z.object({
		urls: z.string().min(1, 'At least one URL is required'),
		skipExisting: z.boolean().default(true),
		batchSize: z.number().min(1).max(10).default(5)
	})

	// Initialize form
	const form = superForm(
		{},
		{
			validators: zodClient(bulkImportSchema),
			resetForm: false
		}
	)

	const { form: formData, message, submitting } = form

	// State for import results
	let importResults = $state<{
		summary?: {
			total: number
			successful: number
			failed: number
			skipped: number
			byType: {
				youtube: number
				github: number
			}
		}
		results?: Array<{
			url: string
			success: boolean
			contentId?: string
			error?: string
			type?: 'youtube' | 'github'
		}>
	} | null>(data.result || null)
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-2xl font-bold">Bulk Import</h1>
		<p class="mt-2 text-gray-600">Import multiple YouTube videos or GitHub repositories at once</p>
	</div>

	<div class="max-w-4xl">
		<div class="rounded-lg bg-white p-6">
			<Form {form} action="?/import">
				<Textarea
					name="urls"
					label="URLs (one per line)"
					placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ
https://github.com/sveltejs/svelte
https://youtu.be/abc123
owner/repo-name"
					description="Enter YouTube URLs, video IDs, GitHub URLs, or owner/repo format. Maximum 50 URLs."
					rows={10}
				/>

				<div class="flex items-center justify-end border-t pt-4">
					<Button type="submit" primary disabled={$submitting}>
						{$submitting ? 'Importing...' : 'Import All'}
					</Button>
				</div>

				<input type="hidden" name="batchSize" value={$formData.batchSize} />
			</Form>
		</div>

		{#if $message}
			<div>{$message.text}</div>
		{/if}
	</div>
</div>
