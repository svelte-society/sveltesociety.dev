<script module lang="ts">
	const colors = {
		default: 'bg-gray-100 text-gray-800',
		primary: 'bg-svelte-100 text-svelte-900',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		danger: 'bg-red-100 text-red-800',
		info: 'bg-svelte-100 text-svelte-900',
		amber: 'bg-amber-100 text-amber-800',
		purple: 'bg-purple-100 text-purple-800'
	} as const

	export type BadgeColor = keyof typeof colors
</script>

<script lang="ts">
	interface Props {
		text?: string
		color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | string
		'data-testid'?: string
	}

	let { text = '', color = 'default', 'data-testid': testId }: Props = $props()

	// Get the color class safely
	const getColorClass = (colorKey: string): string => {
		return colorKey in colors ? colors[colorKey as keyof typeof colors] : colors.default
	}
</script>

<span
	class={[
		'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-sm',
		getColorClass(color)
	]}
	data-testid={testId}
>
	{text}
</span>
