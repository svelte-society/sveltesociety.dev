import {
	S as q,
	i as B,
	s as j,
	k as d,
	a as F,
	l as k,
	m as b,
	c as M,
	h as p,
	n as g,
	B as te,
	b as T,
	C as h,
	f as A,
	g as J,
	d as K,
	t as N,
	D as Q,
	E as se,
	v as U,
	w as z,
	x as G,
	y as V,
	q as H,
	r as I,
	A as S,
	F as le,
	G as ae,
	H as ne,
	I as re
} from '../../chunks/index-2fad9c0c.js';
import { L as ee } from '../../chunks/Link-2f41dbb7.js';
import { p as oe } from '../../chunks/stores-6fbc4487.js';
import '../../chunks/singletons-b2fe3e64.js';
function W(r, t, s) {
	const e = r.slice();
	return (e[3] = t[s][0]), (e[4] = t[s][1]), e;
}
function X(r, t, s) {
	const e = r.slice();
	return (e[3] = t[s][0]), (e[4] = t[s][1]), e;
}
function ce(r) {
	let t = r[4] + '',
		s;
	return {
		c() {
			s = H(t);
		},
		l(e) {
			s = I(e, t);
		},
		m(e, l) {
			T(e, s, l);
		},
		p: S,
		d(e) {
			e && p(s);
		}
	};
}
function Z(r) {
	let t, s;
	return (
		(t = new ee({
			props: {
				path: r[3],
				active: r[3] === '/' ? r[0].url.pathname === '/' : r[0].url.pathname.includes(r[3]),
				$$slots: { default: [ce] },
				$$scope: { ctx: r }
			}
		})),
		{
			c() {
				U(t.$$.fragment);
			},
			l(e) {
				z(t.$$.fragment, e);
			},
			m(e, l) {
				G(t, e, l), (s = !0);
			},
			p(e, l) {
				const i = {};
				l & 1 &&
					(i.active = e[3] === '/' ? e[0].url.pathname === '/' : e[0].url.pathname.includes(e[3])),
					l & 512 && (i.$$scope = { dirty: l, ctx: e }),
					t.$set(i);
			},
			i(e) {
				s || (A(t.$$.fragment, e), (s = !0));
			},
			o(e) {
				N(t.$$.fragment, e), (s = !1);
			},
			d(e) {
				V(t, e);
			}
		}
	);
}
function ie(r) {
	let t = r[4] + '',
		s,
		e;
	return {
		c() {
			(s = H(t)), (e = F());
		},
		l(l) {
			(s = I(l, t)), (e = M(l));
		},
		m(l, i) {
			T(l, s, i), T(l, e, i);
		},
		p: S,
		d(l) {
			l && p(s), l && p(e);
		}
	};
}
function x(r) {
	let t, s;
	return (
		(t = new ee({
			props: {
				path: r[3],
				active: r[3] === '/' ? r[0].url.pathname === '/' : r[0].url.pathname.includes(r[3]),
				$$slots: { default: [ie] },
				$$scope: { ctx: r }
			}
		})),
		{
			c() {
				U(t.$$.fragment);
			},
			l(e) {
				z(t.$$.fragment, e);
			},
			m(e, l) {
				G(t, e, l), (s = !0);
			},
			p(e, l) {
				const i = {};
				l & 1 &&
					(i.active = e[3] === '/' ? e[0].url.pathname === '/' : e[0].url.pathname.includes(e[3])),
					l & 512 && (i.$$scope = { dirty: l, ctx: e }),
					t.$set(i);
			},
			i(e) {
				s || (A(t.$$.fragment, e), (s = !0));
			},
			o(e) {
				N(t.$$.fragment, e), (s = !1);
			},
			d(e) {
				V(t, e);
			}
		}
	);
}
function ue(r) {
	let t,
		s,
		e,
		l,
		i,
		m,
		v,
		_,
		o,
		$,
		L,
		y = r[1],
		c = [];
	for (let a = 0; a < y.length; a += 1) c[a] = Z(X(r, y, a));
	const R = (a) =>
		N(c[a], 1, 1, () => {
			c[a] = null;
		});
	let w = r[2],
		f = [];
	for (let a = 0; a < w.length; a += 1) f[a] = x(W(r, w, a));
	const P = (a) =>
		N(f[a], 1, 1, () => {
			f[a] = null;
		});
	return {
		c() {
			(t = d('header')), (s = d('div')), (e = d('nav')), (l = d('ul'));
			for (let a = 0; a < c.length; a += 1) c[a].c();
			(i = F()), (m = d('li')), (v = d('a')), (_ = d('img')), ($ = F());
			for (let a = 0; a < f.length; a += 1) f[a].c();
			this.h();
		},
		l(a) {
			t = k(a, 'HEADER', { class: !0 });
			var u = b(t);
			s = k(u, 'DIV', { class: !0 });
			var n = b(s);
			e = k(n, 'NAV', { class: !0 });
			var E = b(e);
			l = k(E, 'UL', { class: !0 });
			var C = b(l);
			for (let D = 0; D < c.length; D += 1) c[D].l(C);
			(i = M(C)), (m = k(C, 'LI', { class: !0 }));
			var O = b(m);
			v = k(O, 'A', { href: !0, class: !0 });
			var Y = b(v);
			(_ = k(Y, 'IMG', { alt: !0, src: !0, class: !0 })), Y.forEach(p), O.forEach(p), ($ = M(C));
			for (let D = 0; D < f.length; D += 1) f[D].l(C);
			C.forEach(p), E.forEach(p), n.forEach(p), u.forEach(p), this.h();
		},
		h() {
			g(_, 'alt', 'CULT Magazine Logo'),
				te(_.src, (o = '/images/cult-mask-diamonds-sunglasses.png')) || g(_, 'src', o),
				g(_, 'class', 'svelte-s0hk1x'),
				g(v, 'href', '/'),
				g(v, 'class', 'logo svelte-s0hk1x'),
				g(m, 'class', 'svelte-s0hk1x'),
				g(l, 'class', 'svelte-s0hk1x'),
				g(e, 'class', 'svelte-s0hk1x'),
				g(s, 'class', 'container'),
				g(t, 'class', 'svelte-s0hk1x');
		},
		m(a, u) {
			T(a, t, u), h(t, s), h(s, e), h(e, l);
			for (let n = 0; n < c.length; n += 1) c[n].m(l, null);
			h(l, i), h(l, m), h(m, v), h(v, _), h(l, $);
			for (let n = 0; n < f.length; n += 1) f[n].m(l, null);
			L = !0;
		},
		p(a, [u]) {
			if (u & 3) {
				y = a[1];
				let n;
				for (n = 0; n < y.length; n += 1) {
					const E = X(a, y, n);
					c[n] ? (c[n].p(E, u), A(c[n], 1)) : ((c[n] = Z(E)), c[n].c(), A(c[n], 1), c[n].m(l, i));
				}
				for (J(), n = y.length; n < c.length; n += 1) R(n);
				K();
			}
			if (u & 5) {
				w = a[2];
				let n;
				for (n = 0; n < w.length; n += 1) {
					const E = W(a, w, n);
					f[n]
						? (f[n].p(E, u), A(f[n], 1))
						: ((f[n] = x(E)), f[n].c(), A(f[n], 1), f[n].m(l, null));
				}
				for (J(), n = w.length; n < f.length; n += 1) P(n);
				K();
			}
		},
		i(a) {
			if (!L) {
				for (let u = 0; u < y.length; u += 1) A(c[u]);
				for (let u = 0; u < w.length; u += 1) A(f[u]);
				L = !0;
			}
		},
		o(a) {
			c = c.filter(Boolean);
			for (let u = 0; u < c.length; u += 1) N(c[u]);
			f = f.filter(Boolean);
			for (let u = 0; u < f.length; u += 1) N(f[u]);
			L = !1;
		},
		d(a) {
			a && p(t), Q(c, a), Q(f, a);
		}
	};
}
function fe(r, t, s) {
	let e;
	return (
		se(r, oe, (m) => s(0, (e = m))),
		[
			e,
			[
				['/cultproposals', 'CULT Proposals'],
				['/rvltproposals', 'RVLT Proposals'],
				['/news', 'News']
			],
			[
				['/events', 'events'],
				['/resources', 'resources'],
				['/markets', 'markets']
			]
		]
	);
}
class _e extends q {
	constructor(t) {
		super(), B(this, t, fe, ue, j, {});
	}
}
function he(r) {
	let t, s, e, l, i, m, v, _, o, $, L, y, c, R, w;
	return {
		c() {
			(t = d('footer')),
				(s = d('div')),
				(e = d('span')),
				(l = H('\xA9 ')),
				(i = H(r[0])),
				(m = H(' CULT Magazine')),
				(v = F()),
				(_ = d('span')),
				(o = H('\u2022')),
				($ = F()),
				(L = d('span')),
				(y = H(`Contribute on
			`)),
				(c = d('a')),
				(R = H('GitHub')),
				(w = H('!')),
				this.h();
		},
		l(f) {
			t = k(f, 'FOOTER', { class: !0 });
			var P = b(t);
			s = k(P, 'DIV', { class: !0 });
			var a = b(s);
			e = k(a, 'SPAN', {});
			var u = b(e);
			(l = I(u, '\xA9 ')),
				(i = I(u, r[0])),
				(m = I(u, ' CULT Magazine')),
				u.forEach(p),
				(v = M(a)),
				(_ = k(a, 'SPAN', {}));
			var n = b(_);
			(o = I(n, '\u2022')), n.forEach(p), ($ = M(a)), (L = k(a, 'SPAN', {}));
			var E = b(L);
			(y = I(
				E,
				`Contribute on
			`
			)),
				(c = k(E, 'A', { class: !0, href: !0, target: !0, rel: !0 }));
			var C = b(c);
			(R = I(C, 'GitHub')),
				C.forEach(p),
				(w = I(E, '!')),
				E.forEach(p),
				a.forEach(p),
				P.forEach(p),
				this.h();
		},
		h() {
			g(c, 'class', 'underline'),
				g(c, 'href', 'https://github.com/michael-spengler/cultmagazine'),
				g(c, 'target', '_blank'),
				g(c, 'rel', 'noopener'),
				g(s, 'class', 'container svelte-ypycgj'),
				g(t, 'class', 'svelte-ypycgj');
		},
		m(f, P) {
			T(f, t, P),
				h(t, s),
				h(s, e),
				h(e, l),
				h(e, i),
				h(e, m),
				h(s, v),
				h(s, _),
				h(_, o),
				h(s, $),
				h(s, L),
				h(L, y),
				h(L, c),
				h(c, R),
				h(L, w);
		},
		p: S,
		i: S,
		o: S,
		d(f) {
			f && p(t);
		}
	};
}
function pe(r) {
	var t = new Date(),
		s = t.getFullYear();
	return [s];
}
class me extends q {
	constructor(t) {
		super(), B(this, t, pe, he, j, {});
	}
}
function $e(r) {
	let t, s, e, l, i, m;
	t = new _e({});
	const v = r[1].default,
		_ = le(v, r, r[0], null);
	return (
		(i = new me({})),
		{
			c() {
				U(t.$$.fragment),
					(s = F()),
					(e = d('main')),
					_ && _.c(),
					(l = F()),
					U(i.$$.fragment),
					this.h();
			},
			l(o) {
				z(t.$$.fragment, o), (s = M(o)), (e = k(o, 'MAIN', { class: !0 }));
				var $ = b(e);
				_ && _.l($), $.forEach(p), (l = M(o)), z(i.$$.fragment, o), this.h();
			},
			h() {
				g(e, 'class', 'container svelte-ew0nie');
			},
			m(o, $) {
				G(t, o, $), T(o, s, $), T(o, e, $), _ && _.m(e, null), T(o, l, $), G(i, o, $), (m = !0);
			},
			p(o, [$]) {
				_ && _.p && (!m || $ & 1) && ae(_, v, o, o[0], m ? re(v, o[0], $, null) : ne(o[0]), null);
			},
			i(o) {
				m || (A(t.$$.fragment, o), A(_, o), A(i.$$.fragment, o), (m = !0));
			},
			o(o) {
				N(t.$$.fragment, o), N(_, o), N(i.$$.fragment, o), (m = !1);
			},
			d(o) {
				V(t, o), o && p(s), o && p(e), _ && _.d(o), o && p(l), V(i, o);
			}
		}
	);
}
function ge(r, t, s) {
	let { $$slots: e = {}, $$scope: l } = t;
	return (
		(r.$$set = (i) => {
			'$$scope' in i && s(0, (l = i.$$scope));
		}),
		[l, e]
	);
}
class be extends q {
	constructor(t) {
		super(), B(this, t, ge, $e, j, {});
	}
}
export { be as default };
