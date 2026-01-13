<script lang="ts">
	import {
		promoCardVariants,
		promoCardTitleVariants,
		promoCardDescriptionVariants,
		promoCardButtonVariants
	} from './promoCard.variants'

	interface Props {
		title: string
		description: string
		buttonText: string
		buttonHref: string
		variant?: 'cta' | 'ad'
	}

	let { title, description, buttonText, buttonHref, variant = 'cta' }: Props = $props()
</script>

<div data-testid="{variant}-card" class={promoCardVariants({ variant })}>
	{#if variant === 'ad'}
		<div class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Sponsored</div>
	{/if}
	<div class="mx-auto max-w-2xl text-center">
		<h2 class={promoCardTitleVariants({ variant })}>{title}</h2>
		<p class={promoCardDescriptionVariants({ variant })}>
			{description}
		</p>
		<a href={buttonHref} class={promoCardButtonVariants({ variant })}>
			{buttonText}
		</a>
	</div>
</div>
