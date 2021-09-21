import { compare } from './sort';

describe('sort', () => {
	const mock = [
		{
			addedOn: '2019-09-29T14:39:13Z',
			category: 'Svelte',
			description:
				'Boilerplate with TypeScript, Webpack, Storybook, Travis CI, SCSS, Babel, EsLint, Prettier, Jest',
			stars: 51,
			tags: [],
			title: 'agusID/boilerplate-svelte',
			url: 'https://github.com/agusID/boilerplate-svelte'
		},
		{
			addedOn: '2020-09-29T14:39:13Z',
			category: 'Svelte',
			description: 'An example repo of a Svelte app that is IE11 compatible',
			stars: 27,
			tags: [],
			title: 'angelozehr/svelte-example-museums',
			url: 'https://github.com/angelozehr/svelte-example-museums'
		}
	];

	it('should sort by added_desc', () => {
		mock.sort(compare('added_desc'));
		expect(mock[0].title).toEqual('angelozehr/svelte-example-museums');
		expect(mock[1].title).toEqual('agusID/boilerplate-svelte');
	});

	it('should sort by added_asc', () => {
		mock.sort(compare('added_asc'));
		expect(mock[0].title).toEqual('agusID/boilerplate-svelte');
		expect(mock[1].title).toEqual('angelozehr/svelte-example-museums');
	});

	it('should sort by name_asc', () => {
		mock.sort(compare('name_asc'));
		expect(mock[0].title).toEqual('agusID/boilerplate-svelte');
		expect(mock[1].title).toEqual('angelozehr/svelte-example-museums');
	});

	it('should sort by name_desc', () => {
		mock.sort(compare('name_desc'));
		expect(mock[0].title).toEqual('angelozehr/svelte-example-museums');
		expect(mock[1].title).toEqual('agusID/boilerplate-svelte');
	});

	it('should sort by stars_asc', () => {
		mock.sort(compare('stars_asc'));
		expect(mock[0].title).toEqual('angelozehr/svelte-example-museums');
		expect(mock[1].title).toEqual('agusID/boilerplate-svelte');
	});

	it('should sort by stars_desc', () => {
		mock.sort(compare('stars_desc'));
		expect(mock[0].title).toEqual('agusID/boilerplate-svelte');
		expect(mock[1].title).toEqual('angelozehr/svelte-example-museums');
	});
});
