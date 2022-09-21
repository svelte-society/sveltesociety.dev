import {
	S as p,
	i as c,
	s as $,
	F as d,
	v as h,
	a as y,
	k as v,
	w as g,
	c as S,
	l as b,
	m as w,
	h as _,
	n as A,
	x as I,
	b as m,
	G as j,
	H as k,
	I as q,
	f,
	t as u,
	y as C
} from '../../../chunks/index-2fad9c0c.js';
import { S as E } from '../../../chunks/Seo-fad38391.js';
import '../../../chunks/stores-df887d2e.js';
import '../../../chunks/singletons-9297043a.js';
function F(l) {
	let s, i, a, n;
	s = new E({ props: { title: 'About' } });
	const r = l[1].default,
		e = d(r, l, l[0], null);
	return {
		c() {
			h(s.$$.fragment), (i = y()), (a = v('main')), e && e.c(), this.h();
		},
		l(t) {
			g(s.$$.fragment, t), (i = S(t)), (a = b(t, 'MAIN', { class: !0 }));
			var o = w(a);
			e && e.l(o), o.forEach(_), this.h();
		},
		h() {
			A(a, 'class', 'wrapper svelte-183odj9');
		},
		m(t, o) {
			I(s, t, o), m(t, i, o), m(t, a, o), e && e.m(a, null), (n = !0);
		},
		p(t, [o]) {
			e && e.p && (!n || o & 1) && j(e, r, t, t[0], n ? q(r, t[0], o, null) : k(t[0]), null);
		},
		i(t) {
			n || (f(s.$$.fragment, t), f(e, t), (n = !0));
		},
		o(t) {
			u(s.$$.fragment, t), u(e, t), (n = !1);
		},
		d(t) {
			C(s, t), t && _(i), t && _(a), e && e.d(t);
		}
	};
}
function G(l, s, i) {
	let { $$slots: a = {}, $$scope: n } = s;
	return (
		(l.$$set = (r) => {
			'$$scope' in r && i(0, (n = r.$$scope));
		}),
		[n, a]
	);
}
class z extends p {
	constructor(s) {
		super(), c(this, s, G, F, $, {});
	}
}
export { z as default };
