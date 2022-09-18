import {
	S as Fs,
	i as Qs,
	s as Xs,
	R as ds,
	T as hs,
	v as dt,
	a as v,
	k as a,
	q as p,
	w as ht,
	c as f,
	l as r,
	m as o,
	r as u,
	h as s,
	n as l,
	x as bt,
	b as h,
	C as t,
	U as j,
	V as Pe,
	W as bs,
	u as _s,
	f as _t,
	t as mt,
	y as Et,
	X as Zs,
	o as Ks,
	z as xs
} from '../../../../chunks/index-2fad9c0c.js';
import { S as ms, c as el } from '../../../../chunks/Select-8360dfd8.js';
import { c as Ms } from '../../../../chunks/components-9abf80d5.js';
import { c as yt } from '../../../../chunks/cultproposals-ee6a2386.js';
import { e as Ce } from '../../../../chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js';
import { S as tl } from '../../../../chunks/Seo-4c1a3500.js';
import '../../../../chunks/stores-fe9ed232.js';
import '../../../../chunks/singletons-90aa6b4a.js';
function sl(n) {
	let m,
		c,
		w,
		q,
		pe,
		B,
		G,
		ue,
		I,
		Ve,
		E,
		T,
		W,
		$,
		y,
		D,
		S,
		A,
		Ee,
		d,
		L,
		R,
		Oe,
		Ue,
		P,
		g,
		je,
		b,
		z,
		wt,
		Tt,
		F,
		ve,
		St,
		At,
		Q,
		N,
		Nt,
		ye,
		It,
		Dt,
		X,
		fe,
		Lt,
		Pt,
		Z,
		k,
		Ct,
		ge,
		Vt,
		Ot,
		K,
		ce,
		Ut,
		jt,
		x,
		C,
		qt,
		we,
		Bt,
		$t,
		ee,
		de,
		Rt,
		kt,
		te,
		V,
		Jt,
		Te,
		Ht,
		Mt,
		se,
		he,
		Yt,
		Gt,
		le,
		O,
		Wt,
		Se,
		zt,
		Ft,
		ae,
		be,
		Qt,
		Xt,
		re,
		J,
		Zt,
		Kt,
		Ae,
		xt,
		es,
		ne,
		_e,
		ts,
		ss,
		oe,
		H,
		ls,
		as,
		Ne,
		rs,
		ke,
		Ie,
		ns,
		Je,
		U,
		os,
		qe = JSON.stringify(n[11], null, '	') + '',
		He,
		me,
		Be = n[8] ? 'Copied' : 'Copy',
		Me,
		is,
		Ye,
		Ge,
		We,
		M,
		ze,
		ps,
		Fe,
		Qe,
		ie,
		us,
		Xe,
		Ze,
		Y,
		vs,
		Es;
	m = new tl({ props: { title: 'Submit component' } });
	function Gs(e) {
		n[16](e);
	}
	let ys = { id: 'type', items: n[13], isClearable: !1, showIndicator: !0 };
	n[0] !== void 0 && (ys.value = n[0]),
		(g = new ms({ props: ys })),
		ds.push(() => hs(g, 'value', Gs)),
		g.$on('select', n[15]);
	function Ws(e) {
		n[22](e);
	}
	let gs = { id: 'category', items: n[9], isClearable: !1, showIndicator: !0 };
	n[6] !== void 0 && (gs.value = n[6]),
		(J = new ms({ props: gs })),
		ds.push(() => hs(J, 'value', Ws));
	function zs(e) {
		n[23](e);
	}
	let ws = { id: 'category', items: n[10], showIndicator: !0, isMulti: !0 };
	return (
		n[7] !== void 0 && (ws.value = n[7]),
		(H = new ms({ props: ws })),
		ds.push(() => hs(H, 'value', zs)),
		{
			c() {
				dt(m.$$.fragment),
					(c = v()),
					(w = a('h1')),
					(q = p('Submitting a new component')),
					(pe = v()),
					(B = a('p')),
					(G = p(`To add a new component on the website, the process is rather simple. You have to add a snippet in
	the appropriate file.`)),
					(ue = v()),
					(I = a('h2')),
					(Ve = p('Generating file contents snippet')),
					(E = v()),
					(T = a('p')),
					(W = p(
						'Each component is represented by a JSON Object. Use the generator below to generate the Object.'
					)),
					($ = v()),
					(y = a('p')),
					(D = a('code')),
					(S = p('*')),
					(A = p(' marked fields are required')),
					(Ee = v()),
					(d = a('div')),
					(L = a('div')),
					(R = a('label')),
					(Oe = p('Type:')),
					(Ue = v()),
					(P = a('div')),
					dt(g.$$.fragment),
					(b = v()),
					(z = a('span')),
					(wt = p('The type of snippet to generate')),
					(Tt = v()),
					(F = a('div')),
					(ve = a('label')),
					(St = p('Title:')),
					(At = v()),
					(Q = a('div')),
					(N = a('input')),
					(Nt = v()),
					(ye = a('span')),
					(It = p('Name of the component')),
					(Dt = v()),
					(X = a('div')),
					(fe = a('label')),
					(Lt = p('URL:')),
					(Pt = v()),
					(Z = a('div')),
					(k = a('input')),
					(Ct = v()),
					(ge = a('span')),
					(Vt = p('The URL where to find it')),
					(Ot = v()),
					(K = a('div')),
					(ce = a('label')),
					(Ut = p('Description:')),
					(jt = v()),
					(x = a('div')),
					(C = a('input')),
					(qt = v()),
					(we = a('span')),
					(Bt = p('A short description of the component')),
					($t = v()),
					(ee = a('div')),
					(de = a('label')),
					(Rt = p('NPM:')),
					(kt = v()),
					(te = a('div')),
					(V = a('input')),
					(Jt = v()),
					(Te = a('span')),
					(Ht = p('The npm name of the component')),
					(Mt = v()),
					(se = a('div')),
					(he = a('label')),
					(Yt = p('Added On:')),
					(Gt = v()),
					(le = a('div')),
					(O = a('input')),
					(Wt = v()),
					(Se = a('span')),
					(zt = p(
						'The date when the component have been added on the website (generally it\u2019s today)'
					)),
					(Ft = v()),
					(ae = a('div')),
					(be = a('label')),
					(Qt = p('Category:')),
					(Xt = v()),
					(re = a('div')),
					dt(J.$$.fragment),
					(Kt = v()),
					(Ae = a('span')),
					(xt = p('The category of the component')),
					(es = v()),
					(ne = a('div')),
					(_e = a('label')),
					(ts = p('Tags:')),
					(ss = v()),
					(oe = a('div')),
					dt(H.$$.fragment),
					(as = v()),
					(Ne = a('span')),
					(rs = p('A list of tags')),
					(ke = v()),
					(Ie = a('h2')),
					(ns = p('JSON Snippet')),
					(Je = v()),
					(U = a('pre')),
					(os = p('')),
					(He = p(qe)),
					(me = a('button')),
					(Me = p(Be)),
					(is = p(`
`)),
					(Ye = v()),
					(Ge = a('br')),
					(We = p(`
Copy this snippet and add it to
`)),
					(M = a('a')),
					(ze = p(n[12])),
					(ps = p('.json')),
					(Qe = p(`. You can
propose your changes
`)),
					(ie = a('a')),
					(us = p('directly in GitHub')),
					(Ze = p('.')),
					this.h();
			},
			l(e) {
				ht(m.$$.fragment, e), (c = f(e)), (w = r(e, 'H1', {}));
				var i = o(w);
				(q = u(i, 'Submitting a new component')), i.forEach(s), (pe = f(e)), (B = r(e, 'P', {}));
				var $e = o(B);
				(G = u(
					$e,
					`To add a new component on the website, the process is rather simple. You have to add a snippet in
	the appropriate file.`
				)),
					$e.forEach(s),
					(ue = f(e)),
					(I = r(e, 'H2', {}));
				var De = o(I);
				(Ve = u(De, 'Generating file contents snippet')),
					De.forEach(s),
					(E = f(e)),
					(T = r(e, 'P', {}));
				var Le = o(T);
				(W = u(
					Le,
					'Each component is represented by a JSON Object. Use the generator below to generate the Object.'
				)),
					Le.forEach(s),
					($ = f(e)),
					(y = r(e, 'P', {}));
				var fs = o(y);
				D = r(fs, 'CODE', {});
				var Ts = o(D);
				(S = u(Ts, '*')),
					Ts.forEach(s),
					(A = u(fs, ' marked fields are required')),
					fs.forEach(s),
					(Ee = f(e)),
					(d = r(e, 'DIV', { class: !0 }));
				var _ = o(d);
				L = r(_, 'DIV', { class: !0 });
				var Ke = o(L);
				R = r(Ke, 'LABEL', { for: !0, class: !0 });
				var Ss = o(R);
				(Oe = u(Ss, 'Type:')), Ss.forEach(s), (Ue = f(Ke)), (P = r(Ke, 'DIV', { class: !0 }));
				var xe = o(P);
				ht(g.$$.fragment, xe), (b = f(xe)), (z = r(xe, 'SPAN', { class: !0 }));
				var As = o(z);
				(wt = u(As, 'The type of snippet to generate')),
					As.forEach(s),
					xe.forEach(s),
					Ke.forEach(s),
					(Tt = f(_)),
					(F = r(_, 'DIV', { class: !0 }));
				var et = o(F);
				ve = r(et, 'LABEL', { for: !0, class: !0 });
				var Ns = o(ve);
				(St = u(Ns, 'Title:')), Ns.forEach(s), (At = f(et)), (Q = r(et, 'DIV', { class: !0 }));
				var tt = o(Q);
				(N = r(tt, 'INPUT', { id: !0, type: !0, class: !0 })),
					(Nt = f(tt)),
					(ye = r(tt, 'SPAN', { class: !0 }));
				var Is = o(ye);
				(It = u(Is, 'Name of the component')),
					Is.forEach(s),
					tt.forEach(s),
					et.forEach(s),
					(Dt = f(_)),
					(X = r(_, 'DIV', { class: !0 }));
				var st = o(X);
				fe = r(st, 'LABEL', { for: !0, class: !0 });
				var Ds = o(fe);
				(Lt = u(Ds, 'URL:')), Ds.forEach(s), (Pt = f(st)), (Z = r(st, 'DIV', { class: !0 }));
				var lt = o(Z);
				(k = r(lt, 'INPUT', { id: !0, type: !0, class: !0 })),
					(Ct = f(lt)),
					(ge = r(lt, 'SPAN', { class: !0 }));
				var Ls = o(ge);
				(Vt = u(Ls, 'The URL where to find it')),
					Ls.forEach(s),
					lt.forEach(s),
					st.forEach(s),
					(Ot = f(_)),
					(K = r(_, 'DIV', { class: !0 }));
				var at = o(K);
				ce = r(at, 'LABEL', { for: !0, class: !0 });
				var Ps = o(ce);
				(Ut = u(Ps, 'Description:')),
					Ps.forEach(s),
					(jt = f(at)),
					(x = r(at, 'DIV', { class: !0 }));
				var rt = o(x);
				(C = r(rt, 'INPUT', { id: !0, type: !0, class: !0 })),
					(qt = f(rt)),
					(we = r(rt, 'SPAN', { class: !0 }));
				var Cs = o(we);
				(Bt = u(Cs, 'A short description of the component')),
					Cs.forEach(s),
					rt.forEach(s),
					at.forEach(s),
					($t = f(_)),
					(ee = r(_, 'DIV', { class: !0 }));
				var nt = o(ee);
				de = r(nt, 'LABEL', { for: !0, class: !0 });
				var Vs = o(de);
				(Rt = u(Vs, 'NPM:')), Vs.forEach(s), (kt = f(nt)), (te = r(nt, 'DIV', { class: !0 }));
				var ot = o(te);
				(V = r(ot, 'INPUT', { id: !0, type: !0, class: !0 })),
					(Jt = f(ot)),
					(Te = r(ot, 'SPAN', { class: !0 }));
				var Os = o(Te);
				(Ht = u(Os, 'The npm name of the component')),
					Os.forEach(s),
					ot.forEach(s),
					nt.forEach(s),
					(Mt = f(_)),
					(se = r(_, 'DIV', { class: !0 }));
				var it = o(se);
				he = r(it, 'LABEL', { for: !0, class: !0 });
				var Us = o(he);
				(Yt = u(Us, 'Added On:')), Us.forEach(s), (Gt = f(it)), (le = r(it, 'DIV', { class: !0 }));
				var pt = o(le);
				(O = r(pt, 'INPUT', { id: !0, type: !0, class: !0 })),
					(Wt = f(pt)),
					(Se = r(pt, 'SPAN', { class: !0 }));
				var js = o(Se);
				(zt = u(
					js,
					'The date when the component have been added on the website (generally it\u2019s today)'
				)),
					js.forEach(s),
					pt.forEach(s),
					it.forEach(s),
					(Ft = f(_)),
					(ae = r(_, 'DIV', { class: !0 }));
				var ut = o(ae);
				be = r(ut, 'LABEL', { for: !0, class: !0 });
				var qs = o(be);
				(Qt = u(qs, 'Category:')), qs.forEach(s), (Xt = f(ut)), (re = r(ut, 'DIV', { class: !0 }));
				var vt = o(re);
				ht(J.$$.fragment, vt), (Kt = f(vt)), (Ae = r(vt, 'SPAN', { class: !0 }));
				var Bs = o(Ae);
				(xt = u(Bs, 'The category of the component')),
					Bs.forEach(s),
					vt.forEach(s),
					ut.forEach(s),
					(es = f(_)),
					(ne = r(_, 'DIV', { class: !0 }));
				var ft = o(ne);
				_e = r(ft, 'LABEL', { for: !0, class: !0 });
				var $s = o(_e);
				(ts = u($s, 'Tags:')), $s.forEach(s), (ss = f(ft)), (oe = r(ft, 'DIV', { class: !0 }));
				var ct = o(oe);
				ht(H.$$.fragment, ct), (as = f(ct)), (Ne = r(ct, 'SPAN', { class: !0 }));
				var Rs = o(Ne);
				(rs = u(Rs, 'A list of tags')),
					Rs.forEach(s),
					ct.forEach(s),
					ft.forEach(s),
					_.forEach(s),
					(ke = f(e)),
					(Ie = r(e, 'H2', {}));
				var ks = o(Ie);
				(ns = u(ks, 'JSON Snippet')), ks.forEach(s), (Je = f(e)), (U = r(e, 'PRE', { class: !0 }));
				var Re = o(U);
				(os = u(Re, '')), (He = u(Re, qe)), (me = r(Re, 'BUTTON', { class: !0 }));
				var Js = o(me);
				(Me = u(Js, Be)),
					Js.forEach(s),
					(is = u(
						Re,
						`
`
					)),
					Re.forEach(s),
					(Ye = f(e)),
					(Ge = r(e, 'BR', {})),
					(We = u(
						e,
						`
Copy this snippet and add it to
`
					)),
					(M = r(e, 'A', { href: !0 }));
				var cs = o(M);
				(ze = u(cs, n[12])),
					(ps = u(cs, '.json')),
					cs.forEach(s),
					(Qe = u(
						e,
						`. You can
propose your changes
`
					)),
					(ie = r(e, 'A', { href: !0 }));
				var Hs = o(ie);
				(us = u(Hs, 'directly in GitHub')), Hs.forEach(s), (Ze = u(e, '.')), this.h();
			},
			h() {
				l(R, 'for', 'type'),
					l(R, 'class', 'svelte-b3ver3'),
					l(z, 'class', 'input-helper svelte-b3ver3'),
					l(P, 'class', 'svelte-b3ver3'),
					l(L, 'class', 'input-wrapper svelte-b3ver3'),
					l(ve, 'for', 'title'),
					l(ve, 'class', 'required svelte-b3ver3'),
					l(N, 'id', 'title'),
					l(N, 'type', 'text'),
					(N.required = !0),
					l(N, 'class', 'svelte-b3ver3'),
					l(ye, 'class', 'input-helper svelte-b3ver3'),
					l(Q, 'class', 'svelte-b3ver3'),
					l(F, 'class', 'input-wrapper svelte-b3ver3'),
					l(fe, 'for', 'url'),
					l(fe, 'class', 'svelte-b3ver3'),
					l(k, 'id', 'url'),
					l(k, 'type', 'url'),
					l(k, 'class', 'svelte-b3ver3'),
					l(ge, 'class', 'input-helper svelte-b3ver3'),
					l(Z, 'class', 'svelte-b3ver3'),
					l(X, 'class', 'input-wrapper svelte-b3ver3'),
					l(ce, 'for', 'desc'),
					l(ce, 'class', 'svelte-b3ver3'),
					l(C, 'id', 'desc'),
					l(C, 'type', 'text'),
					l(C, 'class', 'svelte-b3ver3'),
					l(we, 'class', 'input-helper svelte-b3ver3'),
					l(x, 'class', 'svelte-b3ver3'),
					l(K, 'class', 'input-wrapper svelte-b3ver3'),
					l(de, 'for', 'npm'),
					l(de, 'class', 'svelte-b3ver3'),
					l(V, 'id', 'npm'),
					l(V, 'type', 'text'),
					l(V, 'class', 'svelte-b3ver3'),
					l(Te, 'class', 'input-helper svelte-b3ver3'),
					l(te, 'class', 'svelte-b3ver3'),
					l(ee, 'class', 'input-wrapper svelte-b3ver3'),
					l(he, 'for', 'adden-on'),
					l(he, 'class', 'required svelte-b3ver3'),
					l(O, 'id', 'adden-on'),
					l(O, 'type', 'date'),
					(O.required = !0),
					l(O, 'class', 'svelte-b3ver3'),
					l(Se, 'class', 'input-helper svelte-b3ver3'),
					l(le, 'class', 'svelte-b3ver3'),
					l(se, 'class', 'input-wrapper svelte-b3ver3'),
					l(be, 'for', 'category'),
					l(be, 'class', 'svelte-b3ver3'),
					l(Ae, 'class', 'input-helper svelte-b3ver3'),
					l(re, 'class', 'svelte-b3ver3'),
					l(ae, 'class', 'input-wrapper svelte-b3ver3'),
					l(_e, 'for', 'tags'),
					l(_e, 'class', 'required svelte-b3ver3'),
					l(Ne, 'class', 'input-helper svelte-b3ver3'),
					l(oe, 'class', 'svelte-b3ver3'),
					l(ne, 'class', 'input-wrapper svelte-b3ver3'),
					l(d, 'class', 'json-generator svelte-b3ver3'),
					l(me, 'class', 'svelte-b3ver3'),
					l(U, 'class', 'svelte-b3ver3'),
					l(M, 'href', (Fe = gt + '/blob/staging/src/routes/' + n[12] + '/' + n[12] + '.json')),
					l(ie, 'href', (Xe = gt + '/edit/staging/src/routes/' + n[12] + '/' + n[12] + '.json'));
			},
			m(e, i) {
				bt(m, e, i),
					h(e, c, i),
					h(e, w, i),
					t(w, q),
					h(e, pe, i),
					h(e, B, i),
					t(B, G),
					h(e, ue, i),
					h(e, I, i),
					t(I, Ve),
					h(e, E, i),
					h(e, T, i),
					t(T, W),
					h(e, $, i),
					h(e, y, i),
					t(y, D),
					t(D, S),
					t(y, A),
					h(e, Ee, i),
					h(e, d, i),
					t(d, L),
					t(L, R),
					t(R, Oe),
					t(L, Ue),
					t(L, P),
					bt(g, P, null),
					t(P, b),
					t(P, z),
					t(z, wt),
					t(d, Tt),
					t(d, F),
					t(F, ve),
					t(ve, St),
					t(F, At),
					t(F, Q),
					t(Q, N),
					j(N, n[1]),
					t(Q, Nt),
					t(Q, ye),
					t(ye, It),
					t(d, Dt),
					t(d, X),
					t(X, fe),
					t(fe, Lt),
					t(X, Pt),
					t(X, Z),
					t(Z, k),
					j(k, n[2]),
					t(Z, Ct),
					t(Z, ge),
					t(ge, Vt),
					t(d, Ot),
					t(d, K),
					t(K, ce),
					t(ce, Ut),
					t(K, jt),
					t(K, x),
					t(x, C),
					j(C, n[3]),
					t(x, qt),
					t(x, we),
					t(we, Bt),
					t(d, $t),
					t(d, ee),
					t(ee, de),
					t(de, Rt),
					t(ee, kt),
					t(ee, te),
					t(te, V),
					j(V, n[4]),
					t(te, Jt),
					t(te, Te),
					t(Te, Ht),
					t(d, Mt),
					t(d, se),
					t(se, he),
					t(he, Yt),
					t(se, Gt),
					t(se, le),
					t(le, O),
					j(O, n[5]),
					t(le, Wt),
					t(le, Se),
					t(Se, zt),
					t(d, Ft),
					t(d, ae),
					t(ae, be),
					t(be, Qt),
					t(ae, Xt),
					t(ae, re),
					bt(J, re, null),
					t(re, Kt),
					t(re, Ae),
					t(Ae, xt),
					t(d, es),
					t(d, ne),
					t(ne, _e),
					t(_e, ts),
					t(ne, ss),
					t(ne, oe),
					bt(H, oe, null),
					t(oe, as),
					t(oe, Ne),
					t(Ne, rs),
					h(e, ke, i),
					h(e, Ie, i),
					t(Ie, ns),
					h(e, Je, i),
					h(e, U, i),
					t(U, os),
					t(U, He),
					t(U, me),
					t(me, Me),
					t(U, is),
					h(e, Ye, i),
					h(e, Ge, i),
					h(e, We, i),
					h(e, M, i),
					t(M, ze),
					t(M, ps),
					h(e, Qe, i),
					h(e, ie, i),
					t(ie, us),
					h(e, Ze, i),
					(Y = !0),
					vs ||
						((Es = [
							Pe(N, 'input', n[17]),
							Pe(k, 'input', n[18]),
							Pe(C, 'input', n[19]),
							Pe(V, 'input', n[20]),
							Pe(O, 'input', n[21]),
							Pe(me, 'click', n[14])
						]),
						(vs = !0));
			},
			p(e, [i]) {
				const $e = {};
				!je && i & 1 && ((je = !0), ($e.value = e[0]), bs(() => (je = !1))),
					g.$set($e),
					i & 2 && N.value !== e[1] && j(N, e[1]),
					i & 4 && j(k, e[2]),
					i & 8 && C.value !== e[3] && j(C, e[3]),
					i & 16 && V.value !== e[4] && j(V, e[4]),
					i & 32 && j(O, e[5]);
				const De = {};
				i & 512 && (De.items = e[9]),
					!Zt && i & 64 && ((Zt = !0), (De.value = e[6]), bs(() => (Zt = !1))),
					J.$set(De);
				const Le = {};
				i & 1024 && (Le.items = e[10]),
					!ls && i & 128 && ((ls = !0), (Le.value = e[7]), bs(() => (ls = !1))),
					H.$set(Le),
					(!Y || i & 2048) && qe !== (qe = JSON.stringify(e[11], null, '	') + '') && _s(He, qe),
					(!Y || i & 256) && Be !== (Be = e[8] ? 'Copied' : 'Copy') && _s(Me, Be),
					(!Y || i & 4096) && _s(ze, e[12]),
					(!Y ||
						(i & 4096 &&
							Fe !== (Fe = gt + '/blob/staging/src/routes/' + e[12] + '/' + e[12] + '.json'))) &&
						l(M, 'href', Fe),
					(!Y ||
						(i & 4096 &&
							Xe !== (Xe = gt + '/edit/staging/src/routes/' + e[12] + '/' + e[12] + '.json'))) &&
						l(ie, 'href', Xe);
			},
			i(e) {
				Y ||
					(_t(m.$$.fragment, e),
					_t(g.$$.fragment, e),
					_t(J.$$.fragment, e),
					_t(H.$$.fragment, e),
					(Y = !0));
			},
			o(e) {
				mt(m.$$.fragment, e),
					mt(g.$$.fragment, e),
					mt(J.$$.fragment, e),
					mt(H.$$.fragment, e),
					(Y = !1);
			},
			d(e) {
				Et(m, e),
					e && s(c),
					e && s(w),
					e && s(pe),
					e && s(B),
					e && s(ue),
					e && s(I),
					e && s(E),
					e && s(T),
					e && s($),
					e && s(y),
					e && s(Ee),
					e && s(d),
					Et(g),
					Et(J),
					Et(H),
					e && s(ke),
					e && s(Ie),
					e && s(Je),
					e && s(U),
					e && s(Ye),
					e && s(Ge),
					e && s(We),
					e && s(M),
					e && s(Qe),
					e && s(ie),
					e && s(Ze),
					(vs = !1),
					Zs(Es);
			}
		}
	);
}
const gt = 'https://github.com/svelte-society/sveltesociety.dev';
function Ys(n) {
	return n.toString().padStart(2, '0');
}
function ll() {
	const n = new Date(),
		m = Ys(n.getDate()),
		c = Ys(n.getMonth() + 1),
		w = n.getFullYear(),
		q = '-';
	return [w, c, m].join(q);
}
function al(n, m, c) {
	let w, q, pe, B;
	const G = ['Component', 'Template', 'Tool'].map((b) => ({ label: b, value: b.toLowerCase() })),
		ue = {
			component: {
				tags: Ce(Ms, 'tags'),
				categories: [...Ce(Ms, 'category').filter((b) => b.label !== '')]
			},
			template: { tags: Ce(yt, 'tags'), categories: Ce(yt, 'category') },
			tool: { tags: Ce(yt, 'tags'), categories: Ce(yt, 'category') }
		};
	let I = !1;
	const Ve = () => {
		el(JSON.stringify(q, null, '	')).then(() => c(8, (I = !1))), c(8, (I = !0));
	};
	let E = G[0],
		T = 'svelte-lorem-ipsum',
		W = 'https://github.com/sveltejs/svelte-lorem-ipsum',
		$ = 'A dummy text generator that does not exist',
		y = 'svelte-lorem-ipsum',
		D = ll(),
		S,
		A;
	Ks(() => {
		const b = new URLSearchParams(location.search).get('type');
		c(0, (E = G.find((z) => z.value == b) || G[0]));
	});
	async function Ee() {
		await xs(), c(6, (S = null)), c(7, (A = null));
	}
	function d(b) {
		(E = b), c(0, E);
	}
	function L() {
		(T = this.value), c(1, T);
	}
	function R() {
		(W = this.value), c(2, W);
	}
	function Oe() {
		($ = this.value), c(3, $);
	}
	function Ue() {
		(y = this.value), c(4, y);
	}
	function P() {
		(D = this.value), c(5, D);
	}
	function g(b) {
		(S = b), c(6, S);
	}
	function je(b) {
		(A = b), c(7, A);
	}
	return (
		(n.$$.update = () => {
			n.$$.dirty & 1 && c(12, (w = `${E.value}s`)),
				n.$$.dirty & 254 &&
					c(
						11,
						(q = {
							title: T,
							url: W,
							description: $,
							npm: y,
							addedOn: D,
							category: S == null ? void 0 : S.value,
							tags: A == null ? void 0 : A.map((b) => b.value),
							stars: 0
						})
					),
				n.$$.dirty & 1 && c(10, (pe = ue[E.value].tags)),
				n.$$.dirty & 1 && c(9, (B = ue[E.value].categories));
		}),
		[E, T, W, $, y, D, S, A, I, B, pe, q, w, G, Ve, Ee, d, L, R, Oe, Ue, P, g, je]
	);
}
class cl extends Fs {
	constructor(m) {
		super(), Qs(this, m, al, sl, Xs, {});
	}
}
export { cl as default };
