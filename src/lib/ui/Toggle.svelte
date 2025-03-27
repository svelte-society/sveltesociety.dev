<script lang="ts">
	import { Label, Switch } from 'bits-ui'

	let { text, checked = $bindable(), name } = $props()
</script>

<div class="flex items-center space-x-3">
	<Switch.Root
		bind:checked
		id="dnd"
		{name}
		class="data-[state=unchecked]:shadow-mini-inset data-[state=checked]:bg-svelte-900 peer inline-flex h-[19px] min-h-[19px] w-[44px] shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50  data-[state=unchecked]:bg-gray-200"
	>
		<Switch.Thumb
			class="bg-background data-[state=unchecked]:shadow-mini shadow-popover pointer-events-none block size-[14px] shrink-0 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
		/>
	</Switch.Root>
	<Label.Root for="dnd" class="text-sm font-medium">{text}</Label.Root>
</div>
