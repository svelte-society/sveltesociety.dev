import {
	S as b,
	i as S,
	s as H,
	k as c,
	K as C,
	l as u,
	h as r,
	n as e,
	C as l,
	A as y,
	E as k
} from './index-2fad9c0c.js';
import { p as q } from './stores-5c626af5.js';
function z(a) {
	let i, o, d, h, _, f, g, s, n, A, E, T, w, v, M;
	return (
		(document.title = i = a[0] + ' - ' + p),
		{
			c() {
				(o = c('meta')),
					(d = c('meta')),
					(h = c('meta')),
					(f = c('meta')),
					(g = c('meta')),
					(s = c('meta')),
					(n = c('meta')),
					(A = c('meta')),
					(E = c('meta')),
					(T = c('meta')),
					(w = c('meta')),
					(M = c('meta')),
					this.h();
			},
			l(m) {
				const t = C('[data-svelte="svelte-1h4pbpd"]', document.head);
				(o = u(t, 'META', { name: !0, content: !0 })),
					(d = u(t, 'META', { property: !0, content: !0 })),
					(h = u(t, 'META', { property: !0, content: !0 })),
					(f = u(t, 'META', { property: !0, content: !0 })),
					(g = u(t, 'META', { property: !0, content: !0 })),
					(s = u(t, 'META', { property: !0, name: !0, content: !0 })),
					(n = u(t, 'META', { name: !0, content: !0 })),
					(A = u(t, 'META', { name: !0, content: !0 })),
					(E = u(t, 'META', { name: !0, content: !0 })),
					(T = u(t, 'META', { name: !0, content: !0 })),
					(w = u(t, 'META', { name: !0, content: !0 })),
					(M = u(t, 'META', { name: !0, content: !0 })),
					t.forEach(r),
					this.h();
			},
			h() {
				e(o, 'name', 'description'),
					e(o, 'content', a[1]),
					e(d, 'property', 'og:type'),
					e(d, 'content', 'website'),
					e(h, 'property', 'og:title'),
					e(h, 'content', (_ = `${a[0]} - ${p}`)),
					e(f, 'property', 'og:site_name'),
					e(f, 'content', p),
					e(g, 'property', 'og:description'),
					e(g, 'content', a[1]),
					e(s, 'property', 'og:image'),
					e(s, 'name', 'og:image'),
					e(s, 'content', a[2]),
					e(n, 'name', 'og:url'),
					e(n, 'content', a[3]),
					e(A, 'name', 'twitter:site'),
					e(A, 'content', a[4]),
					e(E, 'name', 'twitter:image'),
					e(E, 'content', a[2]),
					e(T, 'name', 'twitter:card'),
					e(T, 'content', 'summary_large_image'),
					e(w, 'name', 'twitter:title'),
					e(w, 'content', (v = `${a[0]} - ${p}`)),
					e(M, 'name', 'twitter:description'),
					e(M, 'content', a[1]);
			},
			m(m, t) {
				l(document.head, o),
					l(document.head, d),
					l(document.head, h),
					l(document.head, f),
					l(document.head, g),
					l(document.head, s),
					l(document.head, n),
					l(document.head, A),
					l(document.head, E),
					l(document.head, T),
					l(document.head, w),
					l(document.head, M);
			},
			p(m, [t]) {
				t & 1 && i !== (i = m[0] + ' - ' + p) && (document.title = i),
					t & 2 && e(o, 'content', m[1]),
					t & 1 && _ !== (_ = `${m[0]} - ${p}`) && e(h, 'content', _),
					t & 2 && e(g, 'content', m[1]),
					t & 4 && e(s, 'content', m[2]),
					t & 8 && e(n, 'content', m[3]),
					t & 16 && e(A, 'content', m[4]),
					t & 4 && e(E, 'content', m[2]),
					t & 1 && v !== (v = `${m[0]} - ${p}`) && e(w, 'content', v),
					t & 2 && e(M, 'content', m[1]);
			},
			i: y,
			o: y,
			d(m) {
				r(o), r(d), r(h), r(f), r(g), r(s), r(n), r(A), r(E), r(T), r(w), r(M);
			}
		}
	);
}
const p = 'CULT Magazine';
function K(a, i, o) {
	let d;
	k(a, q, (n) => o(5, (d = n)));
	let { title: h = p } = i,
		{
			description: _ = 'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources.'
		} = i,
		{
			image: f = 'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/static/images/metatag.png'
		} = i,
		{ url: g = `https://${d.host}${d.url.pathname}` } = i,
		{ twitterHandle: s = '@sveltesociety' } = i;
	return (
		(a.$$set = (n) => {
			'title' in n && o(0, (h = n.title)),
				'description' in n && o(1, (_ = n.description)),
				'image' in n && o(2, (f = n.image)),
				'url' in n && o(3, (g = n.url)),
				'twitterHandle' in n && o(4, (s = n.twitterHandle));
		}),
		[h, _, f, g, s]
	);
}
class W extends b {
	constructor(i) {
		super(), S(this, i, K, z, H, { title: 0, description: 1, image: 2, url: 3, twitterHandle: 4 });
	}
}
export { W as S };
