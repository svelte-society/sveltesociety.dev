import {
	S as O,
	i as V,
	s as W,
	Q as F,
	v as Y,
	w as ee,
	x as te,
	R as le,
	T as J,
	f as ae,
	t as oe,
	y as se,
	X as K,
	k as c,
	q as m,
	a as S,
	l as u,
	m as h,
	r as d,
	h as a,
	c as b,
	n as M,
	b as _,
	C as s,
	A as re
} from '../../../../chunks/index-2fe5515f.js';
import { E as ie } from '../../../../chunks/EventPage-a016509a.js';
import '../../../../chunks/Seo-fb4a23a4.js';
import '../../../../chunks/stores-e1bb27ae.js';
import '../../../../chunks/singletons-a3426cc4.js';
function ne(E) {
	let t, n, f, o, l, i, w, x, g, D, $, Q, q, T, B, L, p, C, y, G, j, k, P, R, A;
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
				(T = c('li')),
				(B = m('routify')),
				(L = S()),
				(p = c('p')),
				(C = m('To get more information visit the ')),
				(y = c('a')),
				(G = m('Svelte Society france website')),
				(j = m('.')),
				(k = S()),
				(P = c('br')),
				(R = S()),
				(A = c('br')),
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
			var U = h(l);
			(i = d(U, 'React-/Angularmigration to Svelte')),
				U.forEach(a),
				(w = b(v)),
				(x = u(v, 'LI', {}));
			var X = h(x);
			(g = d(X, 'Typescript at Svelte')), X.forEach(a), (D = b(v)), ($ = u(v, 'LI', {}));
			var Z = h($);
			(Q = d(Z, 'GraphQL')), Z.forEach(a), (q = b(v)), (T = u(v, 'LI', {}));
			var z = h(T);
			(B = d(z, 'routify')), z.forEach(a), v.forEach(a), (L = b(e)), (p = u(e, 'P', {}));
			var I = h(p);
			(C = d(I, 'To get more information visit the ')), (y = u(I, 'A', { href: !0, rel: !0 }));
			var H = h(y);
			(G = d(H, 'Svelte Society france website')),
				H.forEach(a),
				(j = d(I, '.')),
				I.forEach(a),
				(k = b(e)),
				(P = u(e, 'BR', {})),
				(R = b(e)),
				(A = u(e, 'BR', {})),
				this.h();
		},
		h() {
			M(y, 'href', 'https://france.sveltesociety.dev/'), M(y, 'rel', 'nofollow');
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
				s(o, T),
				s(T, B),
				_(e, L, r),
				_(e, p, r),
				s(p, C),
				s(p, y),
				s(y, G),
				s(p, j),
				_(e, k, r),
				_(e, P, r),
				_(e, R, r),
				_(e, A, r);
		},
		p: re,
		d(e) {
			e && a(t),
				e && a(f),
				e && a(o),
				e && a(L),
				e && a(p),
				e && a(k),
				e && a(P),
				e && a(R),
				e && a(A);
		}
	};
}
function fe(E) {
	let t, n;
	const f = [E[0], N];
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
				const w = i & 1 ? le(f, [i & 1 && J(l[0]), i & 0 && J(N)]) : {};
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
const N = {
	title: 'Svelte Society Day 2020 France',
	layout: 'eventPage',
	date: '2020-09-27T00:00:00.000Z'
};
function ce(E, t, n) {
	return (
		(E.$$set = (f) => {
			n(0, (t = F(F({}, t), K(f))));
		}),
		(t = K(t)),
		[t]
	);
}
class he extends O {
	constructor(t) {
		super(), V(this, t, ce, fe, W, {});
	}
}
export { he as default, N as metadata };
