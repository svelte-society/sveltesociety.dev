<script lang="ts">
const icon_paths_map = new Map<string, string>([
	[
		'plus',
		`<path fill-rule="evenodd" clip-rule="evenodd" d="M7.75 2C7.94891 2 8.13968 2.07902 8.28033 2.21967C8.42098 2.36032 8.5 2.55109 8.5 2.75V7H12.75C12.9489 7 13.1397 7.07902 13.2803 7.21967C13.421 7.36032 13.5 7.55109 13.5 7.75C13.5 7.94891 13.421 8.13968 13.2803 8.28033C13.1397 8.42098 12.9489 8.5 12.75 8.5H8.5V12.75C8.5 12.9489 8.42098 13.1397 8.28033 13.2803C8.13968 13.421 7.94891 13.5 7.75 13.5C7.55109 13.5 7.36032 13.421 7.21967 13.2803C7.07902 13.1397 7 12.9489 7 12.75V8.5H2.75C2.55109 8.5 2.36032 8.42098 2.21967 8.28033C2.07902 8.13968 2 7.94891 2 7.75C2 7.55109 2.07902 7.36032 2.21967 7.21967C2.36032 7.07902 2.55109 7 2.75 7H7V2.75C7 2.55109 7.07902 2.36032 7.21967 2.21967C7.36032 2.07902 7.55109 2 7.75 2Z" fill="currentColor"/>`
	],
	[
		'minus',
		`<path d="M2.75 8H13.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
	],
	[
		'close',
		`<path d="M3 3L13 13M3 13L13 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
	],
	[
		'x-circle',
		`<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM5.5 5.5l5 5m0-5l-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
	],
	[
		'arrow-left',
		`<path d="M10 3L5 8L10 13M5 8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
	],
	[
		'check-circle',
		`<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM5.5 8.5L7 10l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
	]
])
type Props = {
	primary?: boolean
	error?: boolean
	secondary?: boolean
	tertiary?: boolean
	success?: boolean
	small?: boolean
	thin?: boolean
	large?: boolean
	fullWidth?: boolean
	href?: string
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	children: any
	icon_left?: string
	icon_right?: string
	value?: string
	name?: string
	onclick?: () => void
}

let {
	primary,
	secondary,
	tertiary,
	success,
	error,
	small,
	large,
	fullWidth,
	href,
	type,
	disabled,
	thin,
	icon_left,
	icon_right,
	children,
	value,
	name,
	onclick
}: Props = $props()

  const baseStyles = 'inline-flex items-center justify-center gap-1 rounded-md px-4 py-2 font-medium focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-700'
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? '' : 'button'}
	tabindex="0"
	{value}
	{name}
	{type}
	{href}
	{disabled}
	{onclick}
	class={[baseStyles, { 'bg-svelte-900 text-white hover:brightness-150 focus:ring-svelte-900': primary, 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': secondary, 'border border-svelte-300 bg-svelte-100 text-sm font-bold text-svelte-900 focus:ring-svelte-900': tertiary, 'bg-green-400 text-black hover:bg-green-200 focus:ring-green-500': success, 'w-full': fullWidth, 'px-6 py-3 text-lg': large, 'px-2 py-1 text-xs': thin, 'px-3 py-2 text-sm': small, 'rounded-md bg-red-600 text-white transition-colors duration-200 hover:bg-red-700': error }]}
>
	{#if icon_left}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			{@html icon_paths_map.get(icon_left)}
		</svg>
	{/if}
	{@render children()}
	{#if icon_right}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			{@html icon_paths_map.get(icon_right)}
		</svg>
	{/if}
</svelte:element>
