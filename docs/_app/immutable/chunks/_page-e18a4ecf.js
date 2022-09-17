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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-46213b2a.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-46213b2a.js',
						'index-2fe5515f.js',
						'EventPage-13027333.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-54d47ec7.js',
						'stores-b3470ee2.js',
						'singletons-07985465.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-0ab5645d.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-0ab5645d.js',
						'index-2fe5515f.js',
						'EventPage-13027333.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-54d47ec7.js',
						'stores-b3470ee2.js',
						'singletons-07985465.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-b8c12872.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-b8c12872.js',
						'index-2fe5515f.js',
						'EventPage-13027333.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-54d47ec7.js',
						'stores-b3470ee2.js',
						'singletons-07985465.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-e4aaf4fc.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-e4aaf4fc.js',
						'index-2fe5515f.js',
						'EventPage-13027333.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-54d47ec7.js',
						'stores-b3470ee2.js',
						'singletons-07985465.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-46172696.js'),
					[
						'../components/pages/events/summit2020/_page.svx-46172696.js',
						'index-2fe5515f.js',
						'EventPage-13027333.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-54d47ec7.js',
						'stores-b3470ee2.js',
						'singletons-07985465.js'
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
