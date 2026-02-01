import { tv, type VariantProps } from 'tailwind-variants'

export const contentCardVariants = tv({
	base: 'grid min-w-0 gap-2 rounded-lg',
	variants: {
		variant: {
			list: 'px-4 py-4 sm:px-6 sm:py-5',
			detail: 'px-4 py-4 sm:px-6 sm:py-5'
		},
		layout: {
			default: '',
			horizontal: 'grid-cols-[132px_1fr] items-start gap-2 px-3 py-3'
		},
		compact: {
			true: 'px-3 py-3 sm:px-4 sm:py-3'
		},
		highlight: {
			none: 'bg-zinc-50',
			premium: 'bg-svelte-50/50',
			border: 'bg-zinc-50 border-l-4 border-l-svelte-500 rounded-l-none',
			featured: 'bg-gradient-to-r from-svelte-50 to-svelte-100'
		}
	},
	defaultVariants: {
		variant: 'list',
		layout: 'default',
		compact: false,
		highlight: 'none'
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

export const thumbnailVariants = tv({
	base: 'shrink-0 overflow-hidden rounded-lg',
	variants: {
		size: {
			sm: 'h-16 w-16',
			md: 'h-20 w-20',
			lg: 'h-[132px] w-[132px]'
		},
		hasImage: {
			true: '',
			false: 'flex items-center justify-center bg-slate-100'
		}
	},
	defaultVariants: {
		size: 'lg',
		hasImage: false
	}
})

export type CardVariant = NonNullable<VariantProps<typeof contentCardVariants>['variant']>
export type CardLayout = NonNullable<VariantProps<typeof contentCardVariants>['layout']>
export type CardHighlight = NonNullable<VariantProps<typeof contentCardVariants>['highlight']>
export type ThumbnailSize = NonNullable<VariantProps<typeof thumbnailVariants>['size']>
