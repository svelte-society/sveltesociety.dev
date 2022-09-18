import {
	S as k,
	i as M,
	s as L,
	v as S,
	a as f,
	k as u,
	q as h,
	w as T,
	c as v,
	l as $,
	m as d,
	r as x,
	h as r,
	n as U,
	x as b,
	b as m,
	C as y,
	A as q,
	f as w,
	t as A,
	y as E
} from '../../../chunks/index-2fe5515f.js';
import { S as g } from '../../../chunks/Seo-fb4a23a4.js';
import '../../../chunks/stores-e1bb27ae.js';
import '../../../chunks/singletons-a3426cc4.js';
function H(C) {
	let e, o, n, p, i, a, _, l;
	return (
		(e = new g({ props: { title: 'CULT Markets', description: 'CULT Markets' } })),
		{
			c() {
				S(e.$$.fragment),
					(o = f()),
					(n = u('h1')),
					(p = h('CULT Markets')),
					(i = f()),
					(a = u('main')),
					(_ = h('to be done')),
					this.h();
			},
			l(t) {
				T(e.$$.fragment, t), (o = v(t)), (n = $(t, 'H1', {}));
				var s = d(n);
				(p = x(s, 'CULT Markets')), s.forEach(r), (i = v(t)), (a = $(t, 'MAIN', { class: !0 }));
				var c = d(a);
				(_ = x(c, 'to be done')), c.forEach(r), this.h();
			},
			h() {
				U(a, 'class', 'svelte-17n4g9v');
			},
			m(t, s) {
				b(e, t, s), m(t, o, s), m(t, n, s), y(n, p), m(t, i, s), m(t, a, s), y(a, _), (l = !0);
			},
			p: q,
			i(t) {
				l || (w(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				A(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				E(e, t), t && r(o), t && r(n), t && r(i), t && r(a);
			}
		}
	);
}
class z extends k {
	constructor(e) {
		super(), M(this, e, null, H, L, {});
	}
}
export { z as default };
