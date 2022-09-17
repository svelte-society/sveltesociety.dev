import {
	S as Q,
	i as W,
	s as Z,
	Q as j,
	v as G,
	w as K,
	x as L,
	R as O,
	T as J,
	f as U,
	t as V,
	y as ee,
	X as M,
	k as f,
	q as m,
	a as H,
	l as v,
	m as h,
	r as d,
	h as s,
	c as Y,
	n as i,
	B as te,
	b as S,
	C as u,
	A as ae
} from '../../../../chunks/index-2fe5515f.js';
import { E as re } from '../../../../chunks/EventPage-69577002.js';
import '../../../../chunks/Seo-c98eb7f1.js';
import '../../../../chunks/stores-bd836b2e.js';
import '../../../../chunks/singletons-79537efd.js';
function se(g) {
	let e, c, o, _, a, r, b, T, x, p, A, w, q, z, k, E, D, $, y, n, C;
	return {
		c() {
			(e = f('p')),
				(c = m(
					'Svelte Summit is an event dedicated to Svelte and everything that is happening in the community. The event was a day of (exclusive) pre-recorded talks streamed online, syndicated on various platforms including '
				)),
				(o = f('a')),
				(_ = m('YouTube')),
				(a = m(
					'. Specific discussions about the talks and water-cooler chit-chat happened live in the '
				)),
				(r = f('a')),
				(b = m('Svelte Discord server')),
				(T = m('.')),
				(x = H()),
				(p = f('p')),
				(A = m('Everyone was welcome, to attend and submit a talk at ')),
				(w = f('a')),
				(q = m('sessionize')),
				(z = m(
					'. Svelte Summit reflected the wider Svelte community as an inclusive and supportive space for people to learn and make friends.'
				)),
				(k = H()),
				(E = f('p')),
				(D = m('Here you can rewatch the full livestream:')),
				($ = H()),
				(y = f('p')),
				(n = f('iframe')),
				this.h();
		},
		l(t) {
			e = v(t, 'P', {});
			var l = h(e);
			(c = d(
				l,
				'Svelte Summit is an event dedicated to Svelte and everything that is happening in the community. The event was a day of (exclusive) pre-recorded talks streamed online, syndicated on various platforms including '
			)),
				(o = v(l, 'A', { href: !0, rel: !0 }));
			var F = h(o);
			(_ = d(F, 'YouTube')),
				F.forEach(s),
				(a = d(
					l,
					'. Specific discussions about the talks and water-cooler chit-chat happened live in the '
				)),
				(r = v(l, 'A', { href: !0, rel: !0 }));
			var R = h(r);
			(b = d(R, 'Svelte Discord server')),
				R.forEach(s),
				(T = d(l, '.')),
				l.forEach(s),
				(x = Y(t)),
				(p = v(t, 'P', {}));
			var P = h(p);
			(A = d(P, 'Everyone was welcome, to attend and submit a talk at ')),
				(w = v(P, 'A', { href: !0, rel: !0 }));
			var X = h(w);
			(q = d(X, 'sessionize')),
				X.forEach(s),
				(z = d(
					P,
					'. Svelte Summit reflected the wider Svelte community as an inclusive and supportive space for people to learn and make friends.'
				)),
				P.forEach(s),
				(k = Y(t)),
				(E = v(t, 'P', {}));
			var B = h(E);
			(D = d(B, 'Here you can rewatch the full livestream:')),
				B.forEach(s),
				($ = Y(t)),
				(y = v(t, 'P', { align: !0 }));
			var I = h(y);
			(n = v(I, 'IFRAME', {
				width: !0,
				height: !0,
				src: !0,
				title: !0,
				frameborder: !0,
				allow: !0,
				alt: !0
			})),
				h(n).forEach(s),
				I.forEach(s),
				this.h();
		},
		h() {
			i(o, 'href', 'https://youtube.com/SvelteSociety'),
				i(o, 'rel', 'nofollow'),
				i(r, 'href', 'https://discord.gg/daNtanDmsE'),
				i(r, 'rel', 'nofollow'),
				i(w, 'href', 'https://sessionize.com/svelte-summit-spring-2021'),
				i(w, 'rel', 'nofollow'),
				i(n, 'width', '789'),
				i(n, 'height', '444'),
				te(n.src, (C = 'https://www.youtube.com/embed/fnr9XWvjJHw')) || i(n, 'src', C),
				i(n, 'title', 'YouTube video player'),
				i(n, 'frameborder', '0'),
				i(
					n,
					'allow',
					'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				),
				(n.allowFullscreen = !0),
				i(n, 'alt', 'Summit livestream'),
				i(y, 'align', 'center');
		},
		m(t, l) {
			S(t, e, l),
				u(e, c),
				u(e, o),
				u(o, _),
				u(e, a),
				u(e, r),
				u(r, b),
				u(e, T),
				S(t, x, l),
				S(t, p, l),
				u(p, A),
				u(p, w),
				u(w, q),
				u(p, z),
				S(t, k, l),
				S(t, E, l),
				u(E, D),
				S(t, $, l),
				S(t, y, l),
				u(y, n);
		},
		p: ae,
		d(t) {
			t && s(e), t && s(x), t && s(p), t && s(k), t && s(E), t && s($), t && s(y);
		}
	};
}
function le(g) {
	let e, c;
	const o = [g[0], N];
	let _ = { $$slots: { default: [se] }, $$scope: { ctx: g } };
	for (let a = 0; a < o.length; a += 1) _ = j(_, o[a]);
	return (
		(e = new re({ props: _ })),
		{
			c() {
				G(e.$$.fragment);
			},
			l(a) {
				K(e.$$.fragment, a);
			},
			m(a, r) {
				L(e, a, r), (c = !0);
			},
			p(a, [r]) {
				const b = r & 1 ? O(o, [r & 1 && J(a[0]), r & 0 && J(N)]) : {};
				r & 2 && (b.$$scope = { dirty: r, ctx: a }), e.$set(b);
			},
			i(a) {
				c || (U(e.$$.fragment, a), (c = !0));
			},
			o(a) {
				V(e.$$.fragment, a), (c = !1);
			},
			d(a) {
				ee(e, a);
			}
		}
	);
}
const N = {
	title: 'Svelte Summit Spring 2021',
	layout: 'eventPage',
	date: '2021-04-25T00:00:00.000Z'
};
function ie(g, e, c) {
	return (
		(g.$$set = (o) => {
			c(0, (e = j(j({}, e), M(o))));
		}),
		(e = M(e)),
		[e]
	);
}
class de extends Q {
	constructor(e) {
		super(), W(this, e, ie, le, Z, {});
	}
}
export { de as default, N as metadata };
