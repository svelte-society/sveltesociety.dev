<script lang="ts">
	import { Avatar } from "bits-ui";

	let { src, name, size } = $props()

	function getInitials(name: string): string {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
	}
  </script>
   
  <Avatar.Root
	delayMs={200}
	class="data-[status=loaded]:border-svelte-900 bg-svelte-100 text-slate-700 h-10 w-10 rounded-full border text-sm font-medium uppercase data-[status=loading]:border-transparent hover:opacity-80"
  >
	<div
	  class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
	  <Avatar.Image {src} alt={name} />
	  <Avatar.Fallback class="border-none">{getInitials(name)}</Avatar.Fallback>
	</div>
  </Avatar.Root>