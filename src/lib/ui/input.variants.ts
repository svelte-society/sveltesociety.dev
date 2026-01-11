import { tv, type VariantProps } from 'tailwind-variants'

export const inputVariants = tv({
	base: 'w-full rounded-md border-2 px-2 py-1.5 pr-7 text-sm placeholder-slate-500 focus:outline-2 focus:outline-sky-200',
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

export type InputError = VariantProps<typeof inputVariants>['error']
