import {
	S as K,
	i as X,
	s as Y,
	k as v,
	q as D,
	l as p,
	m as C,
	r as S,
	h as g,
	n as k,
	a7 as ft,
	b as z,
	C as f,
	V as Rt,
	a8 as Vt,
	u as j,
	A as ut,
	a as U,
	c as L,
	J as ht,
	f as P,
	g as oe,
	t as V,
	d as ce,
	v as H,
	w as F,
	x as M,
	y as O,
	D as je,
	p as We,
	B as Je,
	F as He,
	G as Fe,
	H as Me,
	I as Oe,
	N as ue,
	R as Ge,
	T as qe,
	O as Bt,
	P as Dt,
	W as Ze,
	a9 as dt,
	Q as Nt,
	U as _t
} from '../../../chunks/index-2fad9c0c.js';
import '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { c as zt, S as At } from '../../../chunks/Select-8360dfd8.js';
import { e as Ae } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { c as Ht } from '../../../chunks/cultproposals-ee6a2386.js';
import { S as Ft } from '../../../chunks/Seo-73f932eb.js';
import '../../../chunks/stores-47dd025f.js';
import '../../../chunks/singletons-c216a8d1.js';
function Mt(r) {
	let e, l, t, s, i;
	return {
		c() {
			(e = v('div')), (l = D(r[0])), this.h();
		},
		l(n) {
			e = p(n, 'DIV', { class: !0 });
			var a = C(e);
			(l = S(a, r[0])), a.forEach(g), this.h();
		},
		h() {
			k(e, 'class', (t = ft(r[1]) + ' svelte-ugev5v'));
		},
		m(n, a) {
			z(n, e, a),
				f(e, l),
				s ||
					((i = Rt(e, 'click', function () {
						Vt(r[2]) && r[2].apply(this, arguments);
					})),
					(s = !0));
		},
		p(n, [a]) {
			(r = n),
				a & 1 && j(l, r[0]),
				a & 2 && t !== (t = ft(r[1]) + ' svelte-ugev5v') && k(e, 'class', t);
		},
		i: ut,
		o: ut,
		d(n) {
			n && g(e), (s = !1), i();
		}
	};
}
function Ot(r, e, l) {
	let { title: t = '' } = e,
		{ variant: s } = e,
		{ click: i = void 0 } = e;
	return (
		(r.$$set = (n) => {
			'title' in n && l(0, (t = n.title)),
				'variant' in n && l(1, (s = n.variant)),
				'click' in n && l(2, (i = n.click));
		}),
		[t, s, i]
	);
}
class St extends K {
	constructor(e) {
		super(), X(this, e, Ot, Mt, Y, { title: 0, variant: 1, click: 2 });
	}
}
function gt(r, e, l) {
	const t = r.slice();
	return (t[14] = e[l]), t;
}
function mt(r) {
	let e, l;
	return (
		(e = new St({
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
				F(e.$$.fragment, t);
			},
			m(t, s) {
				M(e, t, s), (l = !0);
			},
			p(t, s) {
				const i = {};
				s & 832 && (i.title = t[9] ? 'copied!' : `${t[11][t[8]]} ${t[12](t[6])}`), e.$set(i);
			},
			i(t) {
				l || (P(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				V(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				O(e, t);
			}
		}
	);
}
function vt(r) {
	let e,
		l,
		t = r[3],
		s = [];
	for (let n = 0; n < t.length; n += 1) s[n] = pt(gt(r, t, n));
	const i = (n) =>
		V(s[n], 1, 1, () => {
			s[n] = null;
		});
	return {
		c() {
			e = v('div');
			for (let n = 0; n < s.length; n += 1) s[n].c();
			this.h();
		},
		l(n) {
			e = p(n, 'DIV', { class: !0 });
			var a = C(e);
			for (let o = 0; o < s.length; o += 1) s[o].l(a);
			a.forEach(g), this.h();
		},
		h() {
			k(e, 'class', 'card__tags svelte-1p17aya');
		},
		m(n, a) {
			z(n, e, a);
			for (let o = 0; o < s.length; o += 1) s[o].m(e, null);
			l = !0;
		},
		p(n, a) {
			if (a & 8) {
				t = n[3];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const u = gt(n, t, o);
					s[o]
						? (s[o].p(u, a), P(s[o], 1))
						: ((s[o] = pt(u)), s[o].c(), P(s[o], 1), s[o].m(e, null));
				}
				for (oe(), o = t.length; o < s.length; o += 1) i(o);
				ce();
			}
		},
		i(n) {
			if (!l) {
				for (let a = 0; a < t.length; a += 1) P(s[a]);
				l = !0;
			}
		},
		o(n) {
			s = s.filter(Boolean);
			for (let a = 0; a < s.length; a += 1) V(s[a]);
			l = !1;
		},
		d(n) {
			n && g(e), je(s, n);
		}
	};
}
function pt(r) {
	let e, l;
	return (
		(e = new St({ props: { title: r[14], variant: 'blue' } })),
		{
			c() {
				H(e.$$.fragment);
			},
			l(t) {
				F(e.$$.fragment, t);
			},
			m(t, s) {
				M(e, t, s), (l = !0);
			},
			p(t, s) {
				const i = {};
				s & 8 && (i.title = t[14]), e.$set(i);
			},
			i(t) {
				l || (P(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				V(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				O(e, t);
			}
		}
	);
}
function bt(r) {
	let e, l, t, s, i, n, a, o, u;
	function h(_, E) {
		if (
			(E & 160 && (t = null),
			E & 160 && (s = null),
			t == null && (t = !!(_[7] || _[5]).includes('github')),
			t)
		)
			return qt;
		if ((s == null && (s = !!(_[7] || _[5]).includes('gitlab')), s)) return Gt;
	}
	let m = h(r, -1),
		c = m && m(r);
	return {
		c() {
			(e = v('div')),
				(l = v('div')),
				c && c.c(),
				(i = U()),
				(n = v('div')),
				(a = D(`\u2605
				`)),
				(o = v('code')),
				(u = D(r[4])),
				this.h();
		},
		l(_) {
			e = p(_, 'DIV', { class: !0 });
			var E = C(e);
			l = p(E, 'DIV', { class: !0 });
			var R = C(l);
			c && c.l(R), R.forEach(g), (i = L(E)), (n = p(E, 'DIV', { class: !0 }));
			var B = C(n);
			(a = S(
				B,
				`\u2605
				`
			)),
				(o = p(B, 'CODE', {}));
			var d = C(o);
			(u = S(d, r[4])), d.forEach(g), B.forEach(g), E.forEach(g), this.h();
		},
		h() {
			k(l, 'class', 'svelte-1p17aya'),
				k(n, 'class', 'svelte-1p17aya'),
				k(e, 'class', 'card__bottom svelte-1p17aya');
		},
		m(_, E) {
			z(_, e, E), f(e, l), c && c.m(l, null), f(e, i), f(e, n), f(n, a), f(n, o), f(o, u);
		},
		p(_, E) {
			m !== (m = h(_, E)) && (c && c.d(1), (c = m && m(_)), c && (c.c(), c.m(l, null))),
				E & 16 && j(u, _[4]);
		},
		d(_) {
			_ && g(e), c && c.d();
		}
	};
}
function Gt(r) {
	let e, l;
	return {
		c() {
			(e = v('img')), this.h();
		},
		l(t) {
			(e = p(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			We(e, 'display', 'inline'),
				Je(e.src, (l = '/images/gitlab_logo.svg')) || k(e, 'src', l),
				k(e, 'alt', 'gitlab logo');
		},
		m(t, s) {
			z(t, e, s);
		},
		d(t) {
			t && g(e);
		}
	};
}
function qt(r) {
	let e, l;
	return {
		c() {
			(e = v('img')), this.h();
		},
		l(t) {
			(e = p(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			We(e, 'display', 'inline'),
				Je(e.src, (l = '/images/github_logo.svg')) || k(e, 'src', l),
				k(e, 'alt', 'github logo');
		},
		m(t, s) {
			z(t, e, s);
		},
		d(t) {
			t && g(e);
		}
	};
}
function Zt(r) {
	let e,
		l,
		t,
		s,
		i,
		n,
		a,
		o,
		u,
		h,
		m,
		c,
		_,
		E,
		R,
		B,
		d = r[6] && mt(r),
		w = r[3] && vt(r),
		I = typeof r[4] < 'u' && bt(r);
	return {
		c() {
			(e = v('div')),
				(l = v('h3')),
				(t = v('a')),
				(s = D('#')),
				(n = U()),
				(a = v('a')),
				(o = D(r[1])),
				(u = U()),
				d && d.c(),
				(h = U()),
				(m = v('p')),
				(c = D(r[2])),
				(_ = U()),
				w && w.c(),
				(E = U()),
				I && I.c(),
				this.h();
		},
		l(T) {
			e = p(T, 'DIV', { class: !0, id: !0 });
			var y = C(e);
			l = p(y, 'H3', { class: !0 });
			var A = C(l);
			t = p(A, 'A', { href: !0 });
			var W = C(t);
			(s = S(W, '#')), W.forEach(g), (n = L(A)), (a = p(A, 'A', { href: !0 }));
			var J = C(a);
			(o = S(J, r[1])),
				J.forEach(g),
				(u = L(A)),
				d && d.l(A),
				A.forEach(g),
				(h = L(y)),
				(m = p(y, 'P', { class: !0 }));
			var Q = C(m);
			(c = S(Q, r[2])),
				Q.forEach(g),
				(_ = L(y)),
				w && w.l(y),
				(E = L(y)),
				I && I.l(y),
				y.forEach(g),
				this.h();
		},
		h() {
			k(t, 'href', (i = '#component-' + encodeURI(r[1]))),
				k(a, 'href', r[5]),
				k(l, 'class', 'svelte-1p17aya'),
				k(m, 'class', 'flex-grow svelte-1p17aya'),
				k(e, 'class', 'card svelte-1p17aya'),
				k(e, 'id', (R = 'component-' + encodeURI(r[1]))),
				ht(e, 'active', r[0]);
		},
		m(T, y) {
			z(T, e, y),
				f(e, l),
				f(l, t),
				f(t, s),
				f(l, n),
				f(l, a),
				f(a, o),
				f(l, u),
				d && d.m(l, null),
				f(e, h),
				f(e, m),
				f(m, c),
				f(e, _),
				w && w.m(e, null),
				f(e, E),
				I && I.m(e, null),
				(B = !0);
		},
		p(T, [y]) {
			(!B || (y & 2 && i !== (i = '#component-' + encodeURI(T[1])))) && k(t, 'href', i),
				(!B || y & 2) && j(o, T[1]),
				(!B || y & 32) && k(a, 'href', T[5]),
				T[6]
					? d
						? (d.p(T, y), y & 64 && P(d, 1))
						: ((d = mt(T)), d.c(), P(d, 1), d.m(l, null))
					: d &&
					  (oe(),
					  V(d, 1, 1, () => {
							d = null;
					  }),
					  ce()),
				(!B || y & 4) && j(c, T[2]),
				T[3]
					? w
						? (w.p(T, y), y & 8 && P(w, 1))
						: ((w = vt(T)), w.c(), P(w, 1), w.m(e, E))
					: w &&
					  (oe(),
					  V(w, 1, 1, () => {
							w = null;
					  }),
					  ce()),
				typeof T[4] < 'u'
					? I
						? I.p(T, y)
						: ((I = bt(T)), I.c(), I.m(e, null))
					: I && (I.d(1), (I = null)),
				(!B || (y & 2 && R !== (R = 'component-' + encodeURI(T[1])))) && k(e, 'id', R),
				y & 1 && ht(e, 'active', T[0]);
		},
		i(T) {
			B || (P(d), P(w), (B = !0));
		},
		o(T) {
			V(d), V(w), (B = !1);
		},
		d(T) {
			T && g(e), d && d.d(), w && w.d(), I && I.d();
		}
	};
}
function jt(r, e, l) {
	let { active: t = !1 } = e,
		{ title: s = '' } = e,
		{ description: i = '' } = e,
		{ tags: n = [] } = e,
		{ stars: a } = e,
		{ url: o = '' } = e,
		{ npm: u = '' } = e,
		{ repo: h = '' } = e,
		{ manager: m = 'npm' } = e,
		c = !1;
	const _ = () => {
			zt(`${E[m]} ${R(u)}`).then(() => l(9, (c = !1))), l(9, (c = !0));
		},
		E = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' },
		R = (d) => d.replace('https://www.npmjs.com/package/', ''),
		B = () => _();
	return (
		(r.$$set = (d) => {
			'active' in d && l(0, (t = d.active)),
				'title' in d && l(1, (s = d.title)),
				'description' in d && l(2, (i = d.description)),
				'tags' in d && l(3, (n = d.tags)),
				'stars' in d && l(4, (a = d.stars)),
				'url' in d && l(5, (o = d.url)),
				'npm' in d && l(6, (u = d.npm)),
				'repo' in d && l(7, (h = d.repo)),
				'manager' in d && l(8, (m = d.manager));
		}),
		[t, s, i, n, a, o, u, h, m, c, _, E, R, B]
	);
}
class Wt extends K {
	constructor(e) {
		super(),
			X(this, e, jt, Zt, Y, {
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
function Jt(r) {
	let e, l, t, s, i, n, a, o, u, h;
	const m = r[3].default,
		c = He(m, r, r[2], null);
	return {
		c() {
			(e = v('div')),
				(l = v('h1')),
				(t = D(r[0])),
				(s = U()),
				(i = v('a')),
				(n = D('#')),
				(o = U()),
				(u = v('div')),
				c && c.c(),
				this.h();
		},
		l(_) {
			e = p(_, 'DIV', { class: !0 });
			var E = C(e);
			l = p(E, 'H1', { id: !0, class: !0 });
			var R = C(l);
			(t = S(R, r[0])), (s = L(R)), (i = p(R, 'A', { href: !0 }));
			var B = C(i);
			(n = S(B, '#')), B.forEach(g), R.forEach(g), (o = L(E)), (u = p(E, 'DIV', { class: !0 }));
			var d = C(u);
			c && c.l(d), d.forEach(g), E.forEach(g), this.h();
		},
		h() {
			k(i, 'href', (a = '#' + r[1])),
				k(l, 'id', r[1]),
				k(l, 'class', 'svelte-6ivwg1'),
				k(u, 'class', 'grid svelte-6ivwg1'),
				k(e, 'class', 'list svelte-6ivwg1');
		},
		m(_, E) {
			z(_, e, E),
				f(e, l),
				f(l, t),
				f(l, s),
				f(l, i),
				f(i, n),
				f(e, o),
				f(e, u),
				c && c.m(u, null),
				(h = !0);
		},
		p(_, [E]) {
			(!h || E & 1) && j(t, _[0]),
				(!h || (E & 2 && a !== (a = '#' + _[1]))) && k(i, 'href', a),
				(!h || E & 2) && k(l, 'id', _[1]),
				c && c.p && (!h || E & 4) && Fe(c, m, _, _[2], h ? Oe(m, _[2], E, null) : Me(_[2]), null);
		},
		i(_) {
			h || (P(c, _), (h = !0));
		},
		o(_) {
			V(c, _), (h = !1);
		},
		d(_) {
			_ && g(e), c && c.d(_);
		}
	};
}
function Qt(r, e, l) {
	let { $$slots: t = {}, $$scope: s } = e,
		{ title: i } = e,
		{ id: n = `category-${encodeURI(i)}` } = e;
	return (
		(r.$$set = (a) => {
			'title' in a && l(0, (i = a.title)),
				'id' in a && l(1, (n = a.id)),
				'$$scope' in a && l(2, (s = a.$$scope));
		}),
		[i, n, s, t]
	);
}
class Kt extends K {
	constructor(e) {
		super(), X(this, e, Qt, Jt, Y, { title: 0, id: 1 });
	}
}
function wt(r) {
	let e, l;
	return {
		c() {
			(e = v('span')), (l = D(r[1])), this.h();
		},
		l(t) {
			e = p(t, 'SPAN', { class: !0 });
			var s = C(e);
			(l = S(s, r[1])), s.forEach(g), this.h();
		},
		h() {
			k(e, 'class', 'svelte-phe5gt');
		},
		m(t, s) {
			z(t, e, s), f(e, l);
		},
		p(t, s) {
			s & 2 && j(l, t[1]);
		},
		d(t) {
			t && g(e);
		}
	};
}
function Xt(r) {
	let e,
		l,
		t,
		s,
		i,
		n = r[1] && wt(r);
	const a = [{ containerClasses: 'select-container' }, r[2]];
	function o(h) {
		r[3](h);
	}
	let u = {};
	for (let h = 0; h < a.length; h += 1) u = ue(u, a[h]);
	return (
		r[0] !== void 0 && (u.value = r[0]),
		(t = new At({ props: u })),
		Ge.push(() => qe(t, 'value', o)),
		{
			c() {
				(e = v('div')), n && n.c(), (l = U()), H(t.$$.fragment), this.h();
			},
			l(h) {
				e = p(h, 'DIV', { class: !0 });
				var m = C(e);
				n && n.l(m), (l = L(m)), F(t.$$.fragment, m), m.forEach(g), this.h();
			},
			h() {
				k(e, 'class', 'themed svelte-phe5gt');
			},
			m(h, m) {
				z(h, e, m), n && n.m(e, null), f(e, l), M(t, e, null), (i = !0);
			},
			p(h, [m]) {
				h[1] ? (n ? n.p(h, m) : ((n = wt(h)), n.c(), n.m(e, l))) : n && (n.d(1), (n = null));
				const c = m & 4 ? Bt(a, [a[0], Dt(h[2])]) : {};
				!s && m & 1 && ((s = !0), (c.value = h[0]), Ze(() => (s = !1))), t.$set(c);
			},
			i(h) {
				i || (P(t.$$.fragment, h), (i = !0));
			},
			o(h) {
				V(t.$$.fragment, h), (i = !1);
			},
			d(h) {
				h && g(e), n && n.d(), O(t);
			}
		}
	);
}
function Yt(r, e, l) {
	const t = ['value', 'label'];
	let s = dt(e, t),
		{ value: i } = e,
		{ label: n = '' } = e;
	function a(o) {
		(i = o), l(0, i);
	}
	return (
		(r.$$set = (o) => {
			(e = ue(ue({}, e), Nt(o))),
				l(2, (s = dt(e, t))),
				'value' in o && l(0, (i = o.value)),
				'label' in o && l(1, (n = o.label));
		}),
		[i, n, s, a]
	);
}
class kt extends K {
	constructor(e) {
		super(), X(this, e, Yt, Xt, Y, { value: 0, label: 1 });
	}
}
const $t = (r) => ({}),
	Et = (r) => ({}),
	xt = (r) => ({}),
	Ct = (r) => ({});
function el(r) {
	let e, l, t, s, i, n, a;
	const o = r[2].controls,
		u = He(o, r, r[1], Ct),
		h = r[2].items,
		m = He(h, r, r[1], Et);
	return {
		c() {
			(e = v('h1')),
				(l = D(r[0])),
				(t = U()),
				u && u.c(),
				(s = U()),
				(i = v('hr')),
				(n = U()),
				m && m.c();
		},
		l(c) {
			e = p(c, 'H1', {});
			var _ = C(e);
			(l = S(_, r[0])),
				_.forEach(g),
				(t = L(c)),
				u && u.l(c),
				(s = L(c)),
				(i = p(c, 'HR', {})),
				(n = L(c)),
				m && m.l(c);
		},
		m(c, _) {
			z(c, e, _),
				f(e, l),
				z(c, t, _),
				u && u.m(c, _),
				z(c, s, _),
				z(c, i, _),
				z(c, n, _),
				m && m.m(c, _),
				(a = !0);
		},
		p(c, [_]) {
			(!a || _ & 1) && j(l, c[0]),
				u && u.p && (!a || _ & 2) && Fe(u, o, c, c[1], a ? Oe(o, c[1], _, xt) : Me(c[1]), Ct),
				m && m.p && (!a || _ & 2) && Fe(m, h, c, c[1], a ? Oe(h, c[1], _, $t) : Me(c[1]), Et);
		},
		i(c) {
			a || (P(u, c), P(m, c), (a = !0));
		},
		o(c) {
			V(u, c), V(m, c), (a = !1);
		},
		d(c) {
			c && g(e), c && g(t), u && u.d(c), c && g(s), c && g(i), c && g(n), m && m.d(c);
		}
	};
}
function tl(r, e, l) {
	let { $$slots: t = {}, $$scope: s } = e,
		{ title: i } = e;
	return (
		(r.$$set = (n) => {
			'title' in n && l(0, (i = n.title)), '$$scope' in n && l(1, (s = n.$$scope));
		}),
		[i, s, t]
	);
}
class ll extends K {
	constructor(e) {
		super(), X(this, e, tl, el, Y, { title: 0 });
	}
}
const yt = [
	{
		addedOn: '2021-08-09T10:14:05.723Z',
		title: 'Act of RVLT 973',
		category: 'Promotion',
		description: 'Cool designs coming from 973',
		url: 'https://drive.google.com/drive/folders/1uDpzUovNCFh2FRTxFSriiZLIOdAbZWHU',
		tags: ['designs'],
		stars: 402
	},
	{
		addedOn: '2021-08-09T10:14:05.723Z',
		title: 'New CULT Shops Going Live',
		category: 'Promotion',
		description: 'New CULT Shops Going Live',
		url: 'https://github.com/sveltejs/svelte-loader',
		tags: ['shops', 'merchandise'],
		stars: 492
	}
];
function Tt(r, e, l) {
	const t = r.slice();
	return (t[14] = e[l]), t;
}
function It(r, e, l) {
	const t = r.slice();
	return (t[17] = e[l]), t;
}
function sl(r) {
	let e, l, t, s, i, n, a, o, u, h, m, c, _;
	function E(w) {
		r[10](w);
	}
	let R = { items: r[5], isMulti: !0, label: 'Tags' };
	r[1] !== void 0 && (R.value = r[1]), (t = new kt({ props: R })), Ge.push(() => qe(t, 'value', E));
	function B(w) {
		r[11](w);
	}
	let d = {
		label: 'Category',
		items: r[6],
		placeholder: 'Category',
		isClearable: !1,
		showIndicator: !0
	};
	return (
		r[3] !== void 0 && (d.value = r[3]),
		(n = new kt({ props: d })),
		Ge.push(() => qe(n, 'value', B)),
		{
			c() {
				(e = v('section')),
					(l = v('div')),
					H(t.$$.fragment),
					(i = U()),
					H(n.$$.fragment),
					(o = U()),
					(u = v('div')),
					(h = v('input')),
					this.h();
			},
			l(w) {
				e = p(w, 'SECTION', { slot: !0, class: !0 });
				var I = C(e);
				l = p(I, 'DIV', { class: !0 });
				var T = C(l);
				F(t.$$.fragment, T),
					(i = L(T)),
					F(n.$$.fragment, T),
					T.forEach(g),
					(o = L(I)),
					(u = p(I, 'DIV', { class: !0 }));
				var y = C(u);
				(h = p(y, 'INPUT', { style: !0, class: !0, type: !0, placeholder: !0 })),
					y.forEach(g),
					I.forEach(g),
					this.h();
			},
			h() {
				k(l, 'class', 'inputs'),
					We(h, 'width', '100%'),
					k(h, 'class', 'searchbar text-center'),
					k(h, 'type', 'text'),
					k(h, 'placeholder', 'Search through cultnews...'),
					k(u, 'class', 'text-center'),
					k(e, 'slot', 'controls'),
					k(e, 'class', 'controls');
			},
			m(w, I) {
				z(w, e, I),
					f(e, l),
					M(t, l, null),
					f(l, i),
					M(n, l, null),
					f(e, o),
					f(e, u),
					f(u, h),
					_t(h, r[0]),
					(m = !0),
					c || ((_ = Rt(h, 'input', r[12])), (c = !0));
			},
			p(w, I) {
				const T = {};
				!s && I & 2 && ((s = !0), (T.value = w[1]), Ze(() => (s = !1))), t.$set(T);
				const y = {};
				!a && I & 8 && ((a = !0), (y.value = w[3]), Ze(() => (a = !1))),
					n.$set(y),
					I & 1 && h.value !== w[0] && _t(h, w[0]);
			},
			i(w) {
				m || (P(t.$$.fragment, w), P(n.$$.fragment, w), (m = !0));
			},
			o(w) {
				V(t.$$.fragment, w), V(n.$$.fragment, w), (m = !1);
			},
			d(w) {
				w && g(e), O(t), O(n), (c = !1), _();
			}
		}
	);
}
function Ut(r) {
	let e, l;
	const t = [r[17]];
	let s = {};
	for (let i = 0; i < t.length; i += 1) s = ue(s, t[i]);
	return (
		(e = new Wt({ props: s })),
		{
			c() {
				H(e.$$.fragment);
			},
			l(i) {
				F(e.$$.fragment, i);
			},
			m(i, n) {
				M(e, i, n), (l = !0);
			},
			p(i, n) {
				const a = n & 20 ? Bt(t, [Dt(i[17])]) : {};
				e.$set(a);
			},
			i(i) {
				l || (P(e.$$.fragment, i), (l = !0));
			},
			o(i) {
				V(e.$$.fragment, i), (l = !1);
			},
			d(i) {
				O(e, i);
			}
		}
	);
}
function nl(r) {
	let e, l;
	function t(...a) {
		return r[9](r[14], ...a);
	}
	let s = r[2].filter(t),
		i = [];
	for (let a = 0; a < s.length; a += 1) i[a] = Ut(It(r, s, a));
	const n = (a) =>
		V(i[a], 1, 1, () => {
			i[a] = null;
		});
	return {
		c() {
			for (let a = 0; a < i.length; a += 1) i[a].c();
			e = U();
		},
		l(a) {
			for (let o = 0; o < i.length; o += 1) i[o].l(a);
			e = L(a);
		},
		m(a, o) {
			for (let u = 0; u < i.length; u += 1) i[u].m(a, o);
			z(a, e, o), (l = !0);
		},
		p(a, o) {
			if (((r = a), o & 20)) {
				s = r[2].filter(t);
				let u;
				for (u = 0; u < s.length; u += 1) {
					const h = It(r, s, u);
					i[u]
						? (i[u].p(h, o), P(i[u], 1))
						: ((i[u] = Ut(h)), i[u].c(), P(i[u], 1), i[u].m(e.parentNode, e));
				}
				for (oe(), u = s.length; u < i.length; u += 1) n(u);
				ce();
			}
		},
		i(a) {
			if (!l) {
				for (let o = 0; o < s.length; o += 1) P(i[o]);
				l = !0;
			}
		},
		o(a) {
			i = i.filter(Boolean);
			for (let o = 0; o < i.length; o += 1) V(i[o]);
			l = !1;
		},
		d(a) {
			je(i, a), a && g(e);
		}
	};
}
function Lt(r) {
	let e, l;
	return (
		(e = new Kt({
			props: {
				title: r[14].label || 'Unclassified',
				id: r[7][r[14].label] || r[14].label || 'unclassified',
				$$slots: { default: [nl] },
				$$scope: { ctx: r }
			}
		})),
		{
			c() {
				H(e.$$.fragment);
			},
			l(t) {
				F(e.$$.fragment, t);
			},
			m(t, s) {
				M(e, t, s), (l = !0);
			},
			p(t, s) {
				const i = {};
				s & 16 && (i.title = t[14].label || 'Unclassified'),
					s & 16 && (i.id = t[7][t[14].label] || t[14].label || 'unclassified'),
					s & 1048596 && (i.$$scope = { dirty: s, ctx: t }),
					e.$set(i);
			},
			i(t) {
				l || (P(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				V(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				O(e, t);
			}
		}
	);
}
function rl(r) {
	let e,
		l,
		t = r[4],
		s = [];
	for (let n = 0; n < t.length; n += 1) s[n] = Lt(Tt(r, t, n));
	const i = (n) =>
		V(s[n], 1, 1, () => {
			s[n] = null;
		});
	return {
		c() {
			e = v('section');
			for (let n = 0; n < s.length; n += 1) s[n].c();
			this.h();
		},
		l(n) {
			e = p(n, 'SECTION', { slot: !0 });
			var a = C(e);
			for (let o = 0; o < s.length; o += 1) s[o].l(a);
			a.forEach(g), this.h();
		},
		h() {
			k(e, 'slot', 'items');
		},
		m(n, a) {
			z(n, e, a);
			for (let o = 0; o < s.length; o += 1) s[o].m(e, null);
			l = !0;
		},
		p(n, a) {
			if (a & 148) {
				t = n[4];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const u = Tt(n, t, o);
					s[o]
						? (s[o].p(u, a), P(s[o], 1))
						: ((s[o] = Lt(u)), s[o].c(), P(s[o], 1), s[o].m(e, null));
				}
				for (oe(), o = t.length; o < s.length; o += 1) i(o);
				ce();
			}
		},
		i(n) {
			if (!l) {
				for (let a = 0; a < t.length; a += 1) P(s[a]);
				l = !0;
			}
		},
		o(n) {
			s = s.filter(Boolean);
			for (let a = 0; a < s.length; a += 1) V(s[a]);
			l = !1;
		},
		d(n) {
			n && g(e), je(s, n);
		}
	};
}
function al(r) {
	let e,
		l,
		t,
		s,
		i,
		n,
		a,
		o,
		u,
		h,
		m,
		c,
		_,
		E,
		R,
		B,
		d,
		w,
		I,
		T,
		y,
		A,
		W,
		J,
		Q,
		q,
		he,
		de,
		_e,
		ge,
		Z,
		me,
		ve,
		$,
		pe,
		be,
		x,
		we,
		ke,
		ee,
		Ee,
		Ce,
		G,
		Qe,
		ye,
		te,
		Te,
		Ie,
		le,
		Ue,
		Le,
		se,
		Pe,
		Re,
		ne,
		Be,
		De,
		re,
		Se,
		Ve,
		ae,
		Ne,
		ze,
		fe;
	return (
		(e = new Ft({ props: { title: 'CULT News' } })),
		(h = new ll({
			props: { title: '', $$slots: { items: [rl], controls: [sl] }, $$scope: { ctx: r } }
		})),
		{
			c() {
				H(e.$$.fragment),
					(l = U()),
					(t = v('div')),
					(s = v('h1')),
					(i = D('CULT News')),
					(n = D(`

	Please add CULT news via
	`)),
					(a = v('a')),
					(o = D('pull request')),
					(u = D(`.
	

	`)),
					H(h.$$.fragment),
					(m = U()),
					(c = v('p')),
					(_ = v('br')),
					(E = U()),
					(R = v('h3')),
					(B = D('New CULT Shops Going Live')),
					(d = U()),
					(w = v('br')),
					(I = v('br')),
					(T = U()),
					(y = v('a')),
					(A = D('dripxkarip.com')),
					(W = v('br')),
					(J = v('br')),
					(Q = U()),
					(q = v('a')),
					(he = D('shop2revolt.com')),
					(de = v('br')),
					(_e = v('br')),
					(ge = U()),
					(Z = v('a')),
					(me = D('cultdaodizayn.com')),
					(ve = U()),
					($ = v('p')),
					(pe = v('br')),
					(be = U()),
					(x = v('p')),
					(we = v('br')),
					(ke = U()),
					(ee = v('h3')),
					(Ee = D('revolt.cultoshi.com is Optimizing the Voting Process')),
					(Ce = U()),
					(G = v('embed')),
					(ye = U()),
					(te = v('p')),
					(Te = v('br')),
					(Ie = U()),
					(le = v('p')),
					(Ue = v('br')),
					(Le = U()),
					(se = v('h3')),
					(Pe = D('CULT Chat Feature Under Construction')),
					(Re = D(`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`)),
					(ne = v('p')),
					(Be = v('br')),
					(De = U()),
					(re = v('p')),
					(Se = v('br')),
					(Ve = U()),
					(ae = v('h3')),
					(Ne = D('CULT Market Feature Under Construction')),
					(ze = D(`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`)),
					this.h();
			},
			l(N) {
				F(e.$$.fragment, N), (l = L(N)), (t = p(N, 'DIV', { class: !0 }));
				var b = C(t);
				s = p(b, 'H1', {});
				var ie = C(s);
				(i = S(ie, 'CULT News')),
					ie.forEach(g),
					(n = S(
						b,
						`

	Please add CULT news via
	`
					)),
					(a = p(b, 'A', { href: !0, target: !0 }));
				var Ke = C(a);
				(o = S(Ke, 'pull request')),
					Ke.forEach(g),
					(u = S(
						b,
						`.
	

	`
					)),
					F(h.$$.fragment, b),
					(m = L(b)),
					(c = p(b, 'P', {}));
				var Xe = C(c);
				(_ = p(Xe, 'BR', {})), Xe.forEach(g), (E = L(b)), (R = p(b, 'H3', {}));
				var Ye = C(R);
				(B = S(Ye, 'New CULT Shops Going Live')),
					Ye.forEach(g),
					(d = L(b)),
					(w = p(b, 'BR', {})),
					(I = p(b, 'BR', {})),
					(T = L(b)),
					(y = p(b, 'A', { href: !0, target: !0 }));
				var $e = C(y);
				(A = S($e, 'dripxkarip.com')),
					$e.forEach(g),
					(W = p(b, 'BR', {})),
					(J = p(b, 'BR', {})),
					(Q = L(b)),
					(q = p(b, 'A', { href: !0, target: !0 }));
				var xe = C(q);
				(he = S(xe, 'shop2revolt.com')),
					xe.forEach(g),
					(de = p(b, 'BR', {})),
					(_e = p(b, 'BR', {})),
					(ge = L(b)),
					(Z = p(b, 'A', { href: !0, target: !0 }));
				var et = C(Z);
				(me = S(et, 'cultdaodizayn.com')), et.forEach(g), (ve = L(b)), ($ = p(b, 'P', {}));
				var tt = C($);
				(pe = p(tt, 'BR', {})), tt.forEach(g), (be = L(b)), (x = p(b, 'P', {}));
				var lt = C(x);
				(we = p(lt, 'BR', {})), lt.forEach(g), (ke = L(b)), (ee = p(b, 'H3', {}));
				var st = C(ee);
				(Ee = S(st, 'revolt.cultoshi.com is Optimizing the Voting Process')),
					st.forEach(g),
					(Ce = L(b)),
					(G = p(b, 'EMBED', { type: !0, src: !0, width: !0, height: !0 })),
					(ye = L(b)),
					(te = p(b, 'P', {}));
				var nt = C(te);
				(Te = p(nt, 'BR', {})), nt.forEach(g), (Ie = L(b)), (le = p(b, 'P', {}));
				var rt = C(le);
				(Ue = p(rt, 'BR', {})), rt.forEach(g), (Le = L(b)), (se = p(b, 'H3', {}));
				var at = C(se);
				(Pe = S(at, 'CULT Chat Feature Under Construction')),
					at.forEach(g),
					(Re = S(
						b,
						`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`
					)),
					(ne = p(b, 'P', {}));
				var it = C(ne);
				(Be = p(it, 'BR', {})), it.forEach(g), (De = L(b)), (re = p(b, 'P', {}));
				var ot = C(re);
				(Se = p(ot, 'BR', {})), ot.forEach(g), (Ve = L(b)), (ae = p(b, 'H3', {}));
				var ct = C(ae);
				(Ne = S(ct, 'CULT Market Feature Under Construction')),
					ct.forEach(g),
					(ze = S(
						b,
						`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`
					)),
					b.forEach(g),
					this.h();
			},
			h() {
				k(a, 'href', 'https://www.youtube.com/watch?v=8lGpZkjnkt4'),
					k(a, 'target', '_blank'),
					k(y, 'href', 'https://dripxkarip.com'),
					k(y, 'target', '_blank'),
					k(q, 'href', 'https://www.shop2revolt.com'),
					k(q, 'target', '_blank'),
					k(Z, 'href', 'https://www.cultdaodizayn.com'),
					k(Z, 'target', '_blank'),
					k(G, 'type', 'text/html'),
					Je(G.src, (Qe = 'https://revolt.cultoshi.com/')) || k(G, 'src', Qe),
					k(G, 'width', '100%'),
					k(G, 'height', '1100vh'),
					k(t, 'class', 'text-center');
			},
			m(N, b) {
				M(e, N, b),
					z(N, l, b),
					z(N, t, b),
					f(t, s),
					f(s, i),
					f(t, n),
					f(t, a),
					f(a, o),
					f(t, u),
					M(h, t, null),
					f(t, m),
					f(t, c),
					f(c, _),
					f(t, E),
					f(t, R),
					f(R, B),
					f(t, d),
					f(t, w),
					f(t, I),
					f(t, T),
					f(t, y),
					f(y, A),
					f(t, W),
					f(t, J),
					f(t, Q),
					f(t, q),
					f(q, he),
					f(t, de),
					f(t, _e),
					f(t, ge),
					f(t, Z),
					f(Z, me),
					f(t, ve),
					f(t, $),
					f($, pe),
					f(t, be),
					f(t, x),
					f(x, we),
					f(t, ke),
					f(t, ee),
					f(ee, Ee),
					f(t, Ce),
					f(t, G),
					f(t, ye),
					f(t, te),
					f(te, Te),
					f(t, Ie),
					f(t, le),
					f(le, Ue),
					f(t, Le),
					f(t, se),
					f(se, Pe),
					f(t, Re),
					f(t, ne),
					f(ne, Be),
					f(t, De),
					f(t, re),
					f(re, Se),
					f(t, Ve),
					f(t, ae),
					f(ae, Ne),
					f(t, ze),
					(fe = !0);
			},
			p(N, [b]) {
				const ie = {};
				b & 1048607 && (ie.$$scope = { dirty: b, ctx: N }), h.$set(ie);
			},
			i(N) {
				fe || (P(e.$$.fragment, N), P(h.$$.fragment, N), (fe = !0));
			},
			o(N) {
				V(e.$$.fragment, N), V(h.$$.fragment, N), (fe = !1);
			},
			d(N) {
				O(e, N), N && g(l), N && g(t), O(h);
			}
		}
	);
}
let Pt = null;
function il(r, e, l) {
	let t, s, i;
	const n = Ae(yt, 'tags');
	let a = [],
		o = null;
	const u = [{ label: 'All', value: null }, ...Ae(Ht, 'category')];
	let h = null;
	const m = (d, w) => d.filter((I) => w.includes(I)),
		c = {
			'Bundler Plugins': 'bundling',
			Debugging: 'debugging',
			'Editor Extensions': 'editor-support',
			'Linting and Formatting': 'code-quality',
			Preprocessors: 'preprocessors'
		},
		_ = (d, w) => w.category === d.value;
	function E(d) {
		(o = d), l(1, o);
	}
	function R(d) {
		(h = d), l(3, h);
	}
	function B() {
		(i = this.value), l(0, i);
	}
	return (
		(r.$$.update = () => {
			r.$$.dirty & 2 && l(8, (a = (o == null ? void 0 : o.map((d) => d.value)) || [])),
				r.$$.dirty & 257 &&
					l(
						2,
						(t = yt.filter((d) =>
							!i && a.length === 0 && Pt === null
								? !0
								: !(
										(i &&
											!(
												d.title.toLowerCase().includes(i.toLowerCase()) ||
												d.description.toLowerCase().includes(i.toLowerCase())
											)) ||
										(a.length > 0 && m(a, d.tags).length === 0) ||
										Pt !== null
								  )
						))
					),
				r.$$.dirty & 4 && l(4, (s = Ae(t, 'category')));
		}),
		[i, o, t, h, s, n, u, c, a, _, E, R, B]
	);
}
class ml extends K {
	constructor(e) {
		super(), X(this, e, il, al, Y, {});
	}
}
export { ml as default };
