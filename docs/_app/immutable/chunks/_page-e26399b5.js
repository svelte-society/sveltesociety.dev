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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-a4e329f5.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-a4e329f5.js',
						'index-bbe4a303.js',
						'EventPage-8c8ba51d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-1c5264ae.js',
						'stores-f3696736.js',
						'singletons-3b9acdcc.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-ebc78ff3.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-ebc78ff3.js',
						'index-bbe4a303.js',
						'EventPage-8c8ba51d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-1c5264ae.js',
						'stores-f3696736.js',
						'singletons-3b9acdcc.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-85ceb782.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-85ceb782.js',
						'index-bbe4a303.js',
						'EventPage-8c8ba51d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-1c5264ae.js',
						'stores-f3696736.js',
						'singletons-3b9acdcc.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-7cfcd39a.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-7cfcd39a.js',
						'index-bbe4a303.js',
						'EventPage-8c8ba51d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-1c5264ae.js',
						'stores-f3696736.js',
						'singletons-3b9acdcc.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-a58d063a.js'),
					[
						'../components/pages/events/summit2020/_page.svx-a58d063a.js',
						'index-bbe4a303.js',
						'EventPage-8c8ba51d.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-1c5264ae.js',
						'stores-f3696736.js',
						'singletons-3b9acdcc.js'
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
