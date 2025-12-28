import { tv, type VariantProps } from 'tailwind-variants'

export const tagVariants = tv({
	base: 'flex items-center gap-0.5 rounded border border-slate-200 bg-slate-100 py-1 text-xs text-zinc-800',
	variants: {
		active: {
			true: 'border-svelte-300 bg-svelte-100 text-svelte-900',
			false: ''
		},
		removable: {
			true: 'pl-1.5 pr-1',
			false: 'px-1.5 hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-svelte-300'
		}
	},
	compoundVariants: [
		{
			active: true,
			removable: false,
			class: 'hover:bg-svelte-200'
		}
	],
	defaultVariants: {
		active: false,
		removable: false
	}
})

export type TagVariant = VariantProps<typeof tagVariants>
