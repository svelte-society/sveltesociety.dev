const c = [
	() => import("../../../src/routes/$layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/cheatsheet/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/cheatsheet/index.svelte
	[/^\/cheatsheet\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/cheatsheet/cheat-sheet.js
	[/^\/cheatsheet\/cheat-sheet\/?$/],

	// src/routes/cheatsheet/highlight.css
	[/^\/cheatsheet\/highlight\/?$/],

	// src/routes/metatag.png
	[/^\/metatag\/?$/]
];

export const fallback = [c[0](), c[1]()];