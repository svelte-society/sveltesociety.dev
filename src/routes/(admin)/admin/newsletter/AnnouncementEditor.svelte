<script lang="ts">
	import TextArea from '$lib/ui/TextArea.svelte'
	import Input from '$lib/ui/Input.svelte'

	interface Props {
		bodyHtmlField: any
		ctaTextField: any
		ctaUrlField: any
	}

	let { bodyHtmlField, ctaTextField, ctaUrlField }: Props = $props()
</script>

<div class="space-y-6">
	<TextArea
		{...bodyHtmlField.as('text')}
		label="Announcement Content"
		placeholder="Write your announcement here... (HTML supported)"
		description="The main content of your announcement email. HTML tags are supported for formatting."
		issues={bodyHtmlField.issues()}
		rows={10}
		data-testid="textarea-announcement-body"
	/>

	<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
		<p class="mb-4 text-sm font-medium text-gray-700">Call-to-Action Button (Optional)</p>
		<div class="grid gap-4 sm:grid-cols-2">
			<Input
				{...ctaTextField.as('text')}
				label="Button Text"
				placeholder="Learn More"
				issues={ctaTextField.issues()}
				data-testid="input-cta-text"
			/>
			<Input
				{...ctaUrlField.as('text')}
				label="Button URL"
				placeholder="https://sveltesociety.dev/..."
				issues={ctaUrlField.issues()}
				data-testid="input-cta-url"
			/>
		</div>
	</div>
</div>
