import {
	S as P,
	i as q,
	s as z,
	v as A,
	a as x,
	k as s,
	q as C,
	w as B,
	c as E,
	l as i,
	m as d,
	r as M,
	h as l,
	n as T,
	x as I,
	b as U,
	C as a,
	A as R,
	f as D,
	t as H,
	y as N
} from '../../../chunks/index-2fad9c0c.js';
import { S as V } from '../../../chunks/Seo-6f305d95.js';
import '../../../chunks/stores-8e12cdcd.js';
import '../../../chunks/singletons-117469f9.js';
function j(W) {
	let o, f, t, m, u, v, p, g, k, n, y, c, $, b, h;
	return (
		(o = new V({ props: { title: 'CULT Markets', description: 'CULT Markets' } })),
		{
			c() {
				A(o.$$.fragment),
					(f = x()),
					(t = s('div')),
					(m = s('h2')),
					(u = C('CULT Markets')),
					(v = x()),
					(p = s('p')),
					(g = s('br')),
					(k = x()),
					(n = s('main')),
					(y = C(`We'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and to encourage
		freedom.

		`)),
					(c = s('p')),
					($ = s('br')),
					(b = C(`

		We'll also promote other freedom supporting markets here, while introducing community based (aka
		decentralized) content moderation.`)),
					this.h();
			},
			l(e) {
				B(o.$$.fragment, e), (f = E(e)), (t = i(e, 'DIV', { class: !0 }));
				var r = d(t);
				m = i(r, 'H2', {});
				var w = d(m);
				(u = M(w, 'CULT Markets')), w.forEach(l), (v = E(r)), (p = i(r, 'P', {}));
				var L = d(p);
				(g = i(L, 'BR', {})), L.forEach(l), (k = E(r)), (n = i(r, 'MAIN', { class: !0 }));
				var _ = d(n);
				(y = M(
					_,
					`We'll promote peer 2 peer fiat on off ramps here - to avoid dictatorship and to encourage
		freedom.

		`
				)),
					(c = i(_, 'P', {}));
				var S = d(c);
				($ = i(S, 'BR', {})),
					S.forEach(l),
					(b = M(
						_,
						`

		We'll also promote other freedom supporting markets here, while introducing community based (aka
		decentralized) content moderation.`
					)),
					_.forEach(l),
					r.forEach(l),
					this.h();
			},
			h() {
				T(n, 'class', 'svelte-17n4g9v'), T(t, 'class', 'text-center');
			},
			m(e, r) {
				I(o, e, r),
					U(e, f, r),
					U(e, t, r),
					a(t, m),
					a(m, u),
					a(t, v),
					a(t, p),
					a(p, g),
					a(t, k),
					a(t, n),
					a(n, y),
					a(n, c),
					a(c, $),
					a(n, b),
					(h = !0);
			},
			p: R,
			i(e) {
				h || (D(o.$$.fragment, e), (h = !0));
			},
			o(e) {
				H(o.$$.fragment, e), (h = !1);
			},
			d(e) {
				N(o, e), e && l(f), e && l(t);
			}
		}
	);
}
class O extends P {
	constructor(o) {
		super(), q(this, o, null, j, z, {});
	}
}
export { O as default };
