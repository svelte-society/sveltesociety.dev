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
	}

	let { title, description, buttonText, buttonHref }: Props = $props()

	const variant = 'cta' as const
</script>

<div data-testid="cta-card" class={promoCardVariants({ variant })}>
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
