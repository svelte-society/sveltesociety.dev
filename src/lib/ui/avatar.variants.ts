import { tv, type VariantProps } from 'tailwind-variants'

export const avatarVariants = tv({
	base: 'bg-svelte-100 border-svelte-900 relative flex items-center justify-center overflow-hidden rounded-full border font-medium text-slate-700 uppercase hover:opacity-80',
	variants: {
		size: {
			sm: 'h-8 w-8 text-xs',
			md: 'h-10 w-10 text-sm',
			lg: 'h-16 w-16 text-lg'
		}
	},
	defaultVariants: {
		size: 'md'
	}
})

export type AvatarSize = VariantProps<typeof avatarVariants>['size']
