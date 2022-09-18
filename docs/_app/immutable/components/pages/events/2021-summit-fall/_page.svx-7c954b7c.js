import {
	S as C,
	i as G,
	s as Y,
	N as T,
	v as j,
	w as O,
	x as Q,
	O as Z,
	P as D,
	f as z,
	t as B,
	y as H,
	Q as F,
	k as _,
	q as c,
	a as I,
	l as g,
	m as S,
	r as m,
	h as u,
	c as J,
	n as v,
	b as k,
	C as s,
	A as K
} from '../../../../chunks/index-bbe4a303.js';
import { E as L } from '../../../../chunks/EventPage-0034f771.js';
import '../../../../chunks/Seo-77474002.js';
import '../../../../chunks/stores-cf161ab2.js';
import '../../../../chunks/singletons-12333840.js';
function M(f) {
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
				(y = I()),
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
				(y = J(n)),
				(r = g(n, 'P', {}));
			var w = S(r);
			(x = m(w, 'Get more information on the ')), (h = g(w, 'A', { href: !0, rel: !0 }));
			var N = S(h);
			($ = m(N, 'Svelte Fall Summit 2021 website')),
				N.forEach(u),
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
			k(n, e, i),
				s(e, o),
				s(e, l),
				s(l, d),
				s(e, t),
				s(e, a),
				s(a, p),
				s(e, b),
				k(n, y, i),
				k(n, r, i),
				s(r, x),
				s(r, h),
				s(h, $),
				s(r, E);
		},
		p: K,
		d(n) {
			n && u(e), n && u(y), n && u(r);
		}
	};
}
function R(f) {
	let e, o;
	const l = [f[0], q];
	let d = { $$slots: { default: [M] }, $$scope: { ctx: f } };
	for (let t = 0; t < l.length; t += 1) d = T(d, l[t]);
	return (
		(e = new L({ props: d })),
		{
			c() {
				j(e.$$.fragment);
			},
			l(t) {
				O(e.$$.fragment, t);
			},
			m(t, a) {
				Q(e, t, a), (o = !0);
			},
			p(t, [a]) {
				const p = a & 1 ? Z(l, [a & 1 && D(t[0]), a & 0 && D(q)]) : {};
				a & 2 && (p.$$scope = { dirty: a, ctx: t }), e.$set(p);
			},
			i(t) {
				o || (z(e.$$.fragment, t), (o = !0));
			},
			o(t) {
				B(e.$$.fragment, t), (o = !1);
			},
			d(t) {
				H(e, t);
			}
		}
	);
}
const q = {
	title: '\u{1F341} Svelte Summit Fall 2021',
	layout: 'eventPage',
	date: '2021-11-20T00:00:00.000Z'
};
function U(f, e, o) {
	return (
		(f.$$set = (l) => {
			o(0, (e = T(T({}, e), F(l))));
		}),
		(e = F(e)),
		[e]
	);
}
class ae extends C {
	constructor(e) {
		super(), G(this, e, U, R, Y, {});
	}
}
export { ae as default, q as metadata };
