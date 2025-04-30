<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { formatRelativeDate } from '$lib/utils/date'

	import Tags from './Tags.svelte'
	import type { Content } from '$lib/types/content'

	import Recipe from '$lib/ui/content/Recipe.svelte'
	import Collection from '$lib/ui/content/Collection.svelte'
	import Video from '$lib/ui/content/Video.svelte'

	let { content }: { content: Content } = $props()

	let submitting = $state(false)

	// Use any for now to avoid type errors with enhance
	const optimisticUpdate = ({ formData }: { formData: FormData }) => {
		submitting = true
		const type = formData.get('type')

		switch (type) {
			case 'like':
				content.likes = content.liked ? content.likes - 1 : content.likes + 1
				content.liked = !content.liked
				break
			case 'save':
				content.saves = content.saved ? content.saves - 1 : content.saves + 1
				content.saved = !content.saved
				break
		}

		return async ({}) => {
			submitting = false
		}
	}
</script>

<article class="grid gap-2 rounded-lg bg-zinc-50 px-4 py-4 sm:px-6 sm:py-5">
	<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between gap-2 text-xs sm:gap-0">
		<div class="flex flex-wrap items-center">
			<span class="font-semibold capitalize">{content.type}&nbsp;</span>
			<span class="flex flex-wrap text-gray-500">
				<span>by {content.author}</span>
			</span>
		</div>
		<form
			method="POST"
			action="/?/interact"
			use:enhance={optimisticUpdate}
			class="flex items-center space-x-0.5"
		>
			<input type="hidden" name="id" value={content.id} />

			<button
				title={content.liked ? 'Remove like' : 'Like'}
				data-sveltekit-keepfocus
				disabled={!page.data.user || submitting}
				aria-label="Like {content.title}"
				name="type"
				value="like"
				type="submit"
				class="flex touch-manipulation items-center gap-1 rounded-md px-2 py-1.5 font-mono text-gray-600 hover:bg-gray-200 hover:text-gray-700 sm:py-1"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					xmlns="http://www.w3.org/2000/svg"
					class="mr-0.5"
				>
					<title>{content.liked ? 'Remove like' : 'Like'}</title>
					{#if content.liked}
						<path
							d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567Z"
							fill="currentColor"
						/>
					{:else}
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567ZM3.375 9.97388C3.90399 10.0403 4.41791 10.187 4.92908 10.3329H4.92908C5.03944 10.3644 5.14968 10.3959 5.25991 10.4265C6.08194 10.6549 7.01051 10.8747 8.25 10.8747C9.59565 10.8747 9.96023 10.7078 10.1463 10.4636C10.2565 10.3189 10.3529 10.0849 10.4416 9.66098C10.5204 9.28418 10.5822 8.8179 10.6625 8.21348L10.6924 7.98788C10.8806 6.57665 10.8345 5.78884 10.642 5.36534C10.5585 5.18186 10.4511 5.0762 10.3102 5.00567C10.1541 4.92756 9.91973 4.87473 9.5625 4.87473H8.2497C7.7358 4.87473 7.27876 4.442 7.34582 3.87279C7.36273 3.72929 7.38262 3.58106 7.40239 3.43371C7.45155 3.06737 7.49998 2.70649 7.49998 2.43723C7.49998 1.83079 7.39171 1.57446 7.28383 1.4502C7.18128 1.33208 6.98276 1.22258 6.49794 1.16733C6.26792 1.14112 5.99998 1.3451 5.99998 1.6868V2.06223C5.99998 3.50352 5.26628 4.40746 4.55062 4.93045C4.19808 5.18808 3.8487 5.35562 3.58861 5.45898C3.50911 5.49058 3.43716 5.5165 3.375 5.53739V9.97388ZM2.0625 4.87482C2.16605 4.87482 2.25 4.95876 2.25 5.06232V10.4997V10.6874C2.25 10.7909 2.16605 10.8749 2.0625 10.8749H1.3125C1.20895 10.8749 1.125 10.7909 1.125 10.6874V5.06232C1.125 4.95876 1.20895 4.87482 1.3125 4.87482H2.0625Z"
							fill="currentColor"
						/>
					{/if}
				</svg>
				{content.likes} <span class="sr-only">likes</span>
			</button>
			<button
				title={content.saved ? 'Unsave' : 'Save'}
				disabled={!page.data.user || submitting}
				aria-label="Save {content.title}"
				name="type"
				value="save"
				type="submit"
				class="flex touch-manipulation items-center gap-1 rounded-md px-2 py-1.5 font-mono text-gray-600 hover:bg-gray-200 hover:text-gray-700 sm:py-1"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					xmlns="http://www.w3.org/2000/svg"
					class="mr-0.5"
				>
					<title>{content.saved ? 'Unsave' : 'Save'}</title>
					{#if content.saved}
						<path
							d="M3.5625 0.75C2.83763 0.75 2.25 1.33763 2.25 2.0625V10.6875C2.25 10.9052 2.37558 11.1033 2.57243 11.1962C2.76928 11.2891 3.00206 11.26 3.17008 11.1217L6 8.7912L8.8299 11.1217C8.99797 11.26 9.2307 11.2891 9.42758 11.1962C9.62445 11.1033 9.75 10.9052 9.75 10.6875V2.0625C9.75 1.33763 9.16237 0.75 8.4375 0.75H3.5625Z"
							fill="currentColor"
						/>
					{:else}
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M3.5625 1.875C3.45895 1.875 3.375 1.95895 3.375 2.0625V9.4956L5.64242 7.62832C5.85012 7.45723 6.14988 7.45723 6.35758 7.62832L8.625 9.4956V2.0625C8.625 1.95895 8.54108 1.875 8.4375 1.875H3.5625ZM2.25 2.0625C2.25 1.33763 2.83763 0.75 3.5625 0.75H8.4375C9.16237 0.75 9.75 1.33763 9.75 2.0625V10.6875C9.75 10.9052 9.62445 11.1033 9.42758 11.1962C9.2307 11.2891 8.99797 11.26 8.8299 11.1217L6 8.7912L3.17008 11.1217C3.00206 11.26 2.76928 11.2891 2.57243 11.1962C2.37558 11.1033 2.25 10.9052 2.25 10.6875V2.0625Z"
							fill="currentColor"
						/>
					{/if}
				</svg>
				{content.saves} <span class="sr-only">saves</span>
			</button>
		</form>
	</div>

	<h2 class="mb-2 text-lg font-bold sm:text-xl">
		<a href="/{content.type}/{content.slug}">{content.title}</a>
	</h2>
	<div class="text-sm sm:text-base">{content.description}</div>

	<div>
		{#if content.type === 'recipe'}
			<Recipe />
		{:else if content.type === 'collection'}
			<Collection children={content.children} />
		{:else if content.type === 'video'}
			<Video />
		{/if}
	</div>

	<div
		class="mt-4 grid grid-cols-1 items-start justify-between gap-2 sm:grid-cols-[1fr_auto] sm:gap-0"
	>
		<div class="flex flex-wrap gap-2">
			<Tags tags={content.tags} />
		</div>

		<div class="text-xs text-gray-500">{formatRelativeDate(content.published_at)}</div>
	</div>
</article>
