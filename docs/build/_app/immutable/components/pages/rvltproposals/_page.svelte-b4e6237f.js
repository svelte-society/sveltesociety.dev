import {
	S as ye,
	i as Se,
	s as Le,
	F as ce,
	k as y,
	q as R,
	a as U,
	l as S,
	m as k,
	r as q,
	h as v,
	c as V,
	n as $,
	J as ee,
	b as D,
	C as d,
	O as X,
	G as fe,
	H as pe,
	I as _e,
	f as P,
	t as T,
	aa as Ne,
	v as Y,
	w as K,
	B as de,
	x as G,
	y as H,
	o as Ue,
	L as se,
	M as ae,
	N as me,
	P as re,
	u as Ce,
	g as Ie,
	d as ke,
	D as Pe,
	A as Ve,
	ab as Te,
	Y as Me,
	Q as De,
	R as Oe,
	T as Ae
} from '../../../chunks/index-2fe5515f.js';
import { w as he } from '../../../chunks/singletons-79537efd.js';
import { c as ie } from '../../../chunks/components-9abf80d5.js';
import {
	S as Be,
	c as Re,
	a as oe,
	s as qe,
	C as je,
	b as Je
} from '../../../chunks/SearchLayout-13a80f1b.js';
import { e as ue } from '../../../chunks/Select-0fad25ba.js';
import { S as Fe } from '../../../chunks/Seo-c98eb7f1.js';
import '../../../chunks/stores-bd836b2e.js';
var Ye = {};
(function (n) {
	(n.defaults = {}),
		(n.set = function (e, s, t) {
			var l = t || {},
				a = n.defaults,
				i = l.expires || a.expires,
				r = l.domain || a.domain,
				o = l.path !== void 0 ? l.path : a.path !== void 0 ? a.path : '/',
				u = l.secure !== void 0 ? l.secure : a.secure,
				h = l.httponly !== void 0 ? l.httponly : a.httponly,
				w = l.samesite !== void 0 ? l.samesite : a.samesite,
				c = i ? new Date(typeof i == 'number' ? new Date().getTime() + i * 864e5 : i) : 0;
			document.cookie =
				e
					.replace(/[^+#$&^`|]/g, encodeURIComponent)
					.replace('(', '%28')
					.replace(')', '%29') +
				'=' +
				s.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
				(c && c.getTime() >= 0 ? ';expires=' + c.toUTCString() : '') +
				(r ? ';domain=' + r : '') +
				(o ? ';path=' + o : '') +
				(u ? ';secure' : '') +
				(h ? ';httponly' : '') +
				(w ? ';samesite=' + w : '');
		}),
		(n.get = function (e) {
			for (var s = document.cookie.split(';'); s.length; ) {
				var t = s.pop(),
					l = t.indexOf('=');
				l = l < 0 ? t.length : l;
				var a = decodeURIComponent(t.slice(0, l).replace(/^\s+/, ''));
				if (a === e) return decodeURIComponent(t.slice(l + 1));
			}
			return null;
		}),
		(n.erase = function (e, s) {
			n.set(e, '', {
				expires: -1,
				domain: s && s.domain,
				path: s && s.path,
				secure: 0,
				httponly: 0
			});
		}),
		(n.all = function () {
			for (var e = {}, s = document.cookie.split(';'); s.length; ) {
				var t = s.pop(),
					l = t.indexOf('=');
				l = l < 0 ? t.length : l;
				var a = decodeURIComponent(t.slice(0, l).replace(/^\s+/, ''));
				e[a] = decodeURIComponent(t.slice(l + 1));
			}
			return e;
		});
})(Ye);
function Ke(n, e, s) {
	const t = e.getValue(s);
	return (
		t !== null && n.set(t),
		e.addListener &&
			e.addListener(s, (l) => {
				n.set(l);
			}),
		n.subscribe((l) => {
			e.setValue(s, l);
		}),
		Object.assign(Object.assign({}, n), {
			delete() {
				e.deleteValue(s);
			}
		})
	);
}
function Ge(n, e = !1) {
	const s = [],
		t = (i) => {
			const r = i.key;
			i.storageArea === n &&
				s
					.filter(({ key: o }) => o === r)
					.forEach(({ listener: o }) => {
						let u = i.newValue;
						try {
							u = JSON.parse(i.newValue);
						} catch {}
						o(u);
					});
		},
		l = () => {
			e &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.addEventListener) &&
				window.addEventListener('storage', t);
		},
		a = () => {
			e &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.removeEventListener) &&
				window.removeEventListener('storage', t);
		};
	return {
		addListener(i, r) {
			s.push({ key: i, listener: r }), s.length === 1 && l();
		},
		removeListener(i, r) {
			const o = s.indexOf({ key: i, listener: r });
			o !== -1 && s.splice(o, 1), s.length === 0 && a();
		},
		getValue(i) {
			let r = n.getItem(i);
			if (r != null)
				try {
					r = JSON.parse(r);
				} catch {}
			return r;
		},
		deleteValue(i) {
			n.removeItem(i);
		},
		setValue(i, r) {
			n.setItem(i, JSON.stringify(r));
		}
	};
}
function He(n = !1) {
	return typeof window < 'u' && (window == null ? void 0 : window.localStorage)
		? Ge(window.localStorage, n)
		: (console.warn('Unable to find the localStorage. No data will be persisted.'), Qe());
}
function Qe() {
	return {
		getValue() {
			return null;
		},
		deleteValue() {},
		setValue() {}
	};
}
const ze = (n) => ({}),
	ge = (n) => ({});
function We(n) {
	let e, s, t, l, a, i, r, o, u, h, w;
	const c = n[4].default,
		f = ce(c, n, n[3], null),
		_ = n[4].menu,
		E = ce(_, n, n[3], ge);
	return {
		c() {
			(e = y('span')),
				(s = R(`Package Manager
	`)),
				(t = y('div')),
				(l = y('span')),
				f && f.c(),
				(a = U()),
				(i = y('div')),
				(r = U()),
				(o = y('section')),
				E && E.c(),
				this.h();
		},
		l(p) {
			e = S(p, 'SPAN', { class: !0 });
			var m = k(e);
			(s = q(
				m,
				`Package Manager
	`
			)),
				(t = S(m, 'DIV', { class: !0 }));
			var C = k(t);
			l = S(C, 'SPAN', { class: !0 });
			var b = k(l);
			f && f.l(b),
				b.forEach(v),
				(a = V(C)),
				(i = S(C, 'DIV', { class: !0 })),
				k(i).forEach(v),
				(r = V(C)),
				(o = S(C, 'SECTION', { class: !0 }));
			var M = k(o);
			E && E.l(M), M.forEach(v), C.forEach(v), m.forEach(v), this.h();
		},
		h() {
			$(l, 'class', 'svelte-1ba3q7j'),
				$(i, 'class', 'arrow svelte-1ba3q7j'),
				ee(i, 'active', n[0]),
				$(o, 'class', 'popin svelte-1ba3q7j'),
				$(t, 'class', 'svelte-1ba3q7j'),
				ee(t, 'small', n[1]),
				$(e, 'class', 'svelte-1ba3q7j');
		},
		m(p, m) {
			D(p, e, m),
				d(e, s),
				d(e, t),
				d(t, l),
				f && f.m(l, null),
				d(t, a),
				d(t, i),
				d(t, r),
				d(t, o),
				E && E.m(o, null),
				(u = !0),
				h || ((w = X(t, 'click', n[5])), (h = !0));
		},
		p(p, [m]) {
			f && f.p && (!u || m & 8) && fe(f, c, p, p[3], u ? _e(c, p[3], m, null) : pe(p[3]), null),
				m & 1 && ee(i, 'active', p[0]),
				E && E.p && (!u || m & 8) && fe(E, _, p, p[3], u ? _e(_, p[3], m, ze) : pe(p[3]), ge),
				m & 2 && ee(t, 'small', p[1]);
		},
		i(p) {
			u || (P(f, p), P(E, p), (u = !0));
		},
		o(p) {
			T(f, p), T(E, p), (u = !1);
		},
		d(p) {
			p && v(e), f && f.d(p), E && E.d(p), (h = !1), w();
		}
	};
}
function Xe(n, e, s) {
	let { $$slots: t = {}, $$scope: l } = e;
	const a = !1;
	let { active: i = !1 } = e,
		{ small: r = !1 } = e;
	function o(u) {
		Ne.call(this, n, u);
	}
	return (
		(n.$$set = (u) => {
			'active' in u && s(0, (i = u.active)),
				'small' in u && s(1, (r = u.small)),
				'$$scope' in u && s(3, (l = u.$$scope));
		}),
		[i, r, a, l, t, o]
	);
}
class Ze extends ye {
	constructor(e) {
		super(), Se(this, e, Xe, We, Le, { primary: 2, active: 0, small: 1 });
	}
	get primary() {
		return this.$$.ctx[2];
	}
}
function ve(n, e, s) {
	const t = n.slice();
	return (t[24] = e[s]), t;
}
function be(n, e, s) {
	const t = n.slice();
	return (t[27] = e[s]), t;
}
function xe(n) {
	let e = n[7].toUpperCase() + '',
		s;
	return {
		c() {
			s = R(e);
		},
		l(t) {
			s = q(t, e);
		},
		m(t, l) {
			D(t, s, l);
		},
		p(t, l) {
			l & 128 && e !== (e = t[7].toUpperCase() + '') && Ce(s, e);
		},
		d(t) {
			t && v(s);
		}
	};
}
function et(n) {
	let e, s, t, l, a, i, r, o, u, h, w, c, f, _, E, p, m;
	return {
		c() {
			(e = y('ul')),
				(s = y('li')),
				(t = y('label')),
				(l = y('input')),
				(a = R(' NPM')),
				(i = U()),
				(r = y('li')),
				(o = y('label')),
				(u = y('input')),
				(h = R(' PNPM')),
				(w = U()),
				(c = y('li')),
				(f = y('label')),
				(_ = y('input')),
				(E = R(' Yarn')),
				this.h();
		},
		l(C) {
			e = S(C, 'UL', { slot: !0, role: !0, class: !0 });
			var b = k(e);
			s = S(b, 'LI', {});
			var M = k(s);
			t = S(M, 'LABEL', {});
			var B = k(t);
			(l = S(B, 'INPUT', { type: !0 })),
				(a = q(B, ' NPM')),
				B.forEach(v),
				M.forEach(v),
				(i = V(b)),
				(r = S(b, 'LI', {}));
			var j = k(r);
			o = S(j, 'LABEL', {});
			var O = k(o);
			(u = S(O, 'INPUT', { type: !0 })),
				(h = q(O, ' PNPM')),
				O.forEach(v),
				j.forEach(v),
				(w = V(b)),
				(c = S(b, 'LI', {}));
			var J = k(c);
			f = S(J, 'LABEL', {});
			var F = k(f);
			(_ = S(F, 'INPUT', { type: !0 })),
				(E = q(F, ' Yarn')),
				F.forEach(v),
				J.forEach(v),
				b.forEach(v),
				this.h();
		},
		h() {
			$(l, 'type', 'radio'),
				(l.__value = 'npm'),
				(l.value = l.__value),
				n[19][0].push(l),
				$(u, 'type', 'radio'),
				(u.__value = 'pnpm'),
				(u.value = u.__value),
				n[19][0].push(u),
				$(_, 'type', 'radio'),
				(_.__value = 'yarn'),
				(_.value = _.__value),
				n[19][0].push(_),
				$(e, 'slot', 'menu'),
				$(e, 'role', 'menu'),
				$(e, 'class', 'popin no-wrap');
		},
		m(C, b) {
			D(C, e, b),
				d(e, s),
				d(s, t),
				d(t, l),
				(l.checked = l.__value === n[7]),
				d(t, a),
				d(e, i),
				d(e, r),
				d(r, o),
				d(o, u),
				(u.checked = u.__value === n[7]),
				d(o, h),
				d(e, w),
				d(e, c),
				d(c, f),
				d(f, _),
				(_.checked = _.__value === n[7]),
				d(f, E),
				p ||
					((m = [X(l, 'change', n[18]), X(u, 'change', n[20]), X(_, 'change', n[21])]), (p = !0));
		},
		p(C, b) {
			b & 128 && (l.checked = l.__value === C[7]),
				b & 128 && (u.checked = u.__value === C[7]),
				b & 128 && (_.checked = _.__value === C[7]);
		},
		d(C) {
			C && v(e),
				n[19][0].splice(n[19][0].indexOf(l), 1),
				n[19][0].splice(n[19][0].indexOf(u), 1),
				n[19][0].splice(n[19][0].indexOf(_), 1),
				(p = !1),
				Me(m);
		}
	};
}
function $e(n) {
	let e;
	return {
		c() {
			e = R('s');
		},
		l(s) {
			e = q(s, 's');
		},
		m(s, t) {
			D(s, e, t);
		},
		d(s) {
			s && v(e);
		}
	};
}
function tt(n) {
	let e,
		s,
		t,
		l,
		a,
		i,
		r,
		o,
		u,
		h,
		w,
		c,
		f,
		_,
		E,
		p,
		m,
		C,
		b,
		M = n[4].length + '',
		B,
		j,
		O,
		J,
		F;
	function te(g) {
		n[15](g);
	}
	let Z = { items: n[8], isMulti: !0, label: 'Tags' };
	n[1] !== void 0 && (Z.value = n[1]),
		(t = new oe({ props: Z })),
		se.push(() => ae(t, 'value', te));
	function le(g) {
		n[16](g);
	}
	let L = {
		label: 'Category',
		items: n[9],
		placeholder: 'Category',
		isClearable: !1,
		showIndicator: !0
	};
	n[2] !== void 0 && (L.value = n[2]),
		(i = new oe({ props: L })),
		se.push(() => ae(i, 'value', le));
	function z(g) {
		n[17](g);
	}
	let x = { items: qe, label: 'Sorting', showIndicator: !0, isClearable: !1 };
	n[3] !== void 0 && (x.value = n[3]),
		(u = new oe({ props: x })),
		se.push(() => ae(u, 'value', z)),
		(c = new Ze({
			props: {
				small: !0,
				active: n[7] !== '',
				$$slots: { menu: [et], default: [xe] },
				$$scope: { ctx: n }
			}
		}));
	let N = n[4].length !== 1 && $e();
	return {
		c() {
			(e = y('section')),
				(s = y('div')),
				Y(t.$$.fragment),
				(a = U()),
				Y(i.$$.fragment),
				(o = U()),
				Y(u.$$.fragment),
				(w = U()),
				Y(c.$$.fragment),
				(f = U()),
				(_ = y('a')),
				(E = R('Submit a component')),
				(p = U()),
				(m = y('input')),
				(C = U()),
				(b = y('span')),
				(B = R(M)),
				(j = R(' result')),
				N && N.c(),
				this.h();
		},
		l(g) {
			e = S(g, 'SECTION', { class: !0, slot: !0 });
			var I = k(e);
			s = S(I, 'DIV', { class: !0 });
			var A = k(s);
			K(t.$$.fragment, A),
				(a = V(A)),
				K(i.$$.fragment, A),
				(o = V(A)),
				K(u.$$.fragment, A),
				(w = V(A)),
				K(c.$$.fragment, A),
				A.forEach(v),
				(f = V(I)),
				(_ = S(I, 'A', { href: !0, class: !0 }));
			var W = k(_);
			(E = q(W, 'Submit a component')),
				W.forEach(v),
				(p = V(I)),
				(m = S(I, 'INPUT', { class: !0, type: !0, placeholder: !0 })),
				(C = V(I)),
				(b = S(I, 'SPAN', { class: !0 }));
			var Q = k(b);
			(B = q(Q, M)), (j = q(Q, ' result')), N && N.l(Q), Q.forEach(v), I.forEach(v), this.h();
		},
		h() {
			$(s, 'class', 'inputs'),
				$(_, 'href', '/help/submitting?type=component'),
				$(_, 'class', 'submit'),
				$(m, 'class', 'searchbar'),
				$(m, 'type', 'text'),
				$(m, 'placeholder', 'Search for components...'),
				$(b, 'class', 'searchbar-count'),
				$(e, 'class', 'controls'),
				$(e, 'slot', 'controls');
		},
		m(g, I) {
			D(g, e, I),
				d(e, s),
				G(t, s, null),
				d(s, a),
				G(i, s, null),
				d(s, o),
				G(u, s, null),
				d(s, w),
				G(c, s, null),
				d(e, f),
				d(e, _),
				d(_, E),
				d(e, p),
				d(e, m),
				me(m, n[0]),
				d(e, C),
				d(e, b),
				d(b, B),
				d(b, j),
				N && N.m(b, null),
				(O = !0),
				J || ((F = X(m, 'input', n[22])), (J = !0));
		},
		p(g, I) {
			const A = {};
			!l && I & 2 && ((l = !0), (A.value = g[1]), re(() => (l = !1))), t.$set(A);
			const W = {};
			!r && I & 4 && ((r = !0), (W.value = g[2]), re(() => (r = !1))), i.$set(W);
			const Q = {};
			!h && I & 8 && ((h = !0), (Q.value = g[3]), re(() => (h = !1))), u.$set(Q);
			const ne = {};
			I & 128 && (ne.active = g[7] !== ''),
				I & 1073741952 && (ne.$$scope = { dirty: I, ctx: g }),
				c.$set(ne),
				I & 1 && m.value !== g[0] && me(m, g[0]),
				(!O || I & 16) && M !== (M = g[4].length + '') && Ce(B, M),
				g[4].length !== 1 ? N || ((N = $e()), N.c(), N.m(b, null)) : N && (N.d(1), (N = null));
		},
		i(g) {
			O ||
				(P(t.$$.fragment, g),
				P(i.$$.fragment, g),
				P(u.$$.fragment, g),
				P(c.$$.fragment, g),
				(O = !0));
		},
		o(g) {
			T(t.$$.fragment, g), T(i.$$.fragment, g), T(u.$$.fragment, g), T(c.$$.fragment, g), (O = !1);
		},
		d(g) {
			g && v(e), H(t), H(i), H(u), H(c), N && N.d(), (J = !1), F();
		}
	};
}
function we(n) {
	let e, s;
	const t = [n[27], { manager: n[7] }];
	let l = {};
	for (let a = 0; a < t.length; a += 1) l = De(l, t[a]);
	return (
		(e = new Je({ props: l })),
		{
			c() {
				Y(e.$$.fragment);
			},
			l(a) {
				K(e.$$.fragment, a);
			},
			m(a, i) {
				G(e, a, i), (s = !0);
			},
			p(a, i) {
				const r = i & 208 ? Oe(t, [i & 80 && Ae(a[27]), i & 128 && { manager: a[7] }]) : {};
				e.$set(r);
			},
			i(a) {
				s || (P(e.$$.fragment, a), (s = !0));
			},
			o(a) {
				T(e.$$.fragment, a), (s = !1);
			},
			d(a) {
				H(e, a);
			}
		}
	);
}
function lt(n) {
	let e, s;
	function t(...r) {
		return n[14](n[24], ...r);
	}
	let l = n[4].filter(t),
		a = [];
	for (let r = 0; r < l.length; r += 1) a[r] = we(be(n, l, r));
	const i = (r) =>
		T(a[r], 1, 1, () => {
			a[r] = null;
		});
	return {
		c() {
			for (let r = 0; r < a.length; r += 1) a[r].c();
			e = U();
		},
		l(r) {
			for (let o = 0; o < a.length; o += 1) a[o].l(r);
			e = V(r);
		},
		m(r, o) {
			for (let u = 0; u < a.length; u += 1) a[u].m(r, o);
			D(r, e, o), (s = !0);
		},
		p(r, o) {
			if (((n = r), o & 208)) {
				l = n[4].filter(t);
				let u;
				for (u = 0; u < l.length; u += 1) {
					const h = be(n, l, u);
					a[u]
						? (a[u].p(h, o), P(a[u], 1))
						: ((a[u] = we(h)), a[u].c(), P(a[u], 1), a[u].m(e.parentNode, e));
				}
				for (Ie(), u = l.length; u < a.length; u += 1) i(u);
				ke();
			}
		},
		i(r) {
			if (!s) {
				for (let o = 0; o < l.length; o += 1) P(a[o]);
				s = !0;
			}
		},
		o(r) {
			a = a.filter(Boolean);
			for (let o = 0; o < a.length; o += 1) T(a[o]);
			s = !1;
		},
		d(r) {
			Pe(a, r), r && v(e);
		}
	};
}
function Ee(n) {
	let e, s;
	return (
		(e = new je({
			props: {
				title: n[24].label || 'Unclassified',
				id: n[10][n[24].label] || n[24].label || 'unclassified',
				$$slots: { default: [lt] },
				$$scope: { ctx: n }
			}
		})),
		{
			c() {
				Y(e.$$.fragment);
			},
			l(t) {
				K(e.$$.fragment, t);
			},
			m(t, l) {
				G(e, t, l), (s = !0);
			},
			p(t, l) {
				const a = {};
				l & 64 && (a.title = t[24].label || 'Unclassified'),
					l & 64 && (a.id = t[10][t[24].label] || t[24].label || 'unclassified'),
					l & 1073742032 && (a.$$scope = { dirty: l, ctx: t }),
					e.$set(a);
			},
			i(t) {
				s || (P(e.$$.fragment, t), (s = !0));
			},
			o(t) {
				T(e.$$.fragment, t), (s = !1);
			},
			d(t) {
				H(e, t);
			}
		}
	);
}
function nt(n) {
	let e,
		s,
		t = n[6],
		l = [];
	for (let i = 0; i < t.length; i += 1) l[i] = Ee(ve(n, t, i));
	const a = (i) =>
		T(l[i], 1, 1, () => {
			l[i] = null;
		});
	return {
		c() {
			e = y('section');
			for (let i = 0; i < l.length; i += 1) l[i].c();
			this.h();
		},
		l(i) {
			e = S(i, 'SECTION', { slot: !0 });
			var r = k(e);
			for (let o = 0; o < l.length; o += 1) l[o].l(r);
			r.forEach(v), this.h();
		},
		h() {
			$(e, 'slot', 'items');
		},
		m(i, r) {
			D(i, e, r);
			for (let o = 0; o < l.length; o += 1) l[o].m(e, null);
			s = !0;
		},
		p(i, r) {
			if (r & 1232) {
				t = i[6];
				let o;
				for (o = 0; o < t.length; o += 1) {
					const u = ve(i, t, o);
					l[o]
						? (l[o].p(u, r), P(l[o], 1))
						: ((l[o] = Ee(u)), l[o].c(), P(l[o], 1), l[o].m(e, null));
				}
				for (Ie(), o = t.length; o < l.length; o += 1) a(o);
				ke();
			}
		},
		i(i) {
			if (!s) {
				for (let r = 0; r < t.length; r += 1) P(l[r]);
				s = !0;
			}
		},
		o(i) {
			l = l.filter(Boolean);
			for (let r = 0; r < l.length; r += 1) T(l[r]);
			s = !1;
		},
		d(i) {
			i && v(e), Pe(l, i);
		}
	};
}
function st(n) {
	let e, s, t, l, a, i, r, o, u, h, w;
	return (
		(e = new Fe({ props: { title: 'RVLT Proposals' } })),
		(h = new Be({
			props: {
				title: 'RVLT Proposals',
				$$slots: { items: [nt], controls: [tt] },
				$$scope: { ctx: n }
			}
		})),
		{
			c() {
				Y(e.$$.fragment),
					(s = U()),
					(t = y('embed')),
					(a = U()),
					(i = y('p')),
					(r = y('embed')),
					(u = U()),
					Y(h.$$.fragment),
					this.h();
			},
			l(c) {
				K(e.$$.fragment, c),
					(s = V(c)),
					(t = S(c, 'EMBED', { src: !0, width: !0, height: !0 })),
					(a = V(c)),
					(i = S(c, 'P', {}));
				var f = k(i);
				(r = S(f, 'EMBED', { src: !0, width: !0, height: !0 })),
					f.forEach(v),
					(u = V(c)),
					K(h.$$.fragment, c),
					this.h();
			},
			h() {
				de(
					t.src,
					(l = 'https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254')
				) || $(t, 'src', l),
					$(t, 'width', '100%'),
					$(t, 'height', '200'),
					de(
						r.src,
						(o = 'https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722')
					) || $(r, 'src', o),
					$(r, 'width', '25%'),
					$(r, 'height', '200');
			},
			m(c, f) {
				G(e, c, f),
					D(c, s, f),
					D(c, t, f),
					D(c, a, f),
					D(c, i, f),
					d(i, r),
					D(c, u, f),
					G(h, c, f),
					(w = !0);
			},
			p(c, [f]) {
				const _ = {};
				f & 1073742047 && (_.$$scope = { dirty: f, ctx: c }), h.$set(_);
			},
			i(c) {
				w || (P(e.$$.fragment, c), P(h.$$.fragment, c), (w = !0));
			},
			o(c) {
				T(e.$$.fragment, c), T(h.$$.fragment, c), (w = !1);
			},
			d(c) {
				H(e, c), c && v(s), c && v(t), c && v(a), c && v(i), c && v(u), H(h, c);
			}
		}
	);
}
function at(n, e, s) {
	let t,
		l,
		a,
		i = Ve,
		r = () => (i(), (i = Te(m, (L) => s(7, (a = L)))), m);
	n.$$.on_destroy.push(() => i());
	let o;
	const u = ue(ie, 'tags');
	let h = [],
		w = null;
	const c = [{ label: 'All', value: null }, ...ue(ie, 'category').filter((L) => L.value !== '')];
	let f = null,
		_ = null,
		E = 'stars_desc',
		p = { value: 'stars_desc', label: 'Stars Desc' },
		m = he('npm');
	r(),
		Ue(() => {
			r(s(5, (m = Ke(he('npm'), He(), 'packageManager'))));
		});
	const C = (L, z) => L.filter((x) => z.includes(x)),
		b = {
			Animations: 'animations',
			'Data Visualisation': 'data-vis',
			'Design Pattern': 'design-patterns',
			'Design System': 'design-systems',
			'Developer Experience': 'dx',
			'Forms & User Input': 'input',
			Integration: 'integrations',
			'Rich Text Editor': 'text-editors',
			Routers: 'routers',
			Stores: 'stores',
			'SvelteKit Adapters': 'adapters',
			Testing: 'testing',
			'User Interaction': 'ui'
		},
		M = [[]],
		B = (L, z) => z.category === L.value;
	function j(L) {
		(w = L), s(1, w);
	}
	function O(L) {
		(f = L), s(2, f);
	}
	function J(L) {
		(p = L), s(3, p);
	}
	function F() {
		(a = this.__value), m.set(a);
	}
	function te() {
		(a = this.__value), m.set(a);
	}
	function Z() {
		(a = this.__value), m.set(a);
	}
	function le() {
		(o = this.value), s(0, o);
	}
	return (
		(n.$$.update = () => {
			n.$$.dirty & 8 && s(13, (E = (p == null ? void 0 : p.value) || 'stars_desc')),
				n.$$.dirty & 4 && s(12, (_ = (f == null ? void 0 : f.value) || null)),
				n.$$.dirty & 2 && s(11, (h = (w == null ? void 0 : w.map((L) => L.value)) || [])),
				n.$$.dirty & 14337 &&
					s(
						4,
						(t = ie
							.filter((L) =>
								!o && h.length === 0 && _ === null
									? !0
									: !(
											(o &&
												!(
													L.title.toLowerCase().includes(o.toLowerCase()) ||
													L.description.toLowerCase().includes(o.toLowerCase())
												)) ||
											(h.length > 0 && C(h, L.tags).length === 0) ||
											(_ !== null && L.category !== _)
									  )
							)
							.sort(Re(E)))
					),
				n.$$.dirty & 16 && s(6, (l = ue(t, 'category')));
		}),
		[o, w, f, p, t, m, l, a, u, c, b, h, _, E, B, j, O, J, F, M, te, Z, le]
	);
}
class _t extends ye {
	constructor(e) {
		super(), Se(this, e, at, st, Le, {});
	}
}
export { _t as default };
