import {
	S as V,
	i as W,
	s as X,
	N as F,
	v as Y,
	w as ee,
	x as te,
	O as le,
	P as H,
	f as ae,
	t as oe,
	y as se,
	Q as J,
	k as c,
	q as m,
	a as S,
	l as u,
	m as h,
	r as d,
	h as a,
	c as b,
	n as K,
	b as _,
	C as s,
	A as re
} from '../../../../chunks/index-bbe4a303.js';
import { E as ie } from '../../../../chunks/EventPage-2bda9fd7.js';
import '../../../../chunks/Seo-f754fc40.js';
import '../../../../chunks/stores-898e1727.js';
import '../../../../chunks/singletons-751b57d5.js';
function ne(E) {
	let t, n, f, o, l, i, w, x, g, D, $, Q, q, L, B, T, p, C, y, G, j, P, k, A, I;
	return {
		c() {
			(t = c('p')),
				(n = m(
					'The Svelte Society Day 2020 was an event for french Svelte developers with eleven french talks on our youtube channel about Svelte related topics like:'
				)),
				(f = S()),
				(o = c('ul')),
				(l = c('li')),
				(i = m('React-/Angularmigration to Svelte')),
				(w = S()),
				(x = c('li')),
				(g = m('Typescript at Svelte')),
				(D = S()),
				($ = c('li')),
				(Q = m('GraphQL')),
				(q = S()),
				(L = c('li')),
				(B = m('routify')),
				(T = S()),
				(p = c('p')),
				(C = m('To get more information visit the ')),
				(y = c('a')),
				(G = m('Svelte Society france website')),
				(j = m('.')),
				(P = S()),
				(k = c('br')),
				(A = S()),
				(I = c('br')),
				this.h();
		},
		l(e) {
			t = u(e, 'P', {});
			var r = h(t);
			(n = d(
				r,
				'The Svelte Society Day 2020 was an event for french Svelte developers with eleven french talks on our youtube channel about Svelte related topics like:'
			)),
				r.forEach(a),
				(f = b(e)),
				(o = u(e, 'UL', {}));
			var v = h(o);
			l = u(v, 'LI', {});
			var N = h(l);
			(i = d(N, 'React-/Angularmigration to Svelte')),
				N.forEach(a),
				(w = b(v)),
				(x = u(v, 'LI', {}));
			var O = h(x);
			(g = d(O, 'Typescript at Svelte')), O.forEach(a), (D = b(v)), ($ = u(v, 'LI', {}));
			var U = h($);
			(Q = d(U, 'GraphQL')), U.forEach(a), (q = b(v)), (L = u(v, 'LI', {}));
			var Z = h(L);
			(B = d(Z, 'routify')), Z.forEach(a), v.forEach(a), (T = b(e)), (p = u(e, 'P', {}));
			var R = h(p);
			(C = d(R, 'To get more information visit the ')), (y = u(R, 'A', { href: !0, rel: !0 }));
			var z = h(y);
			(G = d(z, 'Svelte Society france website')),
				z.forEach(a),
				(j = d(R, '.')),
				R.forEach(a),
				(P = b(e)),
				(k = u(e, 'BR', {})),
				(A = b(e)),
				(I = u(e, 'BR', {})),
				this.h();
		},
		h() {
			K(y, 'href', 'https://france.sveltesociety.dev/'), K(y, 'rel', 'nofollow');
		},
		m(e, r) {
			_(e, t, r),
				s(t, n),
				_(e, f, r),
				_(e, o, r),
				s(o, l),
				s(l, i),
				s(o, w),
				s(o, x),
				s(x, g),
				s(o, D),
				s(o, $),
				s($, Q),
				s(o, q),
				s(o, L),
				s(L, B),
				_(e, T, r),
				_(e, p, r),
				s(p, C),
				s(p, y),
				s(y, G),
				s(p, j),
				_(e, P, r),
				_(e, k, r),
				_(e, A, r),
				_(e, I, r);
		},
		p: re,
		d(e) {
			e && a(t),
				e && a(f),
				e && a(o),
				e && a(T),
				e && a(p),
				e && a(P),
				e && a(k),
				e && a(A),
				e && a(I);
		}
	};
}
function fe(E) {
	let t, n;
	const f = [E[0], M];
	let o = { $$slots: { default: [ne] }, $$scope: { ctx: E } };
	for (let l = 0; l < f.length; l += 1) o = F(o, f[l]);
	return (
		(t = new ie({ props: o })),
		{
			c() {
				Y(t.$$.fragment);
			},
			l(l) {
				ee(t.$$.fragment, l);
			},
			m(l, i) {
				te(t, l, i), (n = !0);
			},
			p(l, [i]) {
				const w = i & 1 ? le(f, [i & 1 && H(l[0]), i & 0 && H(M)]) : {};
				i & 2 && (w.$$scope = { dirty: i, ctx: l }), t.$set(w);
			},
			i(l) {
				n || (ae(t.$$.fragment, l), (n = !0));
			},
			o(l) {
				oe(t.$$.fragment, l), (n = !1);
			},
			d(l) {
				se(t, l);
			}
		}
	);
}
const M = {
	title: 'Svelte Society Day 2020 France',
	layout: 'eventPage',
	date: '2020-09-27T00:00:00.000Z'
};
function ce(E, t, n) {
	return (
		(E.$$set = (f) => {
			n(0, (t = F(F({}, t), J(f))));
		}),
		(t = J(t)),
		[t]
	);
}
class he extends V {
	constructor(t) {
		super(), W(this, t, ce, fe, X, {});
	}
}
export { he as default, M as metadata };
