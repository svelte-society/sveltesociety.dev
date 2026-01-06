<script lang="ts">
	import { Row, Column, Button } from 'better-svelte-email'
	import type { Snippet } from 'svelte'

	type ButtonVariant = 'primary' | 'secondary' | 'ghost'
	type ButtonSize = 'default' | 'sm' | 'lg'

	interface Props {
		href: string
		variant?: ButtonVariant
		size?: ButtonSize
		children: Snippet
	}

	let { href, variant = 'primary', size = 'default', children }: Props = $props()

	const variantClasses: Record<ButtonVariant, string> = {
		primary: 'bg-svelte-900 text-white',
		secondary: 'bg-slate-200 text-slate-800',
		ghost: 'bg-transparent text-svelte-900 border-2 border-svelte-900'
	}

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'text-sm px-5 py-2.5',
		default: 'text-base px-8 py-3.5',
		lg: 'text-lg px-10 py-4.5'
	}

	const baseClasses = 'font-semibold rounded-lg no-underline inline-block'
	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
</script>

<Row class="my-8">
	<Column align="center">
		<Button {href} class={classes}>
			{@render children()}
		</Button>
	</Column>
</Row>
