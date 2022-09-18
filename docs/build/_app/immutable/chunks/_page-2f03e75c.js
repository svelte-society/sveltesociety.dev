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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-e9b23e64.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-e9b23e64.js',
						'index-2fad9c0c.js',
						'EventPage-4346389c.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-4c1a3500.js',
						'stores-fe9ed232.js',
						'singletons-90aa6b4a.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-65be60d0.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-65be60d0.js',
						'index-2fad9c0c.js',
						'EventPage-4346389c.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-4c1a3500.js',
						'stores-fe9ed232.js',
						'singletons-90aa6b4a.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-22cff472.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-22cff472.js',
						'index-2fad9c0c.js',
						'EventPage-4346389c.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-4c1a3500.js',
						'stores-fe9ed232.js',
						'singletons-90aa6b4a.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-1de2a57d.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-1de2a57d.js',
						'index-2fad9c0c.js',
						'EventPage-4346389c.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-4c1a3500.js',
						'stores-fe9ed232.js',
						'singletons-90aa6b4a.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-477833fc.js'),
					[
						'../components/pages/events/summit2020/_page.svx-477833fc.js',
						'index-2fad9c0c.js',
						'EventPage-4346389c.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-4c1a3500.js',
						'stores-fe9ed232.js',
						'singletons-90aa6b4a.js'
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
