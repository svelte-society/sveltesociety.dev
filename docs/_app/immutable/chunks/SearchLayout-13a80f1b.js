import {
	S as N,
	i as P,
	s as j,
	k as w,
	q as U,
	l as D,
	m as S,
	r as A,
	h as v,
	n as p,
	U as ee,
	b as L,
	C as g,
	O as he,
	V as ve,
	u as H,
	A as te,
	a as T,
	c as O,
	J as le,
	f as y,
	g as q,
	t as R,
	d as G,
	v as z,
	w as K,
	x as Y,
	y as Z,
	D as ge,
	p as _e,
	B as de,
	F,
	G as J,
	H as Q,
	I as W,
	Q as X,
	L as pe,
	M as be,
	R as ke,
	T as we,
	P as De,
	W as se,
	X as Ie
} from './index-2fe5515f.js';
import { c as Ce, S as Se } from './Select-0fad25ba.js';
function Ve(s) {
	let e, l, t, i, f;
	return {
		c() {
			(e = w('div')), (l = U(s[0])), this.h();
		},
		l(a) {
			e = D(a, 'DIV', { class: !0 });
			var r = S(e);
			(l = A(r, s[0])), r.forEach(v), this.h();
		},
		h() {
			p(e, 'class', (t = ee(s[1]) + ' svelte-ugev5v'));
		},
		m(a, r) {
			L(a, e, r),
				g(e, l),
				i ||
					((f = he(e, 'click', function () {
						ve(s[2]) && s[2].apply(this, arguments);
					})),
					(i = !0));
		},
		p(a, [r]) {
			(s = a),
				r & 1 && H(l, s[0]),
				r & 2 && t !== (t = ee(s[1]) + ' svelte-ugev5v') && p(e, 'class', t);
		},
		i: te,
		o: te,
		d(a) {
			a && v(e), (i = !1), f();
		}
	};
}
function Ee(s, e, l) {
	let { title: t = '' } = e,
		{ variant: i } = e,
		{ click: f = void 0 } = e;
	return (
		(s.$$set = (a) => {
			'title' in a && l(0, (t = a.title)),
				'variant' in a && l(1, (i = a.variant)),
				'click' in a && l(2, (f = a.click));
		}),
		[t, i, f]
	);
}
class me extends N {
	constructor(e) {
		super(), P(this, e, Ee, Ve, j, { title: 0, variant: 1, click: 2 });
	}
}
function ae(s, e, l) {
	const t = s.slice();
	return (t[14] = e[l]), t;
}
function ie(s) {
	let e, l;
	return (
		(e = new me({
			props: {
				click: s[13],
				variant: 'copy',
				title: s[9] ? 'copied!' : `${s[11][s[8]]} ${s[12](s[6])}`
			}
		})),
		{
			c() {
				z(e.$$.fragment);
			},
			l(t) {
				K(e.$$.fragment, t);
			},
			m(t, i) {
				Y(e, t, i), (l = !0);
			},
			p(t, i) {
				const f = {};
				i & 832 && (f.title = t[9] ? 'copied!' : `${t[11][t[8]]} ${t[12](t[6])}`), e.$set(f);
			},
			i(t) {
				l || (y(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				R(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				Z(e, t);
			}
		}
	);
}
function ne(s) {
	let e,
		l,
		t = s[3],
		i = [];
	for (let a = 0; a < t.length; a += 1) i[a] = re(ae(s, t, a));
	const f = (a) =>
		R(i[a], 1, 1, () => {
			i[a] = null;
		});
	return {
		c() {
			e = w('div');
			for (let a = 0; a < i.length; a += 1) i[a].c();
			this.h();
		},
		l(a) {
			e = D(a, 'DIV', { class: !0 });
			var r = S(e);
			for (let o = 0; o < i.length; o += 1) i[o].l(r);
			r.forEach(v), this.h();
		},
		h() {
			p(e, 'class', 'card__tags svelte-1p17aya');
		},
		m(a, r) {
			L(a, e, r);
			for (let o = 0; o < i.length; o += 1) i[o].m(e, null);
			l = !0;
		},
		p(a, r) {
			if (r & 8) {
				t = a[3];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const m = ae(a, t, o);
					i[o]
						? (i[o].p(m, r), y(i[o], 1))
						: ((i[o] = re(m)), i[o].c(), y(i[o], 1), i[o].m(e, null));
				}
				for (q(), o = t.length; o < i.length; o += 1) f(o);
				G();
			}
		},
		i(a) {
			if (!l) {
				for (let r = 0; r < t.length; r += 1) y(i[r]);
				l = !0;
			}
		},
		o(a) {
			i = i.filter(Boolean);
			for (let r = 0; r < i.length; r += 1) R(i[r]);
			l = !1;
		},
		d(a) {
			a && v(e), ge(i, a);
		}
	};
}
function re(s) {
	let e, l;
	return (
		(e = new me({ props: { title: s[14], variant: 'blue' } })),
		{
			c() {
				z(e.$$.fragment);
			},
			l(t) {
				K(e.$$.fragment, t);
			},
			m(t, i) {
				Y(e, t, i), (l = !0);
			},
			p(t, i) {
				const f = {};
				i & 8 && (f.title = t[14]), e.$set(f);
			},
			i(t) {
				l || (y(e.$$.fragment, t), (l = !0));
			},
			o(t) {
				R(e.$$.fragment, t), (l = !1);
			},
			d(t) {
				Z(e, t);
			}
		}
	);
}
function ce(s) {
	let e, l, t, i, f, a, r, o, m;
	function d(c, h) {
		if (
			(h & 160 && (t = null),
			h & 160 && (i = null),
			t == null && (t = !!(c[7] || c[5]).includes('github')),
			t)
		)
			return Le;
		if ((i == null && (i = !!(c[7] || c[5]).includes('gitlab')), i)) return ye;
	}
	let _ = d(s, -1),
		n = _ && _(s);
	return {
		c() {
			(e = w('div')),
				(l = w('div')),
				n && n.c(),
				(f = T()),
				(a = w('div')),
				(r = U(`\u2605
				`)),
				(o = w('code')),
				(m = U(s[4])),
				this.h();
		},
		l(c) {
			e = D(c, 'DIV', { class: !0 });
			var h = S(e);
			l = D(h, 'DIV', { class: !0 });
			var E = S(l);
			n && n.l(E), E.forEach(v), (f = O(h)), (a = D(h, 'DIV', { class: !0 }));
			var C = S(a);
			(r = A(
				C,
				`\u2605
				`
			)),
				(o = D(C, 'CODE', {}));
			var u = S(o);
			(m = A(u, s[4])), u.forEach(v), C.forEach(v), h.forEach(v), this.h();
		},
		h() {
			p(l, 'class', 'svelte-1p17aya'),
				p(a, 'class', 'svelte-1p17aya'),
				p(e, 'class', 'card__bottom svelte-1p17aya');
		},
		m(c, h) {
			L(c, e, h), g(e, l), n && n.m(l, null), g(e, f), g(e, a), g(a, r), g(a, o), g(o, m);
		},
		p(c, h) {
			_ !== (_ = d(c, h)) && (n && n.d(1), (n = _ && _(c)), n && (n.c(), n.m(l, null))),
				h & 16 && H(m, c[4]);
		},
		d(c) {
			c && v(e), n && n.d();
		}
	};
}
function ye(s) {
	let e, l;
	return {
		c() {
			(e = w('img')), this.h();
		},
		l(t) {
			(e = D(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			_e(e, 'display', 'inline'),
				de(e.src, (l = '/images/gitlab_logo.svg')) || p(e, 'src', l),
				p(e, 'alt', 'gitlab logo');
		},
		m(t, i) {
			L(t, e, i);
		},
		d(t) {
			t && v(e);
		}
	};
}
function Le(s) {
	let e, l;
	return {
		c() {
			(e = w('img')), this.h();
		},
		l(t) {
			(e = D(t, 'IMG', { style: !0, src: !0, alt: !0 })), this.h();
		},
		h() {
			_e(e, 'display', 'inline'),
				de(e.src, (l = '/images/github_logo.svg')) || p(e, 'src', l),
				p(e, 'alt', 'github logo');
		},
		m(t, i) {
			L(t, e, i);
		},
		d(t) {
			t && v(e);
		}
	};
}
function Te(s) {
	let e,
		l,
		t,
		i,
		f,
		a,
		r,
		o,
		m,
		d,
		_,
		n,
		c,
		h,
		E,
		C,
		u = s[6] && ie(s),
		I = s[3] && ne(s),
		V = typeof s[4] < 'u' && ce(s);
	return {
		c() {
			(e = w('div')),
				(l = w('h3')),
				(t = w('a')),
				(i = U('#')),
				(a = T()),
				(r = w('a')),
				(o = U(s[1])),
				(m = T()),
				u && u.c(),
				(d = T()),
				(_ = w('p')),
				(n = U(s[2])),
				(c = T()),
				I && I.c(),
				(h = T()),
				V && V.c(),
				this.h();
		},
		l(b) {
			e = D(b, 'DIV', { class: !0, id: !0 });
			var k = S(e);
			l = D(k, 'H3', { class: !0 });
			var M = S(l);
			t = D(M, 'A', { href: !0 });
			var B = S(t);
			(i = A(B, '#')), B.forEach(v), (a = O(M)), (r = D(M, 'A', { href: !0 }));
			var $ = S(r);
			(o = A($, s[1])),
				$.forEach(v),
				(m = O(M)),
				u && u.l(M),
				M.forEach(v),
				(d = O(k)),
				(_ = D(k, 'P', { class: !0 }));
			var x = S(_);
			(n = A(x, s[2])),
				x.forEach(v),
				(c = O(k)),
				I && I.l(k),
				(h = O(k)),
				V && V.l(k),
				k.forEach(v),
				this.h();
		},
		h() {
			p(t, 'href', (f = '#component-' + encodeURI(s[1]))),
				p(r, 'href', s[5]),
				p(l, 'class', 'svelte-1p17aya'),
				p(_, 'class', 'flex-grow svelte-1p17aya'),
				p(e, 'class', 'card svelte-1p17aya'),
				p(e, 'id', (E = 'component-' + encodeURI(s[1]))),
				le(e, 'active', s[0]);
		},
		m(b, k) {
			L(b, e, k),
				g(e, l),
				g(l, t),
				g(t, i),
				g(l, a),
				g(l, r),
				g(r, o),
				g(l, m),
				u && u.m(l, null),
				g(e, d),
				g(e, _),
				g(_, n),
				g(e, c),
				I && I.m(e, null),
				g(e, h),
				V && V.m(e, null),
				(C = !0);
		},
		p(b, [k]) {
			(!C || (k & 2 && f !== (f = '#component-' + encodeURI(b[1])))) && p(t, 'href', f),
				(!C || k & 2) && H(o, b[1]),
				(!C || k & 32) && p(r, 'href', b[5]),
				b[6]
					? u
						? (u.p(b, k), k & 64 && y(u, 1))
						: ((u = ie(b)), u.c(), y(u, 1), u.m(l, null))
					: u &&
					  (q(),
					  R(u, 1, 1, () => {
							u = null;
					  }),
					  G()),
				(!C || k & 4) && H(n, b[2]),
				b[3]
					? I
						? (I.p(b, k), k & 8 && y(I, 1))
						: ((I = ne(b)), I.c(), y(I, 1), I.m(e, h))
					: I &&
					  (q(),
					  R(I, 1, 1, () => {
							I = null;
					  }),
					  G()),
				typeof b[4] < 'u'
					? V
						? V.p(b, k)
						: ((V = ce(b)), V.c(), V.m(e, null))
					: V && (V.d(1), (V = null)),
				(!C || (k & 2 && E !== (E = 'component-' + encodeURI(b[1])))) && p(e, 'id', E),
				k & 1 && le(e, 'active', b[0]);
		},
		i(b) {
			C || (y(u), y(I), (C = !0));
		},
		o(b) {
			R(u), R(I), (C = !1);
		},
		d(b) {
			b && v(e), u && u.d(), I && I.d(), V && V.d();
		}
	};
}
function Oe(s, e, l) {
	let { active: t = !1 } = e,
		{ title: i = '' } = e,
		{ description: f = '' } = e,
		{ tags: a = [] } = e,
		{ stars: r } = e,
		{ url: o = '' } = e,
		{ npm: m = '' } = e,
		{ repo: d = '' } = e,
		{ manager: _ = 'npm' } = e,
		n = !1;
	const c = () => {
			Ce(`${h[_]} ${E(m)}`).then(() => l(9, (n = !1))), l(9, (n = !0));
		},
		h = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' },
		E = (u) => u.replace('https://www.npmjs.com/package/', ''),
		C = () => c();
	return (
		(s.$$set = (u) => {
			'active' in u && l(0, (t = u.active)),
				'title' in u && l(1, (i = u.title)),
				'description' in u && l(2, (f = u.description)),
				'tags' in u && l(3, (a = u.tags)),
				'stars' in u && l(4, (r = u.stars)),
				'url' in u && l(5, (o = u.url)),
				'npm' in u && l(6, (m = u.npm)),
				'repo' in u && l(7, (d = u.repo)),
				'manager' in u && l(8, (_ = u.manager));
		}),
		[t, i, f, a, r, o, m, d, _, n, c, h, E, C]
	);
}
class Je extends N {
	constructor(e) {
		super(),
			P(this, e, Oe, Te, j, {
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
function Re(s) {
	let e, l, t, i, f, a, r, o, m, d;
	const _ = s[3].default,
		n = F(_, s, s[2], null);
	return {
		c() {
			(e = w('div')),
				(l = w('h1')),
				(t = U(s[0])),
				(i = T()),
				(f = w('a')),
				(a = U('#')),
				(o = T()),
				(m = w('div')),
				n && n.c(),
				this.h();
		},
		l(c) {
			e = D(c, 'DIV', { class: !0 });
			var h = S(e);
			l = D(h, 'H1', { id: !0, class: !0 });
			var E = S(l);
			(t = A(E, s[0])), (i = O(E)), (f = D(E, 'A', { href: !0 }));
			var C = S(f);
			(a = A(C, '#')), C.forEach(v), E.forEach(v), (o = O(h)), (m = D(h, 'DIV', { class: !0 }));
			var u = S(m);
			n && n.l(u), u.forEach(v), h.forEach(v), this.h();
		},
		h() {
			p(f, 'href', (r = '#' + s[1])),
				p(l, 'id', s[1]),
				p(l, 'class', 'svelte-6ivwg1'),
				p(m, 'class', 'grid svelte-6ivwg1'),
				p(e, 'class', 'list svelte-6ivwg1');
		},
		m(c, h) {
			L(c, e, h),
				g(e, l),
				g(l, t),
				g(l, i),
				g(l, f),
				g(f, a),
				g(e, o),
				g(e, m),
				n && n.m(m, null),
				(d = !0);
		},
		p(c, [h]) {
			(!d || h & 1) && H(t, c[0]),
				(!d || (h & 2 && r !== (r = '#' + c[1]))) && p(f, 'href', r),
				(!d || h & 2) && p(l, 'id', c[1]),
				n && n.p && (!d || h & 4) && J(n, _, c, c[2], d ? W(_, c[2], h, null) : Q(c[2]), null);
		},
		i(c) {
			d || (y(n, c), (d = !0));
		},
		o(c) {
			R(n, c), (d = !1);
		},
		d(c) {
			c && v(e), n && n.d(c);
		}
	};
}
function Ue(s, e, l) {
	let { $$slots: t = {}, $$scope: i } = e,
		{ title: f } = e,
		{ id: a = `category-${encodeURI(f)}` } = e;
	return (
		(s.$$set = (r) => {
			'title' in r && l(0, (f = r.title)),
				'id' in r && l(1, (a = r.id)),
				'$$scope' in r && l(2, (i = r.$$scope));
		}),
		[f, a, i, t]
	);
}
class Qe extends N {
	constructor(e) {
		super(), P(this, e, Ue, Re, j, { title: 0, id: 1 });
	}
}
const We = (s) => (e, l) => {
		switch (s) {
			case 'added_desc':
				return new Date(l.addedOn || '').getTime() - new Date(e.addedOn || '').getTime();
			case 'added_asc':
				return new Date(e.addedOn || '').getTime() - new Date(l.addedOn || '').getTime();
			case 'name_asc':
				return e.title.toLowerCase().localeCompare(l.title.toLowerCase());
			case 'name_desc':
				return l.title.toLowerCase().localeCompare(e.title.toLowerCase());
			case 'stars_desc':
				return (l.stars || 0) - (e.stars || 0);
			case 'stars_asc':
				return (e.stars || 0) - (l.stars || 0);
		}
	},
	Ae = {
		added_desc: 'Added Desc',
		added_asc: 'Added Asc',
		name_asc: 'Name Asc',
		name_desc: 'Name Desc',
		stars_desc: 'Stars Desc',
		stars_asc: 'Stars Asc'
	},
	Xe = Object.entries(Ae).map(([s, e]) => ({ label: e, value: s }));
function fe(s) {
	let e, l;
	return {
		c() {
			(e = w('span')), (l = U(s[1])), this.h();
		},
		l(t) {
			e = D(t, 'SPAN', { class: !0 });
			var i = S(e);
			(l = A(i, s[1])), i.forEach(v), this.h();
		},
		h() {
			p(e, 'class', 'svelte-phe5gt');
		},
		m(t, i) {
			L(t, e, i), g(e, l);
		},
		p(t, i) {
			i & 2 && H(l, t[1]);
		},
		d(t) {
			t && v(e);
		}
	};
}
function He(s) {
	let e,
		l,
		t,
		i,
		f,
		a = s[1] && fe(s);
	const r = [{ containerClasses: 'select-container' }, s[2]];
	function o(d) {
		s[3](d);
	}
	let m = {};
	for (let d = 0; d < r.length; d += 1) m = X(m, r[d]);
	return (
		s[0] !== void 0 && (m.value = s[0]),
		(t = new Se({ props: m })),
		pe.push(() => be(t, 'value', o)),
		{
			c() {
				(e = w('div')), a && a.c(), (l = T()), z(t.$$.fragment), this.h();
			},
			l(d) {
				e = D(d, 'DIV', { class: !0 });
				var _ = S(e);
				a && a.l(_), (l = O(_)), K(t.$$.fragment, _), _.forEach(v), this.h();
			},
			h() {
				p(e, 'class', 'themed svelte-phe5gt');
			},
			m(d, _) {
				L(d, e, _), a && a.m(e, null), g(e, l), Y(t, e, null), (f = !0);
			},
			p(d, [_]) {
				d[1] ? (a ? a.p(d, _) : ((a = fe(d)), a.c(), a.m(e, l))) : a && (a.d(1), (a = null));
				const n = _ & 4 ? ke(r, [r[0], we(d[2])]) : {};
				!i && _ & 1 && ((i = !0), (n.value = d[0]), De(() => (i = !1))), t.$set(n);
			},
			i(d) {
				f || (y(t.$$.fragment, d), (f = !0));
			},
			o(d) {
				R(t.$$.fragment, d), (f = !1);
			},
			d(d) {
				d && v(e), a && a.d(), Z(t);
			}
		}
	);
}
function Me(s, e, l) {
	const t = ['value', 'label'];
	let i = se(e, t),
		{ value: f } = e,
		{ label: a = '' } = e;
	function r(o) {
		(f = o), l(0, f);
	}
	return (
		(s.$$set = (o) => {
			(e = X(X({}, e), Ie(o))),
				l(2, (i = se(e, t))),
				'value' in o && l(0, (f = o.value)),
				'label' in o && l(1, (a = o.label));
		}),
		[f, a, i, r]
	);
}
class ze extends N {
	constructor(e) {
		super(), P(this, e, Me, He, j, { value: 0, label: 1 });
	}
}
const Ne = (s) => ({}),
	oe = (s) => ({}),
	Pe = (s) => ({}),
	ue = (s) => ({});
function je(s) {
	let e, l, t, i, f, a, r;
	const o = s[2].controls,
		m = F(o, s, s[1], ue),
		d = s[2].items,
		_ = F(d, s, s[1], oe);
	return {
		c() {
			(e = w('h1')),
				(l = U(s[0])),
				(t = T()),
				m && m.c(),
				(i = T()),
				(f = w('hr')),
				(a = T()),
				_ && _.c();
		},
		l(n) {
			e = D(n, 'H1', {});
			var c = S(e);
			(l = A(c, s[0])),
				c.forEach(v),
				(t = O(n)),
				m && m.l(n),
				(i = O(n)),
				(f = D(n, 'HR', {})),
				(a = O(n)),
				_ && _.l(n);
		},
		m(n, c) {
			L(n, e, c),
				g(e, l),
				L(n, t, c),
				m && m.m(n, c),
				L(n, i, c),
				L(n, f, c),
				L(n, a, c),
				_ && _.m(n, c),
				(r = !0);
		},
		p(n, [c]) {
			(!r || c & 1) && H(l, n[0]),
				m && m.p && (!r || c & 2) && J(m, o, n, n[1], r ? W(o, n[1], c, Pe) : Q(n[1]), ue),
				_ && _.p && (!r || c & 2) && J(_, d, n, n[1], r ? W(d, n[1], c, Ne) : Q(n[1]), oe);
		},
		i(n) {
			r || (y(m, n), y(_, n), (r = !0));
		},
		o(n) {
			R(m, n), R(_, n), (r = !1);
		},
		d(n) {
			n && v(e), n && v(t), m && m.d(n), n && v(i), n && v(f), n && v(a), _ && _.d(n);
		}
	};
}
function qe(s, e, l) {
	let { $$slots: t = {}, $$scope: i } = e,
		{ title: f } = e;
	return (
		(s.$$set = (a) => {
			'title' in a && l(0, (f = a.title)), '$$scope' in a && l(1, (i = a.$$scope));
		}),
		[f, i, t]
	);
}
class Ke extends N {
	constructor(e) {
		super(), P(this, e, qe, je, j, { title: 0 });
	}
}
export { Qe as C, Ke as S, ze as a, Je as b, We as c, Xe as s };
