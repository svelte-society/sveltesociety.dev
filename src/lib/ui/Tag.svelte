<script module>
	import { queryParameters } from 'sveltekit-search-params'

	const params = queryParameters()
</script>

<script lang="ts">
	import { page } from '$app/state'
	import { afterNavigate } from '$app/navigation'

	type Tag = {
		id: string
		name: string
		slug: string
	}
	let { tag, onclick }: { tag: Tag; onclick?: () => void } = $props()

	let tagElement: HTMLElement
	let shouldRestoreFocus = false

	afterNavigate(() => {
		if (shouldRestoreFocus && tagElement) {
			tagElement.focus()
			shouldRestoreFocus = false
		}
	})

	const handleClick = (e: MouseEvent) => {
		if (onclick) {
			e.preventDefault()
			onclick()
		} else {
			shouldRestoreFocus = true
		}
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (onclick && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault()
			onclick()
		} else if (!onclick && e.key === 'Enter') {
			shouldRestoreFocus = true
		}
	}

	function getTagHref() {
		const url = new URL(page.url)
		const tagParam = url.searchParams.get('tags')
		let tagList = tagParam ? tagParam.split(',') : []

		if (tagList.includes(tag.slug)) {
			tagList = tagList.filter((t) => t !== tag.slug)
		} else {
			tagList.push(tag.slug)
		}

		if (tagList.length > 0) {
			url.searchParams.set('tags', tagList.join(','))
		} else {
			url.searchParams.delete('tags')
		}

		return url.pathname + url.search
	}
</script>

<svelte:element
	this={onclick ? 'button' : 'a'}
	bind:this={tagElement}
	href={onclick ? undefined : getTagHref()}
	class={[
		'focus:outline-svelte-300 flex items-center gap-0.5 rounded border-1 border-slate-200 bg-slate-100 px-1.5 py-1 text-xs text-zinc-800 hover:bg-slate-200 focus:outline-2 focus:outline-offset-2',
		{
			'border-svelte-300 bg-svelte-100 text-svelte-900 hover:bg-svelte-200':
				$params?.tags?.includes(tag.slug)
		}
	]}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	role={onclick ? 'button' : undefined}
	tabindex="0"
	aria-label={`${$params?.tags?.includes(tag.slug) ? 'Remove' : 'Add'} tag: ${tag.name}`}
	aria-pressed={onclick ? $params?.tags?.includes(tag.slug) : undefined}
>
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="text-svelte-500"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M7.487 2.89018C7.50538 2.7934 7.50453 2.69394 7.48447 2.59749C7.46442 2.50104 7.42557 2.40948 7.37013 2.32804C7.25817 2.16357 7.08546 2.05031 6.89 2.01318C6.79322 1.9948 6.69376 1.99566 6.59731 2.01571C6.50085 2.03576 6.40929 2.07461 6.32786 2.13005C6.16339 2.24201 6.05013 2.41472 6.013 2.61018L5.558 4.99818H3.61C3.41109 4.99818 3.22032 5.0772 3.07967 5.21785C2.93902 5.3585 2.86 5.54927 2.86 5.74818C2.86 5.94709 2.93902 6.13786 3.07967 6.27851C3.22032 6.41916 3.41109 6.49818 3.61 6.49818H5.273L4.702 9.49618H2.75C2.55109 9.49618 2.36032 9.5752 2.21967 9.71585C2.07902 9.8565 2 10.0473 2 10.2462C2 10.4451 2.07902 10.6359 2.21967 10.7765C2.36032 10.9172 2.55109 10.9962 2.75 10.9962H4.416L4.013 13.1102C3.99461 13.207 3.99547 13.3064 4.01553 13.4029C4.03558 13.4993 4.07443 13.5909 4.12987 13.6723C4.24183 13.8368 4.41454 13.9501 4.61 13.9872C4.80546 14.0243 5.00767 13.9823 5.17214 13.8703C5.33661 13.7584 5.44987 13.5856 5.487 13.3902L5.943 10.9962H8.916L8.513 13.1102C8.49461 13.207 8.49547 13.3064 8.51552 13.4029C8.53558 13.4993 8.57443 13.5909 8.62987 13.6723C8.6853 13.7538 8.75624 13.8235 8.83862 13.8775C8.921 13.9315 9.01322 13.9688 9.11 13.9872C9.30546 14.0243 9.50767 13.9823 9.67214 13.8703C9.83661 13.7584 9.94987 13.5856 9.987 13.3902L10.443 10.9962H12.39C12.5889 10.9962 12.7797 10.9172 12.9203 10.7765C13.061 10.6359 13.14 10.4451 13.14 10.2462C13.14 10.0473 13.061 9.8565 12.9203 9.71585C12.7797 9.5752 12.5889 9.49618 12.39 9.49618H10.729L11.299 6.49818H13.249C13.4479 6.49818 13.6387 6.41916 13.7793 6.27851C13.92 6.13786 13.999 5.94709 13.999 5.74818C13.999 5.54927 13.92 5.3585 13.7793 5.21785C13.6387 5.0772 13.4479 4.99818 13.249 4.99818H11.585L11.987 2.89018C12.0241 2.69472 11.9821 2.49251 11.8701 2.32804C11.7582 2.16357 11.5855 2.05031 11.39 2.01318C11.1945 1.97605 10.9923 2.01809 10.8279 2.13005C10.6634 2.24201 10.5501 2.41472 10.513 2.61018L10.058 4.99818H7.085L7.487 2.89018ZM6.8 6.49818L6.229 9.49618H9.202L9.772 6.49818H6.8Z"
			fill="#FF6F41"
		/>
	</svg>
	{tag.name}
	{#if onclick}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	{/if}
</svelte:element>
