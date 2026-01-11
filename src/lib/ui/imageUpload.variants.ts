import { tv, type VariantProps } from 'tailwind-variants'

export const imageUploadDropzoneVariants = tv({
	base: 'flex h-24 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
	variants: {
		state: {
			default: 'border-slate-300 bg-slate-50 hover:border-orange-300 hover:bg-orange-50',
			dragging: 'border-orange-400 bg-orange-50',
			error: 'border-red-300 bg-red-50'
		}
	},
	defaultVariants: {
		state: 'default'
	}
})

export type ImageUploadState = VariantProps<typeof imageUploadDropzoneVariants>['state']
