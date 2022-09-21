import {
	S as K,
	i as X,
	s as Y,
	k as v,
	q as V,
	l as p,
	m as C,
	r as D,
	h as g,
	n as k,
	a7 as ut,
	b as z,
	C as f,
	V as Rt,
	a8 as St,
	u as Z,
	A as ht,
	a as U,
	c as L,
	J as dt,
	f as P,
	g as oe,
	t as S,
	d as ce,
	v as H,
	w as M,
	x as F,
	y as G,
	D as We,
	p as Je,
	B as Qe,
	F as Me,
	G as Fe,
	H as Ge,
	I as Oe,
	N as ue,
	R as qe,
	T as je,
	O as Bt,
	P as Vt,
	W as Ze,
	a9 as _t,
	Q as Nt,
	U as gt
} from '../../../chunks/index-2fad9c0c.js';
import '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { c as zt, S as At } from '../../../chunks/Select-8360dfd8.js';
import { e as Ae } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as Ht } from '../../../chunks/Seo-fad38391.js';
import '../../../chunks/stores-df887d2e.js';
import '../../../chunks/singletons-9297043a.js';
function Mt(r) {
	let e, l, t, s, a;
	return {
		c() {
			(e = v('div')), (l = V(r[0])), this.h();
		},
		l(n) {
			e = p(n, 'DIV', { class: !0 });
			var i = C(e);
			(l = D(i, r[0])), i.forEach(g), this.h();
		},
		h() {
			k(e, 'class', (t = ut(r[1]) + ' svelte-ugev5v'));
		},
		m(n, i) {
			z(n, e, i),
				f(e, l),
				s ||
					((a = Rt(e, 'click', function () {
						St(r[2]) && r[2].apply(this, arguments);
					})),
					(s = !0));
		},
		p(n, [i]) {
			(r = n),
				i & 1 && Z(l, r[0]),
				i & 2 && t !== (t = ut(r[1]) + ' svelte-ugev5v') && k(e, 'class', t);
		},
		i: ht,
		o: ht,
		d(n) {
			n && g(e), (s = !1), a();
		}
	};
}
function Ft(r, e, l) {
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
class Dt extends K {
	constructor(e) {
		super(), X(this, e, Ft, Mt, Y, { title: 0, variant: 1, click: 2 });
	}
}
function mt(r, e, l) {
	const t = r.slice();
	return (t[14] = e[l]), t;
}
function vt(r) {
	let e, l;
	return (
		(e = new Dt({
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
				l || (P(e.$$.fragment, t), (l = !0));
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
function pt(r) {
	let e,
		l,
		t = r[3],
		s = [];
	for (let n = 0; n < t.length; n += 1) s[n] = bt(mt(r, t, n));
	const a = (n) =>
		S(s[n], 1, 1, () => {
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
			var i = C(e);
			for (let o = 0; o < s.length; o += 1) s[o].l(i);
			i.forEach(g), this.h();
		},
		h() {
			k(e, 'class', 'card__tags svelte-1p17aya');
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
					const u = mt(n, t, o);
					s[o]
						? (s[o].p(u, i), P(s[o], 1))
						: ((s[o] = bt(u)), s[o].c(), P(s[o], 1), s[o].m(e, null));
				}
				for (oe(), o = t.length; o < s.length; o += 1) a(o);
				ce();
			}
		},
		i(n) {
			if (!l) {
				for (let i = 0; i < t.length; i += 1) P(s[i]);
				l = !0;
			}
		},
		o(n) {
			s = s.filter(Boolean);
			for (let i = 0; i < s.length; i += 1) S(s[i]);
			l = !1;
		},
		d(n) {
			n && g(e), We(s, n);
		}
	};
}
function bt(r) {
	let e, l;
	return (
		(e = new Dt({ props: { title: r[14], variant: 'blue' } })),
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
				l || (P(e.$$.fragment, t), (l = !0));
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
function wt(r) {
	let e, l, t, s, a, n, i, o, u;
	function h(_, E) {
		if (
			(E & 160 && (t = null),
			E & 160 && (s = null),
			t == null && (t = !!(_[7] || _[5]).includes('github')),
			t)
		)
			return Ot;
		if ((s == null && (s = !!(_[7] || _[5]).includes('gitlab')), s)) return Gt;
	}
	let m = h(r, -1),
		c = m && m(r);
	return {
		c() {
			(e = v('div')),
				(l = v('div')),
				c && c.c(),
				(a = U()),
				(n = v('div')),
				(i = V(`\u2605
				`)),
				(o = v('code')),
				(u = V(r[4])),
				this.h();
		},
		l(_) {
			e = p(_, 'DIV', { class: !0 });
			var E = C(e);
			l = p(E, 'DIV', { class: !0 });
			var R = C(l);
			c && c.l(R), R.forEach(g), (a = L(E)), (n = p(E, 'DIV', { class: !0 }));
			var B = C(n);
			(i = D(
				B,
				`\u2605
				`
			)),
				(o = p(B, 'CODE', {}));
			var d = C(o);
			(u = D(d, r[4])), d.forEach(g), B.forEach(g), E.forEach(g), this.h();
		},
		h() {
			k(l, 'class', 'svelte-1p17aya'),
				k(n, 'class', 'svelte-1p17aya'),
				k(e, 'class', 'card__bottom svelte-1p17aya');
		},
		m(_, E) {
			z(_, e, E), f(e, l), c && c.m(l, null), f(e, a), f(e, n), f(n, i), f(n, o), f(o, u);
		},
		p(_, E) {
			m !== (m = h(_, E)) && (c && c.d(1), (c = m && m(_)), c && (c.c(), c.m(l, null))),
				E & 16 && Z(u, _[4]);
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
			Je(e, 'display', 'inline'),
				Qe(e.src, (l = '/images/gitlab_logo.svg')) || k(e, 'src', l),
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
function Ot(r) {
	let e, l;
	return {
		c() {
			(e = v('img')), this.h();
		},
		l(t) {
			(e = p(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			Je(e, 'display', 'inline'),
				Qe(e.src, (l = '/images/github_logo.svg')) || k(e, 'src', l),
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
function qt(r) {
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
		m,
		c,
		_,
		E,
		R,
		B,
		d = r[6] && vt(r),
		w = r[3] && pt(r),
		T = typeof r[4] < 'u' && wt(r);
	return {
		c() {
			(e = v('div')),
				(l = v('h3')),
				(t = v('a')),
				(s = V('#')),
				(n = U()),
				(i = v('a')),
				(o = V(r[1])),
				(u = U()),
				d && d.c(),
				(h = U()),
				(m = v('p')),
				(c = V(r[2])),
				(_ = U()),
				w && w.c(),
				(E = U()),
				T && T.c(),
				this.h();
		},
		l(I) {
			e = p(I, 'DIV', { class: !0, id: !0 });
			var y = C(e);
			l = p(y, 'H3', { class: !0 });
			var A = C(l);
			t = p(A, 'A', { href: !0 });
			var W = C(t);
			(s = D(W, '#')), W.forEach(g), (n = L(A)), (i = p(A, 'A', { href: !0 }));
			var J = C(i);
			(o = D(J, r[1])),
				J.forEach(g),
				(u = L(A)),
				d && d.l(A),
				A.forEach(g),
				(h = L(y)),
				(m = p(y, 'P', { class: !0 }));
			var Q = C(m);
			(c = D(Q, r[2])),
				Q.forEach(g),
				(_ = L(y)),
				w && w.l(y),
				(E = L(y)),
				T && T.l(y),
				y.forEach(g),
				this.h();
		},
		h() {
			k(t, 'href', (a = '#component-' + encodeURI(r[1]))),
				k(i, 'href', r[5]),
				k(l, 'class', 'svelte-1p17aya'),
				k(m, 'class', 'flex-grow svelte-1p17aya'),
				k(e, 'class', 'card svelte-1p17aya'),
				k(e, 'id', (R = 'component-' + encodeURI(r[1]))),
				dt(e, 'active', r[0]);
		},
		m(I, y) {
			z(I, e, y),
				f(e, l),
				f(l, t),
				f(t, s),
				f(l, n),
				f(l, i),
				f(i, o),
				f(l, u),
				d && d.m(l, null),
				f(e, h),
				f(e, m),
				f(m, c),
				f(e, _),
				w && w.m(e, null),
				f(e, E),
				T && T.m(e, null),
				(B = !0);
		},
		p(I, [y]) {
			(!B || (y & 2 && a !== (a = '#component-' + encodeURI(I[1])))) && k(t, 'href', a),
				(!B || y & 2) && Z(o, I[1]),
				(!B || y & 32) && k(i, 'href', I[5]),
				I[6]
					? d
						? (d.p(I, y), y & 64 && P(d, 1))
						: ((d = vt(I)), d.c(), P(d, 1), d.m(l, null))
					: d &&
					  (oe(),
					  S(d, 1, 1, () => {
							d = null;
					  }),
					  ce()),
				(!B || y & 4) && Z(c, I[2]),
				I[3]
					? w
						? (w.p(I, y), y & 8 && P(w, 1))
						: ((w = pt(I)), w.c(), P(w, 1), w.m(e, E))
					: w &&
					  (oe(),
					  S(w, 1, 1, () => {
							w = null;
					  }),
					  ce()),
				typeof I[4] < 'u'
					? T
						? T.p(I, y)
						: ((T = wt(I)), T.c(), T.m(e, null))
					: T && (T.d(1), (T = null)),
				(!B || (y & 2 && R !== (R = 'component-' + encodeURI(I[1])))) && k(e, 'id', R),
				y & 1 && dt(e, 'active', I[0]);
		},
		i(I) {
			B || (P(d), P(w), (B = !0));
		},
		o(I) {
			S(d), S(w), (B = !1);
		},
		d(I) {
			I && g(e), d && d.d(), w && w.d(), T && T.d();
		}
	};
}
function jt(r, e, l) {
	let { active: t = !1 } = e,
		{ title: s = '' } = e,
		{ description: a = '' } = e,
		{ tags: n = [] } = e,
		{ stars: i } = e,
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
				'description' in d && l(2, (a = d.description)),
				'tags' in d && l(3, (n = d.tags)),
				'stars' in d && l(4, (i = d.stars)),
				'url' in d && l(5, (o = d.url)),
				'npm' in d && l(6, (u = d.npm)),
				'repo' in d && l(7, (h = d.repo)),
				'manager' in d && l(8, (m = d.manager));
		}),
		[t, s, a, n, i, o, u, h, m, c, _, E, R, B]
	);
}
class Zt extends K {
	constructor(e) {
		super(),
			X(this, e, jt, qt, Y, {
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
function Wt(r) {
	let e, l, t, s, a, n, i, o, u, h;
	const m = r[3].default,
		c = Me(m, r, r[2], null);
	return {
		c() {
			(e = v('div')),
				(l = v('h1')),
				(t = V(r[0])),
				(s = U()),
				(a = v('a')),
				(n = V('#')),
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
			(t = D(R, r[0])), (s = L(R)), (a = p(R, 'A', { href: !0 }));
			var B = C(a);
			(n = D(B, '#')), B.forEach(g), R.forEach(g), (o = L(E)), (u = p(E, 'DIV', { class: !0 }));
			var d = C(u);
			c && c.l(d), d.forEach(g), E.forEach(g), this.h();
		},
		h() {
			k(a, 'href', (i = '#' + r[1])),
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
				f(l, a),
				f(a, n),
				f(e, o),
				f(e, u),
				c && c.m(u, null),
				(h = !0);
		},
		p(_, [E]) {
			(!h || E & 1) && Z(t, _[0]),
				(!h || (E & 2 && i !== (i = '#' + _[1]))) && k(a, 'href', i),
				(!h || E & 2) && k(l, 'id', _[1]),
				c && c.p && (!h || E & 4) && Fe(c, m, _, _[2], h ? Oe(m, _[2], E, null) : Ge(_[2]), null);
		},
		i(_) {
			h || (P(c, _), (h = !0));
		},
		o(_) {
			S(c, _), (h = !1);
		},
		d(_) {
			_ && g(e), c && c.d(_);
		}
	};
}
function Jt(r, e, l) {
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
class Qt extends K {
	constructor(e) {
		super(), X(this, e, Jt, Wt, Y, { title: 0, id: 1 });
	}
}
function kt(r) {
	let e, l;
	return {
		c() {
			(e = v('span')), (l = V(r[1])), this.h();
		},
		l(t) {
			e = p(t, 'SPAN', { class: !0 });
			var s = C(e);
			(l = D(s, r[1])), s.forEach(g), this.h();
		},
		h() {
			k(e, 'class', 'svelte-phe5gt');
		},
		m(t, s) {
			z(t, e, s), f(e, l);
		},
		p(t, s) {
			s & 2 && Z(l, t[1]);
		},
		d(t) {
			t && g(e);
		}
	};
}
function Kt(r) {
	let e,
		l,
		t,
		s,
		a,
		n = r[1] && kt(r);
	const i = [{ containerClasses: 'select-container' }, r[2]];
	function o(h) {
		r[3](h);
	}
	let u = {};
	for (let h = 0; h < i.length; h += 1) u = ue(u, i[h]);
	return (
		r[0] !== void 0 && (u.value = r[0]),
		(t = new At({ props: u })),
		qe.push(() => je(t, 'value', o)),
		{
			c() {
				(e = v('div')), n && n.c(), (l = U()), H(t.$$.fragment), this.h();
			},
			l(h) {
				e = p(h, 'DIV', { class: !0 });
				var m = C(e);
				n && n.l(m), (l = L(m)), M(t.$$.fragment, m), m.forEach(g), this.h();
			},
			h() {
				k(e, 'class', 'themed svelte-phe5gt');
			},
			m(h, m) {
				z(h, e, m), n && n.m(e, null), f(e, l), F(t, e, null), (a = !0);
			},
			p(h, [m]) {
				h[1] ? (n ? n.p(h, m) : ((n = kt(h)), n.c(), n.m(e, l))) : n && (n.d(1), (n = null));
				const c = m & 4 ? Bt(i, [i[0], Vt(h[2])]) : {};
				!s && m & 1 && ((s = !0), (c.value = h[0]), Ze(() => (s = !1))), t.$set(c);
			},
			i(h) {
				a || (P(t.$$.fragment, h), (a = !0));
			},
			o(h) {
				S(t.$$.fragment, h), (a = !1);
			},
			d(h) {
				h && g(e), n && n.d(), G(t);
			}
		}
	);
}
function Xt(r, e, l) {
	const t = ['value', 'label'];
	let s = _t(e, t),
		{ value: a } = e,
		{ label: n = '' } = e;
	function i(o) {
		(a = o), l(0, a);
	}
	return (
		(r.$$set = (o) => {
			(e = ue(ue({}, e), Nt(o))),
				l(2, (s = _t(e, t))),
				'value' in o && l(0, (a = o.value)),
				'label' in o && l(1, (n = o.label));
		}),
		[a, n, s, i]
	);
}
class Et extends K {
	constructor(e) {
		super(), X(this, e, Xt, Kt, Y, { value: 0, label: 1 });
	}
}
const Yt = (r) => ({}),
	Ct = (r) => ({}),
	$t = (r) => ({}),
	yt = (r) => ({});
function xt(r) {
	let e, l, t, s, a, n, i;
	const o = r[2].controls,
		u = Me(o, r, r[1], yt),
		h = r[2].items,
		m = Me(h, r, r[1], Ct);
	return {
		c() {
			(e = v('h1')),
				(l = V(r[0])),
				(t = U()),
				u && u.c(),
				(s = U()),
				(a = v('hr')),
				(n = U()),
				m && m.c();
		},
		l(c) {
			e = p(c, 'H1', {});
			var _ = C(e);
			(l = D(_, r[0])),
				_.forEach(g),
				(t = L(c)),
				u && u.l(c),
				(s = L(c)),
				(a = p(c, 'HR', {})),
				(n = L(c)),
				m && m.l(c);
		},
		m(c, _) {
			z(c, e, _),
				f(e, l),
				z(c, t, _),
				u && u.m(c, _),
				z(c, s, _),
				z(c, a, _),
				z(c, n, _),
				m && m.m(c, _),
				(i = !0);
		},
		p(c, [_]) {
			(!i || _ & 1) && Z(l, c[0]),
				u && u.p && (!i || _ & 2) && Fe(u, o, c, c[1], i ? Oe(o, c[1], _, $t) : Ge(c[1]), yt),
				m && m.p && (!i || _ & 2) && Fe(m, h, c, c[1], i ? Oe(h, c[1], _, Yt) : Ge(c[1]), Ct);
		},
		i(c) {
			i || (P(u, c), P(m, c), (i = !0));
		},
		o(c) {
			S(u, c), S(m, c), (i = !1);
		},
		d(c) {
			c && g(e), c && g(t), u && u.d(c), c && g(s), c && g(a), c && g(n), m && m.d(c);
		}
	};
}
function el(r, e, l) {
	let { $$slots: t = {}, $$scope: s } = e,
		{ title: a } = e;
	return (
		(r.$$set = (n) => {
			'title' in n && l(0, (a = n.title)), '$$scope' in n && l(1, (s = n.$$scope));
		}),
		[a, s, t]
	);
}
class tl extends K {
	constructor(e) {
		super(), X(this, e, el, xt, Y, { title: 0 });
	}
}
const He = [
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
function It(r, e, l) {
	const t = r.slice();
	return (t[14] = e[l]), t;
}
function Tt(r, e, l) {
	const t = r.slice();
	return (t[17] = e[l]), t;
}
function ll(r) {
	let e, l, t, s, a, n, i, o, u, h, m, c, _;
	function E(w) {
		r[10](w);
	}
	let R = { items: r[5], isMulti: !0, label: 'Tags' };
	r[1] !== void 0 && (R.value = r[1]), (t = new Et({ props: R })), qe.push(() => je(t, 'value', E));
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
		(n = new Et({ props: d })),
		qe.push(() => je(n, 'value', B)),
		{
			c() {
				(e = v('section')),
					(l = v('div')),
					H(t.$$.fragment),
					(a = U()),
					H(n.$$.fragment),
					(o = U()),
					(u = v('div')),
					(h = v('input')),
					this.h();
			},
			l(w) {
				e = p(w, 'SECTION', { slot: !0, class: !0 });
				var T = C(e);
				l = p(T, 'DIV', { class: !0 });
				var I = C(l);
				M(t.$$.fragment, I),
					(a = L(I)),
					M(n.$$.fragment, I),
					I.forEach(g),
					(o = L(T)),
					(u = p(T, 'DIV', { class: !0 }));
				var y = C(u);
				(h = p(y, 'INPUT', { style: !0, class: !0, type: !0, placeholder: !0 })),
					y.forEach(g),
					T.forEach(g),
					this.h();
			},
			h() {
				k(l, 'class', 'inputs'),
					Je(h, 'width', '100%'),
					k(h, 'class', 'searchbar text-center'),
					k(h, 'type', 'text'),
					k(h, 'placeholder', 'Search through cultnews...'),
					k(u, 'class', 'text-center'),
					k(e, 'slot', 'controls'),
					k(e, 'class', 'controls');
			},
			m(w, T) {
				z(w, e, T),
					f(e, l),
					F(t, l, null),
					f(l, a),
					F(n, l, null),
					f(e, o),
					f(e, u),
					f(u, h),
					gt(h, r[0]),
					(m = !0),
					c || ((_ = Rt(h, 'input', r[12])), (c = !0));
			},
			p(w, T) {
				const I = {};
				!s && T & 2 && ((s = !0), (I.value = w[1]), Ze(() => (s = !1))), t.$set(I);
				const y = {};
				!i && T & 8 && ((i = !0), (y.value = w[3]), Ze(() => (i = !1))),
					n.$set(y),
					T & 1 && h.value !== w[0] && gt(h, w[0]);
			},
			i(w) {
				m || (P(t.$$.fragment, w), P(n.$$.fragment, w), (m = !0));
			},
			o(w) {
				S(t.$$.fragment, w), S(n.$$.fragment, w), (m = !1);
			},
			d(w) {
				w && g(e), G(t), G(n), (c = !1), _();
			}
		}
	);
}
function Ut(r) {
	let e, l;
	const t = [r[17]];
	let s = {};
	for (let a = 0; a < t.length; a += 1) s = ue(s, t[a]);
	return (
		(e = new Zt({ props: s })),
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
				const i = n & 20 ? Bt(t, [Vt(a[17])]) : {};
				e.$set(i);
			},
			i(a) {
				l || (P(e.$$.fragment, a), (l = !0));
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
function sl(r) {
	let e, l;
	function t(...i) {
		return r[9](r[14], ...i);
	}
	let s = r[2].filter(t),
		a = [];
	for (let i = 0; i < s.length; i += 1) a[i] = Ut(Tt(r, s, i));
	const n = (i) =>
		S(a[i], 1, 1, () => {
			a[i] = null;
		});
	return {
		c() {
			for (let i = 0; i < a.length; i += 1) a[i].c();
			e = U();
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
					const h = Tt(r, s, u);
					a[u]
						? (a[u].p(h, o), P(a[u], 1))
						: ((a[u] = Ut(h)), a[u].c(), P(a[u], 1), a[u].m(e.parentNode, e));
				}
				for (oe(), u = s.length; u < a.length; u += 1) n(u);
				ce();
			}
		},
		i(i) {
			if (!l) {
				for (let o = 0; o < s.length; o += 1) P(a[o]);
				l = !0;
			}
		},
		o(i) {
			a = a.filter(Boolean);
			for (let o = 0; o < a.length; o += 1) S(a[o]);
			l = !1;
		},
		d(i) {
			We(a, i), i && g(e);
		}
	};
}
function Lt(r) {
	let e, l;
	return (
		(e = new Qt({
			props: {
				title: r[14].label || 'Unclassified',
				id: r[7][r[14].label] || r[14].label || 'unclassified',
				$$slots: { default: [sl] },
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
				l || (P(e.$$.fragment, t), (l = !0));
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
function nl(r) {
	let e,
		l,
		t = r[4],
		s = [];
	for (let n = 0; n < t.length; n += 1) s[n] = Lt(It(r, t, n));
	const a = (n) =>
		S(s[n], 1, 1, () => {
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
			var i = C(e);
			for (let o = 0; o < s.length; o += 1) s[o].l(i);
			i.forEach(g), this.h();
		},
		h() {
			k(e, 'slot', 'items');
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
					const u = It(n, t, o);
					s[o]
						? (s[o].p(u, i), P(s[o], 1))
						: ((s[o] = Lt(u)), s[o].c(), P(s[o], 1), s[o].m(e, null));
				}
				for (oe(), o = t.length; o < s.length; o += 1) a(o);
				ce();
			}
		},
		i(n) {
			if (!l) {
				for (let i = 0; i < t.length; i += 1) P(s[i]);
				l = !0;
			}
		},
		o(n) {
			s = s.filter(Boolean);
			for (let i = 0; i < s.length; i += 1) S(s[i]);
			l = !1;
		},
		d(n) {
			n && g(e), We(s, n);
		}
	};
}
function rl(r) {
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
		m,
		c,
		_,
		E,
		R,
		B,
		d,
		w,
		T,
		I,
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
		j,
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
		O,
		Ke,
		ye,
		te,
		Ie,
		Te,
		le,
		Ue,
		Le,
		se,
		Pe,
		Re,
		ne,
		Be,
		Ve,
		re,
		De,
		Se,
		ie,
		Ne,
		ze,
		fe;
	return (
		(e = new Ht({ props: { title: 'CULT News' } })),
		(h = new tl({
			props: { title: '', $$slots: { items: [nl], controls: [ll] }, $$scope: { ctx: r } }
		})),
		{
			c() {
				H(e.$$.fragment),
					(l = U()),
					(t = v('div')),
					(s = v('h1')),
					(a = V('CULT News')),
					(n = V(`

	Please add CULT news via
	`)),
					(i = v('a')),
					(o = V('pull request')),
					(u = V(`.
	

	`)),
					H(h.$$.fragment),
					(m = U()),
					(c = v('p')),
					(_ = v('br')),
					(E = U()),
					(R = v('h3')),
					(B = V('New CULT Shops Going Live')),
					(d = U()),
					(w = v('br')),
					(T = v('br')),
					(I = U()),
					(y = v('a')),
					(A = V('dripxkarip.com')),
					(W = v('br')),
					(J = v('br')),
					(Q = U()),
					(q = v('a')),
					(he = V('shop2revolt.com')),
					(de = v('br')),
					(_e = v('br')),
					(ge = U()),
					(j = v('a')),
					(me = V('cultdaodizayn.com')),
					(ve = U()),
					($ = v('p')),
					(pe = v('br')),
					(be = U()),
					(x = v('p')),
					(we = v('br')),
					(ke = U()),
					(ee = v('h3')),
					(Ee = V('revolt.cultoshi.com is Optimizing the Voting Process')),
					(Ce = U()),
					(O = v('embed')),
					(ye = U()),
					(te = v('p')),
					(Ie = v('br')),
					(Te = U()),
					(le = v('p')),
					(Ue = v('br')),
					(Le = U()),
					(se = v('h3')),
					(Pe = V('CULT Chat Feature Under Construction')),
					(Re = V(`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`)),
					(ne = v('p')),
					(Be = v('br')),
					(Ve = U()),
					(re = v('p')),
					(De = v('br')),
					(Se = U()),
					(ie = v('h3')),
					(Ne = V('CULT Market Feature Under Construction')),
					(ze = V(`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`)),
					this.h();
			},
			l(N) {
				M(e.$$.fragment, N), (l = L(N)), (t = p(N, 'DIV', { class: !0 }));
				var b = C(t);
				s = p(b, 'H1', {});
				var ae = C(s);
				(a = D(ae, 'CULT News')),
					ae.forEach(g),
					(n = D(
						b,
						`

	Please add CULT news via
	`
					)),
					(i = p(b, 'A', { href: !0, target: !0 }));
				var Xe = C(i);
				(o = D(Xe, 'pull request')),
					Xe.forEach(g),
					(u = D(
						b,
						`.
	

	`
					)),
					M(h.$$.fragment, b),
					(m = L(b)),
					(c = p(b, 'P', {}));
				var Ye = C(c);
				(_ = p(Ye, 'BR', {})), Ye.forEach(g), (E = L(b)), (R = p(b, 'H3', {}));
				var $e = C(R);
				(B = D($e, 'New CULT Shops Going Live')),
					$e.forEach(g),
					(d = L(b)),
					(w = p(b, 'BR', {})),
					(T = p(b, 'BR', {})),
					(I = L(b)),
					(y = p(b, 'A', { href: !0, target: !0 }));
				var xe = C(y);
				(A = D(xe, 'dripxkarip.com')),
					xe.forEach(g),
					(W = p(b, 'BR', {})),
					(J = p(b, 'BR', {})),
					(Q = L(b)),
					(q = p(b, 'A', { href: !0, target: !0 }));
				var et = C(q);
				(he = D(et, 'shop2revolt.com')),
					et.forEach(g),
					(de = p(b, 'BR', {})),
					(_e = p(b, 'BR', {})),
					(ge = L(b)),
					(j = p(b, 'A', { href: !0, target: !0 }));
				var tt = C(j);
				(me = D(tt, 'cultdaodizayn.com')), tt.forEach(g), (ve = L(b)), ($ = p(b, 'P', {}));
				var lt = C($);
				(pe = p(lt, 'BR', {})), lt.forEach(g), (be = L(b)), (x = p(b, 'P', {}));
				var st = C(x);
				(we = p(st, 'BR', {})), st.forEach(g), (ke = L(b)), (ee = p(b, 'H3', {}));
				var nt = C(ee);
				(Ee = D(nt, 'revolt.cultoshi.com is Optimizing the Voting Process')),
					nt.forEach(g),
					(Ce = L(b)),
					(O = p(b, 'EMBED', { type: !0, src: !0, width: !0, height: !0 })),
					(ye = L(b)),
					(te = p(b, 'P', {}));
				var rt = C(te);
				(Ie = p(rt, 'BR', {})), rt.forEach(g), (Te = L(b)), (le = p(b, 'P', {}));
				var it = C(le);
				(Ue = p(it, 'BR', {})), it.forEach(g), (Le = L(b)), (se = p(b, 'H3', {}));
				var at = C(se);
				(Pe = D(at, 'CULT Chat Feature Under Construction')),
					at.forEach(g),
					(Re = D(
						b,
						`
	This decentralized chat feature will store messages on Polygon. Messages are considered transactions
	- avoiding spam.
	`
					)),
					(ne = p(b, 'P', {}));
				var ot = C(ne);
				(Be = p(ot, 'BR', {})), ot.forEach(g), (Ve = L(b)), (re = p(b, 'P', {}));
				var ct = C(re);
				(De = p(ct, 'BR', {})), ct.forEach(g), (Se = L(b)), (ie = p(b, 'H3', {}));
				var ft = C(ie);
				(Ne = D(ft, 'CULT Market Feature Under Construction')),
					ft.forEach(g),
					(ze = D(
						b,
						`
	This decentralized markets feature will use Polygon as backend. There will be a decentralized content
	moderation on what to show via the frontend. Images will be stored via ipfs.io.`
					)),
					b.forEach(g),
					this.h();
			},
			h() {
				k(i, 'href', 'https://www.youtube.com/watch?v=8lGpZkjnkt4'),
					k(i, 'target', '_blank'),
					k(y, 'href', 'https://dripxkarip.com'),
					k(y, 'target', '_blank'),
					k(q, 'href', 'https://www.shop2revolt.com'),
					k(q, 'target', '_blank'),
					k(j, 'href', 'https://www.cultdaodizayn.com'),
					k(j, 'target', '_blank'),
					k(O, 'type', 'text/html'),
					Qe(O.src, (Ke = 'https://revolt.cultoshi.com/')) || k(O, 'src', Ke),
					k(O, 'width', '100%'),
					k(O, 'height', '1100vh'),
					k(t, 'class', 'text-center');
			},
			m(N, b) {
				F(e, N, b),
					z(N, l, b),
					z(N, t, b),
					f(t, s),
					f(s, a),
					f(t, n),
					f(t, i),
					f(i, o),
					f(t, u),
					F(h, t, null),
					f(t, m),
					f(t, c),
					f(c, _),
					f(t, E),
					f(t, R),
					f(R, B),
					f(t, d),
					f(t, w),
					f(t, T),
					f(t, I),
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
					f(t, j),
					f(j, me),
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
					f(t, O),
					f(t, ye),
					f(t, te),
					f(te, Ie),
					f(t, Te),
					f(t, le),
					f(le, Ue),
					f(t, Le),
					f(t, se),
					f(se, Pe),
					f(t, Re),
					f(t, ne),
					f(ne, Be),
					f(t, Ve),
					f(t, re),
					f(re, De),
					f(t, Se),
					f(t, ie),
					f(ie, Ne),
					f(t, ze),
					(fe = !0);
			},
			p(N, [b]) {
				const ae = {};
				b & 1048607 && (ae.$$scope = { dirty: b, ctx: N }), h.$set(ae);
			},
			i(N) {
				fe || (P(e.$$.fragment, N), P(h.$$.fragment, N), (fe = !0));
			},
			o(N) {
				S(e.$$.fragment, N), S(h.$$.fragment, N), (fe = !1);
			},
			d(N) {
				G(e, N), N && g(l), N && g(t), G(h);
			}
		}
	);
}
let Pt = null;
function il(r, e, l) {
	let t, s, a;
	const n = Ae(He, 'tags');
	let i = [],
		o = null;
	const u = [{ label: 'All', value: null }, ...Ae(He, 'category')];
	let h = null;
	const m = (d, w) => d.filter((T) => w.includes(T)),
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
		(a = this.value), l(0, a);
	}
	return (
		(r.$$.update = () => {
			r.$$.dirty & 2 && l(8, (i = (o == null ? void 0 : o.map((d) => d.value)) || [])),
				r.$$.dirty & 257 &&
					l(
						2,
						(t = He.filter((d) =>
							!a && i.length === 0 && Pt === null
								? !0
								: !(
										(a &&
											!(
												d.title.toLowerCase().includes(a.toLowerCase()) ||
												d.description.toLowerCase().includes(a.toLowerCase())
											)) ||
										(i.length > 0 && m(i, d.tags).length === 0) ||
										Pt !== null
								  )
						))
					),
				r.$$.dirty & 4 && l(4, (s = Ae(t, 'category')));
		}),
		[a, o, t, h, s, n, u, c, i, _, E, R, B]
	);
}
class _l extends K {
	constructor(e) {
		super(), X(this, e, il, rl, Y, {});
	}
}
export { _l as default };
