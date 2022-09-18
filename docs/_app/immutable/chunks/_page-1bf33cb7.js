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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-f6d4c523.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-f6d4c523.js',
						'index-bbe4a303.js',
						'EventPage-914912dc.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-3d938e6e.js',
						'stores-95c8792b.js',
						'singletons-f8203a24.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-c5b54aa4.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-c5b54aa4.js',
						'index-bbe4a303.js',
						'EventPage-914912dc.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-3d938e6e.js',
						'stores-95c8792b.js',
						'singletons-f8203a24.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-5af2c8ea.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-5af2c8ea.js',
						'index-bbe4a303.js',
						'EventPage-914912dc.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-3d938e6e.js',
						'stores-95c8792b.js',
						'singletons-f8203a24.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-496f1b74.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-496f1b74.js',
						'index-bbe4a303.js',
						'EventPage-914912dc.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-3d938e6e.js',
						'stores-95c8792b.js',
						'singletons-f8203a24.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-5db4d14e.js'),
					[
						'../components/pages/events/summit2020/_page.svx-5db4d14e.js',
						'index-bbe4a303.js',
						'EventPage-914912dc.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-3d938e6e.js',
						'stores-95c8792b.js',
						'singletons-f8203a24.js'
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
