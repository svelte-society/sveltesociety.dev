import {
	S as Y,
	i as Z,
	s as tt,
	v as et,
	a as v,
	k as l,
	q as D,
	w as rt,
	c as P,
	l as s,
	m as g,
	r as T,
	h as d,
	n as h,
	B as W,
	x as at,
	b as X,
	C as e,
	A as lt,
	f as st,
	t as ot,
	y as nt
} from '../../../chunks/index-bbe4a303.js';
import { c as ct } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { c as M } from '../../../chunks/cultproposals-ee6a2386.js';
import { e as H } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as it } from '../../../chunks/Seo-5a17de65.js';
import '../../../chunks/stores-61a038a2.js';
import '../../../chunks/singletons-37366631.js';
function ut(y) {
	let o, c, t, i, u, p, m, E, n, f, w, U, x, q, L, _, j, R, B, S, A, b, z, k, C, F, $;
	return (
		(o = new it({ props: { title: 'cultproposals' } })),
		{
			c() {
				et(o.$$.fragment),
					(c = v()),
					(t = l('div')),
					(i = l('h2')),
					(u = D('CULT Protocol Proposals')),
					(p = v()),
					(m = l('p')),
					(E = l('br')),
					(n = D(`
	Feel free to submit your own`)),
					(f = l('a')),
					(w = D('CULT Protocol Proposal')),
					(U = D(`.

	`)),
					(x = l('p')),
					(q = l('br')),
					(L = v()),
					(_ = l('embed')),
					(R = v()),
					(B = l('p')),
					(S = l('br')),
					(A = v()),
					(b = l('embed')),
					(k = v()),
					(C = l('p')),
					(F = l('br')),
					this.h();
			},
			l(a) {
				rt(o.$$.fragment, a), (c = P(a)), (t = s(a, 'DIV', { class: !0 }));
				var r = g(t);
				i = s(r, 'H2', {});
				var G = g(i);
				(u = T(G, 'CULT Protocol Proposals')), G.forEach(d), (p = P(r)), (m = s(r, 'P', {}));
				var J = g(m);
				(E = s(J, 'BR', {})),
					J.forEach(d),
					(n = T(
						r,
						`
	Feel free to submit your own`
					)),
					(f = s(r, 'A', { href: !0, target: !0 }));
				var K = g(f);
				(w = T(K, 'CULT Protocol Proposal')),
					K.forEach(d),
					(U = T(
						r,
						`.

	`
					)),
					(x = s(r, 'P', {}));
				var N = g(x);
				(q = s(N, 'BR', {})),
					N.forEach(d),
					(L = P(r)),
					(_ = s(r, 'EMBED', { src: !0, width: !0, height: !0 })),
					(R = P(r)),
					(B = s(r, 'P', {}));
				var O = g(B);
				(S = s(O, 'BR', {})),
					O.forEach(d),
					(A = P(r)),
					(b = s(r, 'EMBED', { src: !0, width: !0, height: !0 })),
					(k = P(r)),
					(C = s(r, 'P', {}));
				var Q = g(C);
				(F = s(Q, 'BR', {})), Q.forEach(d), r.forEach(d), this.h();
			},
			h() {
				h(f, 'href', 'https://app.cultdao.io/submitProposal'),
					h(f, 'target', '_blank'),
					W(
						_.src,
						(j = 'https://dune.com/embeds/1280952/2194860/16501603-2aca-4a78-bb92-ddcd9ddedcb6')
					) || h(_, 'src', j),
					h(_, 'width', '100%'),
					h(_, 'height', '1000'),
					W(
						b.src,
						(z = 'https://dune.com/embeds/1280936/2194836/18828c7c-899f-487e-bc10-779fee1f1026')
					) || h(b, 'src', z),
					h(b, 'width', '100%'),
					h(b, 'height', '200'),
					h(t, 'class', 'text-center');
			},
			m(a, r) {
				at(o, a, r),
					X(a, c, r),
					X(a, t, r),
					e(t, i),
					e(i, u),
					e(t, p),
					e(t, m),
					e(m, E),
					e(t, n),
					e(t, f),
					e(f, w),
					e(t, U),
					e(t, x),
					e(x, q),
					e(t, L),
					e(t, _),
					e(t, R),
					e(t, B),
					e(B, S),
					e(t, A),
					e(t, b),
					e(t, k),
					e(t, C),
					e(C, F),
					($ = !0);
			},
			p: lt,
			i(a) {
				$ || (st(o.$$.fragment, a), ($ = !0));
			},
			o(a) {
				ot(o.$$.fragment, a), ($ = !1);
			},
			d(a) {
				nt(o, a), a && d(c), a && d(t);
			}
		}
	);
}
let I = null,
	V = null;
function pt(y, o, c) {
	let t, i;
	H(M, 'tags');
	let u = [];
	[...H(M, 'category')];
	let p = null,
		m = { value: 'stars_desc', label: 'Stars Desc' };
	const E = (n, f) => n.filter((w) => f.includes(w));
	return (
		(y.$$.update = () => {
			y.$$.dirty & 11 &&
				c(
					2,
					(i = M.filter((n) =>
						u.length === 0 && p === null
							? !0
							: !((u.length > 0 && E(u, n.tags).length === 0) || (p !== null && n.category !== p))
					).sort(ct(t)))
				),
				y.$$.dirty & 4 && H(i, 'category');
		}),
		c(3, (t = (m == null ? void 0 : m.value) || 'stars_desc')),
		c(1, (p = (V == null ? void 0 : V.value) || null)),
		c(0, (u = (I == null ? void 0 : I.map((n) => n.value)) || [])),
		[u, p, i, t]
	);
}
class vt extends Y {
	constructor(o) {
		super(), Z(this, o, pt, ut, tt, {});
	}
}
export { vt as default };
