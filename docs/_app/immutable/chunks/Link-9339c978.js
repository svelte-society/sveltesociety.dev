import {
	S as v,
	i as d,
	s as p,
	F as g,
	k as c,
	l as u,
	m as h,
	h as r,
	n as f,
	J as m,
	b,
	C as L,
	G as k,
	H as y,
	I as C,
	f as E,
	t as I
} from './index-2fe5515f.js';
function S(i) {
	let l, a, n;
	const o = i[3].default,
		t = g(o, i, i[2], null);
	return {
		c() {
			(l = c('li')), (a = c('a')), t && t.c(), this.h();
		},
		l(e) {
			l = u(e, 'LI', { class: !0 });
			var s = h(l);
			a = u(s, 'A', { href: !0, class: !0 });
			var _ = h(a);
			t && t.l(_), _.forEach(r), s.forEach(r), this.h();
		},
		h() {
			f(a, 'href', i[0]),
				f(a, 'class', 'nav-item svelte-bs8x38'),
				m(a, 'active', i[1]),
				f(l, 'class', 'svelte-bs8x38');
		},
		m(e, s) {
			b(e, l, s), L(l, a), t && t.m(a, null), (n = !0);
		},
		p(e, [s]) {
			t && t.p && (!n || s & 4) && k(t, o, e, e[2], n ? C(o, e[2], s, null) : y(e[2]), null),
				(!n || s & 1) && f(a, 'href', e[0]),
				s & 2 && m(a, 'active', e[1]);
		},
		i(e) {
			n || (E(t, e), (n = !0));
		},
		o(e) {
			I(t, e), (n = !1);
		},
		d(e) {
			e && r(l), t && t.d(e);
		}
	};
}
function q(i, l, a) {
	let { $$slots: n = {}, $$scope: o } = l,
		{ path: t, active: e } = l;
	return (
		(i.$$set = (s) => {
			'path' in s && a(0, (t = s.path)),
				'active' in s && a(1, (e = s.active)),
				'$$scope' in s && a(2, (o = s.$$scope));
		}),
		[t, e, o, n]
	);
}
class F extends v {
	constructor(l) {
		super(), d(this, l, q, S, p, { path: 0, active: 1 });
	}
}
export { F as L };
