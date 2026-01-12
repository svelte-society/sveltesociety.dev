import { tv, type VariantProps } from 'tailwind-variants'

export const collapsibleTriggerVariants = tv({
	base: 'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-[background-color] focus:outline-2 focus:outline-offset-2 focus:outline-svelte-300',
	variants: {
		variant: {
			default: 'border-slate-200 bg-slate-50 hover:bg-slate-100'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
})

export const collapsibleContentVariants = tv({
	base: 'my-4 rounded-lg border border-slate-200 bg-white p-4',
	variants: {
		padding: {
			none: 'p-0',
			sm: 'p-2',
			md: 'p-4',
			lg: 'p-6'
		}
	},
	defaultVariants: {
		padding: 'md'
	}
})

export type CollapsibleTriggerVariant = VariantProps<typeof collapsibleTriggerVariants>['variant']
export type CollapsibleContentPadding = VariantProps<typeof collapsibleContentVariants>['padding']
