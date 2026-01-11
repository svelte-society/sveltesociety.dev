import { tv, type VariantProps } from 'tailwind-variants'

export const promoCardVariants = tv({
	base: 'rounded-lg p-6',
	variants: {
		variant: {
			ad: 'bg-gradient-to-r from-gray-50 to-gray-100',
			cta: 'bg-gradient-to-r from-svelte-50 to-svelte-100'
		}
	},
	defaultVariants: {
		variant: 'cta'
	}
})

export const promoCardTitleVariants = tv({
	base: 'text-xl font-semibold',
	variants: {
		variant: {
			ad: 'text-gray-900',
			cta: 'text-svelte-900'
		}
	},
	defaultVariants: {
		variant: 'cta'
	}
})

export const promoCardDescriptionVariants = tv({
	base: 'mt-1.5 text-sm',
	variants: {
		variant: {
			ad: 'text-gray-600',
			cta: 'text-svelte-500'
		}
	},
	defaultVariants: {
		variant: 'cta'
	}
})

export const promoCardButtonVariants = tv({
	base: 'mt-3 inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors',
	variants: {
		variant: {
			ad: 'bg-gray-700 hover:bg-gray-900',
			cta: 'bg-svelte-500 hover:bg-svelte-900'
		}
	},
	defaultVariants: {
		variant: 'cta'
	}
})

export type PromoCardVariant = VariantProps<typeof promoCardVariants>['variant']
