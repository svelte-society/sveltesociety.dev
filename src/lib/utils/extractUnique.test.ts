import { describe, it, expect } from 'vitest';
import { extractUnique } from './extractUnique';

describe('extractUnique', () => {
	it("creates an object using the item's `category` field", () => {
		const extracted = extractUnique(oneItem, 'category');
		expect(extracted).toEqual([{ label: 'Testing', value: 'Testing' }]);
	});

	it('reduces down to unique values, including the empty string', () => {
		const extracted = extractUnique(manyItems, 'category');
		expect(extracted.length).toBeLessThan(manyItems.length);
		expect(extracted.map((i) => i.value)).toEqual([
			'',
			'Data Visualisation',
			'Forms & User Input',
			'SvelteKit Adapters',
			'Testing',
			'User Interaction'
		]);
	});
});

const oneItem = [
	{
		title: 'svelte-carbonbadge',
		url: 'https://gitlab.com/davidhund/svelte-carbonbadge',
		description: 'Svelte badge component for https://www.websitecarbon.com/',
		npm: 'svelte-carbonbadge',
		addedOn: '2022-02-08',
		category: 'Testing',
		stars: 0
	}
];

const manyItems = [
	{
		title: 'svelte-carbonbadge',
		url: 'https://gitlab.com/davidhund/svelte-carbonbadge',
		description: 'Svelte badge component for https://www.websitecarbon.com/',
		npm: 'svelte-carbonbadge',
		addedOn: '2022-02-08',
		category: 'Testing',
		stars: 0
	},
	{
		title: 'svelte-form-validation',
		url: 'https://github.com/DhyeyMoliya/svelte-form-validation',
		npm: 'svelte-form-validation',
		description: 'Svelte Form Validation Library',
		tags: ['forms', 'form validation', 'components and libraries'],
		addedOn: '2021-11-14T17:10:00.000Z',
		category: 'Forms & User Input',
		stars: 0
	},
	{
		title: 'Date Picker Svelte',
		url: 'https://github.com/probablykasper/date-picker-svelte',
		description: 'Date and time picker for Svelte',
		npm: 'date-picker-svelte',
		addedOn: '2021-10-23',
		category: 'Forms & User Input',
		tags: [
			'time and date',
			'forms',
			'components and libraries',
			'form validation',
			'inputs and widgets',
			'component sets'
		]
	},
	{
		title: 'svelte-virtual-table',
		description: 'A virtual, sortable table for Svelte ',
		url: 'https://github.com/BernhardWebstudio/svelte-virtual-table',
		npm: 'svelte-virtual-table',
		tags: ['components and libraries'],
		addedOn: '2021-10-04',
		category: 'Data Visualisation',
		stars: 1
	},
	{
		title: 'svelte-number-spinner',
		description:
			'A number input field that can be controlled by mouse/touch drag, arrow keys or usual editing.',
		url: 'https://github.com/bohnacker/svelte-number-spinner',
		npm: 'svelte-number-spinner',
		tags: ['components and libraries', 'inputs and widgets'],
		addedOn: '2021-08-29T00:00:00Z',
		category: 'Forms & User Input',
		stars: 4
	},
	{
		title: 'svelte-remixicon',
		description:
			'An icon library for svelte based on Remix Icon. Consists of more than 2000 icons.',
		url: 'https://github.com/ABarnob/svelte-remixicon',
		npm: 'https://www.npmjs.com/package/svelte-remixicon',
		tags: ['components and libraries'],
		addedOn: '2021-08-25T00:00:00Z',
		category: '',
		stars: 14
	},
	{
		title: 'svelte-fast-marquee',
		description: 'A Marquee component for Svelte inspired by react-fast-marquee.',
		url: 'https://github.com/abosch19/svelte-fast-marquee',
		npm: 'svelte-fast-marquee',
		tags: ['components and libraries'],
		addedOn: '2021-08-25T00:00:00Z',
		category: '',
		stars: 2
	},
	{
		title: 'sswr',
		category: 'User Interaction',
		description: 'Svelte stale while revalidate (SWR) data fetching strategy',
		url: 'https://github.com/ConsoleTVs/sswr',
		npm: 'https://www.npmjs.com/package/sswr',
		tags: ['components and libraries', 'fonts and icons'],
		addedOn: '2021-07-29T00:00:00Z',
		stars: 59
	},
	{
		title: 'svelte-adapter-firebase',
		description:
			'SvelteKit adapter for Firebase Hosting rewrites to either Cloud Functions or Cloud Run for a Svelte SSR experience',
		url: 'https://github.com/jthegedus/svelte-adapter-firebase',
		npm: 'https://www.npmjs.com/package/svelte-adapter-firebase',
		stars: 54,
		tags: ['integrations'],
		addedOn: '2021-03-31T00:00:00Z',
		category: 'SvelteKit Adapters'
	},
	{
		title: 'architect/sveltekit-adapter',
		description:
			'Adapter for Svelte apps that creates a Begin or Architect app, using a function for dynamic server rendering.',
		url: 'https://github.com/architect/sveltekit-adapter',
		npm: 'https://www.npmjs.com/package/@architect/sveltekit-adapter',
		stars: 3,
		tags: ['integrations'],
		addedOn: '2021-08-09T00:00:00Z'
	}
];
