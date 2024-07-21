<script lang="ts">
	import { insert } from '@milkdown/utils';
	import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { clipboard } from '@milkdown/plugin-clipboard';
	import { emoji } from '@milkdown/plugin-emoji';
	import { history } from '@milkdown/plugin-history';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { upload } from '@milkdown/plugin-upload';
	import { nord } from '@milkdown/theme-nord';
	import '@milkdown-lab/plugin-menu/style.css';

	let editor: Editor;
	let editorDiv: HTMLElement;

	let { markdown = 'Test', value = $bindable(), name = '' } = $props();

	$effect(async () => {
		// const { menu, menuDefaultConfig } = await import('@milkdown-lab/plugin-menu');

		editor = await Editor.make()
			// .config(menuDefaultConfig)
			.config((ctx) => {
				ctx.set(rootCtx, editorDiv);
			})
			.config((ctx) => {
				ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
					value = markdown;
				});
			})
			.config(nord)
			.use(commonmark)
			.use(clipboard)
			.use(emoji)
			.use(history)
			.use(upload)
			.use(listener)
			// .use(menu)
			.create();

		editor.action(insert(markdown));

		return async () => {
			await editor.destroy();
		};
	});
</script>

<div class="markdown-editor">
	<div bind:this={editorDiv}></div>
</div>

<input type="hidden" {value} {name} />
