<script lang="ts">
	import { Row, Column, Text, Hr, Link } from 'better-svelte-email'

	interface Props {
		aboutUrl?: string
		discordUrl?: string
		privacyUrl?: string
	}

	let {
		aboutUrl = 'https://sveltesociety.dev/about',
		discordUrl = 'https://discord.gg/svelte',
		privacyUrl = 'https://sveltesociety.dev/privacy'
	}: Props = $props()
</script>

<Hr class="border-0 border-t border-slate-200 my-8" />

<Row>
	<Column align="center">
		<Text class="text-slate-500 text-sm leading-relaxed mb-2">
			Have questions? Check out our <Link href={aboutUrl} class="text-svelte-900 underline"
				>About page</Link
			>, join the conversation on
			<Link href={discordUrl} class="text-svelte-900 underline">Discord</Link>, or read our
			<Link href={privacyUrl} class="text-svelte-900 underline">Privacy Policy</Link>.
		</Text>
	</Column>
</Row>

<Row>
	<Column align="center">
		<Text class="text-slate-400 text-xs mt-6">
			Svelte Society &bull; Built with love by the community
		</Text>
	</Column>
</Row>
