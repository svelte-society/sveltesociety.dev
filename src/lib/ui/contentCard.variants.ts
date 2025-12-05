import { tv, type VariantProps } from 'tailwind-variants'

export const contentCardVariants = tv({
	base: 'grid min-w-0 gap-2 rounded-lg bg-zinc-50',
	variants: {
		variant: {
			list: 'px-4 py-4 sm:px-6 sm:py-5',
			detail: 'px-4 py-4 sm:px-6 sm:py-5'
		},
		compact: {
			true: 'px-3 py-3 sm:px-4 sm:py-3'
		}
	},
	defaultVariants: {
		variant: 'list',
		compact: false
	}
})

export const titleVariants = tv({
	base: 'font-bold',
	variants: {
		variant: {
			list: 'mb-2 text-lg sm:text-xl',
			detail: 'mb-2 text-lg sm:text-xl'
		},
		compact: {
			true: 'mb-1 text-base sm:text-lg'
		}
	},
	defaultVariants: {
		variant: 'list'
	}
})

export const descriptionVariants = tv({
	base: '',
	variants: {
		variant: {
			list: 'line-clamp-2 text-sm sm:text-base',
			detail: 'text-sm sm:text-base'
		},
		compact: {
			true: 'line-clamp-2 text-sm'
		}
	},
	defaultVariants: {
		variant: 'list'
	}
})

export type CardVariant = NonNullable<VariantProps<typeof contentCardVariants>['variant']>
