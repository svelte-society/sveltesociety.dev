import {
	S as w,
	i as C,
	s as H,
	F as P,
	v as k,
	a as y,
	k as v,
	q as A,
	w as D,
	c as E,
	l as d,
	m as $,
	r as F,
	h as c,
	n as b,
	x as G,
	b as S,
	C as p,
	u as M,
	G as N,
	H as V,
	I as j,
	f as I,
	t as q,
	y as z
} from './index-bbe4a303.js';
import { S as B } from './Seo-b200e40a.js';
function J(l) {
	let t, _, n, i, r, o, m, f;
	t = new B({ props: { title: l[0] } });
	const h = l[2].default,
		s = P(h, l, l[1], null);
	return {
		c() {
			k(t.$$.fragment),
				(_ = y()),
				(n = v('div')),
				(i = v('h1')),
				(r = A(l[0])),
				(o = y()),
				(m = v('main')),
				s && s.c(),
				this.h();
		},
		l(e) {
			D(t.$$.fragment, e), (_ = E(e)), (n = d(e, 'DIV', { class: !0 }));
			var a = $(n);
			i = d(a, 'H1', {});
			var u = $(i);
			(r = F(u, l[0])), u.forEach(c), (o = E(a)), (m = d(a, 'MAIN', { class: !0 }));
			var g = $(m);
			s && s.l(g), g.forEach(c), a.forEach(c), this.h();
		},
		h() {
			b(m, 'class', 'svelte-unfbyl'), b(n, 'class', 'svelte-unfbyl');
		},
		m(e, a) {
			G(t, e, a),
				S(e, _, a),
				S(e, n, a),
				p(n, i),
				p(i, r),
				p(n, o),
				p(n, m),
				s && s.m(m, null),
				(f = !0);
		},
		p(e, [a]) {
			const u = {};
			a & 1 && (u.title = e[0]),
				t.$set(u),
				(!f || a & 1) && M(r, e[0]),
				s && s.p && (!f || a & 2) && N(s, h, e, e[1], f ? j(h, e[1], a, null) : V(e[1]), null);
		},
		i(e) {
			f || (I(t.$$.fragment, e), I(s, e), (f = !0));
		},
		o(e) {
			q(t.$$.fragment, e), q(s, e), (f = !1);
		},
		d(e) {
			z(t, e), e && c(_), e && c(n), s && s.d(e);
		}
	};
}
function K(l, t, _) {
	let { $$slots: n = {}, $$scope: i } = t,
		{ title: r = '' } = t;
	return (
		(l.$$set = (o) => {
			'title' in o && _(0, (r = o.title)), '$$scope' in o && _(1, (i = o.$$scope));
		}),
		[r, i, n]
	);
}
class Q extends w {
	constructor(t) {
		super(), C(this, t, K, J, H, { title: 0 });
	}
}
export { Q as E };
