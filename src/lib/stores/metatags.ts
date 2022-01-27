import type { Writable } from 'svelte/store';
import { derived } from 'svelte/store';
import { page } from '$app/stores';

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

type MetaTagsStore = {
	subscribe: Writable<Metatags>['subscribe'];
	set: Writable<Metatags>['set'];
};

function CreateMetatagsStore(): MetaTagsStore {
	return derived(page, ($page) => {
		const metatags = $page.stuff.metatags;
		metatags['og:title'] = metatags.title;
		metatags['twitter:title'] = metatags.title;
		metatags['og:description'] = metatags.description;
		metatags['twitter:description'] = metatags.description;
		metatags['og:image'] = metatags.image;
		metatags['twitter:image'] = metatags.image;
		metatags['og:image:alt'] = metatags.alt;
		metatags['twitter:image:alt'] = metatags.alt;
		metatags['og:url'] = $page.url.toString();
		return metatags;
	});
}

const store: MetaTagsStore = CreateMetatagsStore();

export default store;
