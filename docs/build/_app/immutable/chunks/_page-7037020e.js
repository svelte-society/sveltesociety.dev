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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-45133b09.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-45133b09.js',
						'index-bbe4a303.js',
						'EventPage-a34aeee8.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-db322a7b.js',
						'stores-a9e31e9b.js',
						'singletons-ffbef57c.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				s(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-d720bd27.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-d720bd27.js',
						'index-bbe4a303.js',
						'EventPage-a34aeee8.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-db322a7b.js',
						'stores-a9e31e9b.js',
						'singletons-ffbef57c.js'
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
