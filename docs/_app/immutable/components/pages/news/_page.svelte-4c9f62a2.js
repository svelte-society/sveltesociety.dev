import {
	S as le,
	i as ie,
	s as ce,
	v as de,
	a as m,
	k as s,
	q as b,
	w as ue,
	c as f,
	l as a,
	m as i,
	r as w,
	h as o,
	n as z,
	B as he,
	x as pe,
	b as ae,
	C as t,
	A as me,
	f as fe,
	t as ve,
	y as ge
} from '../../../chunks/index-bbe4a303.js';
import { c as _e } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { e as W } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { c as be } from '../../../chunks/cultproposals-ee6a2386.js';
import { S as we } from '../../../chunks/Seo-a888bbf2.js';
import '../../../chunks/stores-5b1f001a.js';
import '../../../chunks/singletons-0a0fff25.js';
const ne = [
	{
		addedOn: '2021-08-09T10:14:05.723Z',
		title: 'Act of RVLT 973',
		category: 'Designs',
		description: 'Cool designs coming from 973',
		url: 'https://drive.google.com/drive/folders/1uDpzUovNCFh2FRTxFSriiZLIOdAbZWHU',
		tags: ['official'],
		stars: 402
	},
	{
		addedOn: '2021-08-09T10:14:05.723Z',
		title: 'svelte-loader',
		category: 'Bundler Plugins',
		description: 'Webpack loader for svelte components',
		url: 'https://github.com/sveltejs/svelte-loader',
		tags: ['official'],
		stars: 492
	}
];
function ye(y) {
	let l,
		h,
		e,
		c,
		d,
		v,
		g,
		u,
		C,
		_,
		B,
		$,
		p,
		G,
		F,
		T,
		R,
		q,
		U,
		D,
		H,
		E,
		M,
		O,
		P,
		S,
		A,
		L,
		I,
		N,
		x,
		V,
		Z,
		k;
	return (
		(l = new we({ props: { title: 'CULT News' } })),
		{
			c() {
				de(l.$$.fragment),
					(h = m()),
					(e = s('div')),
					(c = s('h1')),
					(d = b('CULT News')),
					(v = b(`

	Everyone is invited to add CULT news via pull request.
	

	`)),
					(g = s('p')),
					(u = s('br')),
					(C = m()),
					(_ = s('h3')),
					(B = b('revolt.cultoshi.com is Optimizing the Voting Process')),
					($ = m()),
					(p = s('embed')),
					(F = m()),
					(T = s('p')),
					(R = s('br')),
					(q = m()),
					(U = s('p')),
					(D = s('br')),
					(H = m()),
					(E = s('h3')),
					(M = b('CULT Chat Feature Under Construction')),
					(O = b(`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`)),
					(P = s('p')),
					(S = s('br')),
					(A = m()),
					(L = s('p')),
					(I = s('br')),
					(N = m()),
					(x = s('h3')),
					(V = b('CULT Market Feature Under Construction')),
					(Z = b(`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`)),
					this.h();
			},
			l(n) {
				ue(l.$$.fragment, n), (h = f(n)), (e = a(n, 'DIV', { class: !0 }));
				var r = i(e);
				c = a(r, 'H1', {});
				var J = i(c);
				(d = w(J, 'CULT News')),
					J.forEach(o),
					(v = w(
						r,
						`

	Everyone is invited to add CULT news via pull request.
	

	`
					)),
					(g = a(r, 'P', {}));
				var K = i(g);
				(u = a(K, 'BR', {})), K.forEach(o), (C = f(r)), (_ = a(r, 'H3', {}));
				var Q = i(_);
				(B = w(Q, 'revolt.cultoshi.com is Optimizing the Voting Process')),
					Q.forEach(o),
					($ = f(r)),
					(p = a(r, 'EMBED', { type: !0, src: !0, width: !0, height: !0 })),
					(F = f(r)),
					(T = a(r, 'P', {}));
				var X = i(T);
				(R = a(X, 'BR', {})), X.forEach(o), (q = f(r)), (U = a(r, 'P', {}));
				var Y = i(U);
				(D = a(Y, 'BR', {})), Y.forEach(o), (H = f(r)), (E = a(r, 'H3', {}));
				var ee = i(E);
				(M = w(ee, 'CULT Chat Feature Under Construction')),
					ee.forEach(o),
					(O = w(
						r,
						`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`
					)),
					(P = a(r, 'P', {}));
				var te = i(P);
				(S = a(te, 'BR', {})), te.forEach(o), (A = f(r)), (L = a(r, 'P', {}));
				var re = i(L);
				(I = a(re, 'BR', {})), re.forEach(o), (N = f(r)), (x = a(r, 'H3', {}));
				var se = i(x);
				(V = w(se, 'CULT Market Feature Under Construction')),
					se.forEach(o),
					(Z = w(
						r,
						`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`
					)),
					r.forEach(o),
					this.h();
			},
			h() {
				z(p, 'type', 'text/html'),
					he(p.src, (G = 'https://revolt.cultoshi.com/')) || z(p, 'src', G),
					z(p, 'width', '100%'),
					z(p, 'height', '1100vh'),
					z(e, 'class', 'text-center');
			},
			m(n, r) {
				pe(l, n, r),
					ae(n, h, r),
					ae(n, e, r),
					t(e, c),
					t(c, d),
					t(e, v),
					t(e, g),
					t(g, u),
					t(e, C),
					t(e, _),
					t(_, B),
					t(e, $),
					t(e, p),
					t(e, F),
					t(e, T),
					t(T, R),
					t(e, q),
					t(e, U),
					t(U, D),
					t(e, H),
					t(e, E),
					t(E, M),
					t(e, O),
					t(e, P),
					t(P, S),
					t(e, A),
					t(e, L),
					t(L, I),
					t(e, N),
					t(e, x),
					t(x, V),
					t(e, Z),
					(k = !0);
			},
			p: me,
			i(n) {
				k || (fe(l.$$.fragment, n), (k = !0));
			},
			o(n) {
				ve(l.$$.fragment, n), (k = !1);
			},
			d(n) {
				ge(l, n), n && o(h), n && o(e);
			}
		}
	);
}
let j = null,
	oe = null;
function Ce(y, l, h) {
	let e, c;
	W(ne, 'tags');
	let d = [];
	[...W(be, 'category')];
	let v = { value: 'stars_desc', label: 'Stars Desc' };
	const g = (u, C) => u.filter((_) => C.includes(_));
	return (
		(y.$$.update = () => {
			y.$$.dirty & 5 &&
				h(
					1,
					(c = ne
						.filter((u) =>
							d.length === 0 && oe === null
								? !0
								: !((d.length > 0 && g(d, u.tags).length === 0) || oe !== null)
						)
						.sort(_e(e)))
				),
				y.$$.dirty & 2 && W(c, 'category');
		}),
		h(2, (e = (v == null ? void 0 : v.value) || 'stars_desc')),
		h(0, (d = (j == null ? void 0 : j.map((u) => u.value)) || [])),
		[d, c, e]
	);
}
class ke extends le {
	constructor(l) {
		super(), ie(this, l, Ce, ye, ce, {});
	}
}
export { ke as default };
