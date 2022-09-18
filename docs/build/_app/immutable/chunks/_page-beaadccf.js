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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-9ebfb627.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-9ebfb627.js',
						'index-2fe5515f.js',
						'EventPage-a016509a.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-fb4a23a4.js',
						'stores-e1bb27ae.js',
						'singletons-a3426cc4.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-121944bc.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-121944bc.js',
						'index-2fe5515f.js',
						'EventPage-a016509a.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-fb4a23a4.js',
						'stores-e1bb27ae.js',
						'singletons-a3426cc4.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-0a93051e.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-0a93051e.js',
						'index-2fe5515f.js',
						'EventPage-a016509a.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-fb4a23a4.js',
						'stores-e1bb27ae.js',
						'singletons-a3426cc4.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-f67904af.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-f67904af.js',
						'index-2fe5515f.js',
						'EventPage-a016509a.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-fb4a23a4.js',
						'stores-e1bb27ae.js',
						'singletons-a3426cc4.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-0624e6bb.js'),
					[
						'../components/pages/events/summit2020/_page.svx-0624e6bb.js',
						'index-2fe5515f.js',
						'EventPage-a016509a.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-fb4a23a4.js',
						'stores-e1bb27ae.js',
						'singletons-a3426cc4.js'
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
