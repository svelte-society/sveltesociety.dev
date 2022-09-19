import { e as p, _ as s } from './preload-helper-e2690c66.js';
async function _(e) {
	return await Promise.all(
		Object.entries(e).map(async ([t, o]) => {
			const { metadata: i } = await o(),
				r = t.replace('/+page.svx', ''),
				n = r.split('/').pop();
			return { ...i, filename: n, path: r };
		})
	);
}
async function l() {
	const e = await _(
		Object.assign({
			'./2021-summit-fall/+page.svx': () =>
				s(
					() => import('../components/pages/events/2021-summit-fall/_page.svx-3cb16e2d.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-3cb16e2d.js',
						'index-bbe4a303.js',
						'EventPage-c8c63495.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-e52cf9c8.js',
						'stores-3ed91bbf.js',
						'singletons-861d2877.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				s(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-b464e83a.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-b464e83a.js',
						'index-bbe4a303.js',
						'EventPage-c8c63495.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-e52cf9c8.js',
						'stores-3ed91bbf.js',
						'singletons-861d2877.js'
					],
					import.meta.url
				)
		})
	);
	if (e) return e.sort((a, t) => Date.parse(t.date) - Date.parse(a.date)), { events: e };
	throw p(500);
}
const c = Object.freeze(
	Object.defineProperty({ __proto__: null, load: l }, Symbol.toStringTag, { value: 'Module' })
);
export { c as _, l };
