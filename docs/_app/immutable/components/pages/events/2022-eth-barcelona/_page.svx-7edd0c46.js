import {
	S as G,
	i as I,
	s as q,
	F as j,
	v as L,
	a as B,
	k as p,
	q as g,
	w as N,
	c as P,
	l as d,
	m as v,
	r as y,
	h as m,
	n as b,
	x as U,
	b as E,
	C as h,
	u as D,
	G as F,
	H as M,
	I as O,
	f as w,
	t as T,
	y as W,
	N as H,
	O as Q,
	P as S,
	Q as k,
	A as V
} from '../../../../chunks/index-2fad9c0c.js';
import { S as Z } from '../../../../chunks/Seo-30c25c5e.js';
import '../../../../chunks/stores-5c626af5.js';
import '../../../../chunks/singletons-33397e7e.js';
function x(i) {
	let e, r, n, l, a, s, _, u;
	e = new Z({ props: { title: i[0] } });
	const c = i[2].default,
		o = j(c, i, i[1], null);
	return {
		c() {
			L(e.$$.fragment),
				(r = B()),
				(n = p('div')),
				(l = p('h1')),
				(a = g(i[0])),
				(s = B()),
				(_ = p('main')),
				o && o.c(),
				this.h();
		},
		l(t) {
			N(e.$$.fragment, t), (r = P(t)), (n = d(t, 'DIV', { class: !0 }));
			var f = v(n);
			l = d(f, 'H1', {});
			var $ = v(l);
			(a = y($, i[0])), $.forEach(m), (s = P(f)), (_ = d(f, 'MAIN', { class: !0 }));
			var C = v(_);
			o && o.l(C), C.forEach(m), f.forEach(m), this.h();
		},
		h() {
			b(_, 'class', 'svelte-unfbyl'), b(n, 'class', 'svelte-unfbyl');
		},
		m(t, f) {
			U(e, t, f),
				E(t, r, f),
				E(t, n, f),
				h(n, l),
				h(l, a),
				h(n, s),
				h(n, _),
				o && o.m(_, null),
				(u = !0);
		},
		p(t, [f]) {
			const $ = {};
			f & 1 && ($.title = t[0]),
				e.$set($),
				(!u || f & 1) && D(a, t[0]),
				o && o.p && (!u || f & 2) && F(o, c, t, t[1], u ? O(c, t[1], f, null) : M(t[1]), null);
		},
		i(t) {
			u || (w(e.$$.fragment, t), w(o, t), (u = !0));
		},
		o(t) {
			T(e.$$.fragment, t), T(o, t), (u = !1);
		},
		d(t) {
			W(e, t), t && m(r), t && m(n), o && o.d(t);
		}
	};
}
function z(i, e, r) {
	let { $$slots: n = {}, $$scope: l } = e,
		{ title: a = '' } = e;
	return (
		(i.$$set = (s) => {
			'title' in s && r(0, (a = s.title)), '$$scope' in s && r(1, (l = s.$$scope));
		}),
		[a, l, n]
	);
}
class J extends G {
	constructor(e) {
		super(), I(this, e, z, x, q, { title: 0 });
	}
}
function K(i) {
	let e, r, n, l, a, s, _, u;
	return {
		c() {
			(e = p('p')),
				(r = g(
					'ETH Barcelona was co-sponsored by the CULT. What happens in Barcelona stays on the Blockchain.'
				)),
				(n = B()),
				(l = p('p')),
				(a = g('Get more information on the ')),
				(s = p('a')),
				(_ = g('ethbarcelona.com')),
				(u = g('.')),
				this.h();
		},
		l(c) {
			e = d(c, 'P', {});
			var o = v(e);
			(r = y(
				o,
				'ETH Barcelona was co-sponsored by the CULT. What happens in Barcelona stays on the Blockchain.'
			)),
				o.forEach(m),
				(n = P(c)),
				(l = d(c, 'P', {}));
			var t = v(l);
			(a = y(t, 'Get more information on the ')), (s = d(t, 'A', { href: !0, rel: !0 }));
			var f = v(s);
			(_ = y(f, 'ethbarcelona.com')), f.forEach(m), (u = y(t, '.')), t.forEach(m), this.h();
		},
		h() {
			b(s, 'href', 'https://ethbarcelona.com/'), b(s, 'rel', 'nofollow');
		},
		m(c, o) {
			E(c, e, o), h(e, r), E(c, n, o), E(c, l, o), h(l, a), h(l, s), h(s, _), h(l, u);
		},
		p: V,
		d(c) {
			c && m(e), c && m(n), c && m(l);
		}
	};
}
function R(i) {
	let e, r;
	const n = [i[0], A];
	let l = { $$slots: { default: [K] }, $$scope: { ctx: i } };
	for (let a = 0; a < n.length; a += 1) l = H(l, n[a]);
	return (
		(e = new J({ props: l })),
		{
			c() {
				L(e.$$.fragment);
			},
			l(a) {
				N(e.$$.fragment, a);
			},
			m(a, s) {
				U(e, a, s), (r = !0);
			},
			p(a, [s]) {
				const _ = s & 1 ? Q(n, [s & 1 && S(a[0]), s & 0 && S(A)]) : {};
				s & 2 && (_.$$scope = { dirty: s, ctx: a }), e.$set(_);
			},
			i(a) {
				r || (w(e.$$.fragment, a), (r = !0));
			},
			o(a) {
				T(e.$$.fragment, a), (r = !1);
			},
			d(a) {
				W(e, a);
			}
		}
	);
}
const A = {
	title: '\u{1F341} ETH Barcelona 2022',
	layout: 'eventPage',
	date: '2022-07-06T00:00:00.000Z'
};
function X(i, e, r) {
	return (
		(i.$$set = (n) => {
			r(0, (e = H(H({}, e), k(n))));
		}),
		(e = k(e)),
		[e]
	);
}
class se extends G {
	constructor(e) {
		super(), I(this, e, X, R, q, {});
	}
}
export { se as default, A as metadata };