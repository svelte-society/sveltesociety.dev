import { createLocalStorage, persist } from '@macfja/svelte-persistent-store';
import type { PersistentStore } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const packageManager: PersistentStore<string> = persist(
	writable('npm'),
	createLocalStorage(),
	'packageManager'
);
