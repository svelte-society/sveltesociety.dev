import { localStorage, persist } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const packageManager = persist(writable('npm'), localStorage(), 'packageManager');
export const availablePackageManager = [
	{ label: 'NPM', value: 'npm' },
	{ label: 'PNPM', value: 'pnpm' },
	{ label: 'Yarn', value: 'yarn' }
];
