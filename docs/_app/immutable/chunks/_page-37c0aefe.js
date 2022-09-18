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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-2f3a3e5b.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-2f3a3e5b.js',
						'index-bbe4a303.js',
						'EventPage-83237122.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-a888bbf2.js',
						'stores-5b1f001a.js',
						'singletons-0a0fff25.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-1eb5c49a.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-1eb5c49a.js',
						'index-bbe4a303.js',
						'EventPage-83237122.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-a888bbf2.js',
						'stores-5b1f001a.js',
						'singletons-0a0fff25.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-744ed6cd.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-744ed6cd.js',
						'index-bbe4a303.js',
						'EventPage-83237122.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-a888bbf2.js',
						'stores-5b1f001a.js',
						'singletons-0a0fff25.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-0a1f5dca.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-0a1f5dca.js',
						'index-bbe4a303.js',
						'EventPage-83237122.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-a888bbf2.js',
						'stores-5b1f001a.js',
						'singletons-0a0fff25.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-b37949e1.js'),
					[
						'../components/pages/events/summit2020/_page.svx-b37949e1.js',
						'index-bbe4a303.js',
						'EventPage-83237122.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-a888bbf2.js',
						'stores-5b1f001a.js',
						'singletons-0a0fff25.js'
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
