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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-b7a07b7e.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-b7a07b7e.js',
						'index-bbe4a303.js',
						'EventPage-b0e2958d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-5af2fecc.js',
						'stores-456982a4.js',
						'singletons-89f5a9ea.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-098b6658.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-098b6658.js',
						'index-bbe4a303.js',
						'EventPage-b0e2958d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-5af2fecc.js',
						'stores-456982a4.js',
						'singletons-89f5a9ea.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-12727417.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-12727417.js',
						'index-bbe4a303.js',
						'EventPage-b0e2958d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-5af2fecc.js',
						'stores-456982a4.js',
						'singletons-89f5a9ea.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-35491467.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-35491467.js',
						'index-bbe4a303.js',
						'EventPage-b0e2958d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-5af2fecc.js',
						'stores-456982a4.js',
						'singletons-89f5a9ea.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-474ab973.js'),
					[
						'../components/pages/events/summit2020/_page.svx-474ab973.js',
						'index-bbe4a303.js',
						'EventPage-b0e2958d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-5af2fecc.js',
						'stores-456982a4.js',
						'singletons-89f5a9ea.js'
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
