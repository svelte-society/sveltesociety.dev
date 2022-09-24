import {
	S as Je,
	i as je,
	s as Ye,
	v as x,
	a as b,
	k as n,
	q as p,
	w as z,
	c as _,
	l as a,
	m as g,
	r as v,
	h as f,
	n as i,
	B as V,
	p as q,
	x as Q,
	b as E,
	C as r,
	f as W,
	t as X,
	y as Z,
	o as Ke,
	A as at
} from '../../../chunks/index-2fad9c0c.js';
import { w as xe } from '../../../chunks/singletons-caad9685.js';
import { c as Be } from '../../../chunks/components-9abf80d5.js';
import { c as ze } from '../../../chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js';
import { e as ke } from '../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as Qe } from '../../../chunks/Seo-66e26ba0.js';
import { L as nt } from '../../../chunks/Link-2f41dbb7.js';
import '../../../chunks/stores-06ab42d9.js';
var We = {};
(function (u) {
	(u.defaults = {}),
		(u.set = function (l, o, t) {
			var e = t || {},
				c = u.defaults,
				d = e.expires || c.expires,
				m = e.domain || c.domain,
				y = e.path !== void 0 ? e.path : c.path !== void 0 ? c.path : '/',
				w = e.secure !== void 0 ? e.secure : c.secure,
				A = e.httponly !== void 0 ? e.httponly : c.httponly,
				P = e.samesite !== void 0 ? e.samesite : c.samesite,
				G = d ? new Date(typeof d == 'number' ? new Date().getTime() + d * 864e5 : d) : 0;
			document.cookie =
				l
					.replace(/[^+#$&^`|]/g, encodeURIComponent)
					.replace('(', '%28')
					.replace(')', '%29') +
				'=' +
				o.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
				(G && G.getTime() >= 0 ? ';expires=' + G.toUTCString() : '') +
				(m ? ';domain=' + m : '') +
				(y ? ';path=' + y : '') +
				(w ? ';secure' : '') +
				(A ? ';httponly' : '') +
				(P ? ';samesite=' + P : '');
		}),
		(u.get = function (l) {
			for (var o = document.cookie.split(';'); o.length; ) {
				var t = o.pop(),
					e = t.indexOf('=');
				e = e < 0 ? t.length : e;
				var c = decodeURIComponent(t.slice(0, e).replace(/^\s+/, ''));
				if (c === l) return decodeURIComponent(t.slice(e + 1));
			}
			return null;
		}),
		(u.erase = function (l, o) {
			u.set(l, '', {
				expires: -1,
				domain: o && o.domain,
				path: o && o.path,
				secure: 0,
				httponly: 0
			});
		}),
		(u.all = function () {
			for (var l = {}, o = document.cookie.split(';'); o.length; ) {
				var t = o.pop(),
					e = t.indexOf('=');
				e = e < 0 ? t.length : e;
				var c = decodeURIComponent(t.slice(0, e).replace(/^\s+/, ''));
				l[c] = decodeURIComponent(t.slice(e + 1));
			}
			return l;
		});
})(We);
function Xe(u, l, o) {
	const t = l.getValue(o);
	return (
		t !== null && u.set(t),
		l.addListener &&
			l.addListener(o, (e) => {
				u.set(e);
			}),
		u.subscribe((e) => {
			l.setValue(o, e);
		}),
		Object.assign(Object.assign({}, u), {
			delete() {
				l.deleteValue(o);
			}
		})
	);
}
function Ze(u, l = !1) {
	const o = [],
		t = (d) => {
			const m = d.key;
			d.storageArea === u &&
				o
					.filter(({ key: y }) => y === m)
					.forEach(({ listener: y }) => {
						let w = d.newValue;
						try {
							w = JSON.parse(d.newValue);
						} catch {}
						y(w);
					});
		},
		e = () => {
			l &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.addEventListener) &&
				window.addEventListener('storage', t);
		},
		c = () => {
			l &&
				typeof window < 'u' &&
				(window == null ? void 0 : window.removeEventListener) &&
				window.removeEventListener('storage', t);
		};
	return {
		addListener(d, m) {
			o.push({ key: d, listener: m }), o.length === 1 && e();
		},
		removeListener(d, m) {
			const y = o.indexOf({ key: d, listener: m });
			y !== -1 && o.splice(y, 1), o.length === 0 && c();
		},
		getValue(d) {
			let m = u.getItem(d);
			if (m != null)
				try {
					m = JSON.parse(m);
				} catch {}
			return m;
		},
		deleteValue(d) {
			u.removeItem(d);
		},
		setValue(d, m) {
			u.setItem(d, JSON.stringify(m));
		}
	};
}
function tr(u = !1) {
	return typeof window < 'u' && (window == null ? void 0 : window.localStorage)
		? Ze(window.localStorage, u)
		: (console.warn('Unable to find the localStorage. No data will be persisted.'), er());
}
function er() {
	return {
		getValue() {
			return null;
		},
		deleteValue() {},
		setValue() {}
	};
}
function rr(u) {
	let l, o, t;
	return {
		c() {
			(l = n('img')),
				(t = p(`
				Discord`)),
				this.h();
		},
		l(e) {
			(l = a(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Discord`
				)),
				this.h();
		},
		h() {
			V(l.src, (o = 'images/discord.svg')) || i(l, 'src', o),
				i(l, 'alt', ''),
				i(l, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			E(e, l, c), E(e, t, c);
		},
		p: at,
		d(e) {
			e && f(l), e && f(t);
		}
	};
}
function lr(u) {
	let l, o, t;
	return {
		c() {
			(l = n('img')),
				(t = p(`
				YouTube`)),
				this.h();
		},
		l(e) {
			(l = a(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				YouTube`
				)),
				this.h();
		},
		h() {
			V(l.src, (o = 'images/youtube.svg')) || i(l, 'src', o),
				i(l, 'alt', ''),
				i(l, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			E(e, l, c), E(e, t, c);
		},
		p: at,
		d(e) {
			e && f(l), e && f(t);
		}
	};
}
function sr(u) {
	let l, o, t;
	return {
		c() {
			(l = n('img')),
				(t = p(`
				Twitter`)),
				this.h();
		},
		l(e) {
			(l = a(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Twitter`
				)),
				this.h();
		},
		h() {
			V(l.src, (o = 'images/twitter.svg')) || i(l, 'src', o),
				i(l, 'alt', ''),
				i(l, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			E(e, l, c), E(e, t, c);
		},
		p: at,
		d(e) {
			e && f(l), e && f(t);
		}
	};
}
function nr(u) {
	let l, o, t;
	return {
		c() {
			(l = n('img')),
				(t = p(`
				Newsletter`)),
				this.h();
		},
		l(e) {
			(l = a(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Newsletter`
				)),
				this.h();
		},
		h() {
			V(l.src, (o = 'images/newsletter.svg')) || i(l, 'src', o),
				i(l, 'alt', ''),
				i(l, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			E(e, l, c), E(e, t, c);
		},
		p: at,
		d(e) {
			e && f(l), e && f(t);
		}
	};
}
function ar(u) {
	let l, o, t;
	return {
		c() {
			(l = n('img')),
				(t = p(`
				Reddit`)),
				this.h();
		},
		l(e) {
			(l = a(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Reddit`
				)),
				this.h();
		},
		h() {
			V(l.src, (o = 'images/reddit.svg')) || i(l, 'src', o),
				i(l, 'alt', ''),
				i(l, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			E(e, l, c), E(e, t, c);
		},
		p: at,
		d(e) {
			e && f(l), e && f(t);
		}
	};
}
function or(u) {
	let l, o, t;
	return {
		c() {
			(l = n('img')),
				(t = p(`
				Podcast`)),
				this.h();
		},
		l(e) {
			(l = a(e, 'IMG', { src: !0, alt: !0, class: !0 })),
				(t = v(
					e,
					`
				Podcast`
				)),
				this.h();
		},
		h() {
			V(l.src, (o = 'images/radio.svg')) || i(l, 'src', o),
				i(l, 'alt', ''),
				i(l, 'class', 'svelte-cqh5c8');
		},
		m(e, c) {
			E(e, l, c), E(e, t, c);
		},
		p: at,
		d(e) {
			e && f(l), e && f(t);
		}
	};
}
function ir(u) {
	let l,
		o,
		t,
		e,
		c,
		d,
		m,
		y,
		w,
		A,
		P,
		G,
		wt,
		yt,
		Rt,
		N,
		Et,
		Bt,
		kt,
		Tt,
		Vt,
		Lt,
		qt,
		At,
		H,
		Pt,
		Dt,
		Mt,
		It,
		St,
		F,
		Ut,
		Ct,
		Ot,
		Gt,
		Nt,
		tt,
		Ht,
		Ft,
		Jt,
		et,
		jt,
		Yt,
		Kt,
		ot,
		xt,
		zt,
		it,
		Qt,
		Wt,
		B,
		L,
		Le,
		Xt,
		ct,
		Zt,
		te,
		ut,
		ee,
		re,
		J,
		le,
		se,
		ft,
		ne,
		ae,
		oe,
		ie,
		ce,
		ht,
		ue,
		fe,
		$,
		k,
		D,
		he,
		M,
		de,
		I,
		me,
		T,
		S,
		pe,
		U,
		ve,
		C,
		ge,
		j,
		qe,
		be,
		dt,
		_e,
		$e,
		Y,
		Ae,
		we,
		mt,
		ye,
		Re,
		O,
		K,
		Pe,
		$t;
	return (
		(l = new Qe({ props: { title: 'RVLT Proposals' } })),
		(D = new nt({
			props: {
				path: 'https://discord.gg/wearecultdao',
				$$slots: { default: [rr] },
				$$scope: { ctx: u }
			}
		})),
		(M = new nt({
			props: {
				path: 'https://rumble.com/c/c-1902267',
				$$slots: { default: [lr] },
				$$scope: { ctx: u }
			}
		})),
		(I = new nt({
			props: {
				path: 'https://twitter.com/MrOmodulus',
				$$slots: { default: [sr] },
				$$scope: { ctx: u }
			}
		})),
		(S = new nt({
			props: { path: 'https://doc.cultdao.io/', $$slots: { default: [nr] }, $$scope: { ctx: u } }
		})),
		(U = new nt({
			props: {
				path: 'https://www.reddit.com/r/cultdao/',
				$$slots: { default: [ar] },
				$$scope: { ctx: u }
			}
		})),
		(C = new nt({
			props: { path: 'https://www.cultradio.com/', $$slots: { default: [or] }, $$scope: { ctx: u } }
		})),
		{
			c() {
				x(l.$$.fragment),
					(o = b()),
					(t = n('div')),
					(e = n('h2')),
					(c = p('Revolt 2 Earn')),
					(d = b()),
					(m = n('p')),
					(y = n('br')),
					(w = p(`
	
	
	Here you can earn money while doing valuable things. `)),
					(A = n('br')),
					(P = n('br')),
					(G = p(`
	
	Valuable things can be to provide education offerings to other people.`)),
					(wt = n('br')),
					(yt = n('br')),
					(Rt = p(`
	
	After you completed your work you can submit a link to your work as a 
	`)),
					(N = n('a')),
					(Et = p('revolt proposal')),
					(Bt = p('.')),
					(kt = n('br')),
					(Tt = n('br')),
					(Vt = p(`
	The community votes on each proposal deciding whether or not you receive a reward. `)),
					(Lt = n('br')),
					(qt = n('br')),
					(At = p(`

	The reward comes from the 
	`)),
					(H = n('a')),
					(Pt = p('Revolt 2 Earn')),
					(Dt = p(`
	treasury. `)),
					(Mt = n('br')),
					(It = n('br')),
					(St = p(` 
	The Revolt 2 Earn treasury is automatically filled by everyone who buys, sells or transfers
	`)),
					(F = n('a')),
					(Ut = p('RVLT')),
					(Ct = p('. ')),
					(Ot = n('br')),
					(Gt = n('br')),
					(Nt = p(`
	This is because 0.4% of each RVLT transaction goes to this treasury.

	`)),
					(tt = n('p')),
					(Ht = n('br')),
					(Ft = n('br')),
					(Jt = b()),
					(et = n('p')),
					(jt = n('br')),
					(Yt = n('br')),
					(Kt = b()),
					(ot = n('h2')),
					(xt = p('RVLT Tokenomics')),
					(zt = b()),
					(it = n('p')),
					(Qt = n('br')),
					(Wt = b()),
					(B = n('div')),
					(L = n('img')),
					(Xt = b()),
					(ct = n('h2')),
					(Zt = p('Acts of Revolt')),
					(te = b()),
					(ut = n('p')),
					(ee = n('br')),
					(re = p(`
	Feel free to submit your own
	`)),
					(J = n('a')),
					(le = p('Acts of Revolt')),
					(se = p(`.
	`)),
					(ft = n('p')),
					(ne = n('br')),
					(ae = p(`

	Reach out to us if you have any questions.
	

	`)),
					(oe = n('br')),
					(ie = n('br')),
					(ce = b()),
					(ht = n('p')),
					(ue = n('br')),
					(fe = b()),
					($ = n('article')),
					(k = n('ul')),
					x(D.$$.fragment),
					(he = b()),
					x(M.$$.fragment),
					(de = b()),
					x(I.$$.fragment),
					(me = b()),
					(T = n('ul')),
					x(S.$$.fragment),
					(pe = b()),
					x(U.$$.fragment),
					(ve = b()),
					x(C.$$.fragment),
					(ge = b()),
					(j = n('embed')),
					(be = b()),
					(dt = n('p')),
					(_e = n('br')),
					($e = b()),
					(Y = n('embed')),
					(we = b()),
					(mt = n('p')),
					(ye = n('br')),
					(Re = b()),
					(O = n('div')),
					(K = n('embed')),
					this.h();
			},
			l(h) {
				z(l.$$.fragment, h), (o = _(h)), (t = a(h, 'DIV', { class: !0 }));
				var s = g(t);
				e = a(s, 'H2', {});
				var pt = g(e);
				(c = v(pt, 'Revolt 2 Earn')), pt.forEach(f), (d = _(s)), (m = a(s, 'P', {}));
				var vt = g(m);
				(y = a(vt, 'BR', {})),
					vt.forEach(f),
					(w = v(
						s,
						`
	
	
	Here you can earn money while doing valuable things. `
					)),
					(A = a(s, 'BR', {})),
					(P = a(s, 'BR', {})),
					(G = v(
						s,
						`
	
	Valuable things can be to provide education offerings to other people.`
					)),
					(wt = a(s, 'BR', {})),
					(yt = a(s, 'BR', {})),
					(Rt = v(
						s,
						`
	
	After you completed your work you can submit a link to your work as a 
	`
					)),
					(N = a(s, 'A', { href: !0, target: !0 }));
				var gt = g(N);
				(Et = v(gt, 'revolt proposal')),
					gt.forEach(f),
					(Bt = v(s, '.')),
					(kt = a(s, 'BR', {})),
					(Tt = a(s, 'BR', {})),
					(Vt = v(
						s,
						`
	The community votes on each proposal deciding whether or not you receive a reward. `
					)),
					(Lt = a(s, 'BR', {})),
					(qt = a(s, 'BR', {})),
					(At = v(
						s,
						`

	The reward comes from the 
	`
					)),
					(H = a(s, 'A', { href: !0, target: !0 }));
				var bt = g(H);
				(Pt = v(bt, 'Revolt 2 Earn')),
					bt.forEach(f),
					(Dt = v(
						s,
						`
	treasury. `
					)),
					(Mt = a(s, 'BR', {})),
					(It = a(s, 'BR', {})),
					(St = v(
						s,
						` 
	The Revolt 2 Earn treasury is automatically filled by everyone who buys, sells or transfers
	`
					)),
					(F = a(s, 'A', { href: !0, target: !0 }));
				var _t = g(F);
				(Ut = v(_t, 'RVLT')),
					_t.forEach(f),
					(Ct = v(s, '. ')),
					(Ot = a(s, 'BR', {})),
					(Gt = a(s, 'BR', {})),
					(Nt = v(
						s,
						`
	This is because 0.4% of each RVLT transaction goes to this treasury.

	`
					)),
					(tt = a(s, 'P', {}));
				var rt = g(tt);
				(Ht = a(rt, 'BR', {})),
					(Ft = a(rt, 'BR', {})),
					rt.forEach(f),
					(Jt = _(s)),
					(et = a(s, 'P', {}));
				var Ee = g(et);
				(jt = a(Ee, 'BR', {})),
					(Yt = a(Ee, 'BR', {})),
					Ee.forEach(f),
					(Kt = _(s)),
					(ot = a(s, 'H2', {}));
				var De = g(ot);
				(xt = v(De, 'RVLT Tokenomics')), De.forEach(f), (zt = _(s)), (it = a(s, 'P', {}));
				var Me = g(it);
				(Qt = a(Me, 'BR', {})),
					Me.forEach(f),
					(Wt = _(s)),
					(B = a(s, 'DIV', { class: !0, style: !0 }));
				var Ie = g(B);
				(L = a(Ie, 'IMG', { src: !0, alt: !0, style: !0, class: !0 })),
					Ie.forEach(f),
					(Xt = _(s)),
					(ct = a(s, 'H2', {}));
				var Se = g(ct);
				(Zt = v(Se, 'Acts of Revolt')), Se.forEach(f), (te = _(s)), (ut = a(s, 'P', {}));
				var Ue = g(ut);
				(ee = a(Ue, 'BR', {})),
					Ue.forEach(f),
					(re = v(
						s,
						`
	Feel free to submit your own
	`
					)),
					(J = a(s, 'A', { href: !0, target: !0 }));
				var Ce = g(J);
				(le = v(Ce, 'Acts of Revolt')),
					Ce.forEach(f),
					(se = v(
						s,
						`.
	`
					)),
					(ft = a(s, 'P', {}));
				var Oe = g(ft);
				(ne = a(Oe, 'BR', {})),
					Oe.forEach(f),
					(ae = v(
						s,
						`

	Reach out to us if you have any questions.
	

	`
					)),
					(oe = a(s, 'BR', {})),
					(ie = a(s, 'BR', {})),
					(ce = _(s)),
					(ht = a(s, 'P', {}));
				var Ge = g(ht);
				(ue = a(Ge, 'BR', {})), Ge.forEach(f), (fe = _(s)), ($ = a(s, 'ARTICLE', { class: !0 }));
				var R = g($);
				k = a(R, 'UL', { class: !0 });
				var lt = g(k);
				z(D.$$.fragment, lt),
					(he = _(lt)),
					z(M.$$.fragment, lt),
					(de = _(lt)),
					z(I.$$.fragment, lt),
					lt.forEach(f),
					(me = _(R)),
					(T = a(R, 'UL', { class: !0 }));
				var st = g(T);
				z(S.$$.fragment, st),
					(pe = _(st)),
					z(U.$$.fragment, st),
					(ve = _(st)),
					z(C.$$.fragment, st),
					st.forEach(f),
					(ge = _(R)),
					(j = a(R, 'EMBED', { src: !0, width: !0, height: !0 })),
					(be = _(R)),
					(dt = a(R, 'P', {}));
				var Ne = g(dt);
				(_e = a(Ne, 'BR', {})),
					Ne.forEach(f),
					($e = _(R)),
					(Y = a(R, 'EMBED', { src: !0, width: !0, height: !0 })),
					(we = _(R)),
					(mt = a(R, 'P', {}));
				var He = g(mt);
				(ye = a(He, 'BR', {})), He.forEach(f), (Re = _(R)), (O = a(R, 'DIV', { style: !0 }));
				var Fe = g(O);
				(K = a(Fe, 'EMBED', { src: !0, width: !0, height: !0 })),
					Fe.forEach(f),
					R.forEach(f),
					s.forEach(f),
					this.h();
			},
			h() {
				i(N, 'href', 'https://revolt.cultdao.io/submitProposal'),
					i(N, 'target', '_blank'),
					i(H, 'href', 'https://cultdao.io/rvlt.pdf'),
					i(H, 'target', '_blank'),
					i(F, 'href', 'https://coinmarketcap.com/currencies/revolt-2-earn/'),
					i(F, 'target', '_blank'),
					V(L.src, (Le = '/images/revolt-2-earn-tokenomics.png')) || i(L, 'src', Le),
					i(L, 'alt', ''),
					q(L, 'width', '100%'),
					q(L, 'text-align', 'center'),
					i(L, 'class', 'svelte-cqh5c8'),
					i(B, 'class', 'text-center'),
					q(B, 'width', '100%'),
					q(B, 'margin-left', 'auto'),
					q(B, 'margin-right', 'auto'),
					q(B, 'margin-bottom', '10vh'),
					i(J, 'href', 'https://revolt.cultdao.io/submitProposal'),
					i(J, 'target', '_blank'),
					i(k, 'class', 'svelte-cqh5c8'),
					i(T, 'class', 'svelte-cqh5c8'),
					V(
						j.src,
						(qe = 'https://dune.com/embeds/1279330/2192235/161e3edb-480c-451b-835f-078db00181e3')
					) || i(j, 'src', qe),
					i(j, 'width', '100%'),
					i(j, 'height', '700'),
					V(
						Y.src,
						(Ae = 'https://dune.com/embeds/1279317/2192218/6c162b5d-c755-4122-8596-cb70b3e0b254')
					) || i(Y, 'src', Ae),
					i(Y, 'width', '100%'),
					i(Y, 'height', '200'),
					V(
						K.src,
						(Pe = 'https://dune.com/embeds/1279379/2192339/a875789e-a062-49cb-9dfe-56ccf806d722')
					) || i(K, 'src', Pe),
					i(K, 'width', '100%'),
					i(K, 'height', '200'),
					q(O, 'margin-left', 'auto'),
					q(O, 'margin-right', 'auto'),
					q(O, 'width', '50vw'),
					i($, 'class', 'container svelte-cqh5c8'),
					i(t, 'class', 'text-center');
			},
			m(h, s) {
				Q(l, h, s),
					E(h, o, s),
					E(h, t, s),
					r(t, e),
					r(e, c),
					r(t, d),
					r(t, m),
					r(m, y),
					r(t, w),
					r(t, A),
					r(t, P),
					r(t, G),
					r(t, wt),
					r(t, yt),
					r(t, Rt),
					r(t, N),
					r(N, Et),
					r(t, Bt),
					r(t, kt),
					r(t, Tt),
					r(t, Vt),
					r(t, Lt),
					r(t, qt),
					r(t, At),
					r(t, H),
					r(H, Pt),
					r(t, Dt),
					r(t, Mt),
					r(t, It),
					r(t, St),
					r(t, F),
					r(F, Ut),
					r(t, Ct),
					r(t, Ot),
					r(t, Gt),
					r(t, Nt),
					r(t, tt),
					r(tt, Ht),
					r(tt, Ft),
					r(t, Jt),
					r(t, et),
					r(et, jt),
					r(et, Yt),
					r(t, Kt),
					r(t, ot),
					r(ot, xt),
					r(t, zt),
					r(t, it),
					r(it, Qt),
					r(t, Wt),
					r(t, B),
					r(B, L),
					r(t, Xt),
					r(t, ct),
					r(ct, Zt),
					r(t, te),
					r(t, ut),
					r(ut, ee),
					r(t, re),
					r(t, J),
					r(J, le),
					r(t, se),
					r(t, ft),
					r(ft, ne),
					r(t, ae),
					r(t, oe),
					r(t, ie),
					r(t, ce),
					r(t, ht),
					r(ht, ue),
					r(t, fe),
					r(t, $),
					r($, k),
					Q(D, k, null),
					r(k, he),
					Q(M, k, null),
					r(k, de),
					Q(I, k, null),
					r($, me),
					r($, T),
					Q(S, T, null),
					r(T, pe),
					Q(U, T, null),
					r(T, ve),
					Q(C, T, null),
					r($, ge),
					r($, j),
					r($, be),
					r($, dt),
					r(dt, _e),
					r($, $e),
					r($, Y),
					r($, we),
					r($, mt),
					r(mt, ye),
					r($, Re),
					r($, O),
					r(O, K),
					($t = !0);
			},
			p(h, [s]) {
				const pt = {};
				s & 4096 && (pt.$$scope = { dirty: s, ctx: h }), D.$set(pt);
				const vt = {};
				s & 4096 && (vt.$$scope = { dirty: s, ctx: h }), M.$set(vt);
				const gt = {};
				s & 4096 && (gt.$$scope = { dirty: s, ctx: h }), I.$set(gt);
				const bt = {};
				s & 4096 && (bt.$$scope = { dirty: s, ctx: h }), S.$set(bt);
				const _t = {};
				s & 4096 && (_t.$$scope = { dirty: s, ctx: h }), U.$set(_t);
				const rt = {};
				s & 4096 && (rt.$$scope = { dirty: s, ctx: h }), C.$set(rt);
			},
			i(h) {
				$t ||
					(W(l.$$.fragment, h),
					W(D.$$.fragment, h),
					W(M.$$.fragment, h),
					W(I.$$.fragment, h),
					W(S.$$.fragment, h),
					W(U.$$.fragment, h),
					W(C.$$.fragment, h),
					($t = !0));
			},
			o(h) {
				X(l.$$.fragment, h),
					X(D.$$.fragment, h),
					X(M.$$.fragment, h),
					X(I.$$.fragment, h),
					X(S.$$.fragment, h),
					X(U.$$.fragment, h),
					X(C.$$.fragment, h),
					($t = !1);
			},
			d(h) {
				Z(l, h), h && f(o), h && f(t), Z(D), Z(M), Z(I), Z(S), Z(U), Z(C);
			}
		}
	);
}
let Te = null,
	Ve = null;
function cr(u, l, o) {
	let t;
	ke(Be, 'tags');
	let e = [];
	[...ke(Be, 'category').filter((w) => w.value !== '')];
	let c = null,
		d = 'stars_desc',
		m = { value: 'stars_desc', label: 'Stars Desc' };
	Ke(() => {
		Xe(xe('npm'), tr(), 'packageManager');
	});
	const y = (w, A) => w.filter((P) => A.includes(P));
	return (
		(u.$$.update = () => {
			u.$$.dirty & 7 &&
				o(
					3,
					(t = Be.filter((w) =>
						e.length === 0 && c === null
							? !0
							: !((e.length > 0 && y(e, w.tags).length === 0) || (c !== null && w.category !== c))
					).sort(ze(d)))
				),
				u.$$.dirty & 8 && ke(t, 'category');
		}),
		o(2, (d = (m == null ? void 0 : m.value) || 'stars_desc')),
		o(1, (c = (Ve == null ? void 0 : Ve.value) || null)),
		o(0, (e = (Te == null ? void 0 : Te.map((w) => w.value)) || [])),
		[e, c, d, t]
	);
}
class br extends Je {
	constructor(l) {
		super(), je(this, l, cr, ir, Ye, {});
	}
}
export { br as default };
