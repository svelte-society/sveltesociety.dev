import { tv, type VariantProps } from 'tailwind-variants'

export const dynamicSelectorInputVariants = tv({
	base: 'w-full rounded-md border-2 px-8 py-1.5 text-sm text-slate-800 placeholder-slate-500 focus:outline-2 focus:outline-sky-200',
	variants: {
		error: {
			true: 'border-red-300 bg-red-50 text-red-600',
			false: 'border-transparent bg-slate-100'
		}
	},
	defaultVariants: {
		error: false
	}
})

export const dynamicSelectorDropdownVariants = tv({
	base: 'absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white p-1 shadow-lg'
})

export const dynamicSelectorOptionVariants = tv({
	base: 'flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm',
	variants: {
		highlighted: {
			true: 'bg-slate-100',
			false: 'hover:bg-slate-100'
		}
	},
	defaultVariants: {
		highlighted: false
	}
})

export const dynamicSelectorItemVariants = tv({
	base: 'flex cursor-grab items-center justify-between gap-2 rounded-md border-2 border-gray-100 bg-white p-2 pr-10 transition-all duration-300'
})

export type DynamicSelectorInputError = VariantProps<typeof dynamicSelectorInputVariants>['error']
export type DynamicSelectorOptionHighlighted = VariantProps<
	typeof dynamicSelectorOptionVariants
>['highlighted']
