import {
	S as P,
	i as V,
	s as j,
	k as d,
	a as M,
	l as k,
	m as b,
	c as R,
	h as p,
	n as g,
	B as te,
	b as D,
	C as h,
	f as A,
	g as J,
	d as K,
	t as N,
	D as Q,
	E as le,
	v as z,
	w as G,
	x as q,
	y as B,
	q as H,
	r as I,
	A as U,
	F as se,
	G as ae,
	H as ne,
	I as re
} from '../../chunks/index-2fad9c0c.js';
import { L as ee } from '../../chunks/Link-2f41dbb7.js';
import { p as oe } from '../../chunks/stores-764fbfd2.js';
import '../../chunks/singletons-ba6e48e5.js';
function W(r, t, l) {
	const e = r.slice();
	return (e[3] = t[l][0]), (e[4] = t[l][1]), e;
}
function X(r, t, l) {
	const e = r.slice();
	return (e[3] = t[l][0]), (e[4] = t[l][1]), e;
}
function ce(r) {
	let t = r[4] + '',
		l;
	return {
		c() {
			l = H(t);
		},
		l(e) {
			l = I(e, t);
		},
		m(e, s) {
			D(e, l, s);
		},
		p: U,
		d(e) {
			e && p(l);
		}
	};
}
function Z(r) {
	let t, l;
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
				z(t.$$.fragment);
			},
			l(e) {
				G(t.$$.fragment, e);
			},
			m(e, s) {
				q(t, e, s), (l = !0);
			},
			p(e, s) {
				const i = {};
				s & 1 &&
					(i.active = e[3] === '/' ? e[0].url.pathname === '/' : e[0].url.pathname.includes(e[3])),
					s & 512 && (i.$$scope = { dirty: s, ctx: e }),
					t.$set(i);
			},
			i(e) {
				l || (A(t.$$.fragment, e), (l = !0));
			},
			o(e) {
				N(t.$$.fragment, e), (l = !1);
			},
			d(e) {
				B(t, e);
			}
		}
	);
}
function ie(r) {
	let t = r[4] + '',
		l,
		e;
	return {
		c() {
			(l = H(t)), (e = M());
		},
		l(s) {
			(l = I(s, t)), (e = R(s));
		},
		m(s, i) {
			D(s, l, i), D(s, e, i);
		},
		p: U,
		d(s) {
			s && p(l), s && p(e);
		}
	};
}
function x(r) {
	let t, l;
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
				z(t.$$.fragment);
			},
			l(e) {
				G(t.$$.fragment, e);
			},
			m(e, s) {
				q(t, e, s), (l = !0);
			},
			p(e, s) {
				const i = {};
				s & 1 &&
					(i.active = e[3] === '/' ? e[0].url.pathname === '/' : e[0].url.pathname.includes(e[3])),
					s & 512 && (i.$$scope = { dirty: s, ctx: e }),
					t.$set(i);
			},
			i(e) {
				l || (A(t.$$.fragment, e), (l = !0));
			},
			o(e) {
				N(t.$$.fragment, e), (l = !1);
			},
			d(e) {
				B(t, e);
			}
		}
	);
}
function ue(r) {
	let t,
		l,
		e,
		s,
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
	const T = (a) =>
		N(c[a], 1, 1, () => {
			c[a] = null;
		});
	let w = r[2],
		f = [];
	for (let a = 0; a < w.length; a += 1) f[a] = x(W(r, w, a));
	const S = (a) =>
		N(f[a], 1, 1, () => {
			f[a] = null;
		});
	return {
		c() {
			(t = d('header')), (l = d('div')), (e = d('nav')), (s = d('ul'));
			for (let a = 0; a < c.length; a += 1) c[a].c();
			(i = M()), (m = d('li')), (v = d('a')), (_ = d('img')), ($ = M());
			for (let a = 0; a < f.length; a += 1) f[a].c();
			this.h();
		},
		l(a) {
			t = k(a, 'HEADER', { class: !0 });
			var u = b(t);
			l = k(u, 'DIV', { class: !0 });
			var n = b(l);
			e = k(n, 'NAV', { class: !0 });
			var E = b(e);
			s = k(E, 'UL', { class: !0 });
			var C = b(s);
			for (let F = 0; F < c.length; F += 1) c[F].l(C);
			(i = R(C)), (m = k(C, 'LI', { class: !0 }));
			var O = b(m);
			v = k(O, 'A', { href: !0, class: !0 });
			var Y = b(v);
			(_ = k(Y, 'IMG', { alt: !0, src: !0, class: !0 })), Y.forEach(p), O.forEach(p), ($ = R(C));
			for (let F = 0; F < f.length; F += 1) f[F].l(C);
			C.forEach(p), E.forEach(p), n.forEach(p), u.forEach(p), this.h();
		},
		h() {
			g(_, 'alt', 'CULT Magazine Logo'),
				te(_.src, (o = '/images/cult-mask-diamonds-sunglasses.png')) || g(_, 'src', o),
				g(_, 'class', 'svelte-s0hk1x'),
				g(v, 'href', '/'),
				g(v, 'class', 'logo svelte-s0hk1x'),
				g(m, 'class', 'svelte-s0hk1x'),
				g(s, 'class', 'svelte-s0hk1x'),
				g(e, 'class', 'svelte-s0hk1x'),
				g(l, 'class', 'container'),
				g(t, 'class', 'svelte-s0hk1x');
		},
		m(a, u) {
			D(a, t, u), h(t, l), h(l, e), h(e, s);
			for (let n = 0; n < c.length; n += 1) c[n].m(s, null);
			h(s, i), h(s, m), h(m, v), h(v, _), h(s, $);
			for (let n = 0; n < f.length; n += 1) f[n].m(s, null);
			L = !0;
		},
		p(a, [u]) {
			if (u & 3) {
				y = a[1];
				let n;
				for (n = 0; n < y.length; n += 1) {
					const E = X(a, y, n);
					c[n] ? (c[n].p(E, u), A(c[n], 1)) : ((c[n] = Z(E)), c[n].c(), A(c[n], 1), c[n].m(s, i));
				}
				for (J(), n = y.length; n < c.length; n += 1) T(n);
				K();
			}
			if (u & 5) {
				w = a[2];
				let n;
				for (n = 0; n < w.length; n += 1) {
					const E = W(a, w, n);
					f[n]
						? (f[n].p(E, u), A(f[n], 1))
						: ((f[n] = x(E)), f[n].c(), A(f[n], 1), f[n].m(s, null));
				}
				for (J(), n = w.length; n < f.length; n += 1) S(n);
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
function fe(r, t, l) {
	let e;
	return (
		le(r, oe, (m) => l(0, (e = m))),
		[
			e,
			[
				['/cultproposals', 'CULT'],
				['/rvltproposals', 'Revolt 2 Earn'],
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
class _e extends P {
	constructor(t) {
		super(), V(this, t, fe, ue, j, {});
	}
}
function he(r) {
	let t, l, e, s, i, m, v, _, o, $, L, y, c, T, w;
	return {
		c() {
			(t = d('footer')),
				(l = d('div')),
				(e = d('span')),
				(s = H('\xA9 ')),
				(i = H(r[0])),
				(m = H(' CULT Magazine')),
				(v = M()),
				(_ = d('span')),
				(o = H('\u2022')),
				($ = M()),
				(L = d('span')),
				(y = H(`Contribute on
			`)),
				(c = d('a')),
				(T = H('GitHub')),
				(w = H('!')),
				this.h();
		},
		l(f) {
			t = k(f, 'FOOTER', { class: !0 });
			var S = b(t);
			l = k(S, 'DIV', { class: !0 });
			var a = b(l);
			e = k(a, 'SPAN', {});
			var u = b(e);
			(s = I(u, '\xA9 ')),
				(i = I(u, r[0])),
				(m = I(u, ' CULT Magazine')),
				u.forEach(p),
				(v = R(a)),
				(_ = k(a, 'SPAN', {}));
			var n = b(_);
			(o = I(n, '\u2022')), n.forEach(p), ($ = R(a)), (L = k(a, 'SPAN', {}));
			var E = b(L);
			(y = I(
				E,
				`Contribute on
			`
			)),
				(c = k(E, 'A', { class: !0, href: !0, target: !0, rel: !0 }));
			var C = b(c);
			(T = I(C, 'GitHub')),
				C.forEach(p),
				(w = I(E, '!')),
				E.forEach(p),
				a.forEach(p),
				S.forEach(p),
				this.h();
		},
		h() {
			g(c, 'class', 'underline'),
				g(c, 'href', 'https://github.com/michael-spengler/cultmagazine'),
				g(c, 'target', '_blank'),
				g(c, 'rel', 'noopener'),
				g(l, 'class', 'container svelte-ypycgj'),
				g(t, 'class', 'svelte-ypycgj');
		},
		m(f, S) {
			D(f, t, S),
				h(t, l),
				h(l, e),
				h(e, s),
				h(e, i),
				h(e, m),
				h(l, v),
				h(l, _),
				h(_, o),
				h(l, $),
				h(l, L),
				h(L, y),
				h(L, c),
				h(c, T),
				h(L, w);
		},
		p: U,
		i: U,
		o: U,
		d(f) {
			f && p(t);
		}
	};
}
function pe(r) {
	var t = new Date(),
		l = t.getFullYear();
	return [l];
}
class me extends P {
	constructor(t) {
		super(), V(this, t, pe, he, j, {});
	}
}
function $e(r) {
	let t, l, e, s, i, m;
	t = new _e({});
	const v = r[1].default,
		_ = se(v, r, r[0], null);
	return (
		(i = new me({})),
		{
			c() {
				z(t.$$.fragment),
					(l = M()),
					(e = d('main')),
					_ && _.c(),
					(s = M()),
					z(i.$$.fragment),
					this.h();
			},
			l(o) {
				G(t.$$.fragment, o), (l = R(o)), (e = k(o, 'MAIN', { class: !0 }));
				var $ = b(e);
				_ && _.l($), $.forEach(p), (s = R(o)), G(i.$$.fragment, o), this.h();
			},
			h() {
				g(e, 'class', 'container svelte-ew0nie');
			},
			m(o, $) {
				q(t, o, $), D(o, l, $), D(o, e, $), _ && _.m(e, null), D(o, s, $), q(i, o, $), (m = !0);
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
				B(t, o), o && p(l), o && p(e), _ && _.d(o), o && p(s), B(i, o);
			}
		}
	);
}
function ge(r, t, l) {
	let { $$slots: e = {}, $$scope: s } = t;
	return (
		(r.$$set = (i) => {
			'$$scope' in i && l(0, (s = i.$$scope));
		}),
		[s, e]
	);
}
class be extends P {
	constructor(t) {
		super(), V(this, t, ge, $e, j, {});
	}
}
export { be as default };
