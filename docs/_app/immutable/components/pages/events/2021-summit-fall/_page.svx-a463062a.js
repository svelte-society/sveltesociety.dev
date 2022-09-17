import {
	S as C,
	i as G,
	s as Y,
	Q as k,
	v as j,
	w as Q,
	x as R,
	R as X,
	T as F,
	f as Z,
	t as z,
	y as B,
	X as N,
	k as _,
	q as c,
	a as H,
	l as g,
	m as S,
	r as m,
	h as u,
	c as I,
	n as v,
	b as T,
	C as s,
	A as J
} from '../../../../chunks/index-2fe5515f.js';
import { E as K } from '../../../../chunks/EventPage-fd8f6a04.js';
import '../../../../chunks/Seo-535b3afa.js';
import '../../../../chunks/stores-26df9a41.js';
import '../../../../chunks/singletons-c19c8c00.js';
function L(f) {
	let e, o, l, d, t, a, p, b, y, r, x, h, $, E;
	return {
		c() {
			(e = _('p')),
				(o = c(
					'Svelte Summit is an event dedicated to Svelte and everything that is happening in the community. The event will be a day of (exclusive) talks streamed online, syndicated on various platforms including '
				)),
				(l = _('a')),
				(d = c('YouTube')),
				(t = c(
					'. Specific discussions about the talks and water-cooler chit-chat will happen live in the '
				)),
				(a = _('a')),
				(p = c('Svelte Discord server')),
				(b = c('. The fall event this year will take place on Nov 20th.')),
				(y = H()),
				(r = _('p')),
				(x = c('Get more information on the ')),
				(h = _('a')),
				($ = c('Svelte Fall Summit 2021 website')),
				(E = c(' and signup to the mailing list!')),
				this.h();
		},
		l(n) {
			e = g(n, 'P', {});
			var i = S(e);
			(o = m(
				i,
				'Svelte Summit is an event dedicated to Svelte and everything that is happening in the community. The event will be a day of (exclusive) talks streamed online, syndicated on various platforms including '
			)),
				(l = g(i, 'A', { href: !0, rel: !0 }));
			var P = S(l);
			(d = m(P, 'YouTube')),
				P.forEach(u),
				(t = m(
					i,
					'. Specific discussions about the talks and water-cooler chit-chat will happen live in the '
				)),
				(a = g(i, 'A', { href: !0, rel: !0 }));
			var A = S(a);
			(p = m(A, 'Svelte Discord server')),
				A.forEach(u),
				(b = m(i, '. The fall event this year will take place on Nov 20th.')),
				i.forEach(u),
				(y = I(n)),
				(r = g(n, 'P', {}));
			var w = S(r);
			(x = m(w, 'Get more information on the ')), (h = g(w, 'A', { href: !0, rel: !0 }));
			var D = S(h);
			($ = m(D, 'Svelte Fall Summit 2021 website')),
				D.forEach(u),
				(E = m(w, ' and signup to the mailing list!')),
				w.forEach(u),
				this.h();
		},
		h() {
			v(l, 'href', 'https://youtube.com/SvelteSociety'),
				v(l, 'rel', 'nofollow'),
				v(a, 'href', 'https://discord.gg/daNtanDmsE'),
				v(a, 'rel', 'nofollow'),
				v(h, 'href', 'https://sveltesummit.com/'),
				v(h, 'rel', 'nofollow');
		},
		m(n, i) {
			T(n, e, i),
				s(e, o),
				s(e, l),
				s(l, d),
				s(e, t),
				s(e, a),
				s(a, p),
				s(e, b),
				T(n, y, i),
				T(n, r, i),
				s(r, x),
				s(r, h),
				s(h, $),
				s(r, E);
		},
		p: J,
		d(n) {
			n && u(e), n && u(y), n && u(r);
		}
	};
}
function M(f) {
	let e, o;
	const l = [f[0], q];
	let d = { $$slots: { default: [L] }, $$scope: { ctx: f } };
	for (let t = 0; t < l.length; t += 1) d = k(d, l[t]);
	return (
		(e = new K({ props: d })),
		{
			c() {
				j(e.$$.fragment);
			},
			l(t) {
				Q(e.$$.fragment, t);
			},
			m(t, a) {
				R(e, t, a), (o = !0);
			},
			p(t, [a]) {
				const p = a & 1 ? X(l, [a & 1 && F(t[0]), a & 0 && F(q)]) : {};
				a & 2 && (p.$$scope = { dirty: a, ctx: t }), e.$set(p);
			},
			i(t) {
				o || (Z(e.$$.fragment, t), (o = !0));
			},
			o(t) {
				z(e.$$.fragment, t), (o = !1);
			},
			d(t) {
				B(e, t);
			}
		}
	);
}
const q = {
	title: '\u{1F341} Svelte Summit Fall 2021',
	layout: 'eventPage',
	date: '2021-11-20T00:00:00.000Z'
};
function O(f, e, o) {
	return (
		(f.$$set = (l) => {
			o(0, (e = k(k({}, e), N(l))));
		}),
		(e = N(e)),
		[e]
	);
}
class ae extends C {
	constructor(e) {
		super(), G(this, e, O, M, Y, {});
	}
}
export { ae as default, q as metadata };
