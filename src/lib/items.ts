import components from '../routes/components/components.json';
import tools from '../routes/tools/tools.json';
import templates from '../routes/templates/templates.json';
import { cheatSheet } from '../routes/cheatsheet/cheat-sheet';

export type SearchItem = {
	type: 'Component' | 'Tool' | 'Template' | 'Recipe Category' | 'Recipe' | 'CheatSheet' | 'Event';
	url: string;
	tags: Array<string>;
	title: string;
	description: string;
	search: string;
};
type JsonItem = {
	title: string;
	repository: string;
	url: string;
	description: string;
	npm: string;
	category: string;
	tags: Array<string>;
};
// https://gist.github.com/sebleier/554280
const stopWords = [
	'a',
	'about',
	'above',
	'after',
	'again',
	'against',
	'all',
	'am',
	'an',
	'and',
	'any',
	'are',
	'as',
	'at',
	'be',
	'because',
	'been',
	'before',
	'being',
	'below',
	'between',
	'both',
	'but',
	'by',
	'can',
	'did',
	'do',
	'does',
	'doing',
	'don',
	'down',
	'during',
	'each',
	'few',
	'for',
	'from',
	'further',
	'had',
	'has',
	'have',
	'having',
	'he',
	'her',
	'here',
	'hers',
	'herself',
	'him',
	'himself',
	'his',
	'how',
	'i',
	'if',
	'in',
	'into',
	'is',
	'it',
	'its',
	'itself',
	'just',
	'me',
	'more',
	'most',
	'my',
	'myself',
	'no',
	'nor',
	'not',
	'now',
	'of',
	'off',
	'on',
	'once',
	'only',
	'or',
	'other',
	'our',
	'ours',
	'ourselves',
	'out',
	'over',
	'own',
	's',
	'same',
	'she',
	'should',
	'so',
	'some',
	'such',
	't',
	'than',
	'that',
	'the',
	'their',
	'theirs',
	'them',
	'themselves',
	'then',
	'there',
	'these',
	'they',
	'this',
	'those',
	'through',
	'to',
	'too',
	'under',
	'until',
	'up',
	'very',
	'was',
	'we',
	'were',
	'what',
	'when',
	'where',
	'which',
	'while',
	'who',
	'whom',
	'why',
	'will',
	'with',
	'you',
	'your',
	'yours',
	'yourself',
	'yourselves'
];
const otherStopwords = [
	'also',
	'casual',
	'etc',
	'fully',
	'like',
	'make',
	'many',
	'mostly',
	'much',
	'need',
	'new',
	'one',
	'per',
	'run',
	'set',
	'show',
	'tell',
	'two',
	'unless',
	'using',
	'via',
	'way',
	'www',
	'yet'
];
function searchKeywords(...args: Array<string>): string {
	return args
		.filter((item) => {
			try {
				new URL(item);
				return false;
			} catch {
				return true;
			}
		})
		.reduce((all, item) => all + ' ' + item, '')
		.toLowerCase()
		.replaceAll(/\W/g, ' ')
		.split(/\s+/)
		.reduce((all, item) => {
			if (!all.includes(item)) {
				all.push(item);
			}
			return all;
		}, [])
		.filter(
			(item) =>
				item.length >= 3 &&
				!stopWords.includes(item) &&
				!otherStopwords.includes(item) &&
				!/^\d+$/.test(item)
		)
		.join(' ');
}
const allItems = [
	...(components as Array<JsonItem>).map<SearchItem>((item) => ({
		title: item.title,
		description: item.description,
		tags: item.tags,
		type: 'Component',
		search: searchKeywords(item.title, item.description, ...(item.tags ?? []), item.npm ?? ''),
		url: '/components#component-' + item.title
	})),
	...(tools as Array<JsonItem>).map<SearchItem>((item) => ({
		title: item.title,
		description: item.description,
		tags: item.tags,
		type: 'Tool',
		search: searchKeywords(item.title, item.description, ...(item.tags ?? []), item.npm ?? ''),
		url: '/tools#component-' + item.title
	})),
	...(templates as Array<JsonItem>).map<SearchItem>((item) => ({
		title: item.title,
		description: item.description,
		tags: item.tags,
		type: 'Template',
		search: searchKeywords(item.title, item.description, ...(item.tags ?? []), item.npm ?? ''),
		url: '/templates#component-' + item.title
	})),
	...Object.entries(
		import.meta.glob('../routes/recipes/**/*.svx', { eager: true }) as Record<
			string,
			{ metadata: { layout: string; title: string } }
		>
	).map<SearchItem>(([path, { metadata }]) => ({
		title: metadata.title,
		description: '',
		tags: [],
		type: metadata.layout === 'recipe' ? 'Recipe' : 'Recipe Category',
		search: searchKeywords(metadata.title),
		url: path.replace(/^\.\.\/routes/, '').replace('/+page.svx', '')
	})),
	...cheatSheet.map<SearchItem>((item) => ({
		title: item.title,
		description: '',
		tags: [],
		type: 'CheatSheet',
		search: searchKeywords(item.title),
		url: '/cheatsheet'
	})),
	...Object.entries(
		import.meta.glob('../routes/events/**/*.svx', { eager: true }) as Record<
			string,
			{ metadata: { layout: string; title: string; date: string } }
		>
	).map<SearchItem>(([path, { metadata }]) => ({
		title: metadata.title,
		description: metadata.date,
		tags: [],
		type: 'Event',
		search: searchKeywords(metadata.title),
		url: path.replace(/^\.\.\/routes/, '').replace('/+page.svx', '')
	}))
];

export function search(query: string): Array<SearchItem> {
	const keywords = query.toLowerCase().split(/\s+/);
	return allItems.filter((item) => keywords.every((keyword) => item.search.includes(keyword)));
}
