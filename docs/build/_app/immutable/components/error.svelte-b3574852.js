import {
	S as w,
	i as y,
	s as z,
	k as E,
	q as b,
	a as C,
	e as A,
	l as d,
	m as P,
	r as R,
	h as m,
	c as N,
	b as _,
	C as $,
	u as q,
	A as H,
	E as B
} from '../chunks/index-2fad9c0c.js';
import { p as D } from '../chunks/stores-fe9ed232.js';
import '../chunks/singletons-90aa6b4a.js';
function h(p) {
	let r,
		a = p[0].error.frame + '',
		f;
	return {
		c() {
			(r = E('pre')), (f = b(a));
		},
		l(l) {
			r = d(l, 'PRE', {});
			var s = P(r);
			(f = R(s, a)), s.forEach(m);
		},
		m(l, s) {
			_(l, r, s), $(r, f);
		},
		p(l, s) {
			s & 1 && a !== (a = l[0].error.frame + '') && q(f, a);
		},
		d(l) {
			l && m(r);
		}
	};
}
function j(p) {
	let r,
		a = p[0].error.stack + '',
		f;
	return {
		c() {
			(r = E('pre')), (f = b(a));
		},
		l(l) {
			r = d(l, 'PRE', {});
			var s = P(r);
			(f = R(s, a)), s.forEach(m);
		},
		m(l, s) {
			_(l, r, s), $(r, f);
		},
		p(l, s) {
			s & 1 && a !== (a = l[0].error.stack + '') && q(f, a);
		},
		d(l) {
			l && m(r);
		}
	};
}
function F(p) {
	let r,
		a = p[0].status + '',
		f,
		l,
		s,
		c = p[0].error.message + '',
		k,
		v,
		u,
		n,
		t = p[0].error.frame && h(p),
		i = p[0].error.stack && j(p);
	return {
		c() {
			(r = E('h1')),
				(f = b(a)),
				(l = C()),
				(s = E('pre')),
				(k = b(c)),
				(v = C()),
				t && t.c(),
				(u = C()),
				i && i.c(),
				(n = A());
		},
		l(e) {
			r = d(e, 'H1', {});
			var o = P(r);
			(f = R(o, a)), o.forEach(m), (l = N(e)), (s = d(e, 'PRE', {}));
			var S = P(s);
			(k = R(S, c)), S.forEach(m), (v = N(e)), t && t.l(e), (u = N(e)), i && i.l(e), (n = A());
		},
		m(e, o) {
			_(e, r, o),
				$(r, f),
				_(e, l, o),
				_(e, s, o),
				$(s, k),
				_(e, v, o),
				t && t.m(e, o),
				_(e, u, o),
				i && i.m(e, o),
				_(e, n, o);
		},
		p(e, [o]) {
			o & 1 && a !== (a = e[0].status + '') && q(f, a),
				o & 1 && c !== (c = e[0].error.message + '') && q(k, c),
				e[0].error.frame
					? t
						? t.p(e, o)
						: ((t = h(e)), t.c(), t.m(u.parentNode, u))
					: t && (t.d(1), (t = null)),
				e[0].error.stack
					? i
						? i.p(e, o)
						: ((i = j(e)), i.c(), i.m(n.parentNode, n))
					: i && (i.d(1), (i = null));
		},
		i: H,
		o: H,
		d(e) {
			e && m(r), e && m(l), e && m(s), e && m(v), t && t.d(e), e && m(u), i && i.d(e), e && m(n);
		}
	};
}
function G(p, r, a) {
	let f;
	return B(p, D, (l) => a(0, (f = l))), [f];
}
class L extends w {
	constructor(r) {
		super(), y(this, r, G, F, z, {});
	}
}
export { L as default };