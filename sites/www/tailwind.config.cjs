const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			'display': ['Inter'],
			'body': ['Inter']
		},
		extend: {
			colors: {
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
				tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
				svelte: {
					900: 'rgb(var(--svelte-orange-900) / <alpha-value>)',
					500: 'rgb(var(--svelte-orange-500) / <alpha-value>)',
					100: 'rgb(var(--svelte-orange-100) / <alpha-value>)'
				}
			}
		}
	},

	plugins: [forms, typography]
};

module.exports = config;
