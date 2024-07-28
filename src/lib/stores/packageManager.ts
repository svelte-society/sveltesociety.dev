import { createLocalStorage, persist } from '@macfja/svelte-persistent-store';
import type { PersistentStore } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const packageManager: PersistentStore<Array<string>> = persist(
	writable(['npm', 'gem']),
	createLocalStorage(),
	'packageManager'
);

packageManager.subscribe((v) => {
	if (typeof v === 'string') {
		packageManager.set([v, 'gem']);
	}
})();
