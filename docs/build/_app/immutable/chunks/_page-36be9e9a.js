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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-08dad30c.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-08dad30c.js',
						'index-2fad9c0c.js',
						'EventPage-91b1e80f.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c7090712.js',
						'stores-80acc175.js',
						'singletons-7e9a75e8.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-7fd3713a.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-7fd3713a.js',
						'index-2fad9c0c.js',
						'EventPage-91b1e80f.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c7090712.js',
						'stores-80acc175.js',
						'singletons-7e9a75e8.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-f38fc2de.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-f38fc2de.js',
						'index-2fad9c0c.js',
						'EventPage-91b1e80f.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c7090712.js',
						'stores-80acc175.js',
						'singletons-7e9a75e8.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-f76ff7a9.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-f76ff7a9.js',
						'index-2fad9c0c.js',
						'EventPage-91b1e80f.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c7090712.js',
						'stores-80acc175.js',
						'singletons-7e9a75e8.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-7374b3d0.js'),
					[
						'../components/pages/events/summit2020/_page.svx-7374b3d0.js',
						'index-2fad9c0c.js',
						'EventPage-91b1e80f.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-c7090712.js',
						'stores-80acc175.js',
						'singletons-7e9a75e8.js'
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
