import {
	S as le,
	i as ae,
	s as ie,
	v as se,
	a as S,
	k as m,
	q as O,
	w as oe,
	c as B,
	l as p,
	m as _,
	r as $,
	h as w,
	n as v,
	B as I,
	p as J,
	x as ue,
	b as re,
	C as s,
	A as ce,
	f as de,
	t as fe,
	y as me,
	o as pe
} from '../../../chunks/index-bbe4a303.js';
import { w as he } from '../../../chunks/singletons-37366631.js';
import { c as j } from '../../../chunks/components-9abf80d5.js';
import { c as ve } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { e as k } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as we } from '../../../chunks/Seo-5a17de65.js';
import '../../../chunks/stores-61a038a2.js';
var ge = {};
(function (i) {
	(i.defaults = {}),
		(i.set = function (r, n, e) {
			var t = e || {},
				o = i.defaults,
				l = t.expires || o.expires,
				a = t.domain || o.domain,
				d = t.path !== void 0 ? t.path : o.path !== void 0 ? o.path : '/',
				c = t.secure !== void 0 ? t.secure : o.secure,
				h = t.httponly !== void 0 ? t.httponly : o.httponly,
				g = t.samesite !== void 0 ? t.samesite : o.samesite,
				y = l ? new Date(typeof l == 'number' ? new Date().getTime() + l * 864e5 : l) : 0;
			document.cookie =
				r
					.replace(/[^+#$&^`|]/g, encodeURIComponent)
					.replace('(', '%28')
					.replace(')', '%29') +
				'=' +
				n.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
				(y && y.getTime() >= 0 ? ';expires=' + y.toUTCString() : '') +
				(a ? ';domain=' + a : '') +
				(d ? ';path=' + d : '') +
				(c ? ';secure' : '') +
				(h ? ';httponly' : '') +
				(g ? ';samesite=' + g : '');
		}),
		(i.get = function (r) {
			for (var n = document.cookie.split(';'); n.length; ) {
				var e = n.pop(),
					t = e.indexOf('=');
				t = t < 0 ? e.length : t;
				var o = decodeURIComponent(e.slice(0, t).replace(/^\s+/, ''));
				if (o === r) return decodeURIComponent(e.slice(t + 1));
			}
			return null;
		}),
		(i.erase = function (r, n) {
			i.set(r, '', {
				expires: -1,
				domain: n && n.domain,
				path: n && n.path,
				secure: 0,
				httponly: 0
			});
		}),
		(i.all = function () {
			for (var r = {}, n = document.cookie.split(';'); n.length; ) {
				var e = n.pop(),
					t = e.indexOf('=');
				t = t < 0 ? e.length : t;
				var o = decodeURIComponent(e.slice(0, t).replace(/^\s+/, ''));
				r[o] = decodeURIComponent(e.slice(t + 1));
			}
			return r;
		});
})(ge);
function be(i, r, n) {
	const e = r.getValue(n);
	return (
		e !== null && i.set(e),
		r.addListener &&
			r.addListener(n, (t) => {
				i.set(t);
			}),
		i.subscribe((t) => {
			r.setValue(n, t);
		}),
		Object.assign(Object.assign({}, i), {
			delete() {
				r.deleteValue(n);
			}
		})
	);
}
function _e(i, r = !1) {
	const n = [],
		e = (l) => {
			const a = l.key;
			l.storageArea === i &&
				n
					.filter(({ key: d }) => d === a)
					.forEach(({ listener: d }) => {
						let c = l.newValue;
						try {
							c = JSON.parse(l.newValue);
						} catch {}
						d(c);
					});
		},
		t = () => {
			r &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.addEventListener) &&
				window.addEventListener('storage', e);
		},
		o = () => {
			r &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.removeEventListener) &&
				window.removeEventListener('storage', e);
		};
	return {
		addListener(l, a) {
			n.push({ key: l, listener: a }), n.length === 1 && t();
		},
		removeListener(l, a) {
			const d = n.indexOf({ key: l, listener: a });
			d !== -1 && n.splice(d, 1), n.length === 0 && o();
		},
		getValue(l) {
			let a = i.getItem(l);
			if (a != null)
				try {
					a = JSON.parse(a);
				} catch {}
			return a;
		},
		deleteValue(l) {
			i.removeItem(l);
		},
		setValue(l, a) {
			i.setItem(l, JSON.stringify(a));
		}
	};
}
function ye(i = !1) {
	return typeof window < 'u' && (window == null ? void 0 : window.localStorage)
		? _e(window.localStorage, i)
		: (console.warn('Unable to find the localStorage. No data will be persisted.'), Ee());
}
function Ee() {
	return {
		getValue() {
			return null;
		},
		deleteValue() {},
		setValue() {}
	};
}
function Ve(i) {
	let r, n, e, t, o, l, a, d, c, h, g, y, D, A, P, E, z, M, C, T, q, V, G, N, L, x, F, b, R, Q, U;
	return (
		(r = new we({ props: { title: 'RVLT Proposals' } })),
		{
			c() {
				se(r.$$.fragment),
					(n = S()),
					(e = m('div')),
					(t = m('h2')),
					(o = O('Acts of Revolt')),
					(l = S()),
					(a = m('p')),
					(d = m('br')),
					(c = O(`
	Feel free to submit your own`)),
					(h = m('a')),
					(g = O('acts of revolt')),
					(y = O(`.
	`)),
					(D = m('p')),
					(A = m('br')),
					(P = S()),
					(E = m('embed')),
					(M = S()),
					(C = m('p')),
					(T = m('br')),
					(q = S()),
					(V = m('embed')),
					(N = S()),
					(L = m('p')),
					(x = m('br')),
					(F = S()),
					(b = m('div')),
					(R = m('embed')),
					this.h();
			},
			l(f) {
				oe(r.$$.fragment, f), (n = B(f)), (e = p(f, 'DIV', { class: !0 }));
				var u = _(e);
				t = p(u, 'H2', {});
				var W = _(t);
				(o = $(W, 'Acts of Revolt')), W.forEach(w), (l = B(u)), (a = p(u, 'P', {}));
				var X = _(a);
				(d = p(X, 'BR', {})),
					X.forEach(w),
					(c = $(
						u,
						`
	Feel free to submit your own`
					)),
					(h = p(u, 'A', { href: !0, target: !0 }));
				var Y = _(h);
				(g = $(Y, 'acts of revolt')),
					Y.forEach(w),
					(y = $(
						u,
						`.
	`
					)),
					(D = p(u, 'P', {}));
				var Z = _(D);
				(A = p(Z, 'BR', {})),
					Z.forEach(w),
					(P = B(u)),
					(E = p(u, 'EMBED', { src: !0, width: !0, height: !0 })),
					(M = B(u)),
					(C = p(u, 'P', {}));
				var ee = _(C);
				(T = p(ee, 'BR', {})),
					ee.forEach(w),
					(q = B(u)),
					(V = p(u, 'EMBED', { src: !0, width: !0, height: !0 })),
					(N = B(u)),
					(L = p(u, 'P', {}));
				var te = _(L);
				(x = p(te, 'BR', {})), te.forEach(w), (F = B(u)), (b = p(u, 'DIV', { style: !0 }));
				var ne = _(b);
				(R = p(ne, 'EMBED', { src: !0, width: !0, height: !0 })),
					ne.forEach(w),
					u.forEach(w),
					this.h();
			},
			h() {
				v(h, 'href', 'https://revolt.cultdao.io/submitProposal'),
					v(h, 'target', '_blank'),
					I(
						E.src,
						(z = 'https://dune.com/embeds/1279330/2192235/161e3edb-480c-451b-835f-078db00181e3')
					) || v(E, 'src', z),
					v(E, 'width', '100%'),
					v(E, 'height', '700'),
					I(
						V.src,
						(G = 'https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254')
					) || v(V, 'src', G),
					v(V, 'width', '100%'),
					v(V, 'height', '200'),
					I(
						R.src,
						(Q = 'https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722')
					) || v(R, 'src', Q),
					v(R, 'width', '100%'),
					v(R, 'height', '200'),
					J(b, 'margin-left', 'auto'),
					J(b, 'margin-right', 'auto'),
					J(b, 'width', '50vw'),
					v(e, 'class', 'text-center');
			},
			m(f, u) {
				ue(r, f, u),
					re(f, n, u),
					re(f, e, u),
					s(e, t),
					s(t, o),
					s(e, l),
					s(e, a),
					s(a, d),
					s(e, c),
					s(e, h),
					s(h, g),
					s(e, y),
					s(e, D),
					s(D, A),
					s(e, P),
					s(e, E),
					s(e, M),
					s(e, C),
					s(C, T),
					s(e, q),
					s(e, V),
					s(e, N),
					s(e, L),
					s(L, x),
					s(e, F),
					s(e, b),
					s(b, R),
					(U = !0);
			},
			p: ce,
			i(f) {
				U || (de(r.$$.fragment, f), (U = !0));
			},
			o(f) {
				fe(r.$$.fragment, f), (U = !1);
			},
			d(f) {
				me(r, f), f && w(n), f && w(e);
			}
		}
	);
}
let H = null,
	K = null;
function Re(i, r, n) {
	let e;
	k(j, 'tags');
	let t = [];
	[...k(j, 'category').filter((c) => c.value !== '')];
	let o = null,
		l = 'stars_desc',
		a = { value: 'stars_desc', label: 'Stars Desc' };
	pe(() => {
		be(he('npm'), ye(), 'packageManager');
	});
	const d = (c, h) => c.filter((g) => h.includes(g));
	return (
		(i.$$.update = () => {
			i.$$.dirty & 7 &&
				n(
					3,
					(e = j
						.filter((c) =>
							t.length === 0 && o === null
								? !0
								: !((t.length > 0 && d(t, c.tags).length === 0) || (o !== null && c.category !== o))
						)
						.sort(ve(l)))
				),
				i.$$.dirty & 8 && k(e, 'category');
		}),
		n(2, (l = (a == null ? void 0 : a.value) || 'stars_desc')),
		n(1, (o = (K == null ? void 0 : K.value) || null)),
		n(0, (t = (H == null ? void 0 : H.map((c) => c.value)) || [])),
		[t, o, l, e]
	);
}
class $e extends le {
	constructor(r) {
		super(), ae(this, r, Re, Ve, ie, {});
	}
}
export { $e as default };
