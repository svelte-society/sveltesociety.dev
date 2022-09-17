function W() {}
function lt(t, e) {
	for (const n in e) t[n] = e[n];
	return t;
}
function X(t) {
	return t();
}
function U() {
	return Object.create(null);
}
function v(t) {
	t.forEach(X);
}
function at(t) {
	return typeof t == 'function';
}
function Mt(t, e) {
	return t != t ? e == e : t !== e || (t && typeof t == 'object') || typeof t == 'function';
}
let A;
function jt(t, e) {
	return A || (A = document.createElement('a')), (A.href = e), t === A.href;
}
function ut(t) {
	return Object.keys(t).length === 0;
}
function ft(t, ...e) {
	if (t == null) return W;
	const n = t.subscribe(...e);
	return n.unsubscribe ? () => n.unsubscribe() : n;
}
function Ct(t, e, n) {
	t.$$.on_destroy.push(ft(e, n));
}
function Ht(t, e, n, i) {
	if (t) {
		const s = Y(t, e, n, i);
		return t[0](s);
	}
}
function Y(t, e, n, i) {
	return t[1] && i ? lt(n.ctx.slice(), t[1](i(e))) : n.ctx;
}
function Lt(t, e, n, i) {
	if (t[2] && i) {
		const s = t[2](i(n));
		if (e.dirty === void 0) return s;
		if (typeof s == 'object') {
			const o = [],
				r = Math.max(e.dirty.length, s.length);
			for (let l = 0; l < r; l += 1) o[l] = e.dirty[l] | s[l];
			return o;
		}
		return e.dirty | s;
	}
	return e.dirty;
}
function qt(t, e, n, i, s, o) {
	if (s) {
		const r = Y(e, n, i, o);
		t.p(r, s);
	}
}
function zt(t) {
	if (t.ctx.length > 32) {
		const e = [],
			n = t.ctx.length / 32;
		for (let i = 0; i < n; i++) e[i] = -1;
		return e;
	}
	return -1;
}
function Dt(t) {
	const e = {};
	for (const n in t) n[0] !== '$' && (e[n] = t[n]);
	return e;
}
function Ot(t, e) {
	const n = {};
	e = new Set(e);
	for (const i in t) !e.has(i) && i[0] !== '$' && (n[i] = t[i]);
	return n;
}
function Pt(t) {
	return t == null ? '' : t;
}
let j = !1;
function dt() {
	j = !0;
}
function _t() {
	j = !1;
}
function ht(t, e, n, i) {
	for (; t < e; ) {
		const s = t + ((e - t) >> 1);
		n(s) <= i ? (t = s + 1) : (e = s);
	}
	return t;
}
function mt(t) {
	if (t.hydrate_init) return;
	t.hydrate_init = !0;
	let e = t.childNodes;
	if (t.nodeName === 'HEAD') {
		const c = [];
		for (let a = 0; a < e.length; a++) {
			const f = e[a];
			f.claim_order !== void 0 && c.push(f);
		}
		e = c;
	}
	const n = new Int32Array(e.length + 1),
		i = new Int32Array(e.length);
	n[0] = -1;
	let s = 0;
	for (let c = 0; c < e.length; c++) {
		const a = e[c].claim_order,
			f = (s > 0 && e[n[s]].claim_order <= a ? s + 1 : ht(1, s, (d) => e[n[d]].claim_order, a)) - 1;
		i[c] = n[f] + 1;
		const _ = f + 1;
		(n[_] = c), (s = Math.max(_, s));
	}
	const o = [],
		r = [];
	let l = e.length - 1;
	for (let c = n[s] + 1; c != 0; c = i[c - 1]) {
		for (o.push(e[c - 1]); l >= c; l--) r.push(e[l]);
		l--;
	}
	for (; l >= 0; l--) r.push(e[l]);
	o.reverse(), r.sort((c, a) => c.claim_order - a.claim_order);
	for (let c = 0, a = 0; c < r.length; c++) {
		for (; a < o.length && r[c].claim_order >= o[a].claim_order; ) a++;
		const f = a < o.length ? o[a] : null;
		t.insertBefore(r[c], f);
	}
}
function pt(t, e) {
	t.appendChild(e);
}
function yt(t, e) {
	if (j) {
		for (
			mt(t),
				(t.actual_end_child === void 0 ||
					(t.actual_end_child !== null && t.actual_end_child.parentElement !== t)) &&
					(t.actual_end_child = t.firstChild);
			t.actual_end_child !== null && t.actual_end_child.claim_order === void 0;

		)
			t.actual_end_child = t.actual_end_child.nextSibling;
		e !== t.actual_end_child
			? (e.claim_order !== void 0 || e.parentNode !== t) && t.insertBefore(e, t.actual_end_child)
			: (t.actual_end_child = e.nextSibling);
	} else (e.parentNode !== t || e.nextSibling !== null) && t.appendChild(e);
}
function gt(t, e, n) {
	t.insertBefore(e, n || null);
}
function bt(t, e, n) {
	j && !n ? yt(t, e) : (e.parentNode !== t || e.nextSibling != n) && t.insertBefore(e, n || null);
}
function x(t) {
	t.parentNode.removeChild(t);
}
function Bt(t, e) {
	for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e);
}
function G(t) {
	return document.createElement(t);
}
function Z(t) {
	return document.createElementNS('http://www.w3.org/2000/svg', t);
}
function I(t) {
	return document.createTextNode(t);
}
function Wt() {
	return I(' ');
}
function Gt() {
	return I('');
}
function J(t, e, n, i) {
	return t.addEventListener(e, n, i), () => t.removeEventListener(e, n, i);
}
function It(t) {
	return function (e) {
		return e.preventDefault(), t.call(this, e);
	};
}
function tt(t, e, n) {
	n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Ft(t, e) {
	const n = Object.getOwnPropertyDescriptors(t.__proto__);
	for (const i in e)
		e[i] == null
			? t.removeAttribute(i)
			: i === 'style'
			? (t.style.cssText = e[i])
			: i === '__value'
			? (t.value = t[i] = e[i])
			: n[i] && n[i].set
			? (t[i] = e[i])
			: tt(t, i, e[i]);
}
function Rt(t, e, n) {
	e in t ? (t[e] = typeof t[e] == 'boolean' && n === '' ? !0 : n) : tt(t, e, n);
}
function wt(t) {
	return Array.from(t.childNodes);
}
function et(t) {
	t.claim_info === void 0 && (t.claim_info = { last_index: 0, total_claimed: 0 });
}
function nt(t, e, n, i, s = !1) {
	et(t);
	const o = (() => {
		for (let r = t.claim_info.last_index; r < t.length; r++) {
			const l = t[r];
			if (e(l)) {
				const c = n(l);
				return c === void 0 ? t.splice(r, 1) : (t[r] = c), s || (t.claim_info.last_index = r), l;
			}
		}
		for (let r = t.claim_info.last_index - 1; r >= 0; r--) {
			const l = t[r];
			if (e(l)) {
				const c = n(l);
				return (
					c === void 0 ? t.splice(r, 1) : (t[r] = c),
					s ? c === void 0 && t.claim_info.last_index-- : (t.claim_info.last_index = r),
					l
				);
			}
		}
		return i();
	})();
	return (o.claim_order = t.claim_info.total_claimed), (t.claim_info.total_claimed += 1), o;
}
function it(t, e, n, i) {
	return nt(
		t,
		(s) => s.nodeName === e,
		(s) => {
			const o = [];
			for (let r = 0; r < s.attributes.length; r++) {
				const l = s.attributes[r];
				n[l.name] || o.push(l.name);
			}
			o.forEach((r) => s.removeAttribute(r));
		},
		() => i(e)
	);
}
function Ut(t, e, n) {
	return it(t, e, n, G);
}
function Jt(t, e, n) {
	return it(t, e, n, Z);
}
function xt(t, e) {
	return nt(
		t,
		(n) => n.nodeType === 3,
		(n) => {
			const i = '' + e;
			if (n.data.startsWith(i)) {
				if (n.data.length !== i.length) return n.splitText(i.length);
			} else n.data = i;
		},
		() => I(e),
		!0
	);
}
function Kt(t) {
	return xt(t, ' ');
}
function K(t, e, n) {
	for (let i = n; i < t.length; i += 1) {
		const s = t[i];
		if (s.nodeType === 8 && s.textContent.trim() === e) return i;
	}
	return t.length;
}
function Qt(t, e) {
	const n = K(t, 'HTML_TAG_START', 0),
		i = K(t, 'HTML_TAG_END', n);
	if (n === i) return new Q(void 0, e);
	et(t);
	const s = t.splice(n, i - n + 1);
	x(s[0]), x(s[s.length - 1]);
	const o = s.slice(1, s.length - 1);
	for (const r of o)
		(r.claim_order = t.claim_info.total_claimed), (t.claim_info.total_claimed += 1);
	return new Q(o, e);
}
function Vt(t, e) {
	(e = '' + e), t.wholeText !== e && (t.data = e);
}
function Xt(t, e) {
	t.value = e == null ? '' : e;
}
function Yt(t, e, n, i) {
	n === null ? t.style.removeProperty(e) : t.style.setProperty(e, n, i ? 'important' : '');
}
let S;
function $t() {
	if (S === void 0) {
		S = !1;
		try {
			typeof window < 'u' && window.parent && window.parent.document;
		} catch {
			S = !0;
		}
	}
	return S;
}
function Zt(t, e) {
	getComputedStyle(t).position === 'static' && (t.style.position = 'relative');
	const i = G('iframe');
	i.setAttribute(
		'style',
		'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;'
	),
		i.setAttribute('aria-hidden', 'true'),
		(i.tabIndex = -1);
	const s = $t();
	let o;
	return (
		s
			? ((i.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>"),
			  (o = J(window, 'message', (r) => {
					r.source === i.contentWindow && e();
			  })))
			: ((i.src = 'about:blank'),
			  (i.onload = () => {
					o = J(i.contentWindow, 'resize', e);
			  })),
		pt(t, i),
		() => {
			(s || (o && i.contentWindow)) && o(), x(i);
		}
	);
}
function te(t, e, n) {
	t.classList[n ? 'add' : 'remove'](e);
}
function vt(t, e, { bubbles: n = !1, cancelable: i = !1 } = {}) {
	const s = document.createEvent('CustomEvent');
	return s.initCustomEvent(t, n, i, e), s;
}
function ee(t, e = document.body) {
	return Array.from(e.querySelectorAll(t));
}
class Et {
	constructor(e = !1) {
		(this.is_svg = !1), (this.is_svg = e), (this.e = this.n = null);
	}
	c(e) {
		this.h(e);
	}
	m(e, n, i = null) {
		this.e ||
			(this.is_svg ? (this.e = Z(n.nodeName)) : (this.e = G(n.nodeName)), (this.t = n), this.c(e)),
			this.i(i);
	}
	h(e) {
		(this.e.innerHTML = e), (this.n = Array.from(this.e.childNodes));
	}
	i(e) {
		for (let n = 0; n < this.n.length; n += 1) gt(this.t, this.n[n], e);
	}
	p(e) {
		this.d(), this.h(e), this.i(this.a);
	}
	d() {
		this.n.forEach(x);
	}
}
class Q extends Et {
	constructor(e, n = !1) {
		super(n), (this.e = this.n = null), (this.l = e);
	}
	c(e) {
		this.l ? (this.n = this.l) : super.c(e);
	}
	i(e) {
		for (let n = 0; n < this.n.length; n += 1) bt(this.t, this.n[n], e);
	}
}
let $;
function w(t) {
	$ = t;
}
function C() {
	if (!$) throw new Error('Function called outside component initialization');
	return $;
}
function ne(t) {
	C().$$.before_update.push(t);
}
function ie(t) {
	C().$$.on_mount.push(t);
}
function se(t) {
	C().$$.after_update.push(t);
}
function re() {
	const t = C();
	return (e, n, { cancelable: i = !1 } = {}) => {
		const s = t.$$.callbacks[e];
		if (s) {
			const o = vt(e, n, { cancelable: i });
			return (
				s.slice().forEach((r) => {
					r.call(t, o);
				}),
				!o.defaultPrevented
			);
		}
		return !0;
	};
}
function ce(t, e) {
	const n = t.$$.callbacks[e.type];
	n && n.slice().forEach((i) => i.call(this, e));
}
const b = [],
	V = [],
	N = [],
	O = [],
	st = Promise.resolve();
let P = !1;
function rt() {
	P || ((P = !0), st.then(ct));
}
function oe() {
	return rt(), st;
}
function B(t) {
	N.push(t);
}
function le(t) {
	O.push(t);
}
const D = new Set();
let T = 0;
function ct() {
	const t = $;
	do {
		for (; T < b.length; ) {
			const e = b[T];
			T++, w(e), kt(e.$$);
		}
		for (w(null), b.length = 0, T = 0; V.length; ) V.pop()();
		for (let e = 0; e < N.length; e += 1) {
			const n = N[e];
			D.has(n) || (D.add(n), n());
		}
		N.length = 0;
	} while (b.length);
	for (; O.length; ) O.pop()();
	(P = !1), D.clear(), w(t);
}
function kt(t) {
	if (t.fragment !== null) {
		t.update(), v(t.before_update);
		const e = t.dirty;
		(t.dirty = [-1]), t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(B);
	}
}
const M = new Set();
let g;
function ae() {
	g = { r: 0, c: [], p: g };
}
function ue() {
	g.r || v(g.c), (g = g.p);
}
function ot(t, e) {
	t && t.i && (M.delete(t), t.i(e));
}
function At(t, e, n, i) {
	if (t && t.o) {
		if (M.has(t)) return;
		M.add(t),
			g.c.push(() => {
				M.delete(t), i && (n && t.d(1), i());
			}),
			t.o(e);
	} else i && i();
}
function fe(t, e) {
	At(t, 1, 1, () => {
		e.delete(t.key);
	});
}
function de(t, e, n, i, s, o, r, l, c, a, f, _) {
	let d = t.length,
		m = o.length,
		h = d;
	const H = {};
	for (; h--; ) H[t[h].key] = h;
	const E = [],
		L = new Map(),
		q = new Map();
	for (h = m; h--; ) {
		const u = _(s, o, h),
			p = n(u);
		let y = r.get(p);
		y ? i && y.p(u, e) : ((y = a(p, u)), y.c()),
			L.set(p, (E[h] = y)),
			p in H && q.set(p, Math.abs(h - H[p]));
	}
	const F = new Set(),
		R = new Set();
	function z(u) {
		ot(u, 1), u.m(l, f), r.set(u.key, u), (f = u.first), m--;
	}
	for (; d && m; ) {
		const u = E[m - 1],
			p = t[d - 1],
			y = u.key,
			k = p.key;
		u === p
			? ((f = u.first), d--, m--)
			: L.has(k)
			? !r.has(y) || F.has(y)
				? z(u)
				: R.has(k)
				? d--
				: q.get(y) > q.get(k)
				? (R.add(y), z(u))
				: (F.add(k), d--)
			: (c(p, r), d--);
	}
	for (; d--; ) {
		const u = t[d];
		L.has(u.key) || c(u, r);
	}
	for (; m; ) z(E[m - 1]);
	return E;
}
function _e(t, e) {
	const n = {},
		i = {},
		s = { $$scope: 1 };
	let o = t.length;
	for (; o--; ) {
		const r = t[o],
			l = e[o];
		if (l) {
			for (const c in r) c in l || (i[c] = 1);
			for (const c in l) s[c] || ((n[c] = l[c]), (s[c] = 1));
			t[o] = l;
		} else for (const c in r) s[c] = 1;
	}
	for (const r in i) r in n || (n[r] = void 0);
	return n;
}
function he(t) {
	return typeof t == 'object' && t !== null ? t : {};
}
function me(t, e, n) {
	const i = t.$$.props[e];
	i !== void 0 && ((t.$$.bound[i] = n), n(t.$$.ctx[i]));
}
function pe(t) {
	t && t.c();
}
function ye(t, e) {
	t && t.l(e);
}
function St(t, e, n, i) {
	const { fragment: s, on_mount: o, on_destroy: r, after_update: l } = t.$$;
	s && s.m(e, n),
		i ||
			B(() => {
				const c = o.map(X).filter(at);
				r ? r.push(...c) : v(c), (t.$$.on_mount = []);
			}),
		l.forEach(B);
}
function Tt(t, e) {
	const n = t.$$;
	n.fragment !== null &&
		(v(n.on_destroy),
		n.fragment && n.fragment.d(e),
		(n.on_destroy = n.fragment = null),
		(n.ctx = []));
}
function Nt(t, e) {
	t.$$.dirty[0] === -1 && (b.push(t), rt(), t.$$.dirty.fill(0)),
		(t.$$.dirty[(e / 31) | 0] |= 1 << e % 31);
}
function ge(t, e, n, i, s, o, r, l = [-1]) {
	const c = $;
	w(t);
	const a = (t.$$ = {
		fragment: null,
		ctx: null,
		props: o,
		update: W,
		not_equal: s,
		bound: U(),
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(e.context || (c ? c.$$.context : [])),
		callbacks: U(),
		dirty: l,
		skip_bound: !1,
		root: e.target || c.$$.root
	});
	r && r(a.root);
	let f = !1;
	if (
		((a.ctx = n
			? n(t, e.props || {}, (_, d, ...m) => {
					const h = m.length ? m[0] : d;
					return (
						a.ctx &&
							s(a.ctx[_], (a.ctx[_] = h)) &&
							(!a.skip_bound && a.bound[_] && a.bound[_](h), f && Nt(t, _)),
						d
					);
			  })
			: []),
		a.update(),
		(f = !0),
		v(a.before_update),
		(a.fragment = i ? i(a.ctx) : !1),
		e.target)
	) {
		if (e.hydrate) {
			dt();
			const _ = wt(e.target);
			a.fragment && a.fragment.l(_), _.forEach(x);
		} else a.fragment && a.fragment.c();
		e.intro && ot(t.$$.fragment), St(t, e.target, e.anchor, e.customElement), _t(), ct();
	}
	w(c);
}
class be {
	$destroy() {
		Tt(this, 1), (this.$destroy = W);
	}
	$on(e, n) {
		const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
		return (
			i.push(n),
			() => {
				const s = i.indexOf(n);
				s !== -1 && i.splice(s, 1);
			}
		);
	}
	$set(e) {
		this.$$set && !ut(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
	}
}
export {
	Z as $,
	W as A,
	jt as B,
	yt as C,
	Bt as D,
	Ct as E,
	Ht as F,
	qt as G,
	zt as H,
	Lt as I,
	te as J,
	ee as K,
	V as L,
	me as M,
	Xt as N,
	J as O,
	le as P,
	lt as Q,
	_e as R,
	be as S,
	he as T,
	Pt as U,
	at as V,
	Ot as W,
	Dt as X,
	v as Y,
	re as Z,
	ne as _,
	Wt as a,
	Jt as a0,
	Rt as a1,
	B as a2,
	Zt as a3,
	de as a4,
	fe as a5,
	Ft as a6,
	It as a7,
	Q as a8,
	Qt as a9,
	ce as aa,
	ft as ab,
	bt as b,
	Kt as c,
	ue as d,
	Gt as e,
	ot as f,
	ae as g,
	x as h,
	ge as i,
	se as j,
	G as k,
	Ut as l,
	wt as m,
	tt as n,
	ie as o,
	Yt as p,
	I as q,
	xt as r,
	Mt as s,
	At as t,
	Vt as u,
	pe as v,
	ye as w,
	St as x,
	Tt as y,
	oe as z
};
