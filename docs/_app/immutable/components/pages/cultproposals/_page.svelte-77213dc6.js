import {
	S as me,
	i as ge,
	s as he,
	v as P,
	a as N,
	w as A,
	c as T,
	x as D,
	b as R,
	f as g,
	t as b,
	y as U,
	h as w,
	L as H,
	M as J,
	k as O,
	q as F,
	l as B,
	m as Q,
	r as G,
	n as y,
	C as d,
	N as le,
	O as de,
	P as W,
	u as $e,
	g as ie,
	d as ue,
	D as ce,
	Q as ve,
	R as be,
	T as Se
} from '../../../chunks/index-2fe5515f.js';
import {
	S as Ce,
	c as ye,
	a as X,
	s as we,
	C as ke,
	b as Ie
} from '../../../chunks/SearchLayout-13a80f1b.js';
import { c as Y } from '../../../chunks/cultproposals-ee6a2386.js';
import { e as Z } from '../../../chunks/Select-0fad25ba.js';
import { S as Ee } from '../../../chunks/Seo-54d47ec7.js';
import '../../../chunks/stores-b3470ee2.js';
import '../../../chunks/singletons-07985465.js';
function se(i, t, s) {
	const l = i.slice();
	return (l[18] = t[s]), l;
}
function ae(i, t, s) {
	const l = i.slice();
	return (l[21] = t[s]), l;
}
function ne(i) {
	let t;
	return {
		c() {
			t = F('s');
		},
		l(s) {
			t = G(s, 's');
		},
		m(s, l) {
			R(s, t, l);
		},
		d(s) {
			s && w(t);
		}
	};
}
function Le(i) {
	let t,
		s,
		l,
		a,
		e,
		n,
		r,
		o,
		u,
		k,
		S,
		m,
		C,
		M,
		h,
		V,
		$,
		I = i[4].length + '',
		q,
		j,
		f,
		E,
		z;
	function fe(c) {
		i[13](c);
	}
	let x = { items: i[6], isMulti: !0, label: 'Tags' };
	i[1] !== void 0 && (x.value = i[1]), (l = new X({ props: x })), H.push(() => J(l, 'value', fe));
	function pe(c) {
		i[14](c);
	}
	let ee = {
		label: 'Category',
		items: i[7],
		placeholder: 'Category',
		isClearable: !1,
		showIndicator: !0
	};
	i[2] !== void 0 && (ee.value = i[2]), (n = new X({ props: ee })), H.push(() => J(n, 'value', pe));
	function _e(c) {
		i[15](c);
	}
	let te = { items: we, label: 'Sorting', showIndicator: !0, isClearable: !1 };
	i[3] !== void 0 && (te.value = i[3]), (u = new X({ props: te })), H.push(() => J(u, 'value', _e));
	let p = i[4].length !== 1 && ne();
	return {
		c() {
			(t = O('section')),
				(s = O('div')),
				P(l.$$.fragment),
				(e = N()),
				P(n.$$.fragment),
				(o = N()),
				P(u.$$.fragment),
				(S = N()),
				(m = O('a')),
				(C = F('Submit a template')),
				(M = N()),
				(h = O('input')),
				(V = N()),
				($ = O('span')),
				(q = F(I)),
				(j = F(' result')),
				p && p.c(),
				this.h();
		},
		l(c) {
			t = B(c, 'SECTION', { class: !0, slot: !0 });
			var _ = Q(t);
			s = B(_, 'DIV', { class: !0 });
			var v = Q(s);
			A(l.$$.fragment, v),
				(e = T(v)),
				A(n.$$.fragment, v),
				(o = T(v)),
				A(u.$$.fragment, v),
				(S = T(v)),
				(m = B(v, 'A', { href: !0, class: !0 }));
			var K = Q(m);
			(C = G(K, 'Submit a template')),
				K.forEach(w),
				v.forEach(w),
				(M = T(_)),
				(h = B(_, 'INPUT', { class: !0, type: !0, placeholder: !0 })),
				(V = T(_)),
				($ = B(_, 'SPAN', { class: !0 }));
			var L = Q($);
			(q = G(L, I)), (j = G(L, ' result')), p && p.l(L), L.forEach(w), _.forEach(w), this.h();
		},
		h() {
			y(m, 'href', '/help/submitting?type=template'),
				y(m, 'class', 'submit'),
				y(s, 'class', 'inputs'),
				y(h, 'class', 'searchbar'),
				y(h, 'type', 'text'),
				y(h, 'placeholder', 'Search for cultproposals...'),
				y($, 'class', 'searchbar-count'),
				y(t, 'class', 'controls'),
				y(t, 'slot', 'controls');
		},
		m(c, _) {
			R(c, t, _),
				d(t, s),
				D(l, s, null),
				d(s, e),
				D(n, s, null),
				d(s, o),
				D(u, s, null),
				d(s, S),
				d(s, m),
				d(m, C),
				d(t, M),
				d(t, h),
				le(h, i[0]),
				d(t, V),
				d(t, $),
				d($, q),
				d($, j),
				p && p.m($, null),
				(f = !0),
				E || ((z = de(h, 'input', i[16])), (E = !0));
		},
		p(c, _) {
			const v = {};
			!a && _ & 2 && ((a = !0), (v.value = c[1]), W(() => (a = !1))), l.$set(v);
			const K = {};
			!r && _ & 4 && ((r = !0), (K.value = c[2]), W(() => (r = !1))), n.$set(K);
			const L = {};
			!k && _ & 8 && ((k = !0), (L.value = c[3]), W(() => (k = !1))),
				u.$set(L),
				_ & 1 && h.value !== c[0] && le(h, c[0]),
				(!f || _ & 16) && I !== (I = c[4].length + '') && $e(q, I),
				c[4].length !== 1 ? p || ((p = ne()), p.c(), p.m($, null)) : p && (p.d(1), (p = null));
		},
		i(c) {
			f || (g(l.$$.fragment, c), g(n.$$.fragment, c), g(u.$$.fragment, c), (f = !0));
		},
		o(c) {
			b(l.$$.fragment, c), b(n.$$.fragment, c), b(u.$$.fragment, c), (f = !1);
		},
		d(c) {
			c && w(t), U(l), U(n), U(u), p && p.d(), (E = !1), z();
		}
	};
}
function re(i) {
	let t, s;
	const l = [i[21]];
	let a = {};
	for (let e = 0; e < l.length; e += 1) a = ve(a, l[e]);
	return (
		(t = new Ie({ props: a })),
		{
			c() {
				P(t.$$.fragment);
			},
			l(e) {
				A(t.$$.fragment, e);
			},
			m(e, n) {
				D(t, e, n), (s = !0);
			},
			p(e, n) {
				const r = n & 48 ? be(l, [Se(e[21])]) : {};
				t.$set(r);
			},
			i(e) {
				s || (g(t.$$.fragment, e), (s = !0));
			},
			o(e) {
				b(t.$$.fragment, e), (s = !1);
			},
			d(e) {
				U(t, e);
			}
		}
	);
}
function Ne(i) {
	let t, s;
	function l(...r) {
		return i[12](i[18], ...r);
	}
	let a = i[4].filter(l),
		e = [];
	for (let r = 0; r < a.length; r += 1) e[r] = re(ae(i, a, r));
	const n = (r) =>
		b(e[r], 1, 1, () => {
			e[r] = null;
		});
	return {
		c() {
			for (let r = 0; r < e.length; r += 1) e[r].c();
			t = N();
		},
		l(r) {
			for (let o = 0; o < e.length; o += 1) e[o].l(r);
			t = T(r);
		},
		m(r, o) {
			for (let u = 0; u < e.length; u += 1) e[u].m(r, o);
			R(r, t, o), (s = !0);
		},
		p(r, o) {
			if (((i = r), o & 48)) {
				a = i[4].filter(l);
				let u;
				for (u = 0; u < a.length; u += 1) {
					const k = ae(i, a, u);
					e[u]
						? (e[u].p(k, o), g(e[u], 1))
						: ((e[u] = re(k)), e[u].c(), g(e[u], 1), e[u].m(t.parentNode, t));
				}
				for (ie(), u = a.length; u < e.length; u += 1) n(u);
				ue();
			}
		},
		i(r) {
			if (!s) {
				for (let o = 0; o < a.length; o += 1) g(e[o]);
				s = !0;
			}
		},
		o(r) {
			e = e.filter(Boolean);
			for (let o = 0; o < e.length; o += 1) b(e[o]);
			s = !1;
		},
		d(r) {
			ce(e, r), r && w(t);
		}
	};
}
function oe(i) {
	let t, s;
	return (
		(t = new ke({
			props: {
				title: i[18].label || 'Unclassified',
				id: i[8][i[18].label] || i[18].label || 'unclassified',
				$$slots: { default: [Ne] },
				$$scope: { ctx: i }
			}
		})),
		{
			c() {
				P(t.$$.fragment);
			},
			l(l) {
				A(t.$$.fragment, l);
			},
			m(l, a) {
				D(t, l, a), (s = !0);
			},
			p(l, a) {
				const e = {};
				a & 32 && (e.title = l[18].label || 'Unclassified'),
					a & 32 && (e.id = l[8][l[18].label] || l[18].label || 'unclassified'),
					a & 16777264 && (e.$$scope = { dirty: a, ctx: l }),
					t.$set(e);
			},
			i(l) {
				s || (g(t.$$.fragment, l), (s = !0));
			},
			o(l) {
				b(t.$$.fragment, l), (s = !1);
			},
			d(l) {
				U(t, l);
			}
		}
	);
}
function Te(i) {
	let t,
		s,
		l = i[5],
		a = [];
	for (let n = 0; n < l.length; n += 1) a[n] = oe(se(i, l, n));
	const e = (n) =>
		b(a[n], 1, 1, () => {
			a[n] = null;
		});
	return {
		c() {
			t = O('section');
			for (let n = 0; n < a.length; n += 1) a[n].c();
			this.h();
		},
		l(n) {
			t = B(n, 'SECTION', { slot: !0 });
			var r = Q(t);
			for (let o = 0; o < a.length; o += 1) a[o].l(r);
			r.forEach(w), this.h();
		},
		h() {
			y(t, 'slot', 'items');
		},
		m(n, r) {
			R(n, t, r);
			for (let o = 0; o < a.length; o += 1) a[o].m(t, null);
			s = !0;
		},
		p(n, r) {
			if (r & 304) {
				l = n[5];
				let o;
				for (o = 0; o < l.length; o += 1) {
					const u = se(n, l, o);
					a[o]
						? (a[o].p(u, r), g(a[o], 1))
						: ((a[o] = oe(u)), a[o].c(), g(a[o], 1), a[o].m(t, null));
				}
				for (ie(), o = l.length; o < a.length; o += 1) e(o);
				ue();
			}
		},
		i(n) {
			if (!s) {
				for (let r = 0; r < l.length; r += 1) g(a[r]);
				s = !0;
			}
		},
		o(n) {
			a = a.filter(Boolean);
			for (let r = 0; r < a.length; r += 1) b(a[r]);
			s = !1;
		},
		d(n) {
			n && w(t), ce(a, n);
		}
	};
}
function Pe(i) {
	let t, s, l, a;
	return (
		(t = new Ee({ props: { title: 'cultproposals' } })),
		(l = new Ce({
			props: {
				title: 'Cult Proposals',
				$$slots: { items: [Te], controls: [Le] },
				$$scope: { ctx: i }
			}
		})),
		{
			c() {
				P(t.$$.fragment), (s = N()), P(l.$$.fragment);
			},
			l(e) {
				A(t.$$.fragment, e), (s = T(e)), A(l.$$.fragment, e);
			},
			m(e, n) {
				D(t, e, n), R(e, s, n), D(l, e, n), (a = !0);
			},
			p(e, [n]) {
				const r = {};
				n & 16777279 && (r.$$scope = { dirty: n, ctx: e }), l.$set(r);
			},
			i(e) {
				a || (g(t.$$.fragment, e), g(l.$$.fragment, e), (a = !0));
			},
			o(e) {
				b(t.$$.fragment, e), b(l.$$.fragment, e), (a = !1);
			},
			d(e) {
				U(t, e), e && w(s), U(l, e);
			}
		}
	);
}
function Ae(i, t, s) {
	let l, a, e, n;
	const r = Z(Y, 'tags');
	let o = [],
		u = null;
	const k = [{ label: 'All', value: null }, ...Z(Y, 'category')];
	let S = null,
		m = null,
		C = { value: 'stars_desc', label: 'Stars Desc' };
	const M = (f, E) => f.filter((z) => E.includes(z)),
		h = { Sapper: 'sapper', Svelte: 'svelte', 'Svelte Add': 'adders', SvelteKit: 'svelte-kit' },
		V = (f, E) => E.category === f.value;
	function $(f) {
		(u = f), s(1, u);
	}
	function I(f) {
		(S = f), s(2, S);
	}
	function q(f) {
		(C = f), s(3, C);
	}
	function j() {
		(n = this.value), s(0, n);
	}
	return (
		(i.$$.update = () => {
			i.$$.dirty & 8 && s(11, (l = (C == null ? void 0 : C.value) || 'stars_desc')),
				i.$$.dirty & 4 && s(10, (m = (S == null ? void 0 : S.value) || null)),
				i.$$.dirty & 2 && s(9, (o = (u == null ? void 0 : u.map((f) => f.value)) || [])),
				i.$$.dirty & 3585 &&
					s(
						4,
						(a = Y.filter((f) =>
							!n && o.length === 0 && m === null
								? !0
								: !(
										(n &&
											!(
												f.title.toLowerCase().includes(n.toLowerCase()) ||
												f.description.toLowerCase().includes(n.toLowerCase())
											)) ||
										(o.length > 0 && M(o, f.tags).length === 0) ||
										(m !== null && f.category !== m)
								  )
						).sort(ye(l)))
					),
				i.$$.dirty & 16 && s(5, (e = Z(a, 'category')));
		}),
		[n, u, S, C, a, e, r, k, h, o, m, l, V, $, I, q, j]
	);
}
class je extends me {
	constructor(t) {
		super(), ge(this, t, Ae, Pe, he, {});
	}
}
export { je as default };
