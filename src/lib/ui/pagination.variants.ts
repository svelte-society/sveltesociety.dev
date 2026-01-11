import { tv, type VariantProps } from 'tailwind-variants'

export const paginationButtonVariants = tv({
	base: 'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium select-none',
	variants: {
		variant: {
			default: 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 active:scale-[0.98]',
			active: 'border-svelte-900 bg-svelte-900 text-white',
			disabled: 'border-gray-300 bg-white text-gray-500 opacity-50 cursor-not-allowed'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
})

export const paginationNavVariants = tv({
	base: 'inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500',
	variants: {
		disabled: {
			true: 'opacity-50 cursor-not-allowed',
			false: 'hover:bg-gray-50 active:scale-[0.98]'
		}
	},
	defaultVariants: {
		disabled: false
	}
})

export type PaginationButtonVariant = VariantProps<typeof paginationButtonVariants>['variant']
export type PaginationNavDisabled = VariantProps<typeof paginationNavVariants>['disabled']
