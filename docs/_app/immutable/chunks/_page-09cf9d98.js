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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-7e9bb972.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-7e9bb972.js',
						'index-2fad9c0c.js',
						'EventPage-6d6b1afa.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-ccfb3bd7.js',
						'stores-c8d04b5e.js',
						'singletons-47f14a0c.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-d83767b2.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-d83767b2.js',
						'index-2fad9c0c.js',
						'EventPage-6d6b1afa.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-ccfb3bd7.js',
						'stores-c8d04b5e.js',
						'singletons-47f14a0c.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-cce9fa0d.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-cce9fa0d.js',
						'index-2fad9c0c.js',
						'EventPage-6d6b1afa.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-ccfb3bd7.js',
						'stores-c8d04b5e.js',
						'singletons-47f14a0c.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-d21a4c93.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-d21a4c93.js',
						'index-2fad9c0c.js',
						'EventPage-6d6b1afa.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-ccfb3bd7.js',
						'stores-c8d04b5e.js',
						'singletons-47f14a0c.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-478d486e.js'),
					[
						'../components/pages/events/summit2020/_page.svx-478d486e.js',
						'index-2fad9c0c.js',
						'EventPage-6d6b1afa.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-ccfb3bd7.js',
						'stores-c8d04b5e.js',
						'singletons-47f14a0c.js'
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