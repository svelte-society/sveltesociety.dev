// @ts-check

/** @type {import('prettier').Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{ files: '*.svx', options: { parser: 'mdx' } }
	]
};

export default config;
