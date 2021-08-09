const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Inter', 'ui-sans-serif'],
			heading: ['Overpass', 'ui-sans-serif']
		},
		extend: {
			boxShadow: {
				'shadow-dreamy': `0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
        0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07), 0 16px 32px rgba(0, 0, 0, 0.07),
        0 32px 64px rgba(0, 0, 0, 0.07)`,
				'shadow-short': `0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11),
        0 4px 4px rgba(0, 0, 0, 0.11), 0 6px 8px rgba(0, 0, 0, 0.11), 0 8px 16px rgba(0, 0, 0, 0.11)`,
				'shadow-long': `0 2px 1px rgba(0, 0, 0, 0.09), 0 4px 2px rgba(0, 0, 0, 0.09),
        0 8px 4px rgba(0, 0, 0, 0.09), 0 16px 8px rgba(0, 0, 0, 0.09), 0 32px 16px rgba(0, 0, 0, 0.09)`,
				'shadow-sharp': `0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 2px rgba(0, 0, 0, 0.2),
        0 4px 4px rgba(0, 0, 0, 0.15), 0 8px 8px rgba(0, 0, 0, 0.1), 0 16px 16px rgba(0, 0, 0, 0.05)`,
				'shadow-diffuse': `0 1px 1px rgba(0, 0, 0, 0.08), 0 2px 2px rgba(0, 0, 0, 0.12),
        0 4px 4px rgba(0, 0, 0, 0.16), 0 8px 8px rgba(0, 0, 0, 0.2)`
			},
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				accent: '#ff3e000b',
				primary: '#f97316',
				secondary: 'hsl(204, 100%, 38%)',
				'secondary-accent': '#40b3ff0b',
				error: '#f15856',
				success: '#6ecb44',
				caution: '#ffba29',
				basics: {
					50: '#fff',
					100: '#f3f6f9',
					200: '#e9e9e9',
					300: '#5E5e5E',
					400: '#444444',
					500: '#434343',
					600: '#323232',
					700: '#2B2B2B',
					800: '#ff3e000b',
					900: '#111111'
				}
			},
			fontSize: {
				100: 'clamp(0.9894rem, 0.9072rem + 0.411vw, 1.2rem)',
				200: 'clamp(1.1875rem, 1.0655rem + 0.6098vw, 1.5rem)',
				300: 'clamp(1.425rem, 1.2494rem + 0.878vw, 1.875rem)',
				400: 'clamp(1.71rem, 1.4627rem + 1.2366vw, 2.3438rem)',
				500: 'clamp(2.0519rem, 1.7092rem + 1.7134vw, 2.93rem)',
				600: 'clamp(2.4625rem, 1.9945rem + 2.3402vw, 3.6619rem)',
				700: 'clamp(2.955rem, 2.3218rem + 3.1659vw, 4.5775rem)'
			},
			gridTemplateColumns: {
				auto: 'auto'
			}
		}
	},
	plugins: []
};

module.exports = config;
