import { e as p, _ as e } from './preload-helper-e2690c66.js';
async function m(t) {
	return await Promise.all(
		Object.entries(t).map(async ([a, s]) => {
			const { metadata: i } = await s(),
				o = a.replace('/+page.svx', ''),
				_ = o.split('/').pop();
			return { ...i, filename: _, path: o };
		})
	);
}
async function n() {
	const t = await m(
		Object.assign({
			'./2021-summit-fall/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-fall/_page.svx-4610b358.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-4610b358.js',
						'index-bbe4a303.js',
						'EventPage-f001fc8e.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-b6a31980.js',
						'stores-02de2e3c.js',
						'singletons-916cc6bb.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-c2579578.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-c2579578.js',
						'index-bbe4a303.js',
						'EventPage-f001fc8e.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-b6a31980.js',
						'stores-02de2e3c.js',
						'singletons-916cc6bb.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-5926e10e.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-5926e10e.js',
						'index-bbe4a303.js',
						'EventPage-f001fc8e.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-b6a31980.js',
						'stores-02de2e3c.js',
						'singletons-916cc6bb.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-6bcd4c27.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-6bcd4c27.js',
						'index-bbe4a303.js',
						'EventPage-f001fc8e.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-b6a31980.js',
						'stores-02de2e3c.js',
						'singletons-916cc6bb.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-a9277c0c.js'),
					[
						'../components/pages/events/summit2020/_page.svx-a9277c0c.js',
						'index-bbe4a303.js',
						'EventPage-f001fc8e.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-b6a31980.js',
						'stores-02de2e3c.js',
						'singletons-916cc6bb.js'
					],
					import.meta.url
				)
		})
	);
	if (t) return t.sort((r, a) => Date.parse(a.date) - Date.parse(r.date)), { events: t };
	throw p(500);
}
const l = Object.freeze(
	Object.defineProperty({ __proto__: null, load: n }, Symbol.toStringTag, { value: 'Module' })
);
export { l as _, n as l };
