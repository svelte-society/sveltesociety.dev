import {
	S as Et,
	i as Rt,
	s as kt,
	v as F,
	a as _,
	k as a,
	q as g,
	w as K,
	c as $,
	l as o,
	m as p,
	r as v,
	h as f,
	n as i,
	B,
	p as U,
	x,
	b as R,
	C as l,
	f as z,
	t as Q,
	y as X,
	o as Tt,
	A as ae
} from '../../../chunks/index-2fad9c0c.js';
import { w as Lt } from '../../../chunks/singletons-53791fd8.js';
import { c as at } from '../../../chunks/components-9abf80d5.js';
import { c as Vt } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { e as ot } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as Bt } from '../../../chunks/Seo-c4047d93.js';
import { L as ne } from '../../../chunks/Link-2f41dbb7.js';
import '../../../chunks/stores-28cbd078.js';
var Dt = {};
(function (u) {
	(u.defaults = {}),
		(u.set = function (r, s, t) {
			var e = t || {},
				c = u.defaults,
				m = e.expires || c.expires,
				h = e.domain || c.domain,
				y = e.path !== void 0 ? e.path : c.path !== void 0 ? c.path : '/',
				b = e.secure !== void 0 ? e.secure : c.secure,
				k = e.httponly !== void 0 ? e.httponly : c.httponly,
				q = e.samesite !== void 0 ? e.samesite : c.samesite,
				G = m ? new Date(typeof m == 'number' ? new Date().getTime() + m * 864e5 : m) : 0;
			document.cookie =
				r
					.replace(/[^+#$&^`|]/g, encodeURIComponent)
					.replace('(', '%28')
					.replace(')', '%29') +
				'=' +
				s.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
				(G && G.getTime() >= 0 ? ';expires=' + G.toUTCString() : '') +
				(h ? ';domain=' + h : '') +
				(y ? ';path=' + y : '') +
				(b ? ';secure' : '') +
				(k ? ';httponly' : '') +
				(q ? ';samesite=' + q : '');
		}),
		(u.get = function (r) {
			for (var s = document.cookie.split(';'); s.length; ) {
				var t = s.pop(),
					e = t.indexOf('=');
				e = e < 0 ? t.length : e;
				var c = decodeURIComponent(t.slice(0, e).replace(/^\s+/, ''));
				if (c === r) return decodeURIComponent(t.slice(e + 1));
			}
			return null;
		}),
		(u.erase = function (r, s) {
			u.set(r, '', {
				expires: -1,
				domain: s && s.domain,
				path: s && s.path,
				secure: 0,
				httponly: 0
			});
		}),
		(u.all = function () {
			for (var r = {}, s = document.cookie.split(';'); s.length; ) {
				var t = s.pop(),
					e = t.indexOf('=');
				e = e < 0 ? t.length : e;
				var c = decodeURIComponent(t.slice(0, e).replace(/^\s+/, ''));
				r[c] = decodeURIComponent(t.slice(e + 1));
			}
			return r;
		});
})(Dt);
function Ut(u, r, s) {
	const t = r.getValue(s);
	return (
		t !== null && u.set(t),
		r.addListener &&
			r.addListener(s, (e) => {
				u.set(e);
			}),
		u.subscribe((e) => {
			r.setValue(s, e);
		}),
		Object.assign(Object.assign({}, u), {
			delete() {
				r.deleteValue(s);
			}
		})
	);
}
function qt(u, r = !1) {
	const s = [],
		t = (m) => {
			const h = m.key;
			m.storageArea === u &&
				s
					.filter(({ key: y }) => y === h)
					.forEach(({ listener: y }) => {
						let b = m.newValue;
						try {
							b = JSON.parse(m.newValue);
						} catch {}
						y(b);
					});
		},
		e = () => {
			r &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.addEventListener) &&
				window.addEventListener('storage', t);
		},
		c = () => {
			r &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.removeEventListener) &&
				window.removeEventListener('storage', t);
		};
	return {
		addListener(m, h) {
			s.push({ key: m, listener: h }), s.length === 1 && e();
		},
		removeListener(m, h) {
			const y = s.indexOf({ key: m, listener: h });
			y !== -1 && s.splice(y, 1), s.length === 0 && c();
		},
		getValue(m) {
			let h = u.getItem(m);
			if (h != null)
				try {
					h = JSON.parse(h);
				} catch {}
			return h;
		},
		deleteValue(m) {
			u.removeItem(m);
		},
		setValue(m, h) {
			u.setItem(m, JSON.stringify(h));
		}
	};
}
function It(u = !1) {
	return typeof window < 'u' && (window == null ? void 0 : window.localStorage)
		? qt(window.localStorage, u)
		: (console.warn('Unable to find the localStorage. No data will be persisted.'), At());
}
function At() {
	return {
		getValue() {
			return null;
		},
		deleteValue() {},
		setValue() {}
	};
}
function Mt(u) {
	let r, s, t;
	return {
		c() {
			(r = a('img')),
				(t = g(`
				Discord`)),
				this.h();
		},
		l(e) {
			(r = o(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Discord`
				)),
				this.h();
		},
		h() {
			B(r.src, (s = 'images/discord.svg')) || i(r, 'src', s),
				i(r, 'alt', ''),
				i(r, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			R(e, r, c), R(e, t, c);
		},
		p: ae,
		d(e) {
			e && f(r), e && f(t);
		}
	};
}
function Pt(u) {
	let r, s, t;
	return {
		c() {
			(r = a('img')),
				(t = g(`
				YouTube`)),
				this.h();
		},
		l(e) {
			(r = o(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				YouTube`
				)),
				this.h();
		},
		h() {
			B(r.src, (s = 'images/youtube.svg')) || i(r, 'src', s),
				i(r, 'alt', ''),
				i(r, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			R(e, r, c), R(e, t, c);
		},
		p: ae,
		d(e) {
			e && f(r), e && f(t);
		}
	};
}
function Ct(u) {
	let r, s, t;
	return {
		c() {
			(r = a('img')),
				(t = g(`
				Twitter`)),
				this.h();
		},
		l(e) {
			(r = o(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Twitter`
				)),
				this.h();
		},
		h() {
			B(r.src, (s = 'images/twitter.svg')) || i(r, 'src', s),
				i(r, 'alt', ''),
				i(r, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			R(e, r, c), R(e, t, c);
		},
		p: ae,
		d(e) {
			e && f(r), e && f(t);
		}
	};
}
function Ot(u) {
	let r, s, t;
	return {
		c() {
			(r = a('img')),
				(t = g(`
				Newsletter`)),
				this.h();
		},
		l(e) {
			(r = o(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Newsletter`
				)),
				this.h();
		},
		h() {
			B(r.src, (s = 'images/newsletter.svg')) || i(r, 'src', s),
				i(r, 'alt', ''),
				i(r, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			R(e, r, c), R(e, t, c);
		},
		p: ae,
		d(e) {
			e && f(r), e && f(t);
		}
	};
}
function St(u) {
	let r, s, t;
	return {
		c() {
			(r = a('img')),
				(t = g(`
				Reddit`)),
				this.h();
		},
		l(e) {
			(r = o(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Reddit`
				)),
				this.h();
		},
		h() {
			B(r.src, (s = 'images/reddit.svg')) || i(r, 'src', s),
				i(r, 'alt', ''),
				i(r, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			R(e, r, c), R(e, t, c);
		},
		p: ae,
		d(e) {
			e && f(r), e && f(t);
		}
	};
}
function Gt(u) {
	let r, s, t;
	return {
		c() {
			(r = a('img')),
				(t = g(`
				Podcast`)),
				this.h();
		},
		l(e) {
			(r = o(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Podcast`
				)),
				this.h();
		},
		h() {
			B(r.src, (s = 'images/radio.svg')) || i(r, 'src', s),
				i(r, 'alt', ''),
				i(r, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			R(e, r, c), R(e, t, c);
		},
		p: ae,
		d(e) {
			e && f(r), e && f(t);
		}
	};
}
function Nt(u) {
	let r,
		s,
		t,
		e,
		c,
		m,
		h,
		y,
		b,
		k,
		q,
		G,
		$e,
		we,
		be,
		N,
		ye,
		Ee,
		H,
		Re,
		ke,
		Z,
		Te,
		Le,
		Ve,
		J,
		Be,
		De,
		ee,
		Ue,
		qe,
		Ie,
		te,
		Ae,
		Me,
		Pe,
		oe,
		Ce,
		Oe,
		ie,
		Se,
		Ge,
		T,
		D,
		ut,
		Ne,
		ce,
		He,
		Je,
		ue,
		je,
		We,
		w,
		L,
		I,
		Ye,
		A,
		Fe,
		M,
		Ke,
		V,
		P,
		xe,
		C,
		ze,
		O,
		Qe,
		j,
		ft,
		Xe,
		fe,
		Ze,
		et,
		W,
		dt,
		tt,
		de,
		rt,
		lt,
		S,
		Y,
		mt,
		_e;
	return (
		(r = new Bt({ props: { title: 'RVLT Proposals' } })),
		(I = new ne({
			props: {
				path: 'https://discord.gg/wearecultdao',
				$$slots: { default: [Mt] },
				$$scope: { ctx: u }
			}
		})),
		(A = new ne({
			props: {
				path: 'https://rumble.com/c/c-1902267',
				$$slots: { default: [Pt] },
				$$scope: { ctx: u }
			}
		})),
		(M = new ne({
			props: {
				path: 'https://twitter.com/MrOmodulus',
				$$slots: { default: [Ct] },
				$$scope: { ctx: u }
			}
		})),
		(P = new ne({
			props: { path: 'https://doc.cultdao.io/', $$slots: { default: [Ot] }, $$scope: { ctx: u } }
		})),
		(C = new ne({
			props: {
				path: 'https://www.reddit.com/r/cultdao/',
				$$slots: { default: [St] },
				$$scope: { ctx: u }
			}
		})),
		(O = new ne({
			props: { path: 'https://www.cultradio.com/', $$slots: { default: [Gt] }, $$scope: { ctx: u } }
		})),
		{
			c() {
				F(r.$$.fragment),
					(s = _()),
					(t = a('div')),
					(e = a('h2')),
					(c = g('Revolt 2 Earn')),
					(m = _()),
					(h = a('p')),
					(y = a('br')),
					(b = g(`

	Here you can earn money while doing valuable things like supporting the CULTDAO.

	After you completed your work you can 
	`)),
					(k = a('a')),
					(q = g('submit a link to your work')),
					(G = g(`.
	The community votes on each proposal deciding whether or not you receive a reward. `)),
					($e = a('br')),
					(we = a('br')),
					(be = g(`

	The reward comes from the
	`)),
					(N = a('a')),
					(ye = g('Revolt 2 Earn')),
					(Ee = g(`
	Treasury. The Revolt 2 Earn Treasury is automatically filled by everyone who buys, sells or transfers our deflationary currency named
	`)),
					(H = a('a')),
					(Re = g('RVLT')),
					(ke = g(` 
	because 0.4% of each RVLT transaction automatically goes to this treasury.

	`)),
					(Z = a('p')),
					(Te = a('br')),
					(Le = a('br')),
					(Ve = g(`
	If you face any difficulties feel free to reach out to our
	`)),
					(J = a('a')),
					(Be = g('discord community')),
					(De = g(`. 

	`)),
					(ee = a('p')),
					(Ue = a('br')),
					(qe = a('br')),
					(Ie = _()),
					(te = a('p')),
					(Ae = a('br')),
					(Me = a('br')),
					(Pe = _()),
					(oe = a('h3')),
					(Ce = g('RVLT Tokenomics')),
					(Oe = _()),
					(ie = a('p')),
					(Se = a('br')),
					(Ge = _()),
					(T = a('div')),
					(D = a('img')),
					(Ne = _()),
					(ce = a('h3')),
					(He = g('Join Us We Rock')),
					(Je = _()),
					(ue = a('p')),
					(je = a('br')),
					(We = _()),
					(w = a('article')),
					(L = a('ul')),
					F(I.$$.fragment),
					(Ye = _()),
					F(A.$$.fragment),
					(Fe = _()),
					F(M.$$.fragment),
					(Ke = _()),
					(V = a('ul')),
					F(P.$$.fragment),
					(xe = _()),
					F(C.$$.fragment),
					(ze = _()),
					F(O.$$.fragment),
					(Qe = _()),
					(j = a('embed')),
					(Xe = _()),
					(fe = a('p')),
					(Ze = a('br')),
					(et = _()),
					(W = a('embed')),
					(tt = _()),
					(de = a('p')),
					(rt = a('br')),
					(lt = _()),
					(S = a('div')),
					(Y = a('embed')),
					this.h();
			},
			l(d) {
				K(r.$$.fragment, d), (s = $(d)), (t = o(d, 'DIV', { class: !0 }));
				var n = p(t);
				e = o(n, 'H2', {});
				var me = p(e);
				(c = v(me, 'Revolt 2 Earn')), me.forEach(f), (m = $(n)), (h = o(n, 'P', {}));
				var he = p(h);
				(y = o(he, 'BR', {})),
					he.forEach(f),
					(b = v(
						n,
						`

	Here you can earn money while doing valuable things like supporting the CULTDAO.

	After you completed your work you can 
	`
					)),
					(k = o(n, 'A', { href: !0, target: !0 }));
				var pe = p(k);
				(q = v(pe, 'submit a link to your work')),
					pe.forEach(f),
					(G = v(
						n,
						`.
	The community votes on each proposal deciding whether or not you receive a reward. `
					)),
					($e = o(n, 'BR', {})),
					(we = o(n, 'BR', {})),
					(be = v(
						n,
						`

	The reward comes from the
	`
					)),
					(N = o(n, 'A', { href: !0, target: !0 }));
				var ge = p(N);
				(ye = v(ge, 'Revolt 2 Earn')),
					ge.forEach(f),
					(Ee = v(
						n,
						`
	Treasury. The Revolt 2 Earn Treasury is automatically filled by everyone who buys, sells or transfers our deflationary currency named
	`
					)),
					(H = o(n, 'A', { href: !0, target: !0 }));
				var ve = p(H);
				(Re = v(ve, 'RVLT')),
					ve.forEach(f),
					(ke = v(
						n,
						` 
	because 0.4% of each RVLT transaction automatically goes to this treasury.

	`
					)),
					(Z = o(n, 'P', {}));
				var re = p(Z);
				(Te = o(re, 'BR', {})),
					(Le = o(re, 'BR', {})),
					re.forEach(f),
					(Ve = v(
						n,
						`
	If you face any difficulties feel free to reach out to our
	`
					)),
					(J = o(n, 'A', { href: !0, target: !0 }));
				var ht = p(J);
				(Be = v(ht, 'discord community')),
					ht.forEach(f),
					(De = v(
						n,
						`. 

	`
					)),
					(ee = o(n, 'P', {}));
				var st = p(ee);
				(Ue = o(st, 'BR', {})),
					(qe = o(st, 'BR', {})),
					st.forEach(f),
					(Ie = $(n)),
					(te = o(n, 'P', {}));
				var nt = p(te);
				(Ae = o(nt, 'BR', {})),
					(Me = o(nt, 'BR', {})),
					nt.forEach(f),
					(Pe = $(n)),
					(oe = o(n, 'H3', {}));
				var pt = p(oe);
				(Ce = v(pt, 'RVLT Tokenomics')), pt.forEach(f), (Oe = $(n)), (ie = o(n, 'P', {}));
				var gt = p(ie);
				(Se = o(gt, 'BR', {})),
					gt.forEach(f),
					(Ge = $(n)),
					(T = o(n, 'DIV', { class: !0, style: !0 }));
				var vt = p(T);
				(D = o(vt, 'IMG', { src: !0, alt: !0, style: !0, class: !0 })),
					vt.forEach(f),
					(Ne = $(n)),
					(ce = o(n, 'H3', {}));
				var _t = p(ce);
				(He = v(_t, 'Join Us We Rock')), _t.forEach(f), (Je = $(n)), (ue = o(n, 'P', {}));
				var $t = p(ue);
				(je = o($t, 'BR', {})), $t.forEach(f), (We = $(n)), (w = o(n, 'ARTICLE', { class: !0 }));
				var E = p(w);
				L = o(E, 'UL', { class: !0 });
				var le = p(L);
				K(I.$$.fragment, le),
					(Ye = $(le)),
					K(A.$$.fragment, le),
					(Fe = $(le)),
					K(M.$$.fragment, le),
					le.forEach(f),
					(Ke = $(E)),
					(V = o(E, 'UL', { class: !0 }));
				var se = p(V);
				K(P.$$.fragment, se),
					(xe = $(se)),
					K(C.$$.fragment, se),
					(ze = $(se)),
					K(O.$$.fragment, se),
					se.forEach(f),
					(Qe = $(E)),
					(j = o(E, 'EMBED', { src: !0, width: !0, height: !0 })),
					(Xe = $(E)),
					(fe = o(E, 'P', {}));
				var wt = p(fe);
				(Ze = o(wt, 'BR', {})),
					wt.forEach(f),
					(et = $(E)),
					(W = o(E, 'EMBED', { src: !0, width: !0, height: !0 })),
					(tt = $(E)),
					(de = o(E, 'P', {}));
				var bt = p(de);
				(rt = o(bt, 'BR', {})), bt.forEach(f), (lt = $(E)), (S = o(E, 'DIV', { style: !0 }));
				var yt = p(S);
				(Y = o(yt, 'EMBED', { src: !0, width: !0, height: !0 })),
					yt.forEach(f),
					E.forEach(f),
					n.forEach(f),
					this.h();
			},
			h() {
				i(k, 'href', 'https://revolt.cultdao.io/submitProposal'),
					i(k, 'target', '_blank'),
					i(N, 'href', 'https://cultdao.io/rvlt.pdf'),
					i(N, 'target', '_blank'),
					i(H, 'href', 'https://coinmarketcap.com/currencies/revolt-2-earn/'),
					i(H, 'target', '_blank'),
					i(J, 'href', 'https://discord.gg/wearecultdao'),
					i(J, 'target', '_blank'),
					B(D.src, (ut = '/images/revolt-2-earn-tokenomics.png')) || i(D, 'src', ut),
					i(D, 'alt', ''),
					U(D, 'width', '100%'),
					U(D, 'text-align', 'center'),
					i(D, 'class', 'svelte-cqh5c8'),
					i(T, 'class', 'text-center'),
					U(T, 'width', '100%'),
					U(T, 'margin-left', 'auto'),
					U(T, 'margin-right', 'auto'),
					U(T, 'margin-bottom', '10vh'),
					i(L, 'class', 'svelte-cqh5c8'),
					i(V, 'class', 'svelte-cqh5c8'),
					B(
						j.src,
						(ft = 'https://dune.com/embeds/1279330/2192235/161e3edb-480c-451b-835f-078db00181e3')
					) || i(j, 'src', ft),
					i(j, 'width', '100%'),
					i(j, 'height', '700'),
					B(
						W.src,
						(dt = 'https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254')
					) || i(W, 'src', dt),
					i(W, 'width', '100%'),
					i(W, 'height', '200'),
					B(
						Y.src,
						(mt = 'https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722')
					) || i(Y, 'src', mt),
					i(Y, 'width', '100%'),
					i(Y, 'height', '200'),
					U(S, 'margin-left', 'auto'),
					U(S, 'margin-right', 'auto'),
					U(S, 'width', '50vw'),
					i(w, 'class', 'container svelte-cqh5c8'),
					i(t, 'class', 'text-center');
			},
			m(d, n) {
				x(r, d, n),
					R(d, s, n),
					R(d, t, n),
					l(t, e),
					l(e, c),
					l(t, m),
					l(t, h),
					l(h, y),
					l(t, b),
					l(t, k),
					l(k, q),
					l(t, G),
					l(t, $e),
					l(t, we),
					l(t, be),
					l(t, N),
					l(N, ye),
					l(t, Ee),
					l(t, H),
					l(H, Re),
					l(t, ke),
					l(t, Z),
					l(Z, Te),
					l(Z, Le),
					l(t, Ve),
					l(t, J),
					l(J, Be),
					l(t, De),
					l(t, ee),
					l(ee, Ue),
					l(ee, qe),
					l(t, Ie),
					l(t, te),
					l(te, Ae),
					l(te, Me),
					l(t, Pe),
					l(t, oe),
					l(oe, Ce),
					l(t, Oe),
					l(t, ie),
					l(ie, Se),
					l(t, Ge),
					l(t, T),
					l(T, D),
					l(t, Ne),
					l(t, ce),
					l(ce, He),
					l(t, Je),
					l(t, ue),
					l(ue, je),
					l(t, We),
					l(t, w),
					l(w, L),
					x(I, L, null),
					l(L, Ye),
					x(A, L, null),
					l(L, Fe),
					x(M, L, null),
					l(w, Ke),
					l(w, V),
					x(P, V, null),
					l(V, xe),
					x(C, V, null),
					l(V, ze),
					x(O, V, null),
					l(w, Qe),
					l(w, j),
					l(w, Xe),
					l(w, fe),
					l(fe, Ze),
					l(w, et),
					l(w, W),
					l(w, tt),
					l(w, de),
					l(de, rt),
					l(w, lt),
					l(w, S),
					l(S, Y),
					(_e = !0);
			},
			p(d, [n]) {
				const me = {};
				n & 4096 && (me.$$scope = { dirty: n, ctx: d }), I.$set(me);
				const he = {};
				n & 4096 && (he.$$scope = { dirty: n, ctx: d }), A.$set(he);
				const pe = {};
				n & 4096 && (pe.$$scope = { dirty: n, ctx: d }), M.$set(pe);
				const ge = {};
				n & 4096 && (ge.$$scope = { dirty: n, ctx: d }), P.$set(ge);
				const ve = {};
				n & 4096 && (ve.$$scope = { dirty: n, ctx: d }), C.$set(ve);
				const re = {};
				n & 4096 && (re.$$scope = { dirty: n, ctx: d }), O.$set(re);
			},
			i(d) {
				_e ||
					(z(r.$$.fragment, d),
					z(I.$$.fragment, d),
					z(A.$$.fragment, d),
					z(M.$$.fragment, d),
					z(P.$$.fragment, d),
					z(C.$$.fragment, d),
					z(O.$$.fragment, d),
					(_e = !0));
			},
			o(d) {
				Q(r.$$.fragment, d),
					Q(I.$$.fragment, d),
					Q(A.$$.fragment, d),
					Q(M.$$.fragment, d),
					Q(P.$$.fragment, d),
					Q(C.$$.fragment, d),
					Q(O.$$.fragment, d),
					(_e = !1);
			},
			d(d) {
				X(r, d), d && f(s), d && f(t), X(I), X(A), X(M), X(P), X(C), X(O);
			}
		}
	);
}
let it = null,
	ct = null;
function Ht(u, r, s) {
	let t;
	ot(at, 'tags');
	let e = [];
	[...ot(at, 'category').filter((b) => b.value !== '')];
	let c = null,
		m = 'stars_desc',
		h = { value: 'stars_desc', label: 'Stars Desc' };
	Tt(() => {
		Ut(Lt('npm'), It(), 'packageManager');
	});
	const y = (b, k) => b.filter((q) => k.includes(q));
	return (
		(u.$$.update = () => {
			u.$$.dirty & 7 &&
				s(
					3,
					(t = at
						.filter((b) =>
							e.length === 0 && c === null
								? !0
								: !((e.length > 0 && y(e, b.tags).length === 0) || (c !== null && b.category !== c))
						)
						.sort(Vt(m)))
				),
				u.$$.dirty & 8 && ot(t, 'category');
		}),
		s(2, (m = (h == null ? void 0 : h.value) || 'stars_desc')),
		s(1, (c = (ct == null ? void 0 : ct.value) || null)),
		s(0, (e = (it == null ? void 0 : it.map((b) => b.value)) || [])),
		[e, c, m, t]
	);
}
class Qt extends Et {
	constructor(r) {
		super(), Rt(this, r, Ht, Nt, kt, {});
	}
}
export { Qt as default };
