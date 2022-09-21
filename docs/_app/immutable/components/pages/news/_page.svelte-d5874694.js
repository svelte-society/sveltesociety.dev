import {
	S as ee,
	i as te,
	s as le,
	k as v,
	q as S,
	l as p,
	m as C,
	r as V,
	h as d,
	n as k,
	a7 as ct,
	b as A,
	C as c,
	V as Rt,
	a8 as Nt,
	u as Y,
	A as ut,
	a as I,
	c as T,
	J as ht,
	f as B,
	g as _e,
	t as N,
	d as de,
	v as Z,
	w as j,
	x as W,
	y as J,
	D as We,
	p as Bt,
	B as Je,
	F as qe,
	G as Ge,
	H as Ze,
	I as je,
	N as be,
	R as me,
	T as ve,
	O as Dt,
	P as St,
	W as pe,
	a9 as _t,
	Q as At,
	U as dt
} from '../../../chunks/index-2fad9c0c.js';
import { c as zt, s as Ht } from '../../../chunks/Select.svelte_svelte_type_style_lang-949aa272.js';
import { c as Ft, S as Mt } from '../../../chunks/Select-8360dfd8.js';
import { e as Me } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { c as Ot } from '../../../chunks/cultproposals-ee6a2386.js';
import { S as qt } from '../../../chunks/Seo-30c25c5e.js';
import '../../../chunks/stores-5c626af5.js';
import '../../../chunks/singletons-33397e7e.js';
function Gt(r) {
	let e, l, t, n, i;
	return {
		c() {
			(e = v('div')), (l = S(r[0])), this.h();
		},
		l(s) {
			e = p(s, 'DIV', { class: !0 });
			var a = C(e);
			(l = V(a, r[0])), a.forEach(d), this.h();
		},
		h() {
			k(e, 'class', (t = ct(r[1]) + ' svelte-ugev5v'));
		},
		m(s, a) {
			A(s, e, a),
				c(e, l),
				n ||
					((i = Rt(e, 'click', function () {
						Nt(r[2]) && r[2].apply(this, arguments);
					})),
					(n = !0));
		},
		p(s, [a]) {
			(r = s),
				a & 1 && Y(l, r[0]),
				a & 2 && t !== (t = ct(r[1]) + ' svelte-ugev5v') && k(e, 'class', t);
		},
		i: ut,
		o: ut,
		d(s) {
			s && d(e), (n = !1), i();
		}
	};
}
function Zt(r, e, l) {
	let { title: t = '' } = e,
		{ variant: n } = e,
		{ click: i = void 0 } = e;
	return (
		(r.$$set = (s) => {
			'title' in s && l(0, (t = s.title)),
				'variant' in s && l(1, (n = s.variant)),
				'click' in s && l(2, (i = s.click));
		}),
		[t, n, i]
	);
}
class Vt extends ee {
	constructor(e) {
		super(), te(this, e, Zt, Gt, le, { title: 0, variant: 1, click: 2 });
	}
}
function gt(r, e, l) {
	const t = r.slice();
	return (t[14] = e[l]), t;
}
function mt(r) {
	let e, l;
	return (
		(e = new Vt({
			props: {
				click: r[13],
				variant: 'copy',
				title: r[9] ? 'copied!' : `${r[11][r[8]]} ${r[12](r[6])}`
			}
		})),
		{
			c() {
				Z(e.$$.fragment);
			},
			l(t) {
				j(e.$$.fragment, t);
			},
			m(t, n) {
				W(e, t, n), (l = !0);
			},
			p(t, n) {
				const i = {};
				n & 832 && (i.title = t[9] ? 'copied!' : `${t[11][t[8]]} ${t[12](t[6])}`), e.$set(i);
			},
			i(t) {
				l || (B(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				N(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				J(e, t);
			}
		}
	);
}
function vt(r) {
	let e,
		l,
		t = r[3],
		n = [];
	for (let s = 0; s < t.length; s += 1) n[s] = pt(gt(r, t, s));
	const i = (s) =>
		N(n[s], 1, 1, () => {
			n[s] = null;
		});
	return {
		c() {
			e = v('div');
			for (let s = 0; s < n.length; s += 1) n[s].c();
			this.h();
		},
		l(s) {
			e = p(s, 'DIV', { class: !0 });
			var a = C(e);
			for (let o = 0; o < n.length; o += 1) n[o].l(a);
			a.forEach(d), this.h();
		},
		h() {
			k(e, 'class', 'card__tags svelte-1p17aya');
		},
		m(s, a) {
			A(s, e, a);
			for (let o = 0; o < n.length; o += 1) n[o].m(e, null);
			l = !0;
		},
		p(s, a) {
			if (a & 8) {
				t = s[3];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const u = gt(s, t, o);
					n[o]
						? (n[o].p(u, a), B(n[o], 1))
						: ((n[o] = pt(u)), n[o].c(), B(n[o], 1), n[o].m(e, null));
				}
				for (_e(), o = t.length; o < n.length; o += 1) i(o);
				de();
			}
		},
		i(s) {
			if (!l) {
				for (let a = 0; a < t.length; a += 1) B(n[a]);
				l = !0;
			}
		},
		o(s) {
			n = n.filter(Boolean);
			for (let a = 0; a < n.length; a += 1) N(n[a]);
			l = !1;
		},
		d(s) {
			s && d(e), We(n, s);
		}
	};
}
function pt(r) {
	let e, l;
	return (
		(e = new Vt({ props: { title: r[14], variant: 'blue' } })),
		{
			c() {
				Z(e.$$.fragment);
			},
			l(t) {
				j(e.$$.fragment, t);
			},
			m(t, n) {
				W(e, t, n), (l = !0);
			},
			p(t, n) {
				const i = {};
				n & 8 && (i.title = t[14]), e.$set(i);
			},
			i(t) {
				l || (B(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				N(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				J(e, t);
			}
		}
	);
}
function bt(r) {
	let e, l, t, n, i, s, a, o, u;
	function _(h, w) {
		if (
			(w & 160 && (t = null),
			w & 160 && (n = null),
			t == null && (t = !!(h[7] || h[5]).includes('github')),
			t)
		)
			return Wt;
		if ((n == null && (n = !!(h[7] || h[5]).includes('gitlab')), n)) return jt;
	}
	let g = _(r, -1),
		f = g && g(r);
	return {
		c() {
			(e = v('div')),
				(l = v('div')),
				f && f.c(),
				(i = I()),
				(s = v('div')),
				(a = S(`\u2605
				`)),
				(o = v('code')),
				(u = S(r[4])),
				this.h();
		},
		l(h) {
			e = p(h, 'DIV', { class: !0 });
			var w = C(e);
			l = p(w, 'DIV', { class: !0 });
			var L = C(l);
			f && f.l(L), L.forEach(d), (i = T(w)), (s = p(w, 'DIV', { class: !0 }));
			var R = C(s);
			(a = V(
				R,
				`\u2605
				`
			)),
				(o = p(R, 'CODE', {}));
			var m = C(o);
			(u = V(m, r[4])), m.forEach(d), R.forEach(d), w.forEach(d), this.h();
		},
		h() {
			k(l, 'class', 'svelte-1p17aya'),
				k(s, 'class', 'svelte-1p17aya'),
				k(e, 'class', 'card__bottom svelte-1p17aya');
		},
		m(h, w) {
			A(h, e, w), c(e, l), f && f.m(l, null), c(e, i), c(e, s), c(s, a), c(s, o), c(o, u);
		},
		p(h, w) {
			g !== (g = _(h, w)) && (f && f.d(1), (f = g && g(h)), f && (f.c(), f.m(l, null))),
				w & 16 && Y(u, h[4]);
		},
		d(h) {
			h && d(e), f && f.d();
		}
	};
}
function jt(r) {
	let e, l;
	return {
		c() {
			(e = v('img')), this.h();
		},
		l(t) {
			(e = p(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			Bt(e, 'display', 'inline'),
				Je(e.src, (l = '/images/gitlab_logo.svg')) || k(e, 'src', l),
				k(e, 'alt', 'gitlab logo');
		},
		m(t, n) {
			A(t, e, n);
		},
		d(t) {
			t && d(e);
		}
	};
}
function Wt(r) {
	let e, l;
	return {
		c() {
			(e = v('img')), this.h();
		},
		l(t) {
			(e = p(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			Bt(e, 'display', 'inline'),
				Je(e.src, (l = '/images/github_logo.svg')) || k(e, 'src', l),
				k(e, 'alt', 'github logo');
		},
		m(t, n) {
			A(t, e, n);
		},
		d(t) {
			t && d(e);
		}
	};
}
function Jt(r) {
	let e,
		l,
		t,
		n,
		i,
		s,
		a,
		o,
		u,
		_,
		g,
		f,
		h,
		w,
		L,
		R,
		m = r[6] && mt(r),
		U = r[3] && vt(r),
		D = typeof r[4] < 'u' && bt(r);
	return {
		c() {
			(e = v('div')),
				(l = v('h3')),
				(t = v('a')),
				(n = S('#')),
				(s = I()),
				(a = v('a')),
				(o = S(r[1])),
				(u = I()),
				m && m.c(),
				(_ = I()),
				(g = v('p')),
				(f = S(r[2])),
				(h = I()),
				U && U.c(),
				(w = I()),
				D && D.c(),
				this.h();
		},
		l(E) {
			e = p(E, 'DIV', { class: !0, id: !0 });
			var y = C(e);
			l = p(y, 'H3', { class: !0 });
			var M = C(l);
			t = p(M, 'A', { href: !0 });
			var $ = C(t);
			(n = V($, '#')), $.forEach(d), (s = T(M)), (a = p(M, 'A', { href: !0 }));
			var Q = C(a);
			(o = V(Q, r[1])),
				Q.forEach(d),
				(u = T(M)),
				m && m.l(M),
				M.forEach(d),
				(_ = T(y)),
				(g = p(y, 'P', { class: !0 }));
			var K = C(g);
			(f = V(K, r[2])),
				K.forEach(d),
				(h = T(y)),
				U && U.l(y),
				(w = T(y)),
				D && D.l(y),
				y.forEach(d),
				this.h();
		},
		h() {
			k(t, 'href', (i = '#component-' + encodeURI(r[1]))),
				k(a, 'href', r[5]),
				k(l, 'class', 'svelte-1p17aya'),
				k(g, 'class', 'flex-grow svelte-1p17aya'),
				k(e, 'class', 'card svelte-1p17aya'),
				k(e, 'id', (L = 'component-' + encodeURI(r[1]))),
				ht(e, 'active', r[0]);
		},
		m(E, y) {
			A(E, e, y),
				c(e, l),
				c(l, t),
				c(t, n),
				c(l, s),
				c(l, a),
				c(a, o),
				c(l, u),
				m && m.m(l, null),
				c(e, _),
				c(e, g),
				c(g, f),
				c(e, h),
				U && U.m(e, null),
				c(e, w),
				D && D.m(e, null),
				(R = !0);
		},
		p(E, [y]) {
			(!R || (y & 2 && i !== (i = '#component-' + encodeURI(E[1])))) && k(t, 'href', i),
				(!R || y & 2) && Y(o, E[1]),
				(!R || y & 32) && k(a, 'href', E[5]),
				E[6]
					? m
						? (m.p(E, y), y & 64 && B(m, 1))
						: ((m = mt(E)), m.c(), B(m, 1), m.m(l, null))
					: m &&
					  (_e(),
					  N(m, 1, 1, () => {
							m = null;
					  }),
					  de()),
				(!R || y & 4) && Y(f, E[2]),
				E[3]
					? U
						? (U.p(E, y), y & 8 && B(U, 1))
						: ((U = vt(E)), U.c(), B(U, 1), U.m(e, w))
					: U &&
					  (_e(),
					  N(U, 1, 1, () => {
							U = null;
					  }),
					  de()),
				typeof E[4] < 'u'
					? D
						? D.p(E, y)
						: ((D = bt(E)), D.c(), D.m(e, null))
					: D && (D.d(1), (D = null)),
				(!R || (y & 2 && L !== (L = 'component-' + encodeURI(E[1])))) && k(e, 'id', L),
				y & 1 && ht(e, 'active', E[0]);
		},
		i(E) {
			R || (B(m), B(U), (R = !0));
		},
		o(E) {
			N(m), N(U), (R = !1);
		},
		d(E) {
			E && d(e), m && m.d(), U && U.d(), D && D.d();
		}
	};
}
function Qt(r, e, l) {
	let { active: t = !1 } = e,
		{ title: n = '' } = e,
		{ description: i = '' } = e,
		{ tags: s = [] } = e,
		{ stars: a } = e,
		{ url: o = '' } = e,
		{ npm: u = '' } = e,
		{ repo: _ = '' } = e,
		{ manager: g = 'npm' } = e,
		f = !1;
	const h = () => {
			Ft(`${w[g]} ${L(u)}`).then(() => l(9, (f = !1))), l(9, (f = !0));
		},
		w = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' },
		L = (m) => m.replace('https://www.npmjs.com/package/', ''),
		R = () => h();
	return (
		(r.$$set = (m) => {
			'active' in m && l(0, (t = m.active)),
				'title' in m && l(1, (n = m.title)),
				'description' in m && l(2, (i = m.description)),
				'tags' in m && l(3, (s = m.tags)),
				'stars' in m && l(4, (a = m.stars)),
				'url' in m && l(5, (o = m.url)),
				'npm' in m && l(6, (u = m.npm)),
				'repo' in m && l(7, (_ = m.repo)),
				'manager' in m && l(8, (g = m.manager));
		}),
		[t, n, i, s, a, o, u, _, g, f, h, w, L, R]
	);
}
class $t extends ee {
	constructor(e) {
		super(),
			te(this, e, Qt, Jt, le, {
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
function Kt(r) {
	let e, l, t, n, i, s, a, o, u, _;
	const g = r[3].default,
		f = qe(g, r, r[2], null);
	return {
		c() {
			(e = v('div')),
				(l = v('h1')),
				(t = S(r[0])),
				(n = I()),
				(i = v('a')),
				(s = S('#')),
				(o = I()),
				(u = v('div')),
				f && f.c(),
				this.h();
		},
		l(h) {
			e = p(h, 'DIV', { class: !0 });
			var w = C(e);
			l = p(w, 'H1', { id: !0, class: !0 });
			var L = C(l);
			(t = V(L, r[0])), (n = T(L)), (i = p(L, 'A', { href: !0 }));
			var R = C(i);
			(s = V(R, '#')), R.forEach(d), L.forEach(d), (o = T(w)), (u = p(w, 'DIV', { class: !0 }));
			var m = C(u);
			f && f.l(m), m.forEach(d), w.forEach(d), this.h();
		},
		h() {
			k(i, 'href', (a = '#' + r[1])),
				k(l, 'id', r[1]),
				k(l, 'class', 'svelte-6ivwg1'),
				k(u, 'class', 'grid svelte-6ivwg1'),
				k(e, 'class', 'list svelte-6ivwg1');
		},
		m(h, w) {
			A(h, e, w),
				c(e, l),
				c(l, t),
				c(l, n),
				c(l, i),
				c(i, s),
				c(e, o),
				c(e, u),
				f && f.m(u, null),
				(_ = !0);
		},
		p(h, [w]) {
			(!_ || w & 1) && Y(t, h[0]),
				(!_ || (w & 2 && a !== (a = '#' + h[1]))) && k(i, 'href', a),
				(!_ || w & 2) && k(l, 'id', h[1]),
				f && f.p && (!_ || w & 4) && Ge(f, g, h, h[2], _ ? je(g, h[2], w, null) : Ze(h[2]), null);
		},
		i(h) {
			_ || (B(f, h), (_ = !0));
		},
		o(h) {
			N(f, h), (_ = !1);
		},
		d(h) {
			h && d(e), f && f.d(h);
		}
	};
}
function Xt(r, e, l) {
	let { $$slots: t = {}, $$scope: n } = e,
		{ title: i } = e,
		{ id: s = `category-${encodeURI(i)}` } = e;
	return (
		(r.$$set = (a) => {
			'title' in a && l(0, (i = a.title)),
				'id' in a && l(1, (s = a.id)),
				'$$scope' in a && l(2, (n = a.$$scope));
		}),
		[i, s, n, t]
	);
}
class Yt extends ee {
	constructor(e) {
		super(), te(this, e, Xt, Kt, le, { title: 0, id: 1 });
	}
}
function wt(r) {
	let e, l;
	return {
		c() {
			(e = v('span')), (l = S(r[1])), this.h();
		},
		l(t) {
			e = p(t, 'SPAN', { class: !0 });
			var n = C(e);
			(l = V(n, r[1])), n.forEach(d), this.h();
		},
		h() {
			k(e, 'class', 'svelte-phe5gt');
		},
		m(t, n) {
			A(t, e, n), c(e, l);
		},
		p(t, n) {
			n & 2 && Y(l, t[1]);
		},
		d(t) {
			t && d(e);
		}
	};
}
function xt(r) {
	let e,
		l,
		t,
		n,
		i,
		s = r[1] && wt(r);
	const a = [{ containerClasses: 'select-container' }, r[2]];
	function o(_) {
		r[3](_);
	}
	let u = {};
	for (let _ = 0; _ < a.length; _ += 1) u = be(u, a[_]);
	return (
		r[0] !== void 0 && (u.value = r[0]),
		(t = new Mt({ props: u })),
		me.push(() => ve(t, 'value', o)),
		{
			c() {
				(e = v('div')), s && s.c(), (l = I()), Z(t.$$.fragment), this.h();
			},
			l(_) {
				e = p(_, 'DIV', { class: !0 });
				var g = C(e);
				s && s.l(g), (l = T(g)), j(t.$$.fragment, g), g.forEach(d), this.h();
			},
			h() {
				k(e, 'class', 'themed svelte-phe5gt');
			},
			m(_, g) {
				A(_, e, g), s && s.m(e, null), c(e, l), W(t, e, null), (i = !0);
			},
			p(_, [g]) {
				_[1] ? (s ? s.p(_, g) : ((s = wt(_)), s.c(), s.m(e, l))) : s && (s.d(1), (s = null));
				const f = g & 4 ? Dt(a, [a[0], St(_[2])]) : {};
				!n && g & 1 && ((n = !0), (f.value = _[0]), pe(() => (n = !1))), t.$set(f);
			},
			i(_) {
				i || (B(t.$$.fragment, _), (i = !0));
			},
			o(_) {
				N(t.$$.fragment, _), (i = !1);
			},
			d(_) {
				_ && d(e), s && s.d(), J(t);
			}
		}
	);
}
function el(r, e, l) {
	const t = ['value', 'label'];
	let n = _t(e, t),
		{ value: i } = e,
		{ label: s = '' } = e;
	function a(o) {
		(i = o), l(0, i);
	}
	return (
		(r.$$set = (o) => {
			(e = be(be({}, e), At(o))),
				l(2, (n = _t(e, t))),
				'value' in o && l(0, (i = o.value)),
				'label' in o && l(1, (s = o.label));
		}),
		[i, s, n, a]
	);
}
class Oe extends ee {
	constructor(e) {
		super(), te(this, e, el, xt, le, { value: 0, label: 1 });
	}
}
const tl = (r) => ({}),
	kt = (r) => ({}),
	ll = (r) => ({}),
	Et = (r) => ({});
function sl(r) {
	let e, l, t, n, i, s, a;
	const o = r[2].controls,
		u = qe(o, r, r[1], Et),
		_ = r[2].items,
		g = qe(_, r, r[1], kt);
	return {
		c() {
			(e = v('h1')),
				(l = S(r[0])),
				(t = I()),
				u && u.c(),
				(n = I()),
				(i = v('hr')),
				(s = I()),
				g && g.c();
		},
		l(f) {
			e = p(f, 'H1', {});
			var h = C(e);
			(l = V(h, r[0])),
				h.forEach(d),
				(t = T(f)),
				u && u.l(f),
				(n = T(f)),
				(i = p(f, 'HR', {})),
				(s = T(f)),
				g && g.l(f);
		},
		m(f, h) {
			A(f, e, h),
				c(e, l),
				A(f, t, h),
				u && u.m(f, h),
				A(f, n, h),
				A(f, i, h),
				A(f, s, h),
				g && g.m(f, h),
				(a = !0);
		},
		p(f, [h]) {
			(!a || h & 1) && Y(l, f[0]),
				u && u.p && (!a || h & 2) && Ge(u, o, f, f[1], a ? je(o, f[1], h, ll) : Ze(f[1]), Et),
				g && g.p && (!a || h & 2) && Ge(g, _, f, f[1], a ? je(_, f[1], h, tl) : Ze(f[1]), kt);
		},
		i(f) {
			a || (B(u, f), B(g, f), (a = !0));
		},
		o(f) {
			N(u, f), N(g, f), (a = !1);
		},
		d(f) {
			f && d(e), f && d(t), u && u.d(f), f && d(n), f && d(i), f && d(s), g && g.d(f);
		}
	};
}
function nl(r, e, l) {
	let { $$slots: t = {}, $$scope: n } = e,
		{ title: i } = e;
	return (
		(r.$$set = (s) => {
			'title' in s && l(0, (i = s.title)), '$$scope' in s && l(1, (n = s.$$scope));
		}),
		[i, n, t]
	);
}
class rl extends ee {
	constructor(e) {
		super(), te(this, e, nl, sl, le, { title: 0 });
	}
}
const Ct = [
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
function yt(r, e, l) {
	const t = r.slice();
	return (t[17] = e[l]), t;
}
function It(r, e, l) {
	const t = r.slice();
	return (t[20] = e[l]), t;
}
function Tt(r) {
	let e;
	return {
		c() {
			e = S('s');
		},
		l(l) {
			e = V(l, 's');
		},
		m(l, t) {
			A(l, e, t);
		},
		d(l) {
			l && d(e);
		}
	};
}
function al(r) {
	let e,
		l,
		t,
		n,
		i,
		s,
		a,
		o,
		u,
		_,
		g,
		f,
		h,
		w,
		L = r[3].length + '',
		R,
		m,
		U,
		D,
		E;
	function y(P) {
		r[12](P);
	}
	let M = { items: r[6], isMulti: !0, label: 'Tags' };
	r[1] !== void 0 && (M.value = r[1]), (t = new Oe({ props: M })), me.push(() => ve(t, 'value', y));
	function $(P) {
		r[13](P);
	}
	let Q = {
		label: 'Category',
		items: r[7],
		placeholder: 'Category',
		isClearable: !1,
		showIndicator: !0
	};
	r[4] !== void 0 && (Q.value = r[4]), (s = new Oe({ props: Q })), me.push(() => ve(s, 'value', $));
	function K(P) {
		r[14](P);
	}
	let G = { items: Ht, label: 'Sorting', showIndicator: !0, isClearable: !1 };
	r[2] !== void 0 && (G.value = r[2]), (u = new Oe({ props: G })), me.push(() => ve(u, 'value', K));
	let z = r[3].length !== 1 && Tt();
	return {
		c() {
			(e = v('section')),
				(l = v('div')),
				Z(t.$$.fragment),
				(i = I()),
				Z(s.$$.fragment),
				(o = I()),
				Z(u.$$.fragment),
				(g = I()),
				(f = v('input')),
				(h = I()),
				(w = v('span')),
				(R = S(L)),
				(m = S(' result')),
				z && z.c(),
				this.h();
		},
		l(P) {
			e = p(P, 'SECTION', { slot: !0, class: !0 });
			var F = C(e);
			l = p(F, 'DIV', { class: !0 });
			var q = C(l);
			j(t.$$.fragment, q),
				(i = T(q)),
				j(s.$$.fragment, q),
				(o = T(q)),
				j(u.$$.fragment, q),
				q.forEach(d),
				(g = T(F)),
				(f = p(F, 'INPUT', { class: !0, type: !0, placeholder: !0 })),
				(h = T(F)),
				(w = p(F, 'SPAN', { class: !0 }));
			var O = C(w);
			(R = V(O, L)), (m = V(O, ' result')), z && z.l(O), O.forEach(d), F.forEach(d), this.h();
		},
		h() {
			k(l, 'class', 'inputs'),
				k(f, 'class', 'searchbar'),
				k(f, 'type', 'text'),
				k(f, 'placeholder', 'Search for cultproposals...'),
				k(w, 'class', 'searchbar-count'),
				k(e, 'slot', 'controls'),
				k(e, 'class', 'controls');
		},
		m(P, F) {
			A(P, e, F),
				c(e, l),
				W(t, l, null),
				c(l, i),
				W(s, l, null),
				c(l, o),
				W(u, l, null),
				c(e, g),
				c(e, f),
				dt(f, r[0]),
				c(e, h),
				c(e, w),
				c(w, R),
				c(w, m),
				z && z.m(w, null),
				(U = !0),
				D || ((E = Rt(f, 'input', r[15])), (D = !0));
		},
		p(P, F) {
			const q = {};
			!n && F & 2 && ((n = !0), (q.value = P[1]), pe(() => (n = !1))), t.$set(q);
			const O = {};
			!a && F & 16 && ((a = !0), (O.value = P[4]), pe(() => (a = !1))), s.$set(O);
			const x = {};
			!_ && F & 4 && ((_ = !0), (x.value = P[2]), pe(() => (_ = !1))),
				u.$set(x),
				F & 1 && f.value !== P[0] && dt(f, P[0]),
				(!U || F & 8) && L !== (L = P[3].length + '') && Y(R, L),
				P[3].length !== 1 ? z || ((z = Tt()), z.c(), z.m(w, null)) : z && (z.d(1), (z = null));
		},
		i(P) {
			U || (B(t.$$.fragment, P), B(s.$$.fragment, P), B(u.$$.fragment, P), (U = !0));
		},
		o(P) {
			N(t.$$.fragment, P), N(s.$$.fragment, P), N(u.$$.fragment, P), (U = !1);
		},
		d(P) {
			P && d(e), J(t), J(s), J(u), z && z.d(), (D = !1), E();
		}
	};
}
function Ut(r) {
	let e, l;
	const t = [r[20]];
	let n = {};
	for (let i = 0; i < t.length; i += 1) n = be(n, t[i]);
	return (
		(e = new $t({ props: n })),
		{
			c() {
				Z(e.$$.fragment);
			},
			l(i) {
				j(e.$$.fragment, i);
			},
			m(i, s) {
				W(e, i, s), (l = !0);
			},
			p(i, s) {
				const a = s & 40 ? Dt(t, [St(i[20])]) : {};
				e.$set(a);
			},
			i(i) {
				l || (B(e.$$.fragment, i), (l = !0));
			},
			o(i) {
				N(e.$$.fragment, i), (l = !1);
			},
			d(i) {
				J(e, i);
			}
		}
	);
}
function il(r) {
	let e, l;
	function t(...a) {
		return r[11](r[17], ...a);
	}
	let n = r[3].filter(t),
		i = [];
	for (let a = 0; a < n.length; a += 1) i[a] = Ut(It(r, n, a));
	const s = (a) =>
		N(i[a], 1, 1, () => {
			i[a] = null;
		});
	return {
		c() {
			for (let a = 0; a < i.length; a += 1) i[a].c();
			e = I();
		},
		l(a) {
			for (let o = 0; o < i.length; o += 1) i[o].l(a);
			e = T(a);
		},
		m(a, o) {
			for (let u = 0; u < i.length; u += 1) i[u].m(a, o);
			A(a, e, o), (l = !0);
		},
		p(a, o) {
			if (((r = a), o & 40)) {
				n = r[3].filter(t);
				let u;
				for (u = 0; u < n.length; u += 1) {
					const _ = It(r, n, u);
					i[u]
						? (i[u].p(_, o), B(i[u], 1))
						: ((i[u] = Ut(_)), i[u].c(), B(i[u], 1), i[u].m(e.parentNode, e));
				}
				for (_e(), u = n.length; u < i.length; u += 1) s(u);
				de();
			}
		},
		i(a) {
			if (!l) {
				for (let o = 0; o < n.length; o += 1) B(i[o]);
				l = !0;
			}
		},
		o(a) {
			i = i.filter(Boolean);
			for (let o = 0; o < i.length; o += 1) N(i[o]);
			l = !1;
		},
		d(a) {
			We(i, a), a && d(e);
		}
	};
}
function Pt(r) {
	let e, l;
	return (
		(e = new Yt({
			props: {
				title: r[17].label || 'Unclassified',
				id: r[8][r[17].label] || r[17].label || 'unclassified',
				$$slots: { default: [il] },
				$$scope: { ctx: r }
			}
		})),
		{
			c() {
				Z(e.$$.fragment);
			},
			l(t) {
				j(e.$$.fragment, t);
			},
			m(t, n) {
				W(e, t, n), (l = !0);
			},
			p(t, n) {
				const i = {};
				n & 32 && (i.title = t[17].label || 'Unclassified'),
					n & 32 && (i.id = t[8][t[17].label] || t[17].label || 'unclassified'),
					n & 8388648 && (i.$$scope = { dirty: n, ctx: t }),
					e.$set(i);
			},
			i(t) {
				l || (B(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				N(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				J(e, t);
			}
		}
	);
}
function ol(r) {
	let e,
		l,
		t = r[5],
		n = [];
	for (let s = 0; s < t.length; s += 1) n[s] = Pt(yt(r, t, s));
	const i = (s) =>
		N(n[s], 1, 1, () => {
			n[s] = null;
		});
	return {
		c() {
			e = v('section');
			for (let s = 0; s < n.length; s += 1) n[s].c();
			this.h();
		},
		l(s) {
			e = p(s, 'SECTION', { slot: !0 });
			var a = C(e);
			for (let o = 0; o < n.length; o += 1) n[o].l(a);
			a.forEach(d), this.h();
		},
		h() {
			k(e, 'slot', 'items');
		},
		m(s, a) {
			A(s, e, a);
			for (let o = 0; o < n.length; o += 1) n[o].m(e, null);
			l = !0;
		},
		p(s, a) {
			if (a & 296) {
				t = s[5];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const u = yt(s, t, o);
					n[o]
						? (n[o].p(u, a), B(n[o], 1))
						: ((n[o] = Pt(u)), n[o].c(), B(n[o], 1), n[o].m(e, null));
				}
				for (_e(), o = t.length; o < n.length; o += 1) i(o);
				de();
			}
		},
		i(s) {
			if (!l) {
				for (let a = 0; a < t.length; a += 1) B(n[a]);
				l = !0;
			}
		},
		o(s) {
			n = n.filter(Boolean);
			for (let a = 0; a < n.length; a += 1) N(n[a]);
			l = !1;
		},
		d(s) {
			s && d(e), We(n, s);
		}
	};
}
function fl(r) {
	let e,
		l,
		t,
		n,
		i,
		s,
		a,
		o,
		u,
		_,
		g,
		f,
		h,
		w,
		L,
		R,
		m,
		U,
		D,
		E,
		y,
		M,
		$,
		Q,
		K,
		G,
		z,
		P,
		F,
		q,
		O,
		x,
		we,
		se,
		ke,
		Ee,
		ne,
		Ce,
		ye,
		re,
		Ie,
		Te,
		X,
		Qe,
		Ue,
		ae,
		Pe,
		Le,
		ie,
		Re,
		Be,
		oe,
		De,
		Se,
		fe,
		Ve,
		Ne,
		ce,
		Ae,
		ze,
		ue,
		He,
		Fe,
		ge;
	return (
		(e = new qt({ props: { title: 'CULT News' } })),
		(_ = new rl({
			props: { title: '', $$slots: { items: [ol], controls: [al] }, $$scope: { ctx: r } }
		})),
		{
			c() {
				Z(e.$$.fragment),
					(l = I()),
					(t = v('div')),
					(n = v('h1')),
					(i = S('CULT News')),
					(s = S(`

	Please add CULT news via
	`)),
					(a = v('a')),
					(o = S('pull request')),
					(u = S(`.
	

`)),
					Z(_.$$.fragment),
					(g = I()),
					(f = v('p')),
					(h = v('br')),
					(w = I()),
					(L = v('h3')),
					(R = S('New CULT Shops Going Live')),
					(m = I()),
					(U = v('br')),
					(D = v('br')),
					(E = I()),
					(y = v('a')),
					(M = S('dripxkarip.com')),
					($ = v('br')),
					(Q = v('br')),
					(K = I()),
					(G = v('a')),
					(z = S('shop2revolt.com')),
					(P = v('br')),
					(F = v('br')),
					(q = I()),
					(O = v('a')),
					(x = S('cultdaodizayn.com')),
					(we = I()),
					(se = v('p')),
					(ke = v('br')),
					(Ee = I()),
					(ne = v('p')),
					(Ce = v('br')),
					(ye = I()),
					(re = v('h3')),
					(Ie = S('revolt.cultoshi.com is Optimizing the Voting Process')),
					(Te = I()),
					(X = v('embed')),
					(Ue = I()),
					(ae = v('p')),
					(Pe = v('br')),
					(Le = I()),
					(ie = v('p')),
					(Re = v('br')),
					(Be = I()),
					(oe = v('h3')),
					(De = S('CULT Chat Feature Under Construction')),
					(Se = S(`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`)),
					(fe = v('p')),
					(Ve = v('br')),
					(Ne = I()),
					(ce = v('p')),
					(Ae = v('br')),
					(ze = I()),
					(ue = v('h3')),
					(He = S('CULT Market Feature Under Construction')),
					(Fe = S(`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`)),
					this.h();
			},
			l(H) {
				j(e.$$.fragment, H), (l = T(H)), (t = p(H, 'DIV', { class: !0 }));
				var b = C(t);
				n = p(b, 'H1', {});
				var he = C(n);
				(i = V(he, 'CULT News')),
					he.forEach(d),
					(s = V(
						b,
						`

	Please add CULT news via
	`
					)),
					(a = p(b, 'A', { href: !0, target: !0 }));
				var $e = C(a);
				(o = V($e, 'pull request')),
					$e.forEach(d),
					(u = V(
						b,
						`.
	

`
					)),
					j(_.$$.fragment, b),
					(g = T(b)),
					(f = p(b, 'P', {}));
				var Ke = C(f);
				(h = p(Ke, 'BR', {})), Ke.forEach(d), (w = T(b)), (L = p(b, 'H3', {}));
				var Xe = C(L);
				(R = V(Xe, 'New CULT Shops Going Live')),
					Xe.forEach(d),
					(m = T(b)),
					(U = p(b, 'BR', {})),
					(D = p(b, 'BR', {})),
					(E = T(b)),
					(y = p(b, 'A', { href: !0, target: !0 }));
				var Ye = C(y);
				(M = V(Ye, 'dripxkarip.com')),
					Ye.forEach(d),
					($ = p(b, 'BR', {})),
					(Q = p(b, 'BR', {})),
					(K = T(b)),
					(G = p(b, 'A', { href: !0, target: !0 }));
				var xe = C(G);
				(z = V(xe, 'shop2revolt.com')),
					xe.forEach(d),
					(P = p(b, 'BR', {})),
					(F = p(b, 'BR', {})),
					(q = T(b)),
					(O = p(b, 'A', { href: !0, target: !0 }));
				var et = C(O);
				(x = V(et, 'cultdaodizayn.com')), et.forEach(d), (we = T(b)), (se = p(b, 'P', {}));
				var tt = C(se);
				(ke = p(tt, 'BR', {})), tt.forEach(d), (Ee = T(b)), (ne = p(b, 'P', {}));
				var lt = C(ne);
				(Ce = p(lt, 'BR', {})), lt.forEach(d), (ye = T(b)), (re = p(b, 'H3', {}));
				var st = C(re);
				(Ie = V(st, 'revolt.cultoshi.com is Optimizing the Voting Process')),
					st.forEach(d),
					(Te = T(b)),
					(X = p(b, 'EMBED', { type: !0, src: !0, width: !0, height: !0 })),
					(Ue = T(b)),
					(ae = p(b, 'P', {}));
				var nt = C(ae);
				(Pe = p(nt, 'BR', {})), nt.forEach(d), (Le = T(b)), (ie = p(b, 'P', {}));
				var rt = C(ie);
				(Re = p(rt, 'BR', {})), rt.forEach(d), (Be = T(b)), (oe = p(b, 'H3', {}));
				var at = C(oe);
				(De = V(at, 'CULT Chat Feature Under Construction')),
					at.forEach(d),
					(Se = V(
						b,
						`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`
					)),
					(fe = p(b, 'P', {}));
				var it = C(fe);
				(Ve = p(it, 'BR', {})), it.forEach(d), (Ne = T(b)), (ce = p(b, 'P', {}));
				var ot = C(ce);
				(Ae = p(ot, 'BR', {})), ot.forEach(d), (ze = T(b)), (ue = p(b, 'H3', {}));
				var ft = C(ue);
				(He = V(ft, 'CULT Market Feature Under Construction')),
					ft.forEach(d),
					(Fe = V(
						b,
						`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`
					)),
					b.forEach(d),
					this.h();
			},
			h() {
				k(a, 'href', 'https://www.youtube.com/watch?v=8lGpZkjnkt4'),
					k(a, 'target', '_blank'),
					k(y, 'href', 'https://dripxkarip.com'),
					k(y, 'target', '_blank'),
					k(G, 'href', 'https://www.shop2revolt.com'),
					k(G, 'target', '_blank'),
					k(O, 'href', 'https://www.cultdaodizayn.com'),
					k(O, 'target', '_blank'),
					k(X, 'type', 'text/html'),
					Je(X.src, (Qe = 'https://revolt.cultoshi.com/')) || k(X, 'src', Qe),
					k(X, 'width', '100%'),
					k(X, 'height', '1100vh'),
					k(t, 'class', 'text-center');
			},
			m(H, b) {
				W(e, H, b),
					A(H, l, b),
					A(H, t, b),
					c(t, n),
					c(n, i),
					c(t, s),
					c(t, a),
					c(a, o),
					c(t, u),
					W(_, t, null),
					c(t, g),
					c(t, f),
					c(f, h),
					c(t, w),
					c(t, L),
					c(L, R),
					c(t, m),
					c(t, U),
					c(t, D),
					c(t, E),
					c(t, y),
					c(y, M),
					c(t, $),
					c(t, Q),
					c(t, K),
					c(t, G),
					c(G, z),
					c(t, P),
					c(t, F),
					c(t, q),
					c(t, O),
					c(O, x),
					c(t, we),
					c(t, se),
					c(se, ke),
					c(t, Ee),
					c(t, ne),
					c(ne, Ce),
					c(t, ye),
					c(t, re),
					c(re, Ie),
					c(t, Te),
					c(t, X),
					c(t, Ue),
					c(t, ae),
					c(ae, Pe),
					c(t, Le),
					c(t, ie),
					c(ie, Re),
					c(t, Be),
					c(t, oe),
					c(oe, De),
					c(t, Se),
					c(t, fe),
					c(fe, Ve),
					c(t, Ne),
					c(t, ce),
					c(ce, Ae),
					c(t, ze),
					c(t, ue),
					c(ue, He),
					c(t, Fe),
					(ge = !0);
			},
			p(H, [b]) {
				const he = {};
				b & 8388671 && (he.$$scope = { dirty: b, ctx: H }), _.$set(he);
			},
			i(H) {
				ge || (B(e.$$.fragment, H), B(_.$$.fragment, H), (ge = !0));
			},
			o(H) {
				N(e.$$.fragment, H), N(_.$$.fragment, H), (ge = !1);
			},
			d(H) {
				J(e, H), H && d(l), H && d(t), J(_);
			}
		}
	);
}
let Lt = null;
function cl(r, e, l) {
	let t, n, i, s;
	const a = Me(Ct, 'tags');
	let o = [],
		u = null;
	const _ = [{ label: 'All', value: null }, ...Me(Ot, 'category')];
	let g = null,
		f = { value: 'stars_desc', label: 'Stars Desc' };
	const h = (E, y) => E.filter((M) => y.includes(M)),
		w = {
			'Bundler Plugins': 'bundling',
			Debugging: 'debugging',
			'Editor Extensions': 'editor-support',
			'Linting and Formatting': 'code-quality',
			Preprocessors: 'preprocessors'
		},
		L = (E, y) => y.category === E.value;
	function R(E) {
		(u = E), l(1, u);
	}
	function m(E) {
		(g = E), l(4, g);
	}
	function U(E) {
		(f = E), l(2, f);
	}
	function D() {
		(s = this.value), l(0, s);
	}
	return (
		(r.$$.update = () => {
			r.$$.dirty & 4 && l(10, (t = (f == null ? void 0 : f.value) || 'stars_desc')),
				r.$$.dirty & 2 && l(9, (o = (u == null ? void 0 : u.map((E) => E.value)) || [])),
				r.$$.dirty & 1537 &&
					l(
						3,
						(n = Ct.filter((E) =>
							!s && o.length === 0 && Lt === null
								? !0
								: !(
										(s &&
											!(
												E.title.toLowerCase().includes(s.toLowerCase()) ||
												E.description.toLowerCase().includes(s.toLowerCase())
											)) ||
										(o.length > 0 && h(o, E.tags).length === 0) ||
										Lt !== null
								  )
						).sort(zt(t)))
					),
				r.$$.dirty & 8 && l(5, (i = Me(n, 'category')));
		}),
		[s, u, f, n, g, i, a, _, w, o, t, L, R, m, U, D]
	);
}
class bl extends ee {
	constructor(e) {
		super(), te(this, e, cl, fl, le, {});
	}
}
export { bl as default };
