<script lang="ts">
	import { Text } from 'better-svelte-email'
	import { PaymentConfirmation } from '$lib/components/email'

	interface Props {
		jobTitle?: string
		tierName?: string
		amountPaid?: string
		receiptUrl?: string
		baseUrl?: string
	}

	let {
		jobTitle = 'Senior Svelte Developer',
		tierName = 'Standard',
		amountPaid = '$299.00',
		receiptUrl = 'https://stripe.com/receipt/example',
		baseUrl
	}: Props = $props()
</script>

<PaymentConfirmation
	previewText={`Payment confirmed for ${jobTitle}`}
	{receiptUrl}
	{baseUrl}
	followUpMessage="You'll receive another email once your job posting is live."
>
	{#snippet details()}
		<Text class="text-slate-700 text-base">
			<span class="font-semibold">Job Posting:</span>
			{jobTitle}
		</Text>
		<Text class="text-slate-700 text-base">
			<span class="font-semibold">Plan:</span>
			{tierName}
		</Text>
		<Text class="text-slate-700 text-base">
			<span class="font-semibold">Amount Paid:</span>
			{amountPaid}
		</Text>
	{/snippet}
</PaymentConfirmation>
