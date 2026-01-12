import { tv, type VariantProps } from 'tailwind-variants'

export const dialogVariants = tv({
	base: 'fixed inset-0 m-auto rounded-lg bg-white p-6 shadow-xl backdrop:bg-black/30',
	variants: {
		size: {
			sm: 'max-w-sm',
			md: 'max-w-md',
			lg: 'max-w-lg'
		}
	},
	defaultVariants: {
		size: 'md'
	}
})

export const dialogHeaderVariants = tv({
	base: 'mb-4 text-xl font-bold'
})

export const dialogBodyVariants = tv({
	base: 'mb-4'
})

export const dialogFooterVariants = tv({
	base: 'flex justify-end gap-2'
})

export type DialogSize = VariantProps<typeof dialogVariants>['size']
