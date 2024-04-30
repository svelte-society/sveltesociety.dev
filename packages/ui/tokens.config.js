import pluginCSS from '@cobalt-ui/plugin-css';
import pluginJS from '@cobalt-ui/plugin-js';
import pluginTailwind from '@cobalt-ui/plugin-tailwind';

/** @type import('@cobalt-ui/core').Config */
export default {
	tokens: [`./src/lib/tokens.json`],

	outDir: './src/lib/output/',
	plugins: [
		pluginCSS({
			filename: `./tokens.css`,
			prefix: 'craft',
			p3: false
		}),
		pluginJS({
			js: true,
			json: true
		}),
		pluginTailwind({
			filename: './src/styles/tailwind/preset.ts',
			format: 'esm',
			tailwind: {
				theme: {}
			}
		})
	]
};
