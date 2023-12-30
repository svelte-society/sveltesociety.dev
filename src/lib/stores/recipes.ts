import { writable } from 'svelte/store';

export type Recipe = {
	title: string;
	layout: string;
	icon?: string;
	filename: string;
	path: string;
	children: Recipe[];
};

export const categories = writable<Recipe[]>([]);
