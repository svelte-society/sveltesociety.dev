import {
	S as w,
	i as L,
	s as S,
	v as T,
	a as C,
	k as f,
	q as y,
	w as U,
	c as b,
	l as d,
	m as $,
	r as g,
	h as r,
	n as W,
	x as E,
	b as _,
	C as i,
	A as q,
	f as z,
	t as A,
	y as P
} from '../../../chunks/index-bbe4a303.js';
import { S as B } from '../../../chunks/Seo-482a3acc.js';
import '../../../chunks/stores-a4f9b72b.js';
import '../../../chunks/singletons-96992a38.js';
function H(M) {
	let t, l, n, u, m, a, h, s, v, k, p;
	return (
		(t = new B({ props: { title: 'CULT Markets', description: 'CULT Markets' } })),
		{
			c() {
				T(t.$$.fragment),
					(l = C()),
					(n = f('h1')),
					(u = y('CULT Markets')),
					(m = C()),
					(a = f('main')),
					(h = y(`We'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and to encourage freedom.

	`)),
					(s = f('p')),
					(v = f('br')),
					(k = y(`

	We'll also promote other freedom supporting markets here, while introducing community based (aka
	decentralized) content moderation.`)),
					this.h();
			},
			l(e) {
				U(t.$$.fragment, e), (l = b(e)), (n = d(e, 'H1', {}));
				var o = $(n);
				(u = g(o, 'CULT Markets')), o.forEach(r), (m = b(e)), (a = d(e, 'MAIN', { class: !0 }));
				var c = $(a);
				(h = g(
					c,
					`We'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and to encourage freedom.

	`
				)),
					(s = d(c, 'P', {}));
				var x = $(s);
				(v = d(x, 'BR', {})),
					x.forEach(r),
					(k = g(
						c,
						`

	We'll also promote other freedom supporting markets here, while introducing community based (aka
	decentralized) content moderation.`
					)),
					c.forEach(r),
					this.h();
			},
			h() {
				W(a, 'class', 'svelte-17n4g9v');
			},
			m(e, o) {
				E(t, e, o),
					_(e, l, o),
					_(e, n, o),
					i(n, u),
					_(e, m, o),
					_(e, a, o),
					i(a, h),
					i(a, s),
					i(s, v),
					i(a, k),
					(p = !0);
			},
			p: q,
			i(e) {
				p || (z(t.$$.fragment, e), (p = !0));
			},
			o(e) {
				A(t.$$.fragment, e), (p = !1);
			},
			d(e) {
				P(t, e), e && r(l), e && r(n), e && r(m), e && r(a);
			}
		}
	);
}
class D extends w {
	constructor(t) {
		super(), L(this, t, null, H, S, {});
	}
}
export { D as default };
