import {
	S as T,
	i as U,
	s as j,
	v as z,
	a as w,
	k as n,
	q as G,
	w as I,
	c as x,
	l as p,
	m as S,
	h as l,
	r as J,
	B as H,
	n as v,
	x as K,
	b as u,
	C as P,
	A as L,
	f as N,
	t as O,
	y as Q
} from '../../../chunks/index-bbe4a303.js';
import { c as V } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { c as A } from '../../../chunks/cultproposals-ee6a2386.js';
import { e as C } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as W } from '../../../chunks/Seo-f754fc40.js';
import '../../../chunks/stores-898e1727.js';
import '../../../chunks/singletons-751b57d5.js';
function X(y) {
	let a, m, s, c, o, i, f, _, t, E, b, d, q, $, h, D, B;
	return (
		(a = new W({ props: { title: 'cultproposals' } })),
		{
			c() {
				z(a.$$.fragment),
					(m = w()),
					(s = n('embed')),
					(o = w()),
					(i = n('p')),
					(f = n('br')),
					(_ = w()),
					(t = n('embed')),
					(b = w()),
					(d = n('p')),
					(q = n('br')),
					($ = w()),
					(h = n('h1')),
					(D = G('Further information will be provided soon.')),
					this.h();
			},
			l(e) {
				I(a.$$.fragment, e),
					(m = x(e)),
					(s = p(e, 'EMBED', { src: !0, width: !0, height: !0 })),
					(o = x(e)),
					(i = p(e, 'P', {}));
				var r = S(i);
				(f = p(r, 'BR', {})),
					r.forEach(l),
					(_ = x(e)),
					(t = p(e, 'EMBED', { src: !0, width: !0, height: !0 })),
					(b = x(e)),
					(d = p(e, 'P', {}));
				var R = S(d);
				(q = p(R, 'BR', {})), R.forEach(l), ($ = x(e)), (h = p(e, 'H1', {}));
				var k = S(h);
				(D = J(k, 'Further information will be provided soon.')), k.forEach(l), this.h();
			},
			h() {
				H(
					s.src,
					(c = 'https://dune.com/embeds/1280936/2194836/18828c7c-899f-487e-bc10-779fee1f1026')
				) || v(s, 'src', c),
					v(s, 'width', '100%'),
					v(s, 'height', '200'),
					H(
						t.src,
						(E = 'https://dune.com/embeds/1280952/2194860/16501603-2aca-4a78-bb92-ddcd9ddedcb6')
					) || v(t, 'src', E),
					v(t, 'width', '100%'),
					v(t, 'height', '1000');
			},
			m(e, r) {
				K(a, e, r),
					u(e, m, r),
					u(e, s, r),
					u(e, o, r),
					u(e, i, r),
					P(i, f),
					u(e, _, r),
					u(e, t, r),
					u(e, b, r),
					u(e, d, r),
					P(d, q),
					u(e, $, r),
					u(e, h, r),
					P(h, D),
					(B = !0);
			},
			p: L,
			i(e) {
				B || (N(a.$$.fragment, e), (B = !0));
			},
			o(e) {
				O(a.$$.fragment, e), (B = !1);
			},
			d(e) {
				Q(a, e),
					e && l(m),
					e && l(s),
					e && l(o),
					e && l(i),
					e && l(_),
					e && l(t),
					e && l(b),
					e && l(d),
					e && l($),
					e && l(h);
			}
		}
	);
}
let F = null,
	M = null;
function Y(y, a, m) {
	let s, c;
	C(A, 'tags');
	let o = [];
	[...C(A, 'category')];
	let i = null,
		f = { value: 'stars_desc', label: 'Stars Desc' };
	const _ = (t, E) => t.filter((b) => E.includes(b));
	return (
		(y.$$.update = () => {
			y.$$.dirty & 11 &&
				m(
					2,
					(c = A.filter((t) =>
						o.length === 0 && i === null
							? !0
							: !((o.length > 0 && _(o, t.tags).length === 0) || (i !== null && t.category !== i))
					).sort(V(s)))
				),
				y.$$.dirty & 4 && C(c, 'category');
		}),
		m(3, (s = (f == null ? void 0 : f.value) || 'stars_desc')),
		m(1, (i = (M == null ? void 0 : M.value) || null)),
		m(0, (o = (F == null ? void 0 : F.map((t) => t.value)) || [])),
		[o, i, c, s]
	);
}
class ie extends T {
	constructor(a) {
		super(), U(this, a, Y, X, j, {});
	}
}
export { ie as default };
