import { tv, type VariantProps } from 'tailwind-variants'

export const sidebarCardVariants = tv({
	base: 'grid gap-3 rounded border border-slate-200 bg-gray-50 p-4',
	variants: {
		padding: {
			default: 'p-4',
			compact: 'px-4 py-3'
		}
	},
	defaultVariants: {
		padding: 'default'
	}
})

export type SidebarCardPadding = VariantProps<typeof sidebarCardVariants>['padding']
