<script lang="ts">
	import {
		switchContainerVariants,
		switchTrackVariants,
		switchThumbVariants
	} from './switch.variants'

	interface SwitchProps {
		checked: boolean
		disabled?: boolean
		name?: string
		label?: string
	}

	let {
		checked = $bindable(false),
		disabled = false,
		name = '',
		label = ''
	}: SwitchProps = $props()
</script>

<label class={switchContainerVariants({ disabled })}>
	<div class="relative">
		<input type="checkbox" class="sr-only" {name} bind:checked {disabled} />
		<div class={switchTrackVariants({ checked, disabled })}></div>
		<div class={switchThumbVariants({ checked })}></div>
	</div>
	{#if label}
		<span class="ml-3 text-sm font-medium text-gray-700">{label}</span>
	{/if}
</label>
