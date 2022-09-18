import './index-2fad9c0c.js';
import { s as r } from './singletons-7e9a75e8.js';
const t = () => {
		const e = r,
			s = {
				page: { subscribe: e.page.subscribe },
				navigating: { subscribe: e.navigating.subscribe },
				updated: e.updated
			};
		return (
			Object.defineProperties(s, {
				preloading: {
					get() {
						return (
							console.error('stores.preloading is deprecated; use stores.navigating instead'),
							{ subscribe: e.navigating.subscribe }
						);
					},
					enumerable: !1
				},
				session: {
					get() {
						return o(), {};
					},
					enumerable: !1
				}
			}),
			s
		);
	},
	a = {
		subscribe(e) {
			return t().page.subscribe(e);
		}
	};
function o() {
	throw new Error(
		'stores.session is no longer available. See https://github.com/sveltejs/kit/discussions/5883'
	);
}
export { a as p };
