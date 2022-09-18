import {
	S as z,
	i as J,
	s as Q,
	k as C,
	q as R,
	l as I,
	m as L,
	r as A,
	h as g,
	n as k,
	a7 as me,
	b as D,
	C as p,
	V as Re,
	a8 as Me,
	u as G,
	A as ge,
	a as P,
	c as V,
	J as de,
	f as U,
	g as Y,
	t as N,
	d as x,
	v as j,
	w as F,
	x as M,
	y as Z,
	D as ce,
	p as Ae,
	B as Be,
	F as re,
	G as oe,
	H as fe,
	I as ue,
	N as ne,
	R as te,
	T as le,
	O as qe,
	P as He,
	W as se,
	a9 as ve,
	Q as Ze,
	U as pe
} from '../../../chunks/index-2fad9c0c.js';
import { c as Ge, s as We } from '../../../chunks/Select.svelte_svelte_type_style_lang-949aa272.js';
import { c as ze, S as Je } from '../../../chunks/Select-8360dfd8.js';
import { e as ie } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { c as Qe } from '../../../chunks/cultproposals-ee6a2386.js';
import { S as $e } from '../../../chunks/Seo-c7090712.js';
import '../../../chunks/stores-80acc175.js';
import '../../../chunks/singletons-7e9a75e8.js';
function Ke(n) {
	let e, l, t, i, r;
	return {
		c() {
			(e = C('div')), (l = R(n[0])), this.h();
		},
		l(s) {
			e = I(s, 'DIV', { class: !0 });
			var a = L(e);
			(l = A(a, n[0])), a.forEach(g), this.h();
		},
		h() {
			k(e, 'class', (t = me(n[1]) + ' svelte-ugev5v'));
		},
		m(s, a) {
			D(s, e, a),
				p(e, l),
				i ||
					((r = Re(e, 'click', function () {
						Me(n[2]) && n[2].apply(this, arguments);
					})),
					(i = !0));
		},
		p(s, [a]) {
			(n = s),
				a & 1 && G(l, n[0]),
				a & 2 && t !== (t = me(n[1]) + ' svelte-ugev5v') && k(e, 'class', t);
		},
		i: ge,
		o: ge,
		d(s) {
			s && g(e), (i = !1), r();
		}
	};
}
function Xe(n, e, l) {
	let { title: t = '' } = e,
		{ variant: i } = e,
		{ click: r = void 0 } = e;
	return (
		(n.$$set = (s) => {
			'title' in s && l(0, (t = s.title)),
				'variant' in s && l(1, (i = s.variant)),
				'click' in s && l(2, (r = s.click));
		}),
		[t, i, r]
	);
}
class Oe extends z {
	constructor(e) {
		super(), J(this, e, Xe, Ke, Q, { title: 0, variant: 1, click: 2 });
	}
}
function be(n, e, l) {
	const t = n.slice();
	return (t[14] = e[l]), t;
}
function ke(n) {
	let e, l;
	return (
		(e = new Oe({
			props: {
				click: n[13],
				variant: 'copy',
				title: n[9] ? 'copied!' : `${n[11][n[8]]} ${n[12](n[6])}`
			}
		})),
		{
			c() {
				j(e.$$.fragment);
			},
			l(t) {
				F(e.$$.fragment, t);
			},
			m(t, i) {
				M(e, t, i), (l = !0);
			},
			p(t, i) {
				const r = {};
				i & 832 && (r.title = t[9] ? 'copied!' : `${t[11][t[8]]} ${t[12](t[6])}`), e.$set(r);
			},
			i(t) {
				l || (U(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				N(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				Z(e, t);
			}
		}
	);
}
function Ee(n) {
	let e,
		l,
		t = n[3],
		i = [];
	for (let s = 0; s < t.length; s += 1) i[s] = we(be(n, t, s));
	const r = (s) =>
		N(i[s], 1, 1, () => {
			i[s] = null;
		});
	return {
		c() {
			e = C('div');
			for (let s = 0; s < i.length; s += 1) i[s].c();
			this.h();
		},
		l(s) {
			e = I(s, 'DIV', { class: !0 });
			var a = L(e);
			for (let o = 0; o < i.length; o += 1) i[o].l(a);
			a.forEach(g), this.h();
		},
		h() {
			k(e, 'class', 'card__tags svelte-1p17aya');
		},
		m(s, a) {
			D(s, e, a);
			for (let o = 0; o < i.length; o += 1) i[o].m(e, null);
			l = !0;
		},
		p(s, a) {
			if (a & 8) {
				t = s[3];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const c = be(s, t, o);
					i[o]
						? (i[o].p(c, a), U(i[o], 1))
						: ((i[o] = we(c)), i[o].c(), U(i[o], 1), i[o].m(e, null));
				}
				for (Y(), o = t.length; o < i.length; o += 1) r(o);
				x();
			}
		},
		i(s) {
			if (!l) {
				for (let a = 0; a < t.length; a += 1) U(i[a]);
				l = !0;
			}
		},
		o(s) {
			i = i.filter(Boolean);
			for (let a = 0; a < i.length; a += 1) N(i[a]);
			l = !1;
		},
		d(s) {
			s && g(e), ce(i, s);
		}
	};
}
function we(n) {
	let e, l;
	return (
		(e = new Oe({ props: { title: n[14], variant: 'blue' } })),
		{
			c() {
				j(e.$$.fragment);
			},
			l(t) {
				F(e.$$.fragment, t);
			},
			m(t, i) {
				M(e, t, i), (l = !0);
			},
			p(t, i) {
				const r = {};
				i & 8 && (r.title = t[14]), e.$set(r);
			},
			i(t) {
				l || (U(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				N(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				Z(e, t);
			}
		}
	);
}
function Ce(n) {
	let e, l, t, i, r, s, a, o, c;
	function m(_, b) {
		if (
			(b & 160 && (t = null),
			b & 160 && (i = null),
			t == null && (t = !!(_[7] || _[5]).includes('github')),
			t)
		)
			return xe;
		if ((i == null && (i = !!(_[7] || _[5]).includes('gitlab')), i)) return Ye;
	}
	let h = m(n, -1),
		u = h && h(n);
	return {
		c() {
			(e = C('div')),
				(l = C('div')),
				u && u.c(),
				(r = P()),
				(s = C('div')),
				(a = R(`\u2605
				`)),
				(o = C('code')),
				(c = R(n[4])),
				this.h();
		},
		l(_) {
			e = I(_, 'DIV', { class: !0 });
			var b = L(e);
			l = I(b, 'DIV', { class: !0 });
			var E = L(l);
			u && u.l(E), E.forEach(g), (r = V(b)), (s = I(b, 'DIV', { class: !0 }));
			var y = L(s);
			(a = A(
				y,
				`\u2605
				`
			)),
				(o = I(y, 'CODE', {}));
			var f = L(o);
			(c = A(f, n[4])), f.forEach(g), y.forEach(g), b.forEach(g), this.h();
		},
		h() {
			k(l, 'class', 'svelte-1p17aya'),
				k(s, 'class', 'svelte-1p17aya'),
				k(e, 'class', 'card__bottom svelte-1p17aya');
		},
		m(_, b) {
			D(_, e, b), p(e, l), u && u.m(l, null), p(e, r), p(e, s), p(s, a), p(s, o), p(o, c);
		},
		p(_, b) {
			h !== (h = m(_, b)) && (u && u.d(1), (u = h && h(_)), u && (u.c(), u.m(l, null))),
				b & 16 && G(c, _[4]);
		},
		d(_) {
			_ && g(e), u && u.d();
		}
	};
}
function Ye(n) {
	let e, l;
	return {
		c() {
			(e = C('img')), this.h();
		},
		l(t) {
			(e = I(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			Ae(e, 'display', 'inline'),
				Be(e.src, (l = '/images/gitlab_logo.svg')) || k(e, 'src', l),
				k(e, 'alt', 'gitlab logo');
		},
		m(t, i) {
			D(t, e, i);
		},
		d(t) {
			t && g(e);
		}
	};
}
function xe(n) {
	let e, l;
	return {
		c() {
			(e = C('img')), this.h();
		},
		l(t) {
			(e = I(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			Ae(e, 'display', 'inline'),
				Be(e.src, (l = '/images/github_logo.svg')) || k(e, 'src', l),
				k(e, 'alt', 'github logo');
		},
		m(t, i) {
			D(t, e, i);
		},
		d(t) {
			t && g(e);
		}
	};
}
function et(n) {
	let e,
		l,
		t,
		i,
		r,
		s,
		a,
		o,
		c,
		m,
		h,
		u,
		_,
		b,
		E,
		y,
		f = n[6] && ke(n),
		d = n[3] && Ee(n),
		T = typeof n[4] < 'u' && Ce(n);
	return {
		c() {
			(e = C('div')),
				(l = C('h3')),
				(t = C('a')),
				(i = R('#')),
				(s = P()),
				(a = C('a')),
				(o = R(n[1])),
				(c = P()),
				f && f.c(),
				(m = P()),
				(h = C('p')),
				(u = R(n[2])),
				(_ = P()),
				d && d.c(),
				(b = P()),
				T && T.c(),
				this.h();
		},
		l(v) {
			e = I(v, 'DIV', { class: !0, id: !0 });
			var w = L(e);
			l = I(w, 'H3', { class: !0 });
			var H = L(l);
			t = I(H, 'A', { href: !0 });
			var $ = L(t);
			(i = A($, '#')), $.forEach(g), (s = V(H)), (a = I(H, 'A', { href: !0 }));
			var ee = L(a);
			(o = A(ee, n[1])),
				ee.forEach(g),
				(c = V(H)),
				f && f.l(H),
				H.forEach(g),
				(m = V(w)),
				(h = I(w, 'P', { class: !0 }));
			var K = L(h);
			(u = A(K, n[2])),
				K.forEach(g),
				(_ = V(w)),
				d && d.l(w),
				(b = V(w)),
				T && T.l(w),
				w.forEach(g),
				this.h();
		},
		h() {
			k(t, 'href', (r = '#component-' + encodeURI(n[1]))),
				k(a, 'href', n[5]),
				k(l, 'class', 'svelte-1p17aya'),
				k(h, 'class', 'flex-grow svelte-1p17aya'),
				k(e, 'class', 'card svelte-1p17aya'),
				k(e, 'id', (E = 'component-' + encodeURI(n[1]))),
				de(e, 'active', n[0]);
		},
		m(v, w) {
			D(v, e, w),
				p(e, l),
				p(l, t),
				p(t, i),
				p(l, s),
				p(l, a),
				p(a, o),
				p(l, c),
				f && f.m(l, null),
				p(e, m),
				p(e, h),
				p(h, u),
				p(e, _),
				d && d.m(e, null),
				p(e, b),
				T && T.m(e, null),
				(y = !0);
		},
		p(v, [w]) {
			(!y || (w & 2 && r !== (r = '#component-' + encodeURI(v[1])))) && k(t, 'href', r),
				(!y || w & 2) && G(o, v[1]),
				(!y || w & 32) && k(a, 'href', v[5]),
				v[6]
					? f
						? (f.p(v, w), w & 64 && U(f, 1))
						: ((f = ke(v)), f.c(), U(f, 1), f.m(l, null))
					: f &&
					  (Y(),
					  N(f, 1, 1, () => {
							f = null;
					  }),
					  x()),
				(!y || w & 4) && G(u, v[2]),
				v[3]
					? d
						? (d.p(v, w), w & 8 && U(d, 1))
						: ((d = Ee(v)), d.c(), U(d, 1), d.m(e, b))
					: d &&
					  (Y(),
					  N(d, 1, 1, () => {
							d = null;
					  }),
					  x()),
				typeof v[4] < 'u'
					? T
						? T.p(v, w)
						: ((T = Ce(v)), T.c(), T.m(e, null))
					: T && (T.d(1), (T = null)),
				(!y || (w & 2 && E !== (E = 'component-' + encodeURI(v[1])))) && k(e, 'id', E),
				w & 1 && de(e, 'active', v[0]);
		},
		i(v) {
			y || (U(f), U(d), (y = !0));
		},
		o(v) {
			N(f), N(d), (y = !1);
		},
		d(v) {
			v && g(e), f && f.d(), d && d.d(), T && T.d();
		}
	};
}
function tt(n, e, l) {
	let { active: t = !1 } = e,
		{ title: i = '' } = e,
		{ description: r = '' } = e,
		{ tags: s = [] } = e,
		{ stars: a } = e,
		{ url: o = '' } = e,
		{ npm: c = '' } = e,
		{ repo: m = '' } = e,
		{ manager: h = 'npm' } = e,
		u = !1;
	const _ = () => {
			ze(`${b[h]} ${E(c)}`).then(() => l(9, (u = !1))), l(9, (u = !0));
		},
		b = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' },
		E = (f) => f.replace('https://www.npmjs.com/package/', ''),
		y = () => _();
	return (
		(n.$$set = (f) => {
			'active' in f && l(0, (t = f.active)),
				'title' in f && l(1, (i = f.title)),
				'description' in f && l(2, (r = f.description)),
				'tags' in f && l(3, (s = f.tags)),
				'stars' in f && l(4, (a = f.stars)),
				'url' in f && l(5, (o = f.url)),
				'npm' in f && l(6, (c = f.npm)),
				'repo' in f && l(7, (m = f.repo)),
				'manager' in f && l(8, (h = f.manager));
		}),
		[t, i, r, s, a, o, c, m, h, u, _, b, E, y]
	);
}
class lt extends z {
	constructor(e) {
		super(),
			J(this, e, tt, et, Q, {
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
function st(n) {
	let e, l, t, i, r, s, a, o, c, m;
	const h = n[3].default,
		u = re(h, n, n[2], null);
	return {
		c() {
			(e = C('div')),
				(l = C('h1')),
				(t = R(n[0])),
				(i = P()),
				(r = C('a')),
				(s = R('#')),
				(o = P()),
				(c = C('div')),
				u && u.c(),
				this.h();
		},
		l(_) {
			e = I(_, 'DIV', { class: !0 });
			var b = L(e);
			l = I(b, 'H1', { id: !0, class: !0 });
			var E = L(l);
			(t = A(E, n[0])), (i = V(E)), (r = I(E, 'A', { href: !0 }));
			var y = L(r);
			(s = A(y, '#')), y.forEach(g), E.forEach(g), (o = V(b)), (c = I(b, 'DIV', { class: !0 }));
			var f = L(c);
			u && u.l(f), f.forEach(g), b.forEach(g), this.h();
		},
		h() {
			k(r, 'href', (a = '#' + n[1])),
				k(l, 'id', n[1]),
				k(l, 'class', 'svelte-6ivwg1'),
				k(c, 'class', 'grid svelte-6ivwg1'),
				k(e, 'class', 'list svelte-6ivwg1');
		},
		m(_, b) {
			D(_, e, b),
				p(e, l),
				p(l, t),
				p(l, i),
				p(l, r),
				p(r, s),
				p(e, o),
				p(e, c),
				u && u.m(c, null),
				(m = !0);
		},
		p(_, [b]) {
			(!m || b & 1) && G(t, _[0]),
				(!m || (b & 2 && a !== (a = '#' + _[1]))) && k(r, 'href', a),
				(!m || b & 2) && k(l, 'id', _[1]),
				u && u.p && (!m || b & 4) && oe(u, h, _, _[2], m ? ue(h, _[2], b, null) : fe(_[2]), null);
		},
		i(_) {
			m || (U(u, _), (m = !0));
		},
		o(_) {
			N(u, _), (m = !1);
		},
		d(_) {
			_ && g(e), u && u.d(_);
		}
	};
}
function nt(n, e, l) {
	let { $$slots: t = {}, $$scope: i } = e,
		{ title: r } = e,
		{ id: s = `category-${encodeURI(r)}` } = e;
	return (
		(n.$$set = (a) => {
			'title' in a && l(0, (r = a.title)),
				'id' in a && l(1, (s = a.id)),
				'$$scope' in a && l(2, (i = a.$$scope));
		}),
		[r, s, i, t]
	);
}
class it extends z {
	constructor(e) {
		super(), J(this, e, nt, st, Q, { title: 0, id: 1 });
	}
}
function Ie(n) {
	let e, l;
	return {
		c() {
			(e = C('span')), (l = R(n[1])), this.h();
		},
		l(t) {
			e = I(t, 'SPAN', { class: !0 });
			var i = L(e);
			(l = A(i, n[1])), i.forEach(g), this.h();
		},
		h() {
			k(e, 'class', 'svelte-phe5gt');
		},
		m(t, i) {
			D(t, e, i), p(e, l);
		},
		p(t, i) {
			i & 2 && G(l, t[1]);
		},
		d(t) {
			t && g(e);
		}
	};
}
function at(n) {
	let e,
		l,
		t,
		i,
		r,
		s = n[1] && Ie(n);
	const a = [{ containerClasses: 'select-container' }, n[2]];
	function o(m) {
		n[3](m);
	}
	let c = {};
	for (let m = 0; m < a.length; m += 1) c = ne(c, a[m]);
	return (
		n[0] !== void 0 && (c.value = n[0]),
		(t = new Je({ props: c })),
		te.push(() => le(t, 'value', o)),
		{
			c() {
				(e = C('div')), s && s.c(), (l = P()), j(t.$$.fragment), this.h();
			},
			l(m) {
				e = I(m, 'DIV', { class: !0 });
				var h = L(e);
				s && s.l(h), (l = V(h)), F(t.$$.fragment, h), h.forEach(g), this.h();
			},
			h() {
				k(e, 'class', 'themed svelte-phe5gt');
			},
			m(m, h) {
				D(m, e, h), s && s.m(e, null), p(e, l), M(t, e, null), (r = !0);
			},
			p(m, [h]) {
				m[1] ? (s ? s.p(m, h) : ((s = Ie(m)), s.c(), s.m(e, l))) : s && (s.d(1), (s = null));
				const u = h & 4 ? qe(a, [a[0], He(m[2])]) : {};
				!i && h & 1 && ((i = !0), (u.value = m[0]), se(() => (i = !1))), t.$set(u);
			},
			i(m) {
				r || (U(t.$$.fragment, m), (r = !0));
			},
			o(m) {
				N(t.$$.fragment, m), (r = !1);
			},
			d(m) {
				m && g(e), s && s.d(), Z(t);
			}
		}
	);
}
function rt(n, e, l) {
	const t = ['value', 'label'];
	let i = ve(e, t),
		{ value: r } = e,
		{ label: s = '' } = e;
	function a(o) {
		(r = o), l(0, r);
	}
	return (
		(n.$$set = (o) => {
			(e = ne(ne({}, e), Ze(o))),
				l(2, (i = ve(e, t))),
				'value' in o && l(0, (r = o.value)),
				'label' in o && l(1, (s = o.label));
		}),
		[r, s, i, a]
	);
}
class ae extends z {
	constructor(e) {
		super(), J(this, e, rt, at, Q, { value: 0, label: 1 });
	}
}
const ot = (n) => ({}),
	ye = (n) => ({}),
	ft = (n) => ({}),
	Te = (n) => ({});
function ut(n) {
	let e, l, t, i, r, s, a;
	const o = n[2].controls,
		c = re(o, n, n[1], Te),
		m = n[2].items,
		h = re(m, n, n[1], ye);
	return {
		c() {
			(e = C('h1')),
				(l = R(n[0])),
				(t = P()),
				c && c.c(),
				(i = P()),
				(r = C('hr')),
				(s = P()),
				h && h.c();
		},
		l(u) {
			e = I(u, 'H1', {});
			var _ = L(e);
			(l = A(_, n[0])),
				_.forEach(g),
				(t = V(u)),
				c && c.l(u),
				(i = V(u)),
				(r = I(u, 'HR', {})),
				(s = V(u)),
				h && h.l(u);
		},
		m(u, _) {
			D(u, e, _),
				p(e, l),
				D(u, t, _),
				c && c.m(u, _),
				D(u, i, _),
				D(u, r, _),
				D(u, s, _),
				h && h.m(u, _),
				(a = !0);
		},
		p(u, [_]) {
			(!a || _ & 1) && G(l, u[0]),
				c && c.p && (!a || _ & 2) && oe(c, o, u, u[1], a ? ue(o, u[1], _, ft) : fe(u[1]), Te),
				h && h.p && (!a || _ & 2) && oe(h, m, u, u[1], a ? ue(m, u[1], _, ot) : fe(u[1]), ye);
		},
		i(u) {
			a || (U(c, u), U(h, u), (a = !0));
		},
		o(u) {
			N(c, u), N(h, u), (a = !1);
		},
		d(u) {
			u && g(e), u && g(t), c && c.d(u), u && g(i), u && g(r), u && g(s), h && h.d(u);
		}
	};
}
function ct(n, e, l) {
	let { $$slots: t = {}, $$scope: i } = e,
		{ title: r } = e;
	return (
		(n.$$set = (s) => {
			'title' in s && l(0, (r = s.title)), '$$scope' in s && l(1, (i = s.$$scope));
		}),
		[r, i, t]
	);
}
class _t extends z {
	constructor(e) {
		super(), J(this, e, ct, ut, Q, { title: 0 });
	}
}
const Ue = [
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
function Se(n, e, l) {
	const t = n.slice();
	return (t[17] = e[l]), t;
}
function De(n, e, l) {
	const t = n.slice();
	return (t[20] = e[l]), t;
}
function Le(n) {
	let e;
	return {
		c() {
			e = R('s');
		},
		l(l) {
			e = A(l, 's');
		},
		m(l, t) {
			D(l, e, t);
		},
		d(l) {
			l && g(e);
		}
	};
}
function ht(n) {
	let e,
		l,
		t,
		i,
		r,
		s,
		a,
		o,
		c,
		m,
		h,
		u,
		_,
		b,
		E,
		y,
		f,
		d = n[3].length + '',
		T,
		v,
		w,
		H,
		$;
	function ee(S) {
		n[12](S);
	}
	let K = { items: n[6], isMulti: !0, label: 'Tags' };
	n[1] !== void 0 && (K.value = n[1]),
		(t = new ae({ props: K })),
		te.push(() => le(t, 'value', ee));
	function je(S) {
		n[13](S);
	}
	let _e = {
		label: 'Category',
		items: n[7],
		placeholder: 'Category',
		isClearable: !1,
		showIndicator: !0
	};
	n[4] !== void 0 && (_e.value = n[4]),
		(s = new ae({ props: _e })),
		te.push(() => le(s, 'value', je));
	function Fe(S) {
		n[14](S);
	}
	let he = { items: We, label: 'Sorting', showIndicator: !0, isClearable: !1 };
	n[2] !== void 0 && (he.value = n[2]),
		(c = new ae({ props: he })),
		te.push(() => le(c, 'value', Fe));
	let B = n[3].length !== 1 && Le();
	return {
		c() {
			(e = C('section')),
				(l = C('div')),
				j(t.$$.fragment),
				(r = P()),
				j(s.$$.fragment),
				(o = P()),
				j(c.$$.fragment),
				(h = P()),
				(u = C('a')),
				(_ = R('Submit a material collection')),
				(b = P()),
				(E = C('input')),
				(y = P()),
				(f = C('span')),
				(T = R(d)),
				(v = R(' result')),
				B && B.c(),
				this.h();
		},
		l(S) {
			e = I(S, 'SECTION', { slot: !0, class: !0 });
			var q = L(e);
			l = I(q, 'DIV', { class: !0 });
			var O = L(l);
			F(t.$$.fragment, O),
				(r = V(O)),
				F(s.$$.fragment, O),
				(o = V(O)),
				F(c.$$.fragment, O),
				(h = V(O)),
				(u = I(O, 'A', { href: !0, class: !0 }));
			var X = L(u);
			(_ = A(X, 'Submit a material collection')),
				X.forEach(g),
				O.forEach(g),
				(b = V(q)),
				(E = I(q, 'INPUT', { class: !0, type: !0, placeholder: !0 })),
				(y = V(q)),
				(f = I(q, 'SPAN', { class: !0 }));
			var W = L(f);
			(T = A(W, d)), (v = A(W, ' result')), B && B.l(W), W.forEach(g), q.forEach(g), this.h();
		},
		h() {
			k(u, 'href', '/help/submitting?type=tool'),
				k(u, 'class', 'submit'),
				k(l, 'class', 'inputs'),
				k(E, 'class', 'searchbar'),
				k(E, 'type', 'text'),
				k(E, 'placeholder', 'Search for cultproposals...'),
				k(f, 'class', 'searchbar-count'),
				k(e, 'slot', 'controls'),
				k(e, 'class', 'controls');
		},
		m(S, q) {
			D(S, e, q),
				p(e, l),
				M(t, l, null),
				p(l, r),
				M(s, l, null),
				p(l, o),
				M(c, l, null),
				p(l, h),
				p(l, u),
				p(u, _),
				p(e, b),
				p(e, E),
				pe(E, n[0]),
				p(e, y),
				p(e, f),
				p(f, T),
				p(f, v),
				B && B.m(f, null),
				(w = !0),
				H || (($ = Re(E, 'input', n[15])), (H = !0));
		},
		p(S, q) {
			const O = {};
			!i && q & 2 && ((i = !0), (O.value = S[1]), se(() => (i = !1))), t.$set(O);
			const X = {};
			!a && q & 16 && ((a = !0), (X.value = S[4]), se(() => (a = !1))), s.$set(X);
			const W = {};
			!m && q & 4 && ((m = !0), (W.value = S[2]), se(() => (m = !1))),
				c.$set(W),
				q & 1 && E.value !== S[0] && pe(E, S[0]),
				(!w || q & 8) && d !== (d = S[3].length + '') && G(T, d),
				S[3].length !== 1 ? B || ((B = Le()), B.c(), B.m(f, null)) : B && (B.d(1), (B = null));
		},
		i(S) {
			w || (U(t.$$.fragment, S), U(s.$$.fragment, S), U(c.$$.fragment, S), (w = !0));
		},
		o(S) {
			N(t.$$.fragment, S), N(s.$$.fragment, S), N(c.$$.fragment, S), (w = !1);
		},
		d(S) {
			S && g(e), Z(t), Z(s), Z(c), B && B.d(), (H = !1), $();
		}
	};
}
function Ne(n) {
	let e, l;
	const t = [n[20]];
	let i = {};
	for (let r = 0; r < t.length; r += 1) i = ne(i, t[r]);
	return (
		(e = new lt({ props: i })),
		{
			c() {
				j(e.$$.fragment);
			},
			l(r) {
				F(e.$$.fragment, r);
			},
			m(r, s) {
				M(e, r, s), (l = !0);
			},
			p(r, s) {
				const a = s & 40 ? qe(t, [He(r[20])]) : {};
				e.$set(a);
			},
			i(r) {
				l || (U(e.$$.fragment, r), (l = !0));
			},
			o(r) {
				N(e.$$.fragment, r), (l = !1);
			},
			d(r) {
				Z(e, r);
			}
		}
	);
}
function mt(n) {
	let e, l;
	function t(...a) {
		return n[11](n[17], ...a);
	}
	let i = n[3].filter(t),
		r = [];
	for (let a = 0; a < i.length; a += 1) r[a] = Ne(De(n, i, a));
	const s = (a) =>
		N(r[a], 1, 1, () => {
			r[a] = null;
		});
	return {
		c() {
			for (let a = 0; a < r.length; a += 1) r[a].c();
			e = P();
		},
		l(a) {
			for (let o = 0; o < r.length; o += 1) r[o].l(a);
			e = V(a);
		},
		m(a, o) {
			for (let c = 0; c < r.length; c += 1) r[c].m(a, o);
			D(a, e, o), (l = !0);
		},
		p(a, o) {
			if (((n = a), o & 40)) {
				i = n[3].filter(t);
				let c;
				for (c = 0; c < i.length; c += 1) {
					const m = De(n, i, c);
					r[c]
						? (r[c].p(m, o), U(r[c], 1))
						: ((r[c] = Ne(m)), r[c].c(), U(r[c], 1), r[c].m(e.parentNode, e));
				}
				for (Y(), c = i.length; c < r.length; c += 1) s(c);
				x();
			}
		},
		i(a) {
			if (!l) {
				for (let o = 0; o < i.length; o += 1) U(r[o]);
				l = !0;
			}
		},
		o(a) {
			r = r.filter(Boolean);
			for (let o = 0; o < r.length; o += 1) N(r[o]);
			l = !1;
		},
		d(a) {
			ce(r, a), a && g(e);
		}
	};
}
function Pe(n) {
	let e, l;
	return (
		(e = new it({
			props: {
				title: n[17].label || 'Unclassified',
				id: n[8][n[17].label] || n[17].label || 'unclassified',
				$$slots: { default: [mt] },
				$$scope: { ctx: n }
			}
		})),
		{
			c() {
				j(e.$$.fragment);
			},
			l(t) {
				F(e.$$.fragment, t);
			},
			m(t, i) {
				M(e, t, i), (l = !0);
			},
			p(t, i) {
				const r = {};
				i & 32 && (r.title = t[17].label || 'Unclassified'),
					i & 32 && (r.id = t[8][t[17].label] || t[17].label || 'unclassified'),
					i & 8388648 && (r.$$scope = { dirty: i, ctx: t }),
					e.$set(r);
			},
			i(t) {
				l || (U(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				N(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				Z(e, t);
			}
		}
	);
}
function gt(n) {
	let e,
		l,
		t = n[5],
		i = [];
	for (let s = 0; s < t.length; s += 1) i[s] = Pe(Se(n, t, s));
	const r = (s) =>
		N(i[s], 1, 1, () => {
			i[s] = null;
		});
	return {
		c() {
			e = C('section');
			for (let s = 0; s < i.length; s += 1) i[s].c();
			this.h();
		},
		l(s) {
			e = I(s, 'SECTION', { slot: !0 });
			var a = L(e);
			for (let o = 0; o < i.length; o += 1) i[o].l(a);
			a.forEach(g), this.h();
		},
		h() {
			k(e, 'slot', 'items');
		},
		m(s, a) {
			D(s, e, a);
			for (let o = 0; o < i.length; o += 1) i[o].m(e, null);
			l = !0;
		},
		p(s, a) {
			if (a & 296) {
				t = s[5];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const c = Se(s, t, o);
					i[o]
						? (i[o].p(c, a), U(i[o], 1))
						: ((i[o] = Pe(c)), i[o].c(), U(i[o], 1), i[o].m(e, null));
				}
				for (Y(), o = t.length; o < i.length; o += 1) r(o);
				x();
			}
		},
		i(s) {
			if (!l) {
				for (let a = 0; a < t.length; a += 1) U(i[a]);
				l = !0;
			}
		},
		o(s) {
			i = i.filter(Boolean);
			for (let a = 0; a < i.length; a += 1) N(i[a]);
			l = !1;
		},
		d(s) {
			s && g(e), ce(i, s);
		}
	};
}
function dt(n) {
	let e, l, t, i, r, s, a, o, c, m, h, u, _, b, E, y;
	return (
		(e = new $e({ props: { title: 'CULT News' } })),
		(E = new _t({
			props: { title: 'CULT News', $$slots: { items: [gt], controls: [ht] }, $$scope: { ctx: n } }
		})),
		{
			c() {
				j(e.$$.fragment),
					(l = P()),
					(t = C('h1')),
					(i = R('CULT News')),
					(r = P()),
					(s = C('p')),
					(a = C('br')),
					(o = R(`

Under construction - everyone is invited to add CULT news via pull request.


`)),
					(c = C('p')),
					(m = C('br')),
					(h = R(`
The following is just to get some design- / layout ideas

`)),
					(u = C('p')),
					(_ = C('br')),
					(b = P()),
					j(E.$$.fragment);
			},
			l(f) {
				F(e.$$.fragment, f), (l = V(f)), (t = I(f, 'H1', {}));
				var d = L(t);
				(i = A(d, 'CULT News')), d.forEach(g), (r = V(f)), (s = I(f, 'P', {}));
				var T = L(s);
				(a = I(T, 'BR', {})),
					T.forEach(g),
					(o = A(
						f,
						`

Under construction - everyone is invited to add CULT news via pull request.


`
					)),
					(c = I(f, 'P', {}));
				var v = L(c);
				(m = I(v, 'BR', {})),
					v.forEach(g),
					(h = A(
						f,
						`
The following is just to get some design- / layout ideas

`
					)),
					(u = I(f, 'P', {}));
				var w = L(u);
				(_ = I(w, 'BR', {})), w.forEach(g), (b = V(f)), F(E.$$.fragment, f);
			},
			m(f, d) {
				M(e, f, d),
					D(f, l, d),
					D(f, t, d),
					p(t, i),
					D(f, r, d),
					D(f, s, d),
					p(s, a),
					D(f, o, d),
					D(f, c, d),
					p(c, m),
					D(f, h, d),
					D(f, u, d),
					p(u, _),
					D(f, b, d),
					M(E, f, d),
					(y = !0);
			},
			p(f, [d]) {
				const T = {};
				d & 8388671 && (T.$$scope = { dirty: d, ctx: f }), E.$set(T);
			},
			i(f) {
				y || (U(e.$$.fragment, f), U(E.$$.fragment, f), (y = !0));
			},
			o(f) {
				N(e.$$.fragment, f), N(E.$$.fragment, f), (y = !1);
			},
			d(f) {
				Z(e, f),
					f && g(l),
					f && g(t),
					f && g(r),
					f && g(s),
					f && g(o),
					f && g(c),
					f && g(h),
					f && g(u),
					f && g(b),
					Z(E, f);
			}
		}
	);
}
let Ve = null;
function vt(n, e, l) {
	let t, i, r, s;
	const a = ie(Ue, 'tags');
	let o = [],
		c = null;
	const m = [{ label: 'All', value: null }, ...ie(Qe, 'category')];
	let h = null,
		u = { value: 'stars_desc', label: 'Stars Desc' };
	const _ = (v, w) => v.filter((H) => w.includes(H)),
		b = {
			'Bundler Plugins': 'bundling',
			Debugging: 'debugging',
			'Editor Extensions': 'editor-support',
			'Linting and Formatting': 'code-quality',
			Preprocessors: 'preprocessors'
		},
		E = (v, w) => w.category === v.value;
	function y(v) {
		(c = v), l(1, c);
	}
	function f(v) {
		(h = v), l(4, h);
	}
	function d(v) {
		(u = v), l(2, u);
	}
	function T() {
		(s = this.value), l(0, s);
	}
	return (
		(n.$$.update = () => {
			n.$$.dirty & 4 && l(10, (t = (u == null ? void 0 : u.value) || 'stars_desc')),
				n.$$.dirty & 2 && l(9, (o = (c == null ? void 0 : c.map((v) => v.value)) || [])),
				n.$$.dirty & 1537 &&
					l(
						3,
						(i = Ue.filter((v) =>
							!s && o.length === 0 && Ve === null
								? !0
								: !(
										(s &&
											!(
												v.title.toLowerCase().includes(s.toLowerCase()) ||
												v.description.toLowerCase().includes(s.toLowerCase())
											)) ||
										(o.length > 0 && _(o, v.tags).length === 0) ||
										Ve !== null
								  )
						).sort(Ge(t)))
					),
				n.$$.dirty & 8 && l(5, (r = ie(i, 'category')));
		}),
		[s, c, u, i, h, r, a, m, b, o, t, E, y, f, d, T]
	);
}
class Tt extends z {
	constructor(e) {
		super(), J(this, e, vt, dt, Q, {});
	}
}
export { Tt as default };
