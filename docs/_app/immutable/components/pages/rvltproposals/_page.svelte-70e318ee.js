import {
	S as we,
	i as ge,
	s as be,
	v as _e,
	a as b,
	k as c,
	q as R,
	w as ye,
	c as _,
	l as d,
	m as g,
	r as V,
	h as v,
	n as h,
	B as X,
	p as Y,
	x as Ee,
	b as ve,
	C as r,
	A as Re,
	f as Ve,
	t as Be,
	y as Se,
	o as Ae
} from '../../../chunks/index-bbe4a303.js';
import { w as De } from '../../../chunks/singletons-ce71c587.js';
import { c as Z } from '../../../chunks/components-9abf80d5.js';
import { c as Ce } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { e as ee } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as Le } from '../../../chunks/Seo-e8d182e8.js';
import '../../../chunks/stores-1645a409.js';
var Ue = {};
(function (i) {
	(i.defaults = {}),
		(i.set = function (l, n, e) {
			var t = e || {},
				u = i.defaults,
				o = t.expires || u.expires,
				s = t.domain || u.domain,
				m = t.path !== void 0 ? t.path : u.path !== void 0 ? u.path : '/',
				f = t.secure !== void 0 ? t.secure : u.secure,
				w = t.httponly !== void 0 ? t.httponly : u.httponly,
				y = t.samesite !== void 0 ? t.samesite : u.samesite,
				B = o ? new Date(typeof o == 'number' ? new Date().getTime() + o * 864e5 : o) : 0;
			document.cookie =
				l
					.replace(/[^+#$&^`|]/g, encodeURIComponent)
					.replace('(', '%28')
					.replace(')', '%29') +
				'=' +
				n.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
				(B && B.getTime() >= 0 ? ';expires=' + B.toUTCString() : '') +
				(s ? ';domain=' + s : '') +
				(m ? ';path=' + m : '') +
				(f ? ';secure' : '') +
				(w ? ';httponly' : '') +
				(y ? ';samesite=' + y : '');
		}),
		(i.get = function (l) {
			for (var n = document.cookie.split(';'); n.length; ) {
				var e = n.pop(),
					t = e.indexOf('=');
				t = t < 0 ? e.length : t;
				var u = decodeURIComponent(e.slice(0, t).replace(/^\s+/, ''));
				if (u === l) return decodeURIComponent(e.slice(t + 1));
			}
			return null;
		}),
		(i.erase = function (l, n) {
			i.set(l, '', {
				expires: -1,
				domain: n && n.domain,
				path: n && n.path,
				secure: 0,
				httponly: 0
			});
		}),
		(i.all = function () {
			for (var l = {}, n = document.cookie.split(';'); n.length; ) {
				var e = n.pop(),
					t = e.indexOf('=');
				t = t < 0 ? e.length : t;
				var u = decodeURIComponent(e.slice(0, t).replace(/^\s+/, ''));
				l[u] = decodeURIComponent(e.slice(t + 1));
			}
			return l;
		});
})(Ue);
function Oe(i, l, n) {
	const e = l.getValue(n);
	return (
		e !== null && i.set(e),
		l.addListener &&
			l.addListener(n, (t) => {
				i.set(t);
			}),
		i.subscribe((t) => {
			l.setValue(n, t);
		}),
		Object.assign(Object.assign({}, i), {
			delete() {
				l.deleteValue(n);
			}
		})
	);
}
function Pe(i, l = !1) {
	const n = [],
		e = (o) => {
			const s = o.key;
			o.storageArea === i &&
				n
					.filter(({ key: m }) => m === s)
					.forEach(({ listener: m }) => {
						let f = o.newValue;
						try {
							f = JSON.parse(o.newValue);
						} catch {}
						m(f);
					});
		},
		t = () => {
			l &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.addEventListener) &&
				window.addEventListener('storage', e);
		},
		u = () => {
			l &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.removeEventListener) &&
				window.removeEventListener('storage', e);
		};
	return {
		addListener(o, s) {
			n.push({ key: o, listener: s }), n.length === 1 && t();
		},
		removeListener(o, s) {
			const m = n.indexOf({ key: o, listener: s });
			m !== -1 && n.splice(m, 1), n.length === 0 && u();
		},
		getValue(o) {
			let s = i.getItem(o);
			if (s != null)
				try {
					s = JSON.parse(s);
				} catch {}
			return s;
		},
		deleteValue(o) {
			i.removeItem(o);
		},
		setValue(o, s) {
			i.setItem(o, JSON.stringify(s));
		}
	};
}
function $e(i = !1) {
	return typeof window < 'u' && (window == null ? void 0 : window.localStorage)
		? Pe(window.localStorage, i)
		: (console.warn('Unable to find the localStorage. No data will be persisted.'), Te());
}
function Te() {
	return {
		getValue() {
			return null;
		},
		deleteValue() {},
		setValue() {}
	};
}
function Ne(i) {
	let l,
		n,
		e,
		t,
		u,
		o,
		s,
		m,
		f,
		w,
		y,
		B,
		L,
		N,
		I,
		S,
		re,
		M,
		U,
		k,
		q,
		A,
		ae,
		x,
		O,
		F,
		J,
		E,
		D,
		le,
		j,
		P,
		H,
		K,
		$,
		z,
		G,
		C,
		Q,
		W,
		T;
	return (
		(l = new Le({ props: { title: 'RVLT Proposals' } })),
		{
			c() {
				_e(l.$$.fragment),
					(n = b()),
					(e = c('div')),
					(t = c('h2')),
					(u = R('Acts of Revolt')),
					(o = b()),
					(s = c('p')),
					(m = c('br')),
					(f = R(`
	Feel free to submit your own
	`)),
					(w = c('a')),
					(y = R('Acts of Revolt')),
					(B = R(`.
	`)),
					(L = c('p')),
					(N = c('br')),
					(I = b()),
					(S = c('embed')),
					(M = b()),
					(U = c('p')),
					(k = c('br')),
					(q = b()),
					(A = c('embed')),
					(x = b()),
					(O = c('p')),
					(F = c('br')),
					(J = b()),
					(E = c('div')),
					(D = c('embed')),
					(j = b()),
					(P = c('h3')),
					(H = R('Basic Tips for Newcomers')),
					(K = b()),
					($ = c('p')),
					(z = c('br')),
					(G = R(`

	In order to understand details on how Revolt 2 Earn works this
	`)),
					(C = c('a')),
					(Q = R('documentation')),
					(W = R(' might be valuable for you.')),
					this.h();
			},
			l(p) {
				ye(l.$$.fragment, p), (n = _(p)), (e = d(p, 'DIV', { class: !0 }));
				var a = g(e);
				t = d(a, 'H2', {});
				var oe = g(t);
				(u = V(oe, 'Acts of Revolt')), oe.forEach(v), (o = _(a)), (s = d(a, 'P', {}));
				var se = g(s);
				(m = d(se, 'BR', {})),
					se.forEach(v),
					(f = V(
						a,
						`
	Feel free to submit your own
	`
					)),
					(w = d(a, 'A', { href: !0, target: !0 }));
				var ie = g(w);
				(y = V(ie, 'Acts of Revolt')),
					ie.forEach(v),
					(B = V(
						a,
						`.
	`
					)),
					(L = d(a, 'P', {}));
				var ue = g(L);
				(N = d(ue, 'BR', {})),
					ue.forEach(v),
					(I = _(a)),
					(S = d(a, 'EMBED', { src: !0, width: !0, height: !0 })),
					(M = _(a)),
					(U = d(a, 'P', {}));
				var ce = g(U);
				(k = d(ce, 'BR', {})),
					ce.forEach(v),
					(q = _(a)),
					(A = d(a, 'EMBED', { src: !0, width: !0, height: !0 })),
					(x = _(a)),
					(O = d(a, 'P', {}));
				var de = g(O);
				(F = d(de, 'BR', {})), de.forEach(v), (J = _(a)), (E = d(a, 'DIV', { style: !0 }));
				var fe = g(E);
				(D = d(fe, 'EMBED', { src: !0, width: !0, height: !0 })),
					fe.forEach(v),
					(j = _(a)),
					(P = d(a, 'H3', {}));
				var me = g(P);
				(H = V(me, 'Basic Tips for Newcomers')), me.forEach(v), (K = _(a)), ($ = d(a, 'P', {}));
				var pe = g($);
				(z = d(pe, 'BR', {})),
					pe.forEach(v),
					(G = V(
						a,
						`

	In order to understand details on how Revolt 2 Earn works this
	`
					)),
					(C = d(a, 'A', { href: !0, target: !0 }));
				var he = g(C);
				(Q = V(he, 'documentation')),
					he.forEach(v),
					(W = V(a, ' might be valuable for you.')),
					a.forEach(v),
					this.h();
			},
			h() {
				h(w, 'href', 'https://revolt.cultdao.io/submitProposal'),
					h(w, 'target', '_blank'),
					X(
						S.src,
						(re = 'https://dune.com/embeds/1279330/2192235/161e3edb-480c-451b-835f-078db00181e3')
					) || h(S, 'src', re),
					h(S, 'width', '100%'),
					h(S, 'height', '700'),
					X(
						A.src,
						(ae = 'https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254')
					) || h(A, 'src', ae),
					h(A, 'width', '100%'),
					h(A, 'height', '200'),
					X(
						D.src,
						(le = 'https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722')
					) || h(D, 'src', le),
					h(D, 'width', '100%'),
					h(D, 'height', '200'),
					Y(E, 'margin-left', 'auto'),
					Y(E, 'margin-right', 'auto'),
					Y(E, 'width', '50vw'),
					h(C, 'href', 'https://cultdao.io/rvlt.pdf'),
					h(C, 'target', '_blank'),
					h(e, 'class', 'text-center');
			},
			m(p, a) {
				Ee(l, p, a),
					ve(p, n, a),
					ve(p, e, a),
					r(e, t),
					r(t, u),
					r(e, o),
					r(e, s),
					r(s, m),
					r(e, f),
					r(e, w),
					r(w, y),
					r(e, B),
					r(e, L),
					r(L, N),
					r(e, I),
					r(e, S),
					r(e, M),
					r(e, U),
					r(U, k),
					r(e, q),
					r(e, A),
					r(e, x),
					r(e, O),
					r(O, F),
					r(e, J),
					r(e, E),
					r(E, D),
					r(e, j),
					r(e, P),
					r(P, H),
					r(e, K),
					r(e, $),
					r($, z),
					r(e, G),
					r(e, C),
					r(C, Q),
					r(e, W),
					(T = !0);
			},
			p: Re,
			i(p) {
				T || (Ve(l.$$.fragment, p), (T = !0));
			},
			o(p) {
				Be(l.$$.fragment, p), (T = !1);
			},
			d(p) {
				Se(l, p), p && v(n), p && v(e);
			}
		}
	);
}
let te = null,
	ne = null;
function Ie(i, l, n) {
	let e;
	ee(Z, 'tags');
	let t = [];
	[...ee(Z, 'category').filter((f) => f.value !== '')];
	let u = null,
		o = 'stars_desc',
		s = { value: 'stars_desc', label: 'Stars Desc' };
	Ae(() => {
		Oe(De('npm'), $e(), 'packageManager');
	});
	const m = (f, w) => f.filter((y) => w.includes(y));
	return (
		(i.$$.update = () => {
			i.$$.dirty & 7 &&
				n(
					3,
					(e = Z.filter((f) =>
						t.length === 0 && u === null
							? !0
							: !((t.length > 0 && m(t, f.tags).length === 0) || (u !== null && f.category !== u))
					).sort(Ce(o)))
				),
				i.$$.dirty & 8 && ee(e, 'category');
		}),
		n(2, (o = (s == null ? void 0 : s.value) || 'stars_desc')),
		n(1, (u = (ne == null ? void 0 : ne.value) || null)),
		n(0, (t = (te == null ? void 0 : te.map((f) => f.value)) || [])),
		[t, u, o, e]
	);
}
class He extends we {
	constructor(l) {
		super(), ge(this, l, Ie, Ne, be, {});
	}
}
export { He as default };
