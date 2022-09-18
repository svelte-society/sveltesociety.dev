import {
	S as _e,
	i as de,
	s as he,
	v as N,
	a as I,
	w as U,
	c as E,
	x as D,
	b as M,
	f as _,
	t as v,
	y as P,
	h as y,
	L as H,
	M as Q,
	k as A,
	q as W,
	l as q,
	m as j,
	r as z,
	n as C,
	C as h,
	N as te,
	O as $e,
	P as G,
	u as be,
	g as ce,
	d as ue,
	D as fe,
	Q as ve,
	R as Ce,
	T as ye
} from '../../../chunks/index-2fe5515f.js';
import {
	S as we,
	c as Se,
	a as J,
	s as Le,
	C as Te,
	b as ke
} from '../../../chunks/SearchLayout-13a80f1b.js';
import { e as K } from '../../../chunks/Select-0fad25ba.js';
import { c as Ie } from '../../../chunks/cultproposals-ee6a2386.js';
import { S as Ee } from '../../../chunks/Seo-fb4a23a4.js';
import '../../../chunks/stores-e1bb27ae.js';
import '../../../chunks/singletons-a3426cc4.js';
const le = [
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
function se(i, t, s) {
	const l = i.slice();
	return (l[17] = t[s]), l;
}
function ne(i, t, s) {
	const l = i.slice();
	return (l[20] = t[s]), l;
}
function re(i) {
	let t;
	return {
		c() {
			t = W('s');
		},
		l(s) {
			t = z(s, 's');
		},
		m(s, l) {
			M(s, t, l);
		},
		d(s) {
			s && y(t);
		}
	};
}
function Ne(i) {
	let t,
		s,
		l,
		n,
		e,
		r,
		a,
		o,
		c,
		S,
		L,
		p,
		B,
		F,
		d,
		Z,
		$,
		T = i[3].length + '',
		O,
		f,
		w,
		R,
		X;
	function ge(u) {
		i[12](u);
	}
	let Y = { items: i[6], isMulti: !0, label: 'Tags' };
	i[1] !== void 0 && (Y.value = i[1]), (l = new J({ props: Y })), H.push(() => Q(l, 'value', ge));
	function pe(u) {
		i[13](u);
	}
	let x = {
		label: 'Category',
		items: i[7],
		placeholder: 'Category',
		isClearable: !1,
		showIndicator: !0
	};
	i[4] !== void 0 && (x.value = i[4]), (r = new J({ props: x })), H.push(() => Q(r, 'value', pe));
	function me(u) {
		i[14](u);
	}
	let ee = { items: Le, label: 'Sorting', showIndicator: !0, isClearable: !1 };
	i[2] !== void 0 && (ee.value = i[2]), (c = new J({ props: ee })), H.push(() => Q(c, 'value', me));
	let g = i[3].length !== 1 && re();
	return {
		c() {
			(t = A('section')),
				(s = A('div')),
				N(l.$$.fragment),
				(e = I()),
				N(r.$$.fragment),
				(o = I()),
				N(c.$$.fragment),
				(L = I()),
				(p = A('a')),
				(B = W('Submit a material collection')),
				(F = I()),
				(d = A('input')),
				(Z = I()),
				($ = A('span')),
				(O = W(T)),
				(f = W(' result')),
				g && g.c(),
				this.h();
		},
		l(u) {
			t = q(u, 'SECTION', { slot: !0, class: !0 });
			var m = j(t);
			s = q(m, 'DIV', { class: !0 });
			var b = j(s);
			U(l.$$.fragment, b),
				(e = E(b)),
				U(r.$$.fragment, b),
				(o = E(b)),
				U(c.$$.fragment, b),
				(L = E(b)),
				(p = q(b, 'A', { href: !0, class: !0 }));
			var V = j(p);
			(B = z(V, 'Submit a material collection')),
				V.forEach(y),
				b.forEach(y),
				(F = E(m)),
				(d = q(m, 'INPUT', { class: !0, type: !0, placeholder: !0 })),
				(Z = E(m)),
				($ = q(m, 'SPAN', { class: !0 }));
			var k = j($);
			(O = z(k, T)), (f = z(k, ' result')), g && g.l(k), k.forEach(y), m.forEach(y), this.h();
		},
		h() {
			C(p, 'href', '/help/submitting?type=tool'),
				C(p, 'class', 'submit'),
				C(s, 'class', 'inputs'),
				C(d, 'class', 'searchbar'),
				C(d, 'type', 'text'),
				C(d, 'placeholder', 'Search for cultproposals...'),
				C($, 'class', 'searchbar-count'),
				C(t, 'slot', 'controls'),
				C(t, 'class', 'controls');
		},
		m(u, m) {
			M(u, t, m),
				h(t, s),
				D(l, s, null),
				h(s, e),
				D(r, s, null),
				h(s, o),
				D(c, s, null),
				h(s, L),
				h(s, p),
				h(p, B),
				h(t, F),
				h(t, d),
				te(d, i[0]),
				h(t, Z),
				h(t, $),
				h($, O),
				h($, f),
				g && g.m($, null),
				(w = !0),
				R || ((X = $e(d, 'input', i[15])), (R = !0));
		},
		p(u, m) {
			const b = {};
			!n && m & 2 && ((n = !0), (b.value = u[1]), G(() => (n = !1))), l.$set(b);
			const V = {};
			!a && m & 16 && ((a = !0), (V.value = u[4]), G(() => (a = !1))), r.$set(V);
			const k = {};
			!S && m & 4 && ((S = !0), (k.value = u[2]), G(() => (S = !1))),
				c.$set(k),
				m & 1 && d.value !== u[0] && te(d, u[0]),
				(!w || m & 8) && T !== (T = u[3].length + '') && be(O, T),
				u[3].length !== 1 ? g || ((g = re()), g.c(), g.m($, null)) : g && (g.d(1), (g = null));
		},
		i(u) {
			w || (_(l.$$.fragment, u), _(r.$$.fragment, u), _(c.$$.fragment, u), (w = !0));
		},
		o(u) {
			v(l.$$.fragment, u), v(r.$$.fragment, u), v(c.$$.fragment, u), (w = !1);
		},
		d(u) {
			u && y(t), P(l), P(r), P(c), g && g.d(), (R = !1), X();
		}
	};
}
function ae(i) {
	let t, s;
	const l = [i[20]];
	let n = {};
	for (let e = 0; e < l.length; e += 1) n = ve(n, l[e]);
	return (
		(t = new ke({ props: n })),
		{
			c() {
				N(t.$$.fragment);
			},
			l(e) {
				U(t.$$.fragment, e);
			},
			m(e, r) {
				D(t, e, r), (s = !0);
			},
			p(e, r) {
				const a = r & 40 ? Ce(l, [ye(e[20])]) : {};
				t.$set(a);
			},
			i(e) {
				s || (_(t.$$.fragment, e), (s = !0));
			},
			o(e) {
				v(t.$$.fragment, e), (s = !1);
			},
			d(e) {
				P(t, e);
			}
		}
	);
}
function Ue(i) {
	let t, s;
	function l(...a) {
		return i[11](i[17], ...a);
	}
	let n = i[3].filter(l),
		e = [];
	for (let a = 0; a < n.length; a += 1) e[a] = ae(ne(i, n, a));
	const r = (a) =>
		v(e[a], 1, 1, () => {
			e[a] = null;
		});
	return {
		c() {
			for (let a = 0; a < e.length; a += 1) e[a].c();
			t = I();
		},
		l(a) {
			for (let o = 0; o < e.length; o += 1) e[o].l(a);
			t = E(a);
		},
		m(a, o) {
			for (let c = 0; c < e.length; c += 1) e[c].m(a, o);
			M(a, t, o), (s = !0);
		},
		p(a, o) {
			if (((i = a), o & 40)) {
				n = i[3].filter(l);
				let c;
				for (c = 0; c < n.length; c += 1) {
					const S = ne(i, n, c);
					e[c]
						? (e[c].p(S, o), _(e[c], 1))
						: ((e[c] = ae(S)), e[c].c(), _(e[c], 1), e[c].m(t.parentNode, t));
				}
				for (ce(), c = n.length; c < e.length; c += 1) r(c);
				ue();
			}
		},
		i(a) {
			if (!s) {
				for (let o = 0; o < n.length; o += 1) _(e[o]);
				s = !0;
			}
		},
		o(a) {
			e = e.filter(Boolean);
			for (let o = 0; o < e.length; o += 1) v(e[o]);
			s = !1;
		},
		d(a) {
			fe(e, a), a && y(t);
		}
	};
}
function oe(i) {
	let t, s;
	return (
		(t = new Te({
			props: {
				title: i[17].label || 'Unclassified',
				id: i[8][i[17].label] || i[17].label || 'unclassified',
				$$slots: { default: [Ue] },
				$$scope: { ctx: i }
			}
		})),
		{
			c() {
				N(t.$$.fragment);
			},
			l(l) {
				U(t.$$.fragment, l);
			},
			m(l, n) {
				D(t, l, n), (s = !0);
			},
			p(l, n) {
				const e = {};
				n & 32 && (e.title = l[17].label || 'Unclassified'),
					n & 32 && (e.id = l[8][l[17].label] || l[17].label || 'unclassified'),
					n & 8388648 && (e.$$scope = { dirty: n, ctx: l }),
					t.$set(e);
			},
			i(l) {
				s || (_(t.$$.fragment, l), (s = !0));
			},
			o(l) {
				v(t.$$.fragment, l), (s = !1);
			},
			d(l) {
				P(t, l);
			}
		}
	);
}
function De(i) {
	let t,
		s,
		l = i[5],
		n = [];
	for (let r = 0; r < l.length; r += 1) n[r] = oe(se(i, l, r));
	const e = (r) =>
		v(n[r], 1, 1, () => {
			n[r] = null;
		});
	return {
		c() {
			t = A('section');
			for (let r = 0; r < n.length; r += 1) n[r].c();
			this.h();
		},
		l(r) {
			t = q(r, 'SECTION', { slot: !0 });
			var a = j(t);
			for (let o = 0; o < n.length; o += 1) n[o].l(a);
			a.forEach(y), this.h();
		},
		h() {
			C(t, 'slot', 'items');
		},
		m(r, a) {
			M(r, t, a);
			for (let o = 0; o < n.length; o += 1) n[o].m(t, null);
			s = !0;
		},
		p(r, a) {
			if (a & 296) {
				l = r[5];
				let o;
				for (o = 0; o < l.length; o += 1) {
					const c = se(r, l, o);
					n[o]
						? (n[o].p(c, a), _(n[o], 1))
						: ((n[o] = oe(c)), n[o].c(), _(n[o], 1), n[o].m(t, null));
				}
				for (ce(), o = l.length; o < n.length; o += 1) e(o);
				ue();
			}
		},
		i(r) {
			if (!s) {
				for (let a = 0; a < l.length; a += 1) _(n[a]);
				s = !0;
			}
		},
		o(r) {
			n = n.filter(Boolean);
			for (let a = 0; a < n.length; a += 1) v(n[a]);
			s = !1;
		},
		d(r) {
			r && y(t), fe(n, r);
		}
	};
}
function Pe(i) {
	let t, s, l, n;
	return (
		(t = new Ee({ props: { title: 'CULT News' } })),
		(l = new we({
			props: { title: 'CULT News', $$slots: { items: [De], controls: [Ne] }, $$scope: { ctx: i } }
		})),
		{
			c() {
				N(t.$$.fragment), (s = I()), N(l.$$.fragment);
			},
			l(e) {
				U(t.$$.fragment, e), (s = E(e)), U(l.$$.fragment, e);
			},
			m(e, r) {
				D(t, e, r), M(e, s, r), D(l, e, r), (n = !0);
			},
			p(e, [r]) {
				const a = {};
				r & 8388671 && (a.$$scope = { dirty: r, ctx: e }), l.$set(a);
			},
			i(e) {
				n || (_(t.$$.fragment, e), _(l.$$.fragment, e), (n = !0));
			},
			o(e) {
				v(t.$$.fragment, e), v(l.$$.fragment, e), (n = !1);
			},
			d(e) {
				P(t, e), e && y(s), P(l, e);
			}
		}
	);
}
let ie = null;
function Oe(i, t, s) {
	let l, n, e, r;
	const a = K(le, 'tags');
	let o = [],
		c = null;
	const S = [{ label: 'All', value: null }, ...K(Ie, 'category')];
	let L = null,
		p = { value: 'stars_desc', label: 'Stars Desc' };
	const B = (f, w) => f.filter((R) => w.includes(R)),
		F = {
			'Bundler Plugins': 'bundling',
			Debugging: 'debugging',
			'Editor Extensions': 'editor-support',
			'Linting and Formatting': 'code-quality',
			Preprocessors: 'preprocessors'
		},
		d = (f, w) => w.category === f.value;
	function Z(f) {
		(c = f), s(1, c);
	}
	function $(f) {
		(L = f), s(4, L);
	}
	function T(f) {
		(p = f), s(2, p);
	}
	function O() {
		(r = this.value), s(0, r);
	}
	return (
		(i.$$.update = () => {
			i.$$.dirty & 4 && s(10, (l = (p == null ? void 0 : p.value) || 'stars_desc')),
				i.$$.dirty & 2 && s(9, (o = (c == null ? void 0 : c.map((f) => f.value)) || [])),
				i.$$.dirty & 1537 &&
					s(
						3,
						(n = le
							.filter((f) =>
								!r && o.length === 0 && ie === null
									? !0
									: !(
											(r &&
												!(
													f.title.toLowerCase().includes(r.toLowerCase()) ||
													f.description.toLowerCase().includes(r.toLowerCase())
												)) ||
											(o.length > 0 && B(o, f.tags).length === 0) ||
											ie !== null
									  )
							)
							.sort(Se(l)))
					),
				i.$$.dirty & 8 && s(5, (e = K(n, 'category')));
		}),
		[r, c, p, n, L, e, a, S, F, o, l, d, Z, $, T, O]
	);
}
class je extends _e {
	constructor(t) {
		super(), de(this, t, Oe, Pe, he, {});
	}
}
export { je as default };
