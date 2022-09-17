import {
	S as r,
	i as f,
	s as u,
	F as _,
	k as c,
	l as m,
	m as d,
	h as i,
	b as p,
	G as $,
	H as h,
	I as g,
	f as b,
	t as v
} from '../../../chunks/index-2fe5515f.js';
function y(l) {
	let s, a;
	const o = l[1].default,
		t = _(o, l, l[0], null);
	return {
		c() {
			(s = c('main')), t && t.c();
		},
		l(e) {
			s = m(e, 'MAIN', {});
			var n = d(s);
			t && t.l(n), n.forEach(i);
		},
		m(e, n) {
			p(e, s, n), t && t.m(s, null), (a = !0);
		},
		p(e, [n]) {
			t && t.p && (!a || n & 1) && $(t, o, e, e[0], a ? g(o, e[0], n, null) : h(e[0]), null);
		},
		i(e) {
			a || (b(t, e), (a = !0));
		},
		o(e) {
			v(t, e), (a = !1);
		},
		d(e) {
			e && i(s), t && t.d(e);
		}
	};
}
function I(l, s, a) {
	let { $$slots: o = {}, $$scope: t } = s;
	return (
		(l.$$set = (e) => {
			'$$scope' in e && a(0, (t = e.$$scope));
		}),
		[t, o]
	);
}
class k extends r {
	constructor(s) {
		super(), f(this, s, I, y, u, {});
	}
}
export { k as default };
