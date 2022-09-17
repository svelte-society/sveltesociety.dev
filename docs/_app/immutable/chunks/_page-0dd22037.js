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
					() => import('../components/pages/events/2021-summit-fall/_page.svx-b614a996.js'),
					[
						'../components/pages/events/2021-summit-fall/_page.svx-b614a996.js',
						'index-2fe5515f.js',
						'EventPage-75fd35c5.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-55fc93c2.js',
						'stores-75bb5758.js',
						'singletons-a864bddf.js'
					],
					import.meta.url
				),
			'./2021-summit-spring/+page.svx': () =>
				e(
					() => import('../components/pages/events/2021-summit-spring/_page.svx-12664629.js'),
					[
						'../components/pages/events/2021-summit-spring/_page.svx-12664629.js',
						'index-2fe5515f.js',
						'EventPage-75fd35c5.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-55fc93c2.js',
						'stores-75bb5758.js',
						'singletons-a864bddf.js'
					],
					import.meta.url
				),
			'./frsocietyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/frsocietyday2020/_page.svx-8e7c26af.js'),
					[
						'../components/pages/events/frsocietyday2020/_page.svx-8e7c26af.js',
						'index-2fe5515f.js',
						'EventPage-75fd35c5.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-55fc93c2.js',
						'stores-75bb5758.js',
						'singletons-a864bddf.js'
					],
					import.meta.url
				),
			'./societyday2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/societyday2020/_page.svx-acc837d7.js'),
					[
						'../components/pages/events/societyday2020/_page.svx-acc837d7.js',
						'index-2fe5515f.js',
						'EventPage-75fd35c5.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-55fc93c2.js',
						'stores-75bb5758.js',
						'singletons-a864bddf.js'
					],
					import.meta.url
				),
			'./summit2020/+page.svx': () =>
				e(
					() => import('../components/pages/events/summit2020/_page.svx-a4d7a2a5.js'),
					[
						'../components/pages/events/summit2020/_page.svx-a4d7a2a5.js',
						'index-2fe5515f.js',
						'EventPage-75fd35c5.js',
						'../assets/EventPage-76af88bd.css',
						'Seo-55fc93c2.js',
						'stores-75bb5758.js',
						'singletons-a864bddf.js'
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
