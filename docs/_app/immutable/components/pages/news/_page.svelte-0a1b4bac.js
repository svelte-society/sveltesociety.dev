import {
	S as A,
	i as B,
	s as N,
	v as Z,
	a as T,
	k as _,
	q as b,
	w as z,
	c as U,
	l as v,
	m as w,
	r as x,
	h as s,
	n as C,
	B as F,
	x as H,
	b as p,
	C as L,
	A as M,
	f as R,
	t as V,
	y as k
} from '../../../chunks/index-bbe4a303.js';
import { c as W } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { e as $ } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { c as j } from '../../../chunks/cultproposals-ee6a2386.js';
import { S as I } from '../../../chunks/Seo-482a3acc.js';
import '../../../chunks/stores-a4f9b72b.js';
import '../../../chunks/singletons-96992a38.js';
const P = [
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
function G(f) {
	let r, u, l, c, i, o, d, a, m, h, y, n, q, g;
	return (
		(r = new I({ props: { title: 'CULT News' } })),
		{
			c() {
				Z(r.$$.fragment),
					(u = T()),
					(l = _('h1')),
					(c = b('CULT News')),
					(i = b(`

Everyone is invited to add CULT news via pull request.


`)),
					(o = _('p')),
					(d = _('br')),
					(a = T()),
					(m = _('h3')),
					(h = b("Cultoshi is Optimizing the CULT Mander's Voting Process")),
					(y = T()),
					(n = _('embed')),
					this.h();
			},
			l(t) {
				z(r.$$.fragment, t), (u = U(t)), (l = v(t, 'H1', {}));
				var e = w(l);
				(c = x(e, 'CULT News')),
					e.forEach(s),
					(i = x(
						t,
						`

Everyone is invited to add CULT news via pull request.


`
					)),
					(o = v(t, 'P', {}));
				var D = w(o);
				(d = v(D, 'BR', {})), D.forEach(s), (a = U(t)), (m = v(t, 'H3', {}));
				var O = w(m);
				(h = x(O, "Cultoshi is Optimizing the CULT Mander's Voting Process")),
					O.forEach(s),
					(y = U(t)),
					(n = v(t, 'EMBED', { type: !0, src: !0, width: !0, height: !0 })),
					this.h();
			},
			h() {
				C(n, 'type', 'text/html'),
					F(n.src, (q = 'https://revolt.cultoshi.com/')) || C(n, 'src', q),
					C(n, 'width', '100%'),
					C(n, 'height', '500');
			},
			m(t, e) {
				H(r, t, e),
					p(t, u, e),
					p(t, l, e),
					L(l, c),
					p(t, i, e),
					p(t, o, e),
					L(o, d),
					p(t, a, e),
					p(t, m, e),
					L(m, h),
					p(t, y, e),
					p(t, n, e),
					(g = !0);
			},
			p: M,
			i(t) {
				g || (R(r.$$.fragment, t), (g = !0));
			},
			o(t) {
				V(r.$$.fragment, t), (g = !1);
			},
			d(t) {
				k(r, t),
					t && s(u),
					t && s(l),
					t && s(i),
					t && s(o),
					t && s(a),
					t && s(m),
					t && s(y),
					t && s(n);
			}
		}
	);
}
let E = null,
	S = null;
function J(f, r, u) {
	let l, c;
	$(P, 'tags');
	let i = [];
	[...$(j, 'category')];
	let o = { value: 'stars_desc', label: 'Stars Desc' };
	const d = (a, m) => a.filter((h) => m.includes(h));
	return (
		(f.$$.update = () => {
			f.$$.dirty & 5 &&
				u(
					1,
					(c = P.filter((a) =>
						i.length === 0 && S === null
							? !0
							: !((i.length > 0 && d(i, a.tags).length === 0) || S !== null)
					).sort(W(l)))
				),
				f.$$.dirty & 2 && $(c, 'category');
		}),
		u(2, (l = (o == null ? void 0 : o.value) || 'stars_desc')),
		u(0, (i = (E == null ? void 0 : E.map((a) => a.value)) || [])),
		[i, c, l]
	);
}
class rt extends A {
	constructor(r) {
		super(), B(this, r, J, G, N, {});
	}
}
export { rt as default };
