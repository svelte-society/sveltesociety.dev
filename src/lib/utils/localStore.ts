import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export function localStore<T>(key: string, initial: T): Writable<T> {
	const browser = typeof localStorage === 'object';
	if (browser && localStorage.getItem(key) === null) {
		localStorage.setItem(key, JSON.stringify(initial));
	}

	const saved: T = browser ? JSON.parse(localStorage.getItem(key)) : initial;
	const { subscribe, set, update } = writable(saved);

	return {
		subscribe,
		set: (value) => {
			browser && localStorage.setItem(key, JSON.stringify(value));
			return set(value);
		},
		update
	};
}
