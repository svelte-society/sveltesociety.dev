import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

type Recipe = {
	title: string;
	layout: string;
	icon?: string;
	filename: string;
	path: string;
	children: Recipe[];
};

type RecipeStore = {
	subscribe: Writable<Recipe[]>['subscribe'];
	set: Writable<Recipe[]>['set'];
};

export const categories: RecipeStore = writable([]);
