import { tv, type VariantProps } from 'tailwind-variants'

export const switchContainerVariants = tv({
	base: 'inline-flex cursor-pointer items-center',
	variants: {
		disabled: {
			true: 'cursor-not-allowed opacity-50',
			false: ''
		}
	},
	defaultVariants: {
		disabled: false
	}
})

export const switchTrackVariants = tv({
	base: 'h-6 w-10 rounded-full shadow-inner transition-colors duration-300 ease-in-out',
	variants: {
		checked: {
			true: 'bg-blue-500',
			false: 'bg-gray-200'
		},
		disabled: {
			true: 'opacity-50',
			false: ''
		}
	},
	defaultVariants: {
		checked: false,
		disabled: false
	}
})

export const switchThumbVariants = tv({
	base: 'absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out',
	variants: {
		checked: {
			true: 'translate-x-full transform',
			false: ''
		}
	},
	defaultVariants: {
		checked: false
	}
})

export type SwitchDisabled = VariantProps<typeof switchContainerVariants>['disabled']
export type SwitchChecked = VariantProps<typeof switchTrackVariants>['checked']
