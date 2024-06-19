<script lang="ts">
	import { Avatar } from 'bits-ui';
	let { name, src } = $props<{
		name: string;
		src?: string;
	}>();

	let loadingStatus: Avatar.Props['loadingStatus'] = $state();

	function capitalizeFirstLetters(sentence: string): string {
		const words = sentence.split(' ');

		// Map over the words array and capitalize the first letter of each word
		const capitalizedLetters = words.map((word) => {
			// Ensure word is not empty to avoid errors with .charAt(0)
			if (word.length > 0) {
				return word.charAt(0).toUpperCase();
			} else {
				return '';
			}
		});

		// Join the capitalized letters into a single string
		const capitalizedSentence = capitalizedLetters.join('');

		return capitalizedSentence;
	}
</script>

<Avatar.Root
	bind:loadingStatus
	class="h-12 w-12 rounded-full border {loadingStatus === 'loaded'
		? 'border-foreground'
		: 'border-transparent'} bg-muted text-muted-foreground text-[17px] font-medium uppercase"
>
	<div
		class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
		<Avatar.Image {src} alt="{name} profile" />
		<Avatar.Fallback class="border-muted border"
			>{capitalizeFirstLetters(name || 'John Doe')}</Avatar.Fallback
		>
	</div>
</Avatar.Root>
