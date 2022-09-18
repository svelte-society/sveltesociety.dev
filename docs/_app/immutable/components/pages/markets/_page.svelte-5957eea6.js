import {
	S as k,
	i as M,
	s as w,
	v as L,
	a as _,
	k as u,
	q as d,
	w as S,
	c as h,
	l as v,
	m as $,
	r as x,
	h as o,
	n as T,
	x as U,
	b as m,
	C as y,
	A as g,
	f as q,
	t as A,
	y as E
} from '../../../chunks/index-2fad9c0c.js';
import { S as b } from '../../../chunks/Seo-ccfb3bd7.js';
import '../../../chunks/stores-c8d04b5e.js';
import '../../../chunks/singletons-47f14a0c.js';
function H(C) {
	let t, n, r, p, i, s, c, l;
	return (
		(t = new b({ props: { title: 'CULT Markets', description: 'CULT Markets' } })),
		{
			c() {
				L(t.$$.fragment),
					(n = _()),
					(r = u('h1')),
					(p = d('CULT Markets')),
					(i = _()),
					(s = u('main')),
					(c = d(`under construction - we'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and
	to encourage freedom.`)),
					this.h();
			},
			l(e) {
				S(t.$$.fragment, e), (n = h(e)), (r = v(e, 'H1', {}));
				var a = $(r);
				(p = x(a, 'CULT Markets')), a.forEach(o), (i = h(e)), (s = v(e, 'MAIN', { class: !0 }));
				var f = $(s);
				(c = x(
					f,
					`under construction - we'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and
	to encourage freedom.`
				)),
					f.forEach(o),
					this.h();
			},
			h() {
				T(s, 'class', 'svelte-17n4g9v');
			},
			m(e, a) {
				U(t, e, a), m(e, n, a), m(e, r, a), y(r, p), m(e, i, a), m(e, s, a), y(s, c), (l = !0);
			},
			p: g,
			i(e) {
				l || (q(t.$$.fragment, e), (l = !0));
			},
			o(e) {
				A(t.$$.fragment, e), (l = !1);
			},
			d(e) {
				E(t, e), e && o(n), e && o(r), e && o(i), e && o(s);
			}
		}
	);
}
class z extends k {
	constructor(t) {
		super(), M(this, t, null, H, w, {});
	}
}
export { z as default };
