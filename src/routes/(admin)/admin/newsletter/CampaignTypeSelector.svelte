<script lang="ts">
	import { CAMPAIGN_TYPE_CONFIG, type CampaignType } from '$lib/types/newsletter'
	import Sparkle from 'phosphor-svelte/lib/Sparkle'
	import Megaphone from 'phosphor-svelte/lib/Megaphone'
	import Briefcase from 'phosphor-svelte/lib/Briefcase'

	interface Props {
		value: CampaignType
		onchange?: (type: CampaignType) => void
		disabled?: boolean
	}

	let { value = $bindable(), onchange, disabled = false }: Props = $props()

	const icons: Record<string, typeof Sparkle> = {
		Sparkle,
		Megaphone,
		Briefcase
	}

	const colorClasses: Record<string, { selected: string; icon: string }> = {
		amber: {
			selected: 'border-amber-500 bg-amber-50 ring-2 ring-amber-200',
			icon: 'bg-amber-100 text-amber-600'
		},
		purple: {
			selected: 'border-purple-500 bg-purple-50 ring-2 ring-purple-200',
			icon: 'bg-purple-100 text-purple-600'
		},
		green: {
			selected: 'border-green-500 bg-green-50 ring-2 ring-green-200',
			icon: 'bg-green-100 text-green-600'
		}
	}

	const types = Object.entries(CAMPAIGN_TYPE_CONFIG) as [
		CampaignType,
		(typeof CAMPAIGN_TYPE_CONFIG)[CampaignType]
	][]

	function handleSelect(type: CampaignType) {
		if (disabled) return
		value = type
		onchange?.(type)
	}
</script>

<fieldset class="space-y-3" {disabled}>
	<legend class="text-sm font-medium text-gray-700">Campaign Type</legend>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
		{#each types as [type, config]}
			{@const Icon = icons[config.icon]}
			{@const colors = colorClasses[config.color]}
			<button
				type="button"
				onclick={() => handleSelect(type)}
				class={[
					'flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all',
					value === type ? colors.selected : 'border-gray-200 bg-white hover:border-gray-300',
					disabled && 'cursor-not-allowed opacity-60'
				]}
				data-testid={`campaign-type-${type}`}
			>
				<div
					class={[
						'rounded-lg p-2',
						value === type ? colors.icon : 'bg-gray-100 text-gray-500'
					]}
				>
					<Icon class="size-5" weight="bold" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="font-medium text-gray-900">{config.label}</p>
					<p class="text-sm text-gray-500">{config.description}</p>
				</div>
			</button>
		{/each}
	</div>
</fieldset>
