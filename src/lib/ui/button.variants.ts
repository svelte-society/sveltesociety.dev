import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
	base: 'inline-flex items-center justify-center gap-1 rounded-md font-medium focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-700 cursor-pointer',
	variants: {
		variant: {
			primary: 'bg-svelte-900 focus:ring-svelte-900 text-white hover:brightness-150',
			secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
			tertiary:
				'border-svelte-300 bg-svelte-100 text-svelte-900 focus:ring-svelte-900 border text-sm font-bold',
			success: 'bg-green-400 text-black hover:bg-green-200 focus:ring-green-500',
			error: 'bg-red-600 text-white transition-colors duration-200 hover:bg-red-700'
		},
		size: {
			default: 'px-4 py-2',
			sm: 'px-3 py-2 text-sm',
			lg: 'px-6 py-3 text-lg',
			thin: 'px-2 py-1 text-xs'
		},
		width: {
			default: '',
			full: 'w-full'
		},
		thickness: {
			default: 'border-2',
			thin: 'border',
			thick: 'border-4'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default',
		thickness: 'thin'
	}
})

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
export type ButtonSize = VariantProps<typeof buttonVariants>['size']
export type ButtonWidth = VariantProps<typeof buttonVariants>['width']
