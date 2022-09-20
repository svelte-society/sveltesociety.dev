import { A as l, s as g } from './index-bbe4a303.js';
const u = [];
function b(e, s = l) {
	let t;
	const a = new Set();
	function i(n) {
		if (g(e, n) && ((e = n), t)) {
			const c = !u.length;
			for (const r of a) r[1](), u.push(r, e);
			if (c) {
				for (let r = 0; r < u.length; r += 2) u[r][0](u[r + 1]);
				u.length = 0;
			}
		}
	}
	function f(n) {
		i(n(e));
	}
	function o(n, c = l) {
		const r = [n, c];
		return (
			a.add(r),
			a.size === 1 && (t = s(i) || l),
			n(e),
			() => {
				a.delete(r), a.size === 0 && (t(), (t = null));
			}
		);
	}
	return { set: i, update: f, subscribe: o };
}
let d = '',
	p = '';
function w(e) {
	(d = e.base), (p = e.assets || d);
}
function U(e) {
	let s = e.baseURI;
	if (!s) {
		const t = e.getElementsByTagName('base');
		s = t.length ? t[0].href : e.URL;
	}
	return s;
}
function R() {
	return { x: pageXOffset, y: pageYOffset };
}
function y(e) {
	return e.composedPath().find((t) => t instanceof Node && t.nodeName.toUpperCase() === 'A');
}
function T(e) {
	return e instanceof SVGAElement ? new URL(e.href.baseVal, document.baseURI) : new URL(e.href);
}
function h(e) {
	const s = b(e);
	let t = !0;
	function a() {
		(t = !0), s.update((o) => o);
	}
	function i(o) {
		(t = !1), s.set(o);
	}
	function f(o) {
		let n;
		return s.subscribe((c) => {
			(n === void 0 || (t && c !== n)) && o((n = c));
		});
	}
	return { notify: a, set: i, subscribe: f };
}
function _() {
	const { set: e, subscribe: s } = b(!1);
	let t;
	async function a() {
		clearTimeout(t);
		const i = await fetch(`${p}/_app/version.json`, {
			headers: { pragma: 'no-cache', 'cache-control': 'no-cache' }
		});
		if (i.ok) {
			const { version: f } = await i.json(),
				o = f !== '1663676067837';
			return o && (e(!0), clearTimeout(t)), o;
		} else throw new Error(`Version check failed: ${i.status}`);
	}
	return { subscribe: s, check: a };
}
function k(e) {
	e.client;
}
const q = { url: h({}), page: h({}), navigating: b(null), updated: _() };
export { T as a, R as b, w as c, y as f, U as g, k as i, q as s, b as w };
