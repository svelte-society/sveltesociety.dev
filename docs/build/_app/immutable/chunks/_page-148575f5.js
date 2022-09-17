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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-af68e560.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-af68e560.js',
						'index-2fe5515f.js',
						'EventPage-69577002.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c98eb7f1.js',
						'stores-bd836b2e.js',
						'singletons-79537efd.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-5715202a.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-5715202a.js',
						'index-2fe5515f.js',
						'EventPage-69577002.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c98eb7f1.js',
						'stores-bd836b2e.js',
						'singletons-79537efd.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-67a08254.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-67a08254.js',
						'index-2fe5515f.js',
						'EventPage-69577002.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c98eb7f1.js',
						'stores-bd836b2e.js',
						'singletons-79537efd.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-7dd0a021.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-7dd0a021.js',
						'index-2fe5515f.js',
						'EventPage-69577002.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c98eb7f1.js',
						'stores-bd836b2e.js',
						'singletons-79537efd.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-85d15e25.js'),
					[
						'../components/pages/events/summit2020/_page.svx-85d15e25.js',
						'index-2fe5515f.js',
						'EventPage-69577002.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c98eb7f1.js',
						'stores-bd836b2e.js',
						'singletons-79537efd.js'
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
