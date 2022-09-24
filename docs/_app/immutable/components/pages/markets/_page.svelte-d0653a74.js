import {
	S as G,
	i as H,
	s as J,
	v as V,
	a as w,
	k as o,
	q as y,
	w as j,
	c as g,
	l as n,
	m as c,
	r as k,
	h as l,
	n as p,
	B as K,
	x as N,
	b as Y,
	C as t,
	A as O,
	f as Q,
	t as Z,
	y as ee
} from '../../../chunks/index-2fad9c0c.js';
import { S as te } from '../../../chunks/Seo-c4047d93.js';
import '../../../chunks/stores-28cbd078.js';
import '../../../chunks/singletons-53791fd8.js';
function re(D) {
	let i, b, e, m, E, T, u, C, $, d, x, B, f, L, P, h, R, U, _, M, S, s, W, v;
	return (
		(i = new te({ props: { title: 'CULT Markets', description: 'CULT Markets' } })),
		{
			c() {
				V(i.$$.fragment),
					(b = w()),
					(e = o('div')),
					(m = o('h2')),
					(E = y('CULT Markets')),
					(T = w()),
					(u = o('p')),
					(C = o('br')),
					($ = y(`
	The CULT markets feature is currently under construction.
	`)),
					(d = o('p')),
					(x = o('br')),
					(B = y(`
	We'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and to encourage freedom.

	`)),
					(f = o('p')),
					(L = o('br')),
					(P = y(`

	We'll also promote other freedom supporting markets here, while introducing community based (aka
	decentralized) content moderation.

	`)),
					(h = o('p')),
					(R = o('br')),
					(U = w()),
					(_ = o('p')),
					(M = o('br')),
					(S = w()),
					(s = o('iframe')),
					this.h();
			},
			l(a) {
				j(i.$$.fragment, a), (b = g(a)), (e = n(a, 'DIV', { class: !0 }));
				var r = c(e);
				m = n(r, 'H2', {});
				var q = c(m);
				(E = k(q, 'CULT Markets')), q.forEach(l), (T = g(r)), (u = n(r, 'P', {}));
				var z = c(u);
				(C = n(z, 'BR', {})),
					z.forEach(l),
					($ = k(
						r,
						`
	The CULT markets feature is currently under construction.
	`
					)),
					(d = n(r, 'P', {}));
				var A = c(d);
				(x = n(A, 'BR', {})),
					A.forEach(l),
					(B = k(
						r,
						`
	We'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and to encourage freedom.

	`
					)),
					(f = n(r, 'P', {}));
				var F = c(f);
				(L = n(F, 'BR', {})),
					F.forEach(l),
					(P = k(
						r,
						`

	We'll also promote other freedom supporting markets here, while introducing community based (aka
	decentralized) content moderation.

	`
					)),
					(h = n(r, 'P', {}));
				var I = c(h);
				(R = n(I, 'BR', {})), I.forEach(l), (U = g(r)), (_ = n(r, 'P', {}));
				var X = c(_);
				(M = n(X, 'BR', {})),
					X.forEach(l),
					(S = g(r)),
					(s = n(r, 'IFRAME', {
						width: !0,
						height: !0,
						src: !0,
						title: !0,
						frameborder: !0,
						allow: !0
					})),
					c(s).forEach(l),
					r.forEach(l),
					this.h();
			},
			h() {
				p(s, 'width', '100%'),
					p(s, 'height', '600'),
					K(s.src, (W = 'https://www.youtube.com/embed/J7GY1Xg6X20')) || p(s, 'src', W),
					p(s, 'title', 'YouTube video player'),
					p(s, 'frameborder', '0'),
					p(
						s,
						'allow',
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					),
					(s.allowFullscreen = !0),
					p(e, 'class', 'text-center');
			},
			m(a, r) {
				N(i, a, r),
					Y(a, b, r),
					Y(a, e, r),
					t(e, m),
					t(m, E),
					t(e, T),
					t(e, u),
					t(u, C),
					t(e, $),
					t(e, d),
					t(d, x),
					t(e, B),
					t(e, f),
					t(f, L),
					t(e, P),
					t(e, h),
					t(h, R),
					t(e, U),
					t(e, _),
					t(_, M),
					t(e, S),
					t(e, s),
					(v = !0);
			},
			p: O,
			i(a) {
				v || (Q(i.$$.fragment, a), (v = !0));
			},
			o(a) {
				Z(i.$$.fragment, a), (v = !1);
			},
			d(a) {
				ee(i, a), a && l(b), a && l(e);
			}
		}
	);
}
class le extends G {
	constructor(i) {
		super(), H(this, i, null, re, J, {});
	}
}
export { le as default };
