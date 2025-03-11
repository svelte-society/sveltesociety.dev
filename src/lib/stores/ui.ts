import { writable } from 'svelte/store';

// Store for controlling left sidebar visibility
export const toggleLeftSidebar = writable(false);

// Store for controlling right sidebar visibility
export const toggleRightSidebar = writable(false); 