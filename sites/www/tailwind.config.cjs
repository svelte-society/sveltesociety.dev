const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			display: ['Inter'],
			body: ['Inter']
		},
		extend: {
			colors: {
				svelte: {
					900: 'rgb(var(--svelte-orange-900) / <alpha-value>)',
					500: 'rgb(var(--svelte-orange-500) / <alpha-value>)',
					300: 'rgb(var(--svelte-orange-300) / <alpha-value>)',
					100: 'rgb(var(--svelte-orange-100) / <alpha-value>)'
				}
			}
		}
	},

	plugins: [typography]
};

module.exports = config;
