// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/stylistic',
		'plugin:svelte/recommended',
		'prettier'
	],
	plugins: ['@typescript-eslint', 'svelte'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
		sourceType: 'module',
		ecmaVersion: 2022,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2022: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/consistent-type-definitions': 'off',
		'svelte/no-at-html-tags': 'off',
		'svelte/valid-compile': 'off'
	}
};

module.exports = config;
