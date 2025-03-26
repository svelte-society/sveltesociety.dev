<script module lang="ts">
	const colors = {
		default: 'bg-gray-100 text-gray-800',
		primary: 'bg-blue-100 text-blue-800',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		danger: 'bg-red-100 text-red-800',
		info: 'bg-indigo-100 text-indigo-800'
	} as const

	export type BadgeColor = keyof typeof colors
</script>

<script lang="ts">
	export let text = ''
	export let color: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | string =
		'default'

	// Get the color class safely
	const getColorClass = (colorKey: string): string => {
		return colorKey in colors ? colors[colorKey as keyof typeof colors] : colors.default
	}
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {getColorClass(
		color
	)}"
>
	{text}
</span>
