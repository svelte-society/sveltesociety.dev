import {
	S as Je,
	i as Ye,
	s as He,
	v as F,
	a as v,
	k as u,
	q as R,
	w as j,
	c as _,
	l as f,
	m as b,
	r as y,
	h as d,
	n as o,
	B as q,
	p as Ae,
	x as J,
	b as E,
	C as r,
	f as Y,
	t as H,
	y as K,
	o as Ke,
	A as W
} from '../../../chunks/index-2fad9c0c.js';
import { w as xe } from '../../../chunks/singletons-1d1822e3.js';
import { c as Pe } from '../../../chunks/components-9abf80d5.js';
import { c as ze } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { e as Se } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as Qe } from '../../../chunks/Seo-17746f97.js';
import { L as Q } from '../../../chunks/Link-2f41dbb7.js';
import '../../../chunks/stores-2990c9e9.js';
var We = {};
(function (a) {
	(a.defaults = {}),
		(a.set = function (t, l, s) {
			var e = s || {},
				n = a.defaults,
				m = e.expires || n.expires,
				p = e.domain || n.domain,
				$ = e.path !== void 0 ? e.path : n.path !== void 0 ? n.path : '/',
				g = e.secure !== void 0 ? e.secure : n.secure,
				k = e.httponly !== void 0 ? e.httponly : n.httponly,
				B = e.samesite !== void 0 ? e.samesite : n.samesite,
				I = m ? new Date(typeof m == 'number' ? new Date().getTime() + m * 864e5 : m) : 0;
			document.cookie =
				t
					.replace(/[^+#$&^`|]/g, encodeURIComponent)
					.replace('(', '%28')
					.replace(')', '%29') +
				'=' +
				l.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
				(I && I.getTime() >= 0 ? ';expires=' + I.toUTCString() : '') +
				(p ? ';domain=' + p : '') +
				($ ? ';path=' + $ : '') +
				(g ? ';secure' : '') +
				(k ? ';httponly' : '') +
				(B ? ';samesite=' + B : '');
		}),
		(a.get = function (t) {
			for (var l = document.cookie.split(';'); l.length; ) {
				var s = l.pop(),
					e = s.indexOf('=');
				e = e < 0 ? s.length : e;
				var n = decodeURIComponent(s.slice(0, e).replace(/^\s+/, ''));
				if (n === t) return decodeURIComponent(s.slice(e + 1));
			}
			return null;
		}),
		(a.erase = function (t, l) {
			a.set(t, '', {
				expires: -1,
				domain: l && l.domain,
				path: l && l.path,
				secure: 0,
				httponly: 0
			});
		}),
		(a.all = function () {
			for (var t = {}, l = document.cookie.split(';'); l.length; ) {
				var s = l.pop(),
					e = s.indexOf('=');
				e = e < 0 ? s.length : e;
				var n = decodeURIComponent(s.slice(0, e).replace(/^\s+/, ''));
				t[n] = decodeURIComponent(s.slice(e + 1));
			}
			return t;
		});
})(We);
function Xe(a, t, l) {
	const s = t.getValue(l);
	return (
		s !== null && a.set(s),
		t.addListener &&
			t.addListener(l, (e) => {
				a.set(e);
			}),
		a.subscribe((e) => {
			t.setValue(l, e);
		}),
		Object.assign(Object.assign({}, a), {
			delete() {
				t.deleteValue(l);
			}
		})
	);
}
function Ze(a, t = !1) {
	const l = [],
		s = (m) => {
			const p = m.key;
			m.storageArea === a &&
				l
					.filter(({ key: $ }) => $ === p)
					.forEach(({ listener: $ }) => {
						let g = m.newValue;
						try {
							g = JSON.parse(m.newValue);
						} catch {}
						$(g);
					});
		},
		e = () => {
			t &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.addEventListener) &&
				window.addEventListener('storage', s);
		},
		n = () => {
			t &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.removeEventListener) &&
				window.removeEventListener('storage', s);
		};
	return {
		addListener(m, p) {
			l.push({ key: m, listener: p }), l.length === 1 && e();
		},
		removeListener(m, p) {
			const $ = l.indexOf({ key: m, listener: p });
			$ !== -1 && l.splice($, 1), l.length === 0 && n();
		},
		getValue(m) {
			let p = a.getItem(m);
			if (p != null)
				try {
					p = JSON.parse(p);
				} catch {}
			return p;
		},
		deleteValue(m) {
			a.removeItem(m);
		},
		setValue(m, p) {
			a.setItem(m, JSON.stringify(p));
		}
	};
}
function et(a = !1) {
	return typeof window < 'u' && (window == null ? void 0 : window.localStorage)
		? Ze(window.localStorage, a)
		: (console.warn('Unable to find the localStorage. No data will be persisted.'), tt());
}
function tt() {
	return {
		getValue() {
			return null;
		},
		deleteValue() {},
		setValue() {}
	};
}
function st(a) {
	let t, l, s;
	return {
		c() {
			(t = u('img')),
				(s = R(`
				Discord`)),
				this.h();
		},
		l(e) {
			(t = f(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(s = y(
					e,
					`
				Discord`
				)),
				this.h();
		},
		h() {
			q(t.src, (l = 'images/discord.svg')) || o(t, 'src', l),
				o(t, 'alt', ''),
				o(t, 'class', 'svelte-cqh5c8');
		},
		m(e, n) {
			E(e, t, n), E(e, s, n);
		},
		p: W,
		d(e) {
			e && d(t), e && d(s);
		}
	};
}
function lt(a) {
	let t, l, s;
	return {
		c() {
			(t = u('img')),
				(s = R(`
				YouTube`)),
				this.h();
		},
		l(e) {
			(t = f(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(s = y(
					e,
					`
				YouTube`
				)),
				this.h();
		},
		h() {
			q(t.src, (l = 'images/youtube.svg')) || o(t, 'src', l),
				o(t, 'alt', ''),
				o(t, 'class', 'svelte-cqh5c8');
		},
		m(e, n) {
			E(e, t, n), E(e, s, n);
		},
		p: W,
		d(e) {
			e && d(t), e && d(s);
		}
	};
}
function rt(a) {
	let t, l, s;
	return {
		c() {
			(t = u('img')),
				(s = R(`
				Twitter`)),
				this.h();
		},
		l(e) {
			(t = f(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(s = y(
					e,
					`
				Twitter`
				)),
				this.h();
		},
		h() {
			q(t.src, (l = 'images/twitter.svg')) || o(t, 'src', l),
				o(t, 'alt', ''),
				o(t, 'class', 'svelte-cqh5c8');
		},
		m(e, n) {
			E(e, t, n), E(e, s, n);
		},
		p: W,
		d(e) {
			e && d(t), e && d(s);
		}
	};
}
function nt(a) {
	let t, l, s;
	return {
		c() {
			(t = u('img')),
				(s = R(`
				Newsletter`)),
				this.h();
		},
		l(e) {
			(t = f(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(s = y(
					e,
					`
				Newsletter`
				)),
				this.h();
		},
		h() {
			q(t.src, (l = 'images/newsletter.svg')) || o(t, 'src', l),
				o(t, 'alt', ''),
				o(t, 'class', 'svelte-cqh5c8');
		},
		m(e, n) {
			E(e, t, n), E(e, s, n);
		},
		p: W,
		d(e) {
			e && d(t), e && d(s);
		}
	};
}
function at(a) {
	let t, l, s;
	return {
		c() {
			(t = u('img')),
				(s = R(`
				Reddit`)),
				this.h();
		},
		l(e) {
			(t = f(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(s = y(
					e,
					`
				Reddit`
				)),
				this.h();
		},
		h() {
			q(t.src, (l = 'images/reddit.svg')) || o(t, 'src', l),
				o(t, 'alt', ''),
				o(t, 'class', 'svelte-cqh5c8');
		},
		m(e, n) {
			E(e, t, n), E(e, s, n);
		},
		p: W,
		d(e) {
			e && d(t), e && d(s);
		}
	};
}
function it(a) {
	let t, l, s;
	return {
		c() {
			(t = u('img')),
				(s = R(`
				Podcast`)),
				this.h();
		},
		l(e) {
			(t = f(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(s = y(
					e,
					`
				Podcast`
				)),
				this.h();
		},
		h() {
			q(t.src, (l = 'images/radio.svg')) || o(t, 'src', l),
				o(t, 'alt', ''),
				o(t, 'class', 'svelte-cqh5c8');
		},
		m(e, n) {
			E(e, t, n), E(e, s, n);
		},
		p: W,
		d(e) {
			e && d(t), e && d(s);
		}
	};
}
function ot(a) {
	let t,
		l,
		s,
		e,
		n,
		m,
		p,
		$,
		g,
		k,
		B,
		I,
		X,
		ue,
		fe,
		T,
		de,
		me,
		Z,
		pe,
		he,
		ge,
		$e,
		ee,
		ve,
		_e,
		h,
		V,
		D,
		we,
		M,
		be,
		A,
		Ee,
		L,
		P,
		Re,
		S,
		ye,
		U,
		ke,
		O,
		Ie,
		Ve,
		te,
		Le,
		qe,
		G,
		Te,
		Be,
		se,
		De,
		Me,
		C,
		N,
		Oe,
		ce;
	return (
		(t = new Qe({ props: { title: 'RVLT Proposals' } })),
		(D = new Q({
			props: {
				path: 'https://discord.gg/wearecultdao',
				$$slots: { default: [st] },
				$$scope: { ctx: a }
			}
		})),
		(M = new Q({
			props: {
				path: 'https://rumble.com/c/c-1902267',
				$$slots: { default: [lt] },
				$$scope: { ctx: a }
			}
		})),
		(A = new Q({
			props: {
				path: 'https://twitter.com/MrOmodulus',
				$$slots: { default: [rt] },
				$$scope: { ctx: a }
			}
		})),
		(P = new Q({
			props: { path: 'https://doc.cultdao.io/', $$slots: { default: [nt] }, $$scope: { ctx: a } }
		})),
		(S = new Q({
			props: {
				path: 'https://www.reddit.com/r/cultdao/',
				$$slots: { default: [at] },
				$$scope: { ctx: a }
			}
		})),
		(U = new Q({
			props: { path: 'https://www.cultradio.com/', $$slots: { default: [it] }, $$scope: { ctx: a } }
		})),
		{
			c() {
				F(t.$$.fragment),
					(l = v()),
					(s = u('div')),
					(e = u('h2')),
					(n = R('Acts of Revolt')),
					(m = v()),
					(p = u('p')),
					($ = u('br')),
					(g = R(`
	Feel free to submit your own
	`)),
					(k = u('a')),
					(B = R('Acts of Revolt')),
					(I = R(`.
	`)),
					(X = u('p')),
					(ue = u('br')),
					(fe = R(`

	Feel free to join us to explore how
	`)),
					(T = u('a')),
					(de = R('Revolt 2 Earn works')),
					(me = R(`.
	`)),
					(Z = u('p')),
					(pe = u('br')),
					(he = v()),
					(ge = u('br')),
					($e = v()),
					(ee = u('p')),
					(ve = u('br')),
					(_e = v()),
					(h = u('article')),
					(V = u('ul')),
					F(D.$$.fragment),
					(we = v()),
					F(M.$$.fragment),
					(be = v()),
					F(A.$$.fragment),
					(Ee = v()),
					(L = u('ul')),
					F(P.$$.fragment),
					(Re = v()),
					F(S.$$.fragment),
					(ye = v()),
					F(U.$$.fragment),
					(ke = v()),
					(O = u('embed')),
					(Ve = v()),
					(te = u('p')),
					(Le = u('br')),
					(qe = v()),
					(G = u('embed')),
					(Be = v()),
					(se = u('p')),
					(De = u('br')),
					(Me = v()),
					(C = u('div')),
					(N = u('embed')),
					this.h();
			},
			l(c) {
				j(t.$$.fragment, c), (l = _(c)), (s = f(c, 'DIV', { class: !0 }));
				var i = b(s);
				e = f(i, 'H2', {});
				var le = b(e);
				(n = y(le, 'Acts of Revolt')), le.forEach(d), (m = _(i)), (p = f(i, 'P', {}));
				var re = b(p);
				($ = f(re, 'BR', {})),
					re.forEach(d),
					(g = y(
						i,
						`
	Feel free to submit your own
	`
					)),
					(k = f(i, 'A', { href: !0, target: !0 }));
				var ne = b(k);
				(B = y(ne, 'Acts of Revolt')),
					ne.forEach(d),
					(I = y(
						i,
						`.
	`
					)),
					(X = f(i, 'P', {}));
				var ae = b(X);
				(ue = f(ae, 'BR', {})),
					ae.forEach(d),
					(fe = y(
						i,
						`

	Feel free to join us to explore how
	`
					)),
					(T = f(i, 'A', { href: !0, target: !0 }));
				var ie = b(T);
				(de = y(ie, 'Revolt 2 Earn works')),
					ie.forEach(d),
					(me = y(
						i,
						`.
	`
					)),
					(Z = f(i, 'P', {}));
				var oe = b(Z);
				(pe = f(oe, 'BR', {})),
					oe.forEach(d),
					(he = _(i)),
					(ge = f(i, 'BR', {})),
					($e = _(i)),
					(ee = f(i, 'P', {}));
				var Ge = b(ee);
				(ve = f(Ge, 'BR', {})), Ge.forEach(d), (_e = _(i)), (h = f(i, 'ARTICLE', { class: !0 }));
				var w = b(h);
				V = f(w, 'UL', { class: !0 });
				var x = b(V);
				j(D.$$.fragment, x),
					(we = _(x)),
					j(M.$$.fragment, x),
					(be = _(x)),
					j(A.$$.fragment, x),
					x.forEach(d),
					(Ee = _(w)),
					(L = f(w, 'UL', { class: !0 }));
				var z = b(L);
				j(P.$$.fragment, z),
					(Re = _(z)),
					j(S.$$.fragment, z),
					(ye = _(z)),
					j(U.$$.fragment, z),
					z.forEach(d),
					(ke = _(w)),
					(O = f(w, 'EMBED', { src: !0, width: !0, height: !0 })),
					(Ve = _(w)),
					(te = f(w, 'P', {}));
				var Ne = b(te);
				(Le = f(Ne, 'BR', {})),
					Ne.forEach(d),
					(qe = _(w)),
					(G = f(w, 'EMBED', { src: !0, width: !0, height: !0 })),
					(Be = _(w)),
					(se = f(w, 'P', {}));
				var Fe = b(se);
				(De = f(Fe, 'BR', {})), Fe.forEach(d), (Me = _(w)), (C = f(w, 'DIV', { style: !0 }));
				var je = b(C);
				(N = f(je, 'EMBED', { src: !0, width: !0, height: !0 })),
					je.forEach(d),
					w.forEach(d),
					i.forEach(d),
					this.h();
			},
			h() {
				o(k, 'href', 'https://revolt.cultdao.io/submitProposal'),
					o(k, 'target', '_blank'),
					o(T, 'href', 'https://cultdao.io/rvlt.pdf'),
					o(T, 'target', '_blank'),
					o(V, 'class', 'svelte-cqh5c8'),
					o(L, 'class', 'svelte-cqh5c8'),
					q(
						O.src,
						(Ie = 'https://dune.com/embeds/1279330/2192235/161e3edb-480c-451b-835f-078db00181e3')
					) || o(O, 'src', Ie),
					o(O, 'width', '100%'),
					o(O, 'height', '700'),
					q(
						G.src,
						(Te = 'https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254')
					) || o(G, 'src', Te),
					o(G, 'width', '100%'),
					o(G, 'height', '200'),
					q(
						N.src,
						(Oe = 'https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722')
					) || o(N, 'src', Oe),
					o(N, 'width', '100%'),
					o(N, 'height', '200'),
					Ae(C, 'margin-left', 'auto'),
					Ae(C, 'margin-right', 'auto'),
					Ae(C, 'width', '50vw'),
					o(h, 'class', 'container svelte-cqh5c8'),
					o(s, 'class', 'text-center');
			},
			m(c, i) {
				J(t, c, i),
					E(c, l, i),
					E(c, s, i),
					r(s, e),
					r(e, n),
					r(s, m),
					r(s, p),
					r(p, $),
					r(s, g),
					r(s, k),
					r(k, B),
					r(s, I),
					r(s, X),
					r(X, ue),
					r(s, fe),
					r(s, T),
					r(T, de),
					r(s, me),
					r(s, Z),
					r(Z, pe),
					r(s, he),
					r(s, ge),
					r(s, $e),
					r(s, ee),
					r(ee, ve),
					r(s, _e),
					r(s, h),
					r(h, V),
					J(D, V, null),
					r(V, we),
					J(M, V, null),
					r(V, be),
					J(A, V, null),
					r(h, Ee),
					r(h, L),
					J(P, L, null),
					r(L, Re),
					J(S, L, null),
					r(L, ye),
					J(U, L, null),
					r(h, ke),
					r(h, O),
					r(h, Ve),
					r(h, te),
					r(te, Le),
					r(h, qe),
					r(h, G),
					r(h, Be),
					r(h, se),
					r(se, De),
					r(h, Me),
					r(h, C),
					r(C, N),
					(ce = !0);
			},
			p(c, [i]) {
				const le = {};
				i & 4096 && (le.$$scope = { dirty: i, ctx: c }), D.$set(le);
				const re = {};
				i & 4096 && (re.$$scope = { dirty: i, ctx: c }), M.$set(re);
				const ne = {};
				i & 4096 && (ne.$$scope = { dirty: i, ctx: c }), A.$set(ne);
				const ae = {};
				i & 4096 && (ae.$$scope = { dirty: i, ctx: c }), P.$set(ae);
				const ie = {};
				i & 4096 && (ie.$$scope = { dirty: i, ctx: c }), S.$set(ie);
				const oe = {};
				i & 4096 && (oe.$$scope = { dirty: i, ctx: c }), U.$set(oe);
			},
			i(c) {
				ce ||
					(Y(t.$$.fragment, c),
					Y(D.$$.fragment, c),
					Y(M.$$.fragment, c),
					Y(A.$$.fragment, c),
					Y(P.$$.fragment, c),
					Y(S.$$.fragment, c),
					Y(U.$$.fragment, c),
					(ce = !0));
			},
			o(c) {
				H(t.$$.fragment, c),
					H(D.$$.fragment, c),
					H(M.$$.fragment, c),
					H(A.$$.fragment, c),
					H(P.$$.fragment, c),
					H(S.$$.fragment, c),
					H(U.$$.fragment, c),
					(ce = !1);
			},
			d(c) {
				K(t, c), c && d(l), c && d(s), K(D), K(M), K(A), K(P), K(S), K(U);
			}
		}
	);
}
let Ue = null,
	Ce = null;
function ct(a, t, l) {
	let s;
	Se(Pe, 'tags');
	let e = [];
	[...Se(Pe, 'category').filter((g) => g.value !== '')];
	let n = null,
		m = 'stars_desc',
		p = { value: 'stars_desc', label: 'Stars Desc' };
	Ke(() => {
		Xe(xe('npm'), et(), 'packageManager');
	});
	const $ = (g, k) => g.filter((B) => k.includes(B));
	return (
		(a.$$.update = () => {
			a.$$.dirty & 7 &&
				l(
					3,
					(s = Pe.filter((g) =>
						e.length === 0 && n === null
							? !0
							: !((e.length > 0 && $(e, g.tags).length === 0) || (n !== null && g.category !== n))
					).sort(ze(m)))
				),
				a.$$.dirty & 8 && Se(s, 'category');
		}),
		l(2, (m = (p == null ? void 0 : p.value) || 'stars_desc')),
		l(1, (n = (Ce == null ? void 0 : Ce.value) || null)),
		l(0, (e = (Ue == null ? void 0 : Ue.map((g) => g.value)) || [])),
		[e, n, m, s]
	);
}
class vt extends Je {
	constructor(t) {
		super(), Ye(this, t, ct, ot, He, {});
	}
}
export { vt as default };
