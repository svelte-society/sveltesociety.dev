<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';

	import { attachment } from '@cartamd/plugin-attachment';
	import { emoji } from '@cartamd/plugin-emoji';
	import { code } from '@cartamd/plugin-code';
	import { video } from 'carta-plugin-video';
	import { insdel } from 'carta-plugin-ins-del';

	const carta = new Carta({
		sanitizer: false,
		extensions: [
			attachment({
				async upload() {
					return 'some-url-from-server.xyz';
				}
			}),
			emoji(),
			code(),
			video(),
			insdel()
		]
	});

	let value = '';
</script>

{#key value}
	<MarkdownEditor {carta} {value} />
{/key}

<style>
	/* Set your monospace font (Required to have the editor working correctly!) */
	:global(.carta-font-code) {
		font-family: '...', monospace;
		font-size: 1.1rem;
	}
</style>
