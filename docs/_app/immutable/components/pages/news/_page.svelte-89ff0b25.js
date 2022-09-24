import {
	S as X,
	i as Y,
	s as $,
	k as g,
	q as B,
	l as m,
	m as E,
	r as V,
	h as v,
	n as w,
	a7 as Ct,
	b as z,
	C as c,
	V as Ot,
	a8 as Wt,
	u as J,
	A as yt,
	a as I,
	c as L,
	J as Tt,
	f as R,
	g as ce,
	t as S,
	d as fe,
	v as H,
	w as M,
	x as F,
	y as G,
	D as tt,
	p as lt,
	B as st,
	F as Qe,
	G as Ke,
	H as Xe,
	I as Ye,
	N as he,
	R as $e,
	T as xe,
	O as qt,
	P as jt,
	W as et,
	a9 as Ut,
	Q as Jt,
	U as It
} from '../../../chunks/index-2fad9c0c.js';
import '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { c as Qt, S as Kt } from '../../../chunks/Select-8360dfd8.js';
import { e as We } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as Xt } from '../../../chunks/Seo-aa4aa096.js';
import '../../../chunks/stores-59ef06c0.js';
import '../../../chunks/singletons-1426f67c.js';
function Yt(r) {
	let e, l, t, s, a;
	return {
		c() {
			(e = g('div')), (l = B(r[0])), this.h();
		},
		l(n) {
			e = m(n, 'DIV', { class: !0 });
			var i = E(e);
			(l = V(i, r[0])), i.forEach(v), this.h();
		},
		h() {
			w(e, 'class', (t = Ct(r[1]) + ' svelte-ugev5v'));
		},
		m(n, i) {
			z(n, e, i),
				c(e, l),
				s ||
					((a = Ot(e, 'click', function () {
						Wt(r[2]) && r[2].apply(this, arguments);
					})),
					(s = !0));
		},
		p(n, [i]) {
			(r = n),
				i & 1 && J(l, r[0]),
				i & 2 && t !== (t = Ct(r[1]) + ' svelte-ugev5v') && w(e, 'class', t);
		},
		i: yt,
		o: yt,
		d(n) {
			n && v(e), (s = !1), a();
		}
	};
}
function $t(r, e, l) {
	let { title: t = '' } = e,
		{ variant: s } = e,
		{ click: a = void 0 } = e;
	return (
		(r.$$set = (n) => {
			'title' in n && l(0, (t = n.title)),
				'variant' in n && l(1, (s = n.variant)),
				'click' in n && l(2, (a = n.click));
		}),
		[t, s, a]
	);
}
class Zt extends X {
	constructor(e) {
		super(), Y(this, e, $t, Yt, $, { title: 0, variant: 1, click: 2 });
	}
}
function Lt(r, e, l) {
	const t = r.slice();
	return (t[14] = e[l]), t;
}
function Pt(r) {
	let e, l;
	return (
		(e = new Zt({
			props: {
				click: r[13],
				variant: 'copy',
				title: r[9] ? 'copied!' : `${r[11][r[8]]} ${r[12](r[6])}`
			}
		})),
		{
			c() {
				H(e.$$.fragment);
			},
			l(t) {
				M(e.$$.fragment, t);
			},
			m(t, s) {
				F(e, t, s), (l = !0);
			},
			p(t, s) {
				const a = {};
				s & 832 && (a.title = t[9] ? 'copied!' : `${t[11][t[8]]} ${t[12](t[6])}`), e.$set(a);
			},
			i(t) {
				l || (R(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				S(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				G(e, t);
			}
		}
	);
}
function Rt(r) {
	let e,
		l,
		t = r[3],
		s = [];
	for (let n = 0; n < t.length; n += 1) s[n] = Bt(Lt(r, t, n));
	const a = (n) =>
		S(s[n], 1, 1, () => {
			s[n] = null;
		});
	return {
		c() {
			e = g('div');
			for (let n = 0; n < s.length; n += 1) s[n].c();
			this.h();
		},
		l(n) {
			e = m(n, 'DIV', { class: !0 });
			var i = E(e);
			for (let o = 0; o < s.length; o += 1) s[o].l(i);
			i.forEach(v), this.h();
		},
		h() {
			w(e, 'class', 'card__tags svelte-1p17aya');
		},
		m(n, i) {
			z(n, e, i);
			for (let o = 0; o < s.length; o += 1) s[o].m(e, null);
			l = !0;
		},
		p(n, i) {
			if (i & 8) {
				t = n[3];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const u = Lt(n, t, o);
					s[o]
						? (s[o].p(u, i), R(s[o], 1))
						: ((s[o] = Bt(u)), s[o].c(), R(s[o], 1), s[o].m(e, null));
				}
				for (ce(), o = t.length; o < s.length; o += 1) a(o);
				fe();
			}
		},
		i(n) {
			if (!l) {
				for (let i = 0; i < t.length; i += 1) R(s[i]);
				l = !0;
			}
		},
		o(n) {
			s = s.filter(Boolean);
			for (let i = 0; i < s.length; i += 1) S(s[i]);
			l = !1;
		},
		d(n) {
			n && v(e), tt(s, n);
		}
	};
}
function Bt(r) {
	let e, l;
	return (
		(e = new Zt({ props: { title: r[14], variant: 'blue' } })),
		{
			c() {
				H(e.$$.fragment);
			},
			l(t) {
				M(e.$$.fragment, t);
			},
			m(t, s) {
				F(e, t, s), (l = !0);
			},
			p(t, s) {
				const a = {};
				s & 8 && (a.title = t[14]), e.$set(a);
			},
			i(t) {
				l || (R(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				S(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				G(e, t);
			}
		}
	);
}
function Vt(r) {
	let e, l, t, s, a, n, i, o, u;
	function h(d, C) {
		if (
			(C & 160 && (t = null),
			C & 160 && (s = null),
			t == null && (t = !!(d[7] || d[5]).includes('github')),
			t)
		)
			return el;
		if ((s == null && (s = !!(d[7] || d[5]).includes('gitlab')), s)) return xt;
	}
	let p = h(r, -1),
		f = p && p(r);
	return {
		c() {
			(e = g('div')),
				(l = g('div')),
				f && f.c(),
				(a = I()),
				(n = g('div')),
				(i = B(`\u2605
				`)),
				(o = g('code')),
				(u = B(r[4])),
				this.h();
		},
		l(d) {
			e = m(d, 'DIV', { class: !0 });
			var C = E(e);
			l = m(C, 'DIV', { class: !0 });
			var D = E(l);
			f && f.l(D), D.forEach(v), (a = L(C)), (n = m(C, 'DIV', { class: !0 }));
			var P = E(n);
			(i = V(
				P,
				`\u2605
				`
			)),
				(o = m(P, 'CODE', {}));
			var _ = E(o);
			(u = V(_, r[4])), _.forEach(v), P.forEach(v), C.forEach(v), this.h();
		},
		h() {
			w(l, 'class', 'svelte-1p17aya'),
				w(n, 'class', 'svelte-1p17aya'),
				w(e, 'class', 'card__bottom svelte-1p17aya');
		},
		m(d, C) {
			z(d, e, C), c(e, l), f && f.m(l, null), c(e, a), c(e, n), c(n, i), c(n, o), c(o, u);
		},
		p(d, C) {
			p !== (p = h(d, C)) && (f && f.d(1), (f = p && p(d)), f && (f.c(), f.m(l, null))),
				C & 16 && J(u, d[4]);
		},
		d(d) {
			d && v(e), f && f.d();
		}
	};
}
function xt(r) {
	let e, l;
	return {
		c() {
			(e = g('img')), this.h();
		},
		l(t) {
			(e = m(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			lt(e, 'display', 'inline'),
				st(e.src, (l = '/images/gitlab_logo.svg')) || w(e, 'src', l),
				w(e, 'alt', 'gitlab logo');
		},
		m(t, s) {
			z(t, e, s);
		},
		d(t) {
			t && v(e);
		}
	};
}
function el(r) {
	let e, l;
	return {
		c() {
			(e = g('img')), this.h();
		},
		l(t) {
			(e = m(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			lt(e, 'display', 'inline'),
				st(e.src, (l = '/images/github_logo.svg')) || w(e, 'src', l),
				w(e, 'alt', 'github logo');
		},
		m(t, s) {
			z(t, e, s);
		},
		d(t) {
			t && v(e);
		}
	};
}
function tl(r) {
	let e,
		l,
		t,
		s,
		a,
		n,
		i,
		o,
		u,
		h,
		p,
		f,
		d,
		C,
		D,
		P,
		_ = r[6] && Pt(r),
		k = r[3] && Rt(r),
		y = typeof r[4] < 'u' && Vt(r);
	return {
		c() {
			(e = g('div')),
				(l = g('h3')),
				(t = g('a')),
				(s = B('#')),
				(n = I()),
				(i = g('a')),
				(o = B(r[1])),
				(u = I()),
				_ && _.c(),
				(h = I()),
				(p = g('p')),
				(f = B(r[2])),
				(d = I()),
				k && k.c(),
				(C = I()),
				y && y.c(),
				this.h();
		},
		l(T) {
			e = m(T, 'DIV', { class: !0, id: !0 });
			var U = E(e);
			l = m(U, 'H3', { class: !0 });
			var A = E(l);
			t = m(A, 'A', { href: !0 });
			var Q = E(t);
			(s = V(Q, '#')), Q.forEach(v), (n = L(A)), (i = m(A, 'A', { href: !0 }));
			var O = E(i);
			(o = V(O, r[1])),
				O.forEach(v),
				(u = L(A)),
				_ && _.l(A),
				A.forEach(v),
				(h = L(U)),
				(p = m(U, 'P', { class: !0 }));
			var K = E(p);
			(f = V(K, r[2])),
				K.forEach(v),
				(d = L(U)),
				k && k.l(U),
				(C = L(U)),
				y && y.l(U),
				U.forEach(v),
				this.h();
		},
		h() {
			w(t, 'href', (a = '#component-' + encodeURI(r[1]))),
				w(i, 'href', r[5]),
				w(l, 'class', 'svelte-1p17aya'),
				w(p, 'class', 'flex-grow svelte-1p17aya'),
				w(e, 'class', 'card svelte-1p17aya'),
				w(e, 'id', (D = 'component-' + encodeURI(r[1]))),
				Tt(e, 'active', r[0]);
		},
		m(T, U) {
			z(T, e, U),
				c(e, l),
				c(l, t),
				c(t, s),
				c(l, n),
				c(l, i),
				c(i, o),
				c(l, u),
				_ && _.m(l, null),
				c(e, h),
				c(e, p),
				c(p, f),
				c(e, d),
				k && k.m(e, null),
				c(e, C),
				y && y.m(e, null),
				(P = !0);
		},
		p(T, [U]) {
			(!P || (U & 2 && a !== (a = '#component-' + encodeURI(T[1])))) && w(t, 'href', a),
				(!P || U & 2) && J(o, T[1]),
				(!P || U & 32) && w(i, 'href', T[5]),
				T[6]
					? _
						? (_.p(T, U), U & 64 && R(_, 1))
						: ((_ = Pt(T)), _.c(), R(_, 1), _.m(l, null))
					: _ &&
					  (ce(),
					  S(_, 1, 1, () => {
							_ = null;
					  }),
					  fe()),
				(!P || U & 4) && J(f, T[2]),
				T[3]
					? k
						? (k.p(T, U), U & 8 && R(k, 1))
						: ((k = Rt(T)), k.c(), R(k, 1), k.m(e, C))
					: k &&
					  (ce(),
					  S(k, 1, 1, () => {
							k = null;
					  }),
					  fe()),
				typeof T[4] < 'u'
					? y
						? y.p(T, U)
						: ((y = Vt(T)), y.c(), y.m(e, null))
					: y && (y.d(1), (y = null)),
				(!P || (U & 2 && D !== (D = 'component-' + encodeURI(T[1])))) && w(e, 'id', D),
				U & 1 && Tt(e, 'active', T[0]);
		},
		i(T) {
			P || (R(_), R(k), (P = !0));
		},
		o(T) {
			S(_), S(k), (P = !1);
		},
		d(T) {
			T && v(e), _ && _.d(), k && k.d(), y && y.d();
		}
	};
}
function ll(r, e, l) {
	let { active: t = !1 } = e,
		{ title: s = '' } = e,
		{ description: a = '' } = e,
		{ tags: n = [] } = e,
		{ stars: i } = e,
		{ url: o = '' } = e,
		{ npm: u = '' } = e,
		{ repo: h = '' } = e,
		{ manager: p = 'npm' } = e,
		f = !1;
	const d = () => {
			Qt(`${C[p]} ${D(u)}`).then(() => l(9, (f = !1))), l(9, (f = !0));
		},
		C = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' },
		D = (_) => _.replace('https://www.npmjs.com/package/', ''),
		P = () => d();
	return (
		(r.$$set = (_) => {
			'active' in _ && l(0, (t = _.active)),
				'title' in _ && l(1, (s = _.title)),
				'description' in _ && l(2, (a = _.description)),
				'tags' in _ && l(3, (n = _.tags)),
				'stars' in _ && l(4, (i = _.stars)),
				'url' in _ && l(5, (o = _.url)),
				'npm' in _ && l(6, (u = _.npm)),
				'repo' in _ && l(7, (h = _.repo)),
				'manager' in _ && l(8, (p = _.manager));
		}),
		[t, s, a, n, i, o, u, h, p, f, d, C, D, P]
	);
}
class sl extends X {
	constructor(e) {
		super(),
			Y(this, e, ll, tl, $, {
				active: 0,
				title: 1,
				description: 2,
				tags: 3,
				stars: 4,
				url: 5,
				npm: 6,
				repo: 7,
				manager: 8
			});
	}
}
function nl(r) {
	let e, l, t, s, a, n, i, o, u, h;
	const p = r[3].default,
		f = Qe(p, r, r[2], null);
	return {
		c() {
			(e = g('div')),
				(l = g('h1')),
				(t = B(r[0])),
				(s = I()),
				(a = g('a')),
				(n = B('#')),
				(o = I()),
				(u = g('div')),
				f && f.c(),
				this.h();
		},
		l(d) {
			e = m(d, 'DIV', { class: !0 });
			var C = E(e);
			l = m(C, 'H1', { id: !0, class: !0 });
			var D = E(l);
			(t = V(D, r[0])), (s = L(D)), (a = m(D, 'A', { href: !0 }));
			var P = E(a);
			(n = V(P, '#')), P.forEach(v), D.forEach(v), (o = L(C)), (u = m(C, 'DIV', { class: !0 }));
			var _ = E(u);
			f && f.l(_), _.forEach(v), C.forEach(v), this.h();
		},
		h() {
			w(a, 'href', (i = '#' + r[1])),
				w(l, 'id', r[1]),
				w(l, 'class', 'svelte-6ivwg1'),
				w(u, 'class', 'grid svelte-6ivwg1'),
				w(e, 'class', 'list svelte-6ivwg1');
		},
		m(d, C) {
			z(d, e, C),
				c(e, l),
				c(l, t),
				c(l, s),
				c(l, a),
				c(a, n),
				c(e, o),
				c(e, u),
				f && f.m(u, null),
				(h = !0);
		},
		p(d, [C]) {
			(!h || C & 1) && J(t, d[0]),
				(!h || (C & 2 && i !== (i = '#' + d[1]))) && w(a, 'href', i),
				(!h || C & 2) && w(l, 'id', d[1]),
				f && f.p && (!h || C & 4) && Ke(f, p, d, d[2], h ? Ye(p, d[2], C, null) : Xe(d[2]), null);
		},
		i(d) {
			h || (R(f, d), (h = !0));
		},
		o(d) {
			S(f, d), (h = !1);
		},
		d(d) {
			d && v(e), f && f.d(d);
		}
	};
}
function rl(r, e, l) {
	let { $$slots: t = {}, $$scope: s } = e,
		{ title: a } = e,
		{ id: n = `category-${encodeURI(a)}` } = e;
	return (
		(r.$$set = (i) => {
			'title' in i && l(0, (a = i.title)),
				'id' in i && l(1, (n = i.id)),
				'$$scope' in i && l(2, (s = i.$$scope));
		}),
		[a, n, s, t]
	);
}
class il extends X {
	constructor(e) {
		super(), Y(this, e, rl, nl, $, { title: 0, id: 1 });
	}
}
function Dt(r) {
	let e, l;
	return {
		c() {
			(e = g('span')), (l = B(r[1])), this.h();
		},
		l(t) {
			e = m(t, 'SPAN', { class: !0 });
			var s = E(e);
			(l = V(s, r[1])), s.forEach(v), this.h();
		},
		h() {
			w(e, 'class', 'svelte-phe5gt');
		},
		m(t, s) {
			z(t, e, s), c(e, l);
		},
		p(t, s) {
			s & 2 && J(l, t[1]);
		},
		d(t) {
			t && v(e);
		}
	};
}
function al(r) {
	let e,
		l,
		t,
		s,
		a,
		n = r[1] && Dt(r);
	const i = [{ containerClasses: 'select-container' }, r[2]];
	function o(h) {
		r[3](h);
	}
	let u = {};
	for (let h = 0; h < i.length; h += 1) u = he(u, i[h]);
	return (
		r[0] !== void 0 && (u.value = r[0]),
		(t = new Kt({ props: u })),
		$e.push(() => xe(t, 'value', o)),
		{
			c() {
				(e = g('div')), n && n.c(), (l = I()), H(t.$$.fragment), this.h();
			},
			l(h) {
				e = m(h, 'DIV', { class: !0 });
				var p = E(e);
				n && n.l(p), (l = L(p)), M(t.$$.fragment, p), p.forEach(v), this.h();
			},
			h() {
				w(e, 'class', 'themed svelte-phe5gt');
			},
			m(h, p) {
				z(h, e, p), n && n.m(e, null), c(e, l), F(t, e, null), (a = !0);
			},
			p(h, [p]) {
				h[1] ? (n ? n.p(h, p) : ((n = Dt(h)), n.c(), n.m(e, l))) : n && (n.d(1), (n = null));
				const f = p & 4 ? qt(i, [i[0], jt(h[2])]) : {};
				!s && p & 1 && ((s = !0), (f.value = h[0]), et(() => (s = !1))), t.$set(f);
			},
			i(h) {
				a || (R(t.$$.fragment, h), (a = !0));
			},
			o(h) {
				S(t.$$.fragment, h), (a = !1);
			},
			d(h) {
				h && v(e), n && n.d(), G(t);
			}
		}
	);
}
function ol(r, e, l) {
	const t = ['value', 'label'];
	let s = Ut(e, t),
		{ value: a } = e,
		{ label: n = '' } = e;
	function i(o) {
		(a = o), l(0, a);
	}
	return (
		(r.$$set = (o) => {
			(e = he(he({}, e), Jt(o))),
				l(2, (s = Ut(e, t))),
				'value' in o && l(0, (a = o.value)),
				'label' in o && l(1, (n = o.label));
		}),
		[a, n, s, i]
	);
}
class St extends X {
	constructor(e) {
		super(), Y(this, e, ol, al, $, { value: 0, label: 1 });
	}
}
const cl = (r) => ({}),
	Nt = (r) => ({}),
	fl = (r) => ({}),
	zt = (r) => ({});
function ul(r) {
	let e, l, t, s, a, n, i;
	const o = r[2].controls,
		u = Qe(o, r, r[1], zt),
		h = r[2].items,
		p = Qe(h, r, r[1], Nt);
	return {
		c() {
			(e = g('h1')),
				(l = B(r[0])),
				(t = I()),
				u && u.c(),
				(s = I()),
				(a = g('hr')),
				(n = I()),
				p && p.c();
		},
		l(f) {
			e = m(f, 'H1', {});
			var d = E(e);
			(l = V(d, r[0])),
				d.forEach(v),
				(t = L(f)),
				u && u.l(f),
				(s = L(f)),
				(a = m(f, 'HR', {})),
				(n = L(f)),
				p && p.l(f);
		},
		m(f, d) {
			z(f, e, d),
				c(e, l),
				z(f, t, d),
				u && u.m(f, d),
				z(f, s, d),
				z(f, a, d),
				z(f, n, d),
				p && p.m(f, d),
				(i = !0);
		},
		p(f, [d]) {
			(!i || d & 1) && J(l, f[0]),
				u && u.p && (!i || d & 2) && Ke(u, o, f, f[1], i ? Ye(o, f[1], d, fl) : Xe(f[1]), zt),
				p && p.p && (!i || d & 2) && Ke(p, h, f, f[1], i ? Ye(h, f[1], d, cl) : Xe(f[1]), Nt);
		},
		i(f) {
			i || (R(u, f), R(p, f), (i = !0));
		},
		o(f) {
			S(u, f), S(p, f), (i = !1);
		},
		d(f) {
			f && v(e), f && v(t), u && u.d(f), f && v(s), f && v(a), f && v(n), p && p.d(f);
		}
	};
}
function hl(r, e, l) {
	let { $$slots: t = {}, $$scope: s } = e,
		{ title: a } = e;
	return (
		(r.$$set = (n) => {
			'title' in n && l(0, (a = n.title)), '$$scope' in n && l(1, (s = n.$$scope));
		}),
		[a, s, t]
	);
}
class dl extends X {
	constructor(e) {
		super(), Y(this, e, hl, ul, $, { title: 0 });
	}
}
const Je = [
	{
		title: 'Act of RVLT 973',
		category: 'Promotion',
		description: 'Cool designs coming from 973',
		url: 'https://drive.google.com/drive/folders/1uDpzUovNCFh2FRTxFSriiZLIOdAbZWHU',
		tags: ['designs']
	},
	{
		title: 'New CULT Shops Going Live',
		category: 'Promotion',
		description: 'New CULT Shops Going Live',
		url: 'https://dripxkarip.com',
		tags: ['shops', 'merchandise']
	},
	{
		title: 'revolt.cultoshi.com Optimizing the Voting Process',
		category: 'Voting Process',
		description:
			'revolt.cultoshi.com simplifies the lives for CULTManders by simplifying the voting process enourmously.',
		url: 'https://revolt.cultoshi.com',
		tags: ['voting', 'cultoshi', 'revolt', 'revolt 2 earn']
	}
];
function At(r, e, l) {
	const t = r.slice();
	return (t[14] = e[l]), t;
}
function Ht(r, e, l) {
	const t = r.slice();
	return (t[17] = e[l]), t;
}
function _l(r) {
	let e, l, t, s, a, n, i, o, u, h, p, f, d;
	function C(k) {
		r[10](k);
	}
	let D = { items: r[5], isMulti: !0, label: 'Tags' };
	r[1] !== void 0 && (D.value = r[1]), (t = new St({ props: D })), $e.push(() => xe(t, 'value', C));
	function P(k) {
		r[11](k);
	}
	let _ = {
		label: 'Category',
		items: r[6],
		placeholder: 'Category',
		isClearable: !1,
		showIndicator: !0
	};
	return (
		r[3] !== void 0 && (_.value = r[3]),
		(n = new St({ props: _ })),
		$e.push(() => xe(n, 'value', P)),
		{
			c() {
				(e = g('section')),
					(l = g('div')),
					H(t.$$.fragment),
					(a = I()),
					H(n.$$.fragment),
					(o = I()),
					(u = g('div')),
					(h = g('input')),
					this.h();
			},
			l(k) {
				e = m(k, 'SECTION', { slot: !0, class: !0 });
				var y = E(e);
				l = m(y, 'DIV', { class: !0 });
				var T = E(l);
				M(t.$$.fragment, T),
					(a = L(T)),
					M(n.$$.fragment, T),
					T.forEach(v),
					(o = L(y)),
					(u = m(y, 'DIV', { class: !0 }));
				var U = E(u);
				(h = m(U, 'INPUT', { style: !0, class: !0, type: !0, placeholder: !0 })),
					U.forEach(v),
					y.forEach(v),
					this.h();
			},
			h() {
				w(l, 'class', 'inputs'),
					lt(h, 'width', '100%'),
					w(h, 'class', 'searchbar text-center'),
					w(h, 'type', 'text'),
					w(h, 'placeholder', 'Search through cultnews...'),
					w(u, 'class', 'text-center'),
					w(e, 'slot', 'controls'),
					w(e, 'class', 'controls');
			},
			m(k, y) {
				z(k, e, y),
					c(e, l),
					F(t, l, null),
					c(l, a),
					F(n, l, null),
					c(e, o),
					c(e, u),
					c(u, h),
					It(h, r[0]),
					(p = !0),
					f || ((d = Ot(h, 'input', r[12])), (f = !0));
			},
			p(k, y) {
				const T = {};
				!s && y & 2 && ((s = !0), (T.value = k[1]), et(() => (s = !1))), t.$set(T);
				const U = {};
				!i && y & 8 && ((i = !0), (U.value = k[3]), et(() => (i = !1))),
					n.$set(U),
					y & 1 && h.value !== k[0] && It(h, k[0]);
			},
			i(k) {
				p || (R(t.$$.fragment, k), R(n.$$.fragment, k), (p = !0));
			},
			o(k) {
				S(t.$$.fragment, k), S(n.$$.fragment, k), (p = !1);
			},
			d(k) {
				k && v(e), G(t), G(n), (f = !1), d();
			}
		}
	);
}
function Mt(r) {
	let e, l;
	const t = [r[17]];
	let s = {};
	for (let a = 0; a < t.length; a += 1) s = he(s, t[a]);
	return (
		(e = new sl({ props: s })),
		{
			c() {
				H(e.$$.fragment);
			},
			l(a) {
				M(e.$$.fragment, a);
			},
			m(a, n) {
				F(e, a, n), (l = !0);
			},
			p(a, n) {
				const i = n & 20 ? qt(t, [jt(a[17])]) : {};
				e.$set(i);
			},
			i(a) {
				l || (R(e.$$.fragment, a), (l = !0));
			},
			o(a) {
				S(e.$$.fragment, a), (l = !1);
			},
			d(a) {
				G(e, a);
			}
		}
	);
}
function gl(r) {
	let e, l;
	function t(...i) {
		return r[9](r[14], ...i);
	}
	let s = r[2].filter(t),
		a = [];
	for (let i = 0; i < s.length; i += 1) a[i] = Mt(Ht(r, s, i));
	const n = (i) =>
		S(a[i], 1, 1, () => {
			a[i] = null;
		});
	return {
		c() {
			for (let i = 0; i < a.length; i += 1) a[i].c();
			e = I();
		},
		l(i) {
			for (let o = 0; o < a.length; o += 1) a[o].l(i);
			e = L(i);
		},
		m(i, o) {
			for (let u = 0; u < a.length; u += 1) a[u].m(i, o);
			z(i, e, o), (l = !0);
		},
		p(i, o) {
			if (((r = i), o & 20)) {
				s = r[2].filter(t);
				let u;
				for (u = 0; u < s.length; u += 1) {
					const h = Ht(r, s, u);
					a[u]
						? (a[u].p(h, o), R(a[u], 1))
						: ((a[u] = Mt(h)), a[u].c(), R(a[u], 1), a[u].m(e.parentNode, e));
				}
				for (ce(), u = s.length; u < a.length; u += 1) n(u);
				fe();
			}
		},
		i(i) {
			if (!l) {
				for (let o = 0; o < s.length; o += 1) R(a[o]);
				l = !0;
			}
		},
		o(i) {
			a = a.filter(Boolean);
			for (let o = 0; o < a.length; o += 1) S(a[o]);
			l = !1;
		},
		d(i) {
			tt(a, i), i && v(e);
		}
	};
}
function Ft(r) {
	let e, l;
	return (
		(e = new il({
			props: {
				title: r[14].label || 'Unclassified',
				id: r[7][r[14].label] || r[14].label || 'unclassified',
				$$slots: { default: [gl] },
				$$scope: { ctx: r }
			}
		})),
		{
			c() {
				H(e.$$.fragment);
			},
			l(t) {
				M(e.$$.fragment, t);
			},
			m(t, s) {
				F(e, t, s), (l = !0);
			},
			p(t, s) {
				const a = {};
				s & 16 && (a.title = t[14].label || 'Unclassified'),
					s & 16 && (a.id = t[7][t[14].label] || t[14].label || 'unclassified'),
					s & 1048596 && (a.$$scope = { dirty: s, ctx: t }),
					e.$set(a);
			},
			i(t) {
				l || (R(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				S(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				G(e, t);
			}
		}
	);
}
function ml(r) {
	let e,
		l,
		t = r[4],
		s = [];
	for (let n = 0; n < t.length; n += 1) s[n] = Ft(At(r, t, n));
	const a = (n) =>
		S(s[n], 1, 1, () => {
			s[n] = null;
		});
	return {
		c() {
			e = g('section');
			for (let n = 0; n < s.length; n += 1) s[n].c();
			this.h();
		},
		l(n) {
			e = m(n, 'SECTION', { slot: !0 });
			var i = E(e);
			for (let o = 0; o < s.length; o += 1) s[o].l(i);
			i.forEach(v), this.h();
		},
		h() {
			w(e, 'slot', 'items');
		},
		m(n, i) {
			z(n, e, i);
			for (let o = 0; o < s.length; o += 1) s[o].m(e, null);
			l = !0;
		},
		p(n, i) {
			if (i & 148) {
				t = n[4];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const u = At(n, t, o);
					s[o]
						? (s[o].p(u, i), R(s[o], 1))
						: ((s[o] = Ft(u)), s[o].c(), R(s[o], 1), s[o].m(e, null));
				}
				for (ce(), o = t.length; o < s.length; o += 1) a(o);
				fe();
			}
		},
		i(n) {
			if (!l) {
				for (let i = 0; i < t.length; i += 1) R(s[i]);
				l = !0;
			}
		},
		o(n) {
			s = s.filter(Boolean);
			for (let i = 0; i < s.length; i += 1) S(s[i]);
			l = !1;
		},
		d(n) {
			n && v(e), tt(s, n);
		}
	};
}
function vl(r) {
	let e,
		l,
		t,
		s,
		a,
		n,
		i,
		o,
		u,
		h,
		p,
		f,
		d,
		C,
		D,
		P,
		_,
		k,
		y,
		T,
		U,
		A,
		Q,
		O,
		K,
		de,
		_e,
		ge,
		me,
		j,
		ve,
		pe,
		be,
		we,
		Z,
		ke,
		Ee,
		Ce,
		ye,
		W,
		Te,
		Ue,
		x,
		Ie,
		Le,
		ee,
		Pe,
		Re,
		te,
		Be,
		Ve,
		q,
		nt,
		De,
		le,
		Se,
		Ne,
		se,
		ze,
		Ae,
		ne,
		He,
		Me,
		re,
		Fe,
		Ge,
		ie,
		Oe,
		qe,
		ae,
		je,
		Ze,
		ue;
	return (
		(e = new Xt({ props: { title: 'CULT News' } })),
		(y = new dl({
			props: { title: '', $$slots: { items: [ml], controls: [_l] }, $$scope: { ctx: r } }
		})),
		{
			c() {
				H(e.$$.fragment),
					(l = I()),
					(t = g('div')),
					(s = g('h2')),
					(a = B('CULT News')),
					(n = I()),
					(i = g('p')),
					(o = g('br')),
					(u = B(`
	Please add CULT news via
	`)),
					(h = g('a')),
					(p = B('pull request')),
					(f = B(`.
	`)),
					(d = g('p')),
					(C = g('br')),
					(D = B(`
	The latest CULT statistics can be found via
	`)),
					(P = g('a')),
					(_ = B('this link')),
					(k = B(`.
	

	`)),
					H(y.$$.fragment),
					(T = I()),
					(U = g('p')),
					(A = g('br')),
					(Q = I()),
					(O = g('h3')),
					(K = B('New CULT Shops Going Live')),
					(de = I()),
					(_e = g('br')),
					(ge = g('br')),
					(me = I()),
					(j = g('a')),
					(ve = B('dripxkarip.com')),
					(pe = g('br')),
					(be = g('br')),
					(we = I()),
					(Z = g('a')),
					(ke = B('shop2revolt.com')),
					(Ee = g('br')),
					(Ce = g('br')),
					(ye = I()),
					(W = g('a')),
					(Te = B('cultdaodizayn.com')),
					(Ue = I()),
					(x = g('p')),
					(Ie = g('br')),
					(Le = I()),
					(ee = g('p')),
					(Pe = g('br')),
					(Re = I()),
					(te = g('h3')),
					(Be = B('revolt.cultoshi.com is Optimizing the Voting Process')),
					(Ve = I()),
					(q = g('embed')),
					(De = I()),
					(le = g('p')),
					(Se = g('br')),
					(Ne = I()),
					(se = g('p')),
					(ze = g('br')),
					(Ae = I()),
					(ne = g('h3')),
					(He = B('CULT Chat Feature Under Construction')),
					(Me = B(`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`)),
					(re = g('p')),
					(Fe = g('br')),
					(Ge = I()),
					(ie = g('p')),
					(Oe = g('br')),
					(qe = I()),
					(ae = g('h3')),
					(je = B('CULT Market Feature Under Construction')),
					(Ze = B(`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`)),
					this.h();
			},
			l(N) {
				M(e.$$.fragment, N), (l = L(N)), (t = m(N, 'DIV', { class: !0 }));
				var b = E(t);
				s = m(b, 'H2', {});
				var oe = E(s);
				(a = V(oe, 'CULT News')), oe.forEach(v), (n = L(b)), (i = m(b, 'P', {}));
				var rt = E(i);
				(o = m(rt, 'BR', {})),
					rt.forEach(v),
					(u = V(
						b,
						`
	Please add CULT news via
	`
					)),
					(h = m(b, 'A', { href: !0, target: !0 }));
				var it = E(h);
				(p = V(it, 'pull request')),
					it.forEach(v),
					(f = V(
						b,
						`.
	`
					)),
					(d = m(b, 'P', {}));
				var at = E(d);
				(C = m(at, 'BR', {})),
					at.forEach(v),
					(D = V(
						b,
						`
	The latest CULT statistics can be found via
	`
					)),
					(P = m(b, 'A', { href: !0, target: !0 }));
				var ot = E(P);
				(_ = V(ot, 'this link')),
					ot.forEach(v),
					(k = V(
						b,
						`.
	

	`
					)),
					M(y.$$.fragment, b),
					(T = L(b)),
					(U = m(b, 'P', {}));
				var ct = E(U);
				(A = m(ct, 'BR', {})), ct.forEach(v), (Q = L(b)), (O = m(b, 'H3', {}));
				var ft = E(O);
				(K = V(ft, 'New CULT Shops Going Live')),
					ft.forEach(v),
					(de = L(b)),
					(_e = m(b, 'BR', {})),
					(ge = m(b, 'BR', {})),
					(me = L(b)),
					(j = m(b, 'A', { href: !0, target: !0 }));
				var ut = E(j);
				(ve = V(ut, 'dripxkarip.com')),
					ut.forEach(v),
					(pe = m(b, 'BR', {})),
					(be = m(b, 'BR', {})),
					(we = L(b)),
					(Z = m(b, 'A', { href: !0, target: !0 }));
				var ht = E(Z);
				(ke = V(ht, 'shop2revolt.com')),
					ht.forEach(v),
					(Ee = m(b, 'BR', {})),
					(Ce = m(b, 'BR', {})),
					(ye = L(b)),
					(W = m(b, 'A', { href: !0, target: !0 }));
				var dt = E(W);
				(Te = V(dt, 'cultdaodizayn.com')), dt.forEach(v), (Ue = L(b)), (x = m(b, 'P', {}));
				var _t = E(x);
				(Ie = m(_t, 'BR', {})), _t.forEach(v), (Le = L(b)), (ee = m(b, 'P', {}));
				var gt = E(ee);
				(Pe = m(gt, 'BR', {})), gt.forEach(v), (Re = L(b)), (te = m(b, 'H3', {}));
				var mt = E(te);
				(Be = V(mt, 'revolt.cultoshi.com is Optimizing the Voting Process')),
					mt.forEach(v),
					(Ve = L(b)),
					(q = m(b, 'EMBED', { type: !0, src: !0, width: !0, height: !0 })),
					(De = L(b)),
					(le = m(b, 'P', {}));
				var vt = E(le);
				(Se = m(vt, 'BR', {})), vt.forEach(v), (Ne = L(b)), (se = m(b, 'P', {}));
				var pt = E(se);
				(ze = m(pt, 'BR', {})), pt.forEach(v), (Ae = L(b)), (ne = m(b, 'H3', {}));
				var bt = E(ne);
				(He = V(bt, 'CULT Chat Feature Under Construction')),
					bt.forEach(v),
					(Me = V(
						b,
						`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`
					)),
					(re = m(b, 'P', {}));
				var wt = E(re);
				(Fe = m(wt, 'BR', {})), wt.forEach(v), (Ge = L(b)), (ie = m(b, 'P', {}));
				var kt = E(ie);
				(Oe = m(kt, 'BR', {})), kt.forEach(v), (qe = L(b)), (ae = m(b, 'H3', {}));
				var Et = E(ae);
				(je = V(Et, 'CULT Market Feature Under Construction')),
					Et.forEach(v),
					(Ze = V(
						b,
						`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`
					)),
					b.forEach(v),
					this.h();
			},
			h() {
				w(h, 'href', 'https://www.youtube.com/watch?v=8lGpZkjnkt4'),
					w(h, 'target', '_blank'),
					w(P, 'href', 'https://dune.com/web3_data/CULT'),
					w(P, 'target', '_blank'),
					w(j, 'href', 'https://dripxkarip.com'),
					w(j, 'target', '_blank'),
					w(Z, 'href', 'https://www.shop2revolt.com'),
					w(Z, 'target', '_blank'),
					w(W, 'href', 'https://www.cultdaodizayn.com'),
					w(W, 'target', '_blank'),
					w(q, 'type', 'text/html'),
					st(q.src, (nt = 'https://revolt.cultoshi.com/')) || w(q, 'src', nt),
					w(q, 'width', '100%'),
					w(q, 'height', '1100vh'),
					w(t, 'class', 'text-center');
			},
			m(N, b) {
				F(e, N, b),
					z(N, l, b),
					z(N, t, b),
					c(t, s),
					c(s, a),
					c(t, n),
					c(t, i),
					c(i, o),
					c(t, u),
					c(t, h),
					c(h, p),
					c(t, f),
					c(t, d),
					c(d, C),
					c(t, D),
					c(t, P),
					c(P, _),
					c(t, k),
					F(y, t, null),
					c(t, T),
					c(t, U),
					c(U, A),
					c(t, Q),
					c(t, O),
					c(O, K),
					c(t, de),
					c(t, _e),
					c(t, ge),
					c(t, me),
					c(t, j),
					c(j, ve),
					c(t, pe),
					c(t, be),
					c(t, we),
					c(t, Z),
					c(Z, ke),
					c(t, Ee),
					c(t, Ce),
					c(t, ye),
					c(t, W),
					c(W, Te),
					c(t, Ue),
					c(t, x),
					c(x, Ie),
					c(t, Le),
					c(t, ee),
					c(ee, Pe),
					c(t, Re),
					c(t, te),
					c(te, Be),
					c(t, Ve),
					c(t, q),
					c(t, De),
					c(t, le),
					c(le, Se),
					c(t, Ne),
					c(t, se),
					c(se, ze),
					c(t, Ae),
					c(t, ne),
					c(ne, He),
					c(t, Me),
					c(t, re),
					c(re, Fe),
					c(t, Ge),
					c(t, ie),
					c(ie, Oe),
					c(t, qe),
					c(t, ae),
					c(ae, je),
					c(t, Ze),
					(ue = !0);
			},
			p(N, [b]) {
				const oe = {};
				b & 1048607 && (oe.$$scope = { dirty: b, ctx: N }), y.$set(oe);
			},
			i(N) {
				ue || (R(e.$$.fragment, N), R(y.$$.fragment, N), (ue = !0));
			},
			o(N) {
				S(e.$$.fragment, N), S(y.$$.fragment, N), (ue = !1);
			},
			d(N) {
				G(e, N), N && v(l), N && v(t), G(y);
			}
		}
	);
}
let Gt = null;
function pl(r, e, l) {
	let t, s, a;
	const n = We(Je, 'tags');
	let i = [],
		o = null;
	const u = [{ label: 'All', value: null }, ...We(Je, 'category')];
	let h = null;
	const p = (_, k) => _.filter((y) => k.includes(y)),
		f = {
			'Bundler Plugins': 'bundling',
			Debugging: 'debugging',
			'Editor Extensions': 'editor-support',
			'Linting and Formatting': 'code-quality',
			Preprocessors: 'preprocessors'
		},
		d = (_, k) => k.category === _.value;
	function C(_) {
		(o = _), l(1, o);
	}
	function D(_) {
		(h = _), l(3, h);
	}
	function P() {
		(a = this.value), l(0, a);
	}
	return (
		(r.$$.update = () => {
			r.$$.dirty & 2 && l(8, (i = (o == null ? void 0 : o.map((_) => _.value)) || [])),
				r.$$.dirty & 257 &&
					l(
						2,
						(t = Je.filter((_) =>
							!a && i.length === 0 && Gt === null
								? !0
								: !(
										(a &&
											!(
												_.title.toLowerCase().includes(a.toLowerCase()) ||
												_.description.toLowerCase().includes(a.toLowerCase())
											)) ||
										(i.length > 0 && p(i, _.tags).length === 0) ||
										Gt !== null
								  )
						))
					),
				r.$$.dirty & 4 && l(4, (s = We(t, 'category')));
		}),
		[a, o, t, h, s, n, u, f, i, d, C, D, P]
	);
}
class Ul extends X {
	constructor(e) {
		super(), Y(this, e, pl, vl, $, {});
	}
}
export { Ul as default };
