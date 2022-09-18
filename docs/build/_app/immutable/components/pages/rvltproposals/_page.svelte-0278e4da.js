import {
	S as x,
	i as I,
	s as H,
	v as K,
	a as V,
	k as v,
	q as k,
	w as z,
	c as S,
	l as w,
	m as R,
	h as f,
	r as G,
	B as $,
	n as h,
	p as M,
	x as Q,
	b as p,
	C as U,
	A as W,
	f as X,
	t as Y,
	y as Z,
	o as ee
} from '../../../chunks/index-2fad9c0c.js';
import { w as te } from '../../../chunks/singletons-7e9a75e8.js';
import { c as T } from '../../../chunks/components-9abf80d5.js';
import { c as ne } from '../../../chunks/Select.svelte_svelte_type_style_lang-949aa272.js';
import { e as q } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as ie } from '../../../chunks/Seo-c7090712.js';
import '../../../chunks/stores-80acc175.js';
var le = {};
(function (s) {
	(s.defaults = {}),
		(s.set = function (r, n, i) {
			var t = i || {},
				a = s.defaults,
				l = t.expires || a.expires,
				o = t.domain || a.domain,
				c = t.path !== void 0 ? t.path : a.path !== void 0 ? a.path : '/',
				u = t.secure !== void 0 ? t.secure : a.secure,
				m = t.httponly !== void 0 ? t.httponly : a.httponly,
				y = t.samesite !== void 0 ? t.samesite : a.samesite,
				_ = l ? new Date(typeof l == 'number' ? new Date().getTime() + l * 864e5 : l) : 0;
			document.cookie =
				r
					.replace(/[^+#$&^`|]/g, encodeURIComponent)
					.replace('(', '%28')
					.replace(')', '%29') +
				'=' +
				n.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
				(_ && _.getTime() >= 0 ? ';expires=' + _.toUTCString() : '') +
				(o ? ';domain=' + o : '') +
				(c ? ';path=' + c : '') +
				(u ? ';secure' : '') +
				(m ? ';httponly' : '') +
				(y ? ';samesite=' + y : '');
		}),
		(s.get = function (r) {
			for (var n = document.cookie.split(';'); n.length; ) {
				var i = n.pop(),
					t = i.indexOf('=');
				t = t < 0 ? i.length : t;
				var a = decodeURIComponent(i.slice(0, t).replace(/^\s+/, ''));
				if (a === r) return decodeURIComponent(i.slice(t + 1));
			}
			return null;
		}),
		(s.erase = function (r, n) {
			s.set(r, '', {
				expires: -1,
				domain: n && n.domain,
				path: n && n.path,
				secure: 0,
				httponly: 0
			});
		}),
		(s.all = function () {
			for (var r = {}, n = document.cookie.split(';'); n.length; ) {
				var i = n.pop(),
					t = i.indexOf('=');
				t = t < 0 ? i.length : t;
				var a = decodeURIComponent(i.slice(0, t).replace(/^\s+/, ''));
				r[a] = decodeURIComponent(i.slice(t + 1));
			}
			return r;
		});
})(le);
function re(s, r, n) {
	const i = r.getValue(n);
	return (
		i !== null && s.set(i),
		r.addListener &&
			r.addListener(n, (t) => {
				s.set(t);
			}),
		s.subscribe((t) => {
			r.setValue(n, t);
		}),
		Object.assign(Object.assign({}, s), {
			delete() {
				r.deleteValue(n);
			}
		})
	);
}
function se(s, r = !1) {
	const n = [],
		i = (l) => {
			const o = l.key;
			l.storageArea === s &&
				n
					.filter(({ key: c }) => c === o)
					.forEach(({ listener: c }) => {
						let u = l.newValue;
						try {
							u = JSON.parse(l.newValue);
						} catch {}
						c(u);
					});
		},
		t = () => {
			r &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.addEventListener) &&
				window.addEventListener('storage', i);
		},
		a = () => {
			r &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.removeEventListener) &&
				window.removeEventListener('storage', i);
		};
	return {
		addListener(l, o) {
			n.push({ key: l, listener: o }), n.length === 1 && t();
		},
		removeListener(l, o) {
			const c = n.indexOf({ key: l, listener: o });
			c !== -1 && n.splice(c, 1), n.length === 0 && a();
		},
		getValue(l) {
			let o = s.getItem(l);
			if (o != null)
				try {
					o = JSON.parse(o);
				} catch {}
			return o;
		},
		deleteValue(l) {
			s.removeItem(l);
		},
		setValue(l, o) {
			s.setItem(l, JSON.stringify(o));
		}
	};
}
function ae(s = !1) {
	return typeof window < 'u' && (window == null ? void 0 : window.localStorage)
		? se(window.localStorage, s)
		: (console.warn('Unable to find the localStorage. No data will be persisted.'), oe());
}
function oe() {
	return {
		getValue() {
			return null;
		},
		deleteValue() {},
		setValue() {}
	};
}
function ue(s) {
	let r, n, i, t, a, l, o, c, u, m, y, _, g, B, C, b, P, D, E, O, L;
	return (
		(r = new ie({ props: { title: 'RVLT Proposals' } })),
		{
			c() {
				K(r.$$.fragment),
					(n = V()),
					(i = v('embed')),
					(a = V()),
					(l = v('p')),
					(o = v('br')),
					(c = V()),
					(u = v('div')),
					(m = v('embed')),
					(_ = V()),
					(g = v('p')),
					(B = v('br')),
					(C = V()),
					(b = v('embed')),
					(D = V()),
					(E = v('h1')),
					(O = k('Further information will be provided soon.')),
					this.h();
			},
			l(e) {
				z(r.$$.fragment, e),
					(n = S(e)),
					(i = w(e, 'EMBED', { src: !0, width: !0, height: !0 })),
					(a = S(e)),
					(l = w(e, 'P', {}));
				var d = R(l);
				(o = w(d, 'BR', {})), d.forEach(f), (c = S(e)), (u = w(e, 'DIV', { style: !0 }));
				var F = R(u);
				(m = w(F, 'EMBED', { src: !0, width: !0, height: !0 })),
					F.forEach(f),
					(_ = S(e)),
					(g = w(e, 'P', {}));
				var J = R(g);
				(B = w(J, 'BR', {})),
					J.forEach(f),
					(C = S(e)),
					(b = w(e, 'EMBED', { src: !0, width: !0, height: !0 })),
					(D = S(e)),
					(E = w(e, 'H1', {}));
				var j = R(E);
				(O = G(j, 'Further information will be provided soon.')), j.forEach(f), this.h();
			},
			h() {
				$(
					i.src,
					(t = 'https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254')
				) || h(i, 'src', t),
					h(i, 'width', '100%'),
					h(i, 'height', '200'),
					$(
						m.src,
						(y = 'https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722')
					) || h(m, 'src', y),
					h(m, 'width', '100%'),
					h(m, 'height', '200'),
					M(u, 'margin-left', 'auto'),
					M(u, 'margin-right', 'auto'),
					M(u, 'width', '50vw'),
					$(
						b.src,
						(P = 'https://dune.com/embeds/1280979/2194908/ec83050f-257e-45b4-a382-f791020293c0')
					) || h(b, 'src', P),
					h(b, 'width', '100%'),
					h(b, 'height', '1000');
			},
			m(e, d) {
				Q(r, e, d),
					p(e, n, d),
					p(e, i, d),
					p(e, a, d),
					p(e, l, d),
					U(l, o),
					p(e, c, d),
					p(e, u, d),
					U(u, m),
					p(e, _, d),
					p(e, g, d),
					U(g, B),
					p(e, C, d),
					p(e, b, d),
					p(e, D, d),
					p(e, E, d),
					U(E, O),
					(L = !0);
			},
			p: W,
			i(e) {
				L || (X(r.$$.fragment, e), (L = !0));
			},
			o(e) {
				Y(r.$$.fragment, e), (L = !1);
			},
			d(e) {
				Z(r, e),
					e && f(n),
					e && f(i),
					e && f(a),
					e && f(l),
					e && f(c),
					e && f(u),
					e && f(_),
					e && f(g),
					e && f(C),
					e && f(b),
					e && f(D),
					e && f(E);
			}
		}
	);
}
let A = null,
	N = null;
function ce(s, r, n) {
	let i;
	q(T, 'tags');
	let t = [];
	[...q(T, 'category').filter((u) => u.value !== '')];
	let a = null,
		l = 'stars_desc',
		o = { value: 'stars_desc', label: 'Stars Desc' };
	ee(() => {
		re(te('npm'), ae(), 'packageManager');
	});
	const c = (u, m) => u.filter((y) => m.includes(y));
	return (
		(s.$$.update = () => {
			s.$$.dirty & 7 &&
				n(
					3,
					(i = T.filter((u) =>
						t.length === 0 && a === null
							? !0
							: !((t.length > 0 && c(t, u.tags).length === 0) || (a !== null && u.category !== a))
					).sort(ne(l)))
				),
				s.$$.dirty & 8 && q(i, 'category');
		}),
		n(2, (l = (o == null ? void 0 : o.value) || 'stars_desc')),
		n(1, (a = (N == null ? void 0 : N.value) || null)),
		n(0, (t = (A == null ? void 0 : A.map((u) => u.value)) || [])),
		[t, a, l, i]
	);
}
class _e extends x {
	constructor(r) {
		super(), I(this, r, ce, ue, H, {});
	}
}
export { _e as default };
