import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

type Metatags = {
	title: string;
	description: string;
	type: string;
	image: string;
	alt: string;
	'twitter:title': string;
	'twitter:description': string;
	'twitter:card': string;
	'twitter:image': string;
	'twitter:image:alt': string;
	'og:title': string;
	'og:description': string;
	'og:type': string;
	'og:image': string;
	'og:image:alt': string;
	'og:url': string;
};

type UpdateMetaTags = Partial<
	Pick<Metatags, 'title' | 'description' | 'type' | 'image' | 'alt'> & { url: string }
>;

const initialTags: Metatags = {
	title: 'Svelte Society',
	description:
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
	type: 'website',
	image:
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	alt: 'SvelteSociety.dev',
	'twitter:title': 'Svelte Society',
	'twitter:description':
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
	'twitter:card': 'summary_large_image',
	'twitter:image':
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	'twitter:image:alt': 'SvelteSociety.dev',
	'og:title': 'Svelte Society',
	'og:description':
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
	'og:type': 'website',
	'og:image':
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	'og:image:alt': 'SvelteSociety.dev',
	'og:url': 'https://sveltesociety.dev/'
};

type MetaTagsStore = {
	subscribe: Writable<Metatags>['subscribe'];
	set: Writable<Metatags>['set'];
	title: (title: string) => void;
	desc: (desc: string) => void;
	image: (image: string) => void;
	alt: (alt: string) => void;
	url: (url: string) => void;
	update: (opts: UpdateMetaTags) => void;
};

function CreateMetatagsStore(): MetaTagsStore {
	const { subscribe, set, update } = writable(initialTags);

	const getTitles = (title: string) => ({ title, 'og:title': title, 'twitter:title': title });
	const getDescriptions = (desc: string) => ({
		description: desc,
		'og:description': desc,
		'twitter:description': desc
	});
	const getImages = (image: string) => ({ image, 'og:image': image, 'twitter:image': image });
	const getAlts = (alt: string) => ({ alt, 'og:image:alt': alt, 'twitter:image:alt': alt });
	const getUrls = (url: string) => ({ 'og:url': url });

	const title = (title: string) => update((curr) => ({ ...curr, ...getTitles(title) }));
	const desc = (desc: string) => update((curr) => ({ ...curr, ...getDescriptions(desc) }));
	const image = (image: string) => update((curr) => ({ ...curr, ...getImages(image) }));
	const alt = (alt: string) => update((curr) => ({ ...curr, ...getAlts(alt) }));
	const url = (url: string) => update((curr) => ({ ...curr, ...getUrls(url) }));

	const setUpdate = (opts: UpdateMetaTags) => {
		const titles = opts.title ? getTitles(opts.title) : {};
		const descriptions = opts.description ? getDescriptions(opts.description) : {};
		const images = opts.image ? getImages(opts.image) : {};
		const alts = opts.alt ? getAlts(opts.alt) : {};
		const urls = opts.url ? getUrls(opts.url) : {};

		set({
			...initialTags,
			...titles,
			...descriptions,
			...images,
			...alts,
			...urls
		});
	};

	return {
		subscribe,
		set,
		url,
		title,
		desc,
		image,
		alt,
		update: setUpdate
	};
}

const store: MetaTagsStore = CreateMetatagsStore();

export default store;
