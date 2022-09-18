import {
	S as O,
	i as Y,
	s as J,
	k as v,
	a as T,
	l as d,
	m as E,
	c as D,
	h as p,
	n as g,
	B as re,
	b as M,
	C as i,
	f as P,
	g as Z,
	d as x,
	t as F,
	D as ee,
	E as oe,
	v as V,
	w as q,
	x as B,
	y as j,
	q as H,
	r as I,
	A as z,
	F as ce,
	G as ue,
	H as ie,
	I as fe
} from '../../chunks/index-2fad9c0c.js';
import { L as ne } from '../../chunks/Link-2f41dbb7.js';
import { p as _e } from '../../chunks/stores-fe9ed232.js';
import '../../chunks/singletons-90aa6b4a.js';
function te(r, t, s) {
	const e = r.slice();
	return (e[3] = t[s][0]), (e[4] = t[s][1]), e;
}
function se(r, t, s) {
	const e = r.slice();
	return (e[3] = t[s][0]), (e[4] = t[s][1]), e;
}
function he(r) {
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
			M(e, s, l);
		},
		p: z,
		d(e) {
			e && p(s);
		}
	};
}
function le(r) {
	let t, s;
	return (
		(t = new ne({
			props: {
				path: r[3],
				active: r[3] === '/' ? r[0].url.pathname === '/' : r[0].url.pathname.includes(r[3]),
				$$slots: { default: [he] },
				$$scope: { ctx: r }
			}
		})),
		{
			c() {
				V(t.$$.fragment);
			},
			l(e) {
				q(t.$$.fragment, e);
			},
			m(e, l) {
				B(t, e, l), (s = !0);
			},
			p(e, l) {
				const u = {};
				l & 1 &&
					(u.active = e[3] === '/' ? e[0].url.pathname === '/' : e[0].url.pathname.includes(e[3])),
					l & 512 && (u.$$scope = { dirty: l, ctx: e }),
					t.$set(u);
			},
			i(e) {
				s || (P(t.$$.fragment, e), (s = !0));
			},
			o(e) {
				F(t.$$.fragment, e), (s = !1);
			},
			d(e) {
				j(t, e);
			}
		}
	);
}
function pe(r) {
	let t = r[4] + '',
		s,
		e;
	return {
		c() {
			(s = H(t)), (e = T());
		},
		l(l) {
			(s = I(l, t)), (e = D(l));
		},
		m(l, u) {
			M(l, s, u), M(l, e, u);
		},
		p: z,
		d(l) {
			l && p(s), l && p(e);
		}
	};
}
function ae(r) {
	let t, s;
	return (
		(t = new ne({
			props: {
				path: r[3],
				active: r[3] === '/' ? r[0].url.pathname === '/' : r[0].url.pathname.includes(r[3]),
				$$slots: { default: [pe] },
				$$scope: { ctx: r }
			}
		})),
		{
			c() {
				V(t.$$.fragment);
			},
			l(e) {
				q(t.$$.fragment, e);
			},
			m(e, l) {
				B(t, e, l), (s = !0);
			},
			p(e, l) {
				const u = {};
				l & 1 &&
					(u.active = e[3] === '/' ? e[0].url.pathname === '/' : e[0].url.pathname.includes(e[3])),
					l & 512 && (u.$$scope = { dirty: l, ctx: e }),
					t.$set(u);
			},
			i(e) {
				s || (P(t.$$.fragment, e), (s = !0));
			},
			o(e) {
				F(t.$$.fragment, e), (s = !1);
			},
			d(e) {
				j(t, e);
			}
		}
	);
}
function me(r) {
	let t,
		s,
		e,
		l,
		u,
		m,
		k,
		f,
		o,
		$,
		L,
		w = r[1],
		_ = [];
	for (let n = 0; n < w.length; n += 1) _[n] = le(se(r, w, n));
	const R = (n) =>
		F(_[n], 1, 1, () => {
			_[n] = null;
		});
	let N = r[2],
		h = [];
	for (let n = 0; n < N.length; n += 1) h[n] = ae(te(r, N, n));
	const S = (n) =>
		F(h[n], 1, 1, () => {
			h[n] = null;
		});
	return {
		c() {
			(t = v('header')), (s = v('div')), (e = v('nav')), (l = v('ul'));
			for (let n = 0; n < _.length; n += 1) _[n].c();
			(u = T()), (m = v('li')), (k = v('a')), (f = v('img')), ($ = T());
			for (let n = 0; n < h.length; n += 1) h[n].c();
			this.h();
		},
		l(n) {
			t = d(n, 'HEADER', { class: !0 });
			var c = E(t);
			s = d(c, 'DIV', { class: !0 });
			var a = E(s);
			e = d(a, 'NAV', { class: !0 });
			var C = E(e);
			l = d(C, 'UL', { class: !0 });
			var y = E(l);
			for (let A = 0; A < _.length; A += 1) _[A].l(y);
			(u = D(y)), (m = d(y, 'LI', { class: !0 }));
			var U = E(m);
			k = d(U, 'A', { href: !0, class: !0 });
			var b = E(k);
			(f = d(b, 'IMG', { alt: !0, src: !0, class: !0 })), b.forEach(p), U.forEach(p), ($ = D(y));
			for (let A = 0; A < h.length; A += 1) h[A].l(y);
			y.forEach(p), C.forEach(p), a.forEach(p), c.forEach(p), this.h();
		},
		h() {
			g(f, 'alt', 'CULT Magazine Logo'),
				re(f.src, (o = '/images/cult-mask-diamonds-sunglasses.png')) || g(f, 'src', o),
				g(f, 'class', 'svelte-s0hk1x'),
				g(k, 'href', '/'),
				g(k, 'class', 'logo svelte-s0hk1x'),
				g(m, 'class', 'svelte-s0hk1x'),
				g(l, 'class', 'svelte-s0hk1x'),
				g(e, 'class', 'svelte-s0hk1x'),
				g(s, 'class', 'container'),
				g(t, 'class', 'svelte-s0hk1x');
		},
		m(n, c) {
			M(n, t, c), i(t, s), i(s, e), i(e, l);
			for (let a = 0; a < _.length; a += 1) _[a].m(l, null);
			i(l, u), i(l, m), i(m, k), i(k, f), i(l, $);
			for (let a = 0; a < h.length; a += 1) h[a].m(l, null);
			L = !0;
		},
		p(n, [c]) {
			if (c & 3) {
				w = n[1];
				let a;
				for (a = 0; a < w.length; a += 1) {
					const C = se(n, w, a);
					_[a] ? (_[a].p(C, c), P(_[a], 1)) : ((_[a] = le(C)), _[a].c(), P(_[a], 1), _[a].m(l, u));
				}
				for (Z(), a = w.length; a < _.length; a += 1) R(a);
				x();
			}
			if (c & 5) {
				N = n[2];
				let a;
				for (a = 0; a < N.length; a += 1) {
					const C = te(n, N, a);
					h[a]
						? (h[a].p(C, c), P(h[a], 1))
						: ((h[a] = ae(C)), h[a].c(), P(h[a], 1), h[a].m(l, null));
				}
				for (Z(), a = N.length; a < h.length; a += 1) S(a);
				x();
			}
		},
		i(n) {
			if (!L) {
				for (let c = 0; c < w.length; c += 1) P(_[c]);
				for (let c = 0; c < N.length; c += 1) P(h[c]);
				L = !0;
			}
		},
		o(n) {
			_ = _.filter(Boolean);
			for (let c = 0; c < _.length; c += 1) F(_[c]);
			h = h.filter(Boolean);
			for (let c = 0; c < h.length; c += 1) F(h[c]);
			L = !1;
		},
		d(n) {
			n && p(t), ee(_, n), ee(h, n);
		}
	};
}
function $e(r, t, s) {
	let e;
	return (
		oe(r, _e, (m) => s(0, (e = m))),
		[
			e,
			[
				['/cultproposals', 'CULT Proposals'],
				['/rvltproposals', 'RVLT Proposals'],
				['/markets', 'markets']
			],
			[
				['/events', 'events'],
				['/news', 'News'],
				['/resources', 'resources']
			]
		]
	);
}
class ge extends O {
	constructor(t) {
		super(), Y(this, t, $e, me, J, {});
	}
}
function ve(r) {
	let t, s, e, l, u, m, k, f, o, $, L, w, _, R, N, h, S, n, c, a, C;
	return {
		c() {
			(t = v('footer')),
				(s = v('div')),
				(e = v('span')),
				(l = H('\xA9 ')),
				(u = H(r[0])),
				(m = H(' CULT Magazine')),
				(k = T()),
				(f = v('span')),
				(o = H('\u2022')),
				($ = T()),
				(L = v('a')),
				(w = H('Code of Conduct')),
				(_ = T()),
				(R = v('span')),
				(N = H('\u2022')),
				(h = T()),
				(S = v('span')),
				(n = H(`Contribute on
			`)),
				(c = v('a')),
				(a = H('GitHub')),
				(C = H('!')),
				this.h();
		},
		l(y) {
			t = d(y, 'FOOTER', { class: !0 });
			var U = E(t);
			s = d(U, 'DIV', { class: !0 });
			var b = E(s);
			e = d(b, 'SPAN', {});
			var A = E(e);
			(l = I(A, '\xA9 ')),
				(u = I(A, r[0])),
				(m = I(A, ' CULT Magazine')),
				A.forEach(p),
				(k = D(b)),
				(f = d(b, 'SPAN', {}));
			var K = E(f);
			(o = I(K, '\u2022')), K.forEach(p), ($ = D(b)), (L = d(b, 'A', { class: !0, href: !0 }));
			var Q = E(L);
			(w = I(Q, 'Code of Conduct')), Q.forEach(p), (_ = D(b)), (R = d(b, 'SPAN', {}));
			var W = E(R);
			(N = I(W, '\u2022')), W.forEach(p), (h = D(b)), (S = d(b, 'SPAN', {}));
			var G = E(S);
			(n = I(
				G,
				`Contribute on
			`
			)),
				(c = d(G, 'A', { class: !0, href: !0, target: !0, rel: !0 }));
			var X = E(c);
			(a = I(X, 'GitHub')),
				X.forEach(p),
				(C = I(G, '!')),
				G.forEach(p),
				b.forEach(p),
				U.forEach(p),
				this.h();
		},
		h() {
			g(L, 'class', 'underline'),
				g(L, 'href', '/about'),
				g(c, 'class', 'underline'),
				g(c, 'href', 'https://github.com/michael-spengler/cultmagazine'),
				g(c, 'target', '_blank'),
				g(c, 'rel', 'noopener'),
				g(s, 'class', 'container svelte-ypycgj'),
				g(t, 'class', 'svelte-ypycgj');
		},
		m(y, U) {
			M(y, t, U),
				i(t, s),
				i(s, e),
				i(e, l),
				i(e, u),
				i(e, m),
				i(s, k),
				i(s, f),
				i(f, o),
				i(s, $),
				i(s, L),
				i(L, w),
				i(s, _),
				i(s, R),
				i(R, N),
				i(s, h),
				i(s, S),
				i(S, n),
				i(S, c),
				i(c, a),
				i(S, C);
		},
		p: z,
		i: z,
		o: z,
		d(y) {
			y && p(t);
		}
	};
}
function de(r) {
	var t = new Date(),
		s = t.getFullYear();
	return [s];
}
class ke extends O {
	constructor(t) {
		super(), Y(this, t, de, ve, J, {});
	}
}
function Ee(r) {
	let t, s, e, l, u, m;
	t = new ge({});
	const k = r[1].default,
		f = ce(k, r, r[0], null);
	return (
		(u = new ke({})),
		{
			c() {
				V(t.$$.fragment),
					(s = T()),
					(e = v('main')),
					f && f.c(),
					(l = T()),
					V(u.$$.fragment),
					this.h();
			},
			l(o) {
				q(t.$$.fragment, o), (s = D(o)), (e = d(o, 'MAIN', { class: !0 }));
				var $ = E(e);
				f && f.l($), $.forEach(p), (l = D(o)), q(u.$$.fragment, o), this.h();
			},
			h() {
				g(e, 'class', 'container svelte-ew0nie');
			},
			m(o, $) {
				B(t, o, $), M(o, s, $), M(o, e, $), f && f.m(e, null), M(o, l, $), B(u, o, $), (m = !0);
			},
			p(o, [$]) {
				f && f.p && (!m || $ & 1) && ue(f, k, o, o[0], m ? fe(k, o[0], $, null) : ie(o[0]), null);
			},
			i(o) {
				m || (P(t.$$.fragment, o), P(f, o), P(u.$$.fragment, o), (m = !0));
			},
			o(o) {
				F(t.$$.fragment, o), F(f, o), F(u.$$.fragment, o), (m = !1);
			},
			d(o) {
				j(t, o), o && p(s), o && p(e), f && f.d(o), o && p(l), j(u, o);
			}
		}
	);
}
function be(r, t, s) {
	let { $$slots: e = {}, $$scope: l } = t;
	return (
		(r.$$set = (u) => {
			'$$scope' in u && s(0, (l = u.$$scope));
		}),
		[l, e]
	);
}
class we extends O {
	constructor(t) {
		super(), Y(this, t, be, Ee, J, {});
	}
}
export { we as default };
