import {
	S as Qs,
	i as Ws,
	s as Zs,
	L as ds,
	M as hs,
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
	N as j,
	O as Pe,
	P as bs,
	u as _s,
	f as _t,
	t as mt,
	y as Et,
	Y as Ks,
	o as Xs,
	z as xs
} from '../../../../chunks/index-2fe5515f.js';
import { S as ms, e as Ce, c as el } from '../../../../chunks/Select-0fad25ba.js';
import { c as Ys } from '../../../../chunks/components-9abf80d5.js';
import { c as yt } from '../../../../chunks/cultproposals-ee6a2386.js';
import { S as tl } from '../../../../chunks/Seo-534e6b2c.js';
import '../../../../chunks/stores-5d0174eb.js';
import '../../../../chunks/singletons-99c9cfe2.js';
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
		Oe,
		E,
		S,
		z,
		$,
		y,
		L,
		T,
		N,
		Ee,
		d,
		D,
		R,
		Ve,
		Ue,
		P,
		g,
		je,
		b,
		F,
		wt,
		St,
		Q,
		ve,
		Tt,
		Nt,
		W,
		A,
		At,
		ye,
		It,
		Lt,
		Z,
		fe,
		Dt,
		Pt,
		K,
		k,
		Ct,
		ge,
		Ot,
		Vt,
		X,
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
		O,
		Jt,
		Se,
		Mt,
		Yt,
		se,
		he,
		Ht,
		Gt,
		le,
		V,
		zt,
		Te,
		Ft,
		Qt,
		ae,
		be,
		Wt,
		Zt,
		re,
		J,
		Kt,
		Xt,
		Ne,
		xt,
		es,
		ne,
		_e,
		ts,
		ss,
		oe,
		M,
		ls,
		as,
		Ae,
		rs,
		ke,
		Ie,
		ns,
		Je,
		U,
		os,
		qe = JSON.stringify(n[11], null, '	') + '',
		Me,
		me,
		Be = n[8] ? 'Copied' : 'Copy',
		Ye,
		is,
		He,
		Ge,
		ze,
		Y,
		Fe,
		ps,
		Qe,
		We,
		ie,
		us,
		Ze,
		Ke,
		H,
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
	function zs(e) {
		n[22](e);
	}
	let gs = { id: 'category', items: n[9], isClearable: !1, showIndicator: !0 };
	n[6] !== void 0 && (gs.value = n[6]),
		(J = new ms({ props: gs })),
		ds.push(() => hs(J, 'value', zs));
	function Fs(e) {
		n[23](e);
	}
	let ws = { id: 'category', items: n[10], showIndicator: !0, isMulti: !0 };
	return (
		n[7] !== void 0 && (ws.value = n[7]),
		(M = new ms({ props: ws })),
		ds.push(() => hs(M, 'value', Fs)),
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
					(Oe = p('Generating file contents snippet')),
					(E = v()),
					(S = a('p')),
					(z = p(
						'Each component is represented by a JSON Object. Use the generator below to generate the Object.'
					)),
					($ = v()),
					(y = a('p')),
					(L = a('code')),
					(T = p('*')),
					(N = p(' marked fields are required')),
					(Ee = v()),
					(d = a('div')),
					(D = a('div')),
					(R = a('label')),
					(Ve = p('Type:')),
					(Ue = v()),
					(P = a('div')),
					dt(g.$$.fragment),
					(b = v()),
					(F = a('span')),
					(wt = p('The type of snippet to generate')),
					(St = v()),
					(Q = a('div')),
					(ve = a('label')),
					(Tt = p('Title:')),
					(Nt = v()),
					(W = a('div')),
					(A = a('input')),
					(At = v()),
					(ye = a('span')),
					(It = p('Name of the component')),
					(Lt = v()),
					(Z = a('div')),
					(fe = a('label')),
					(Dt = p('URL:')),
					(Pt = v()),
					(K = a('div')),
					(k = a('input')),
					(Ct = v()),
					(ge = a('span')),
					(Ot = p('The URL where to find it')),
					(Vt = v()),
					(X = a('div')),
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
					(O = a('input')),
					(Jt = v()),
					(Se = a('span')),
					(Mt = p('The npm name of the component')),
					(Yt = v()),
					(se = a('div')),
					(he = a('label')),
					(Ht = p('Added On:')),
					(Gt = v()),
					(le = a('div')),
					(V = a('input')),
					(zt = v()),
					(Te = a('span')),
					(Ft = p(
						'The date when the component have been added on the website (generally it\u2019s today)'
					)),
					(Qt = v()),
					(ae = a('div')),
					(be = a('label')),
					(Wt = p('Category:')),
					(Zt = v()),
					(re = a('div')),
					dt(J.$$.fragment),
					(Xt = v()),
					(Ne = a('span')),
					(xt = p('The category of the component')),
					(es = v()),
					(ne = a('div')),
					(_e = a('label')),
					(ts = p('Tags:')),
					(ss = v()),
					(oe = a('div')),
					dt(M.$$.fragment),
					(as = v()),
					(Ae = a('span')),
					(rs = p('A list of tags')),
					(ke = v()),
					(Ie = a('h2')),
					(ns = p('JSON Snippet')),
					(Je = v()),
					(U = a('pre')),
					(os = p('')),
					(Me = p(qe)),
					(me = a('button')),
					(Ye = p(Be)),
					(is = p(`
`)),
					(He = v()),
					(Ge = a('br')),
					(ze = p(`
Copy this snippet and add it to
`)),
					(Y = a('a')),
					(Fe = p(n[12])),
					(ps = p('.json')),
					(We = p(`. You can
propose your changes
`)),
					(ie = a('a')),
					(us = p('directly in GitHub')),
					(Ke = p('.')),
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
				var Le = o(I);
				(Oe = u(Le, 'Generating file contents snippet')),
					Le.forEach(s),
					(E = f(e)),
					(S = r(e, 'P', {}));
				var De = o(S);
				(z = u(
					De,
					'Each component is represented by a JSON Object. Use the generator below to generate the Object.'
				)),
					De.forEach(s),
					($ = f(e)),
					(y = r(e, 'P', {}));
				var fs = o(y);
				L = r(fs, 'CODE', {});
				var Ss = o(L);
				(T = u(Ss, '*')),
					Ss.forEach(s),
					(N = u(fs, ' marked fields are required')),
					fs.forEach(s),
					(Ee = f(e)),
					(d = r(e, 'DIV', { class: !0 }));
				var _ = o(d);
				D = r(_, 'DIV', { class: !0 });
				var Xe = o(D);
				R = r(Xe, 'LABEL', { for: !0, class: !0 });
				var Ts = o(R);
				(Ve = u(Ts, 'Type:')), Ts.forEach(s), (Ue = f(Xe)), (P = r(Xe, 'DIV', { class: !0 }));
				var xe = o(P);
				ht(g.$$.fragment, xe), (b = f(xe)), (F = r(xe, 'SPAN', { class: !0 }));
				var Ns = o(F);
				(wt = u(Ns, 'The type of snippet to generate')),
					Ns.forEach(s),
					xe.forEach(s),
					Xe.forEach(s),
					(St = f(_)),
					(Q = r(_, 'DIV', { class: !0 }));
				var et = o(Q);
				ve = r(et, 'LABEL', { for: !0, class: !0 });
				var As = o(ve);
				(Tt = u(As, 'Title:')), As.forEach(s), (Nt = f(et)), (W = r(et, 'DIV', { class: !0 }));
				var tt = o(W);
				(A = r(tt, 'INPUT', { id: !0, type: !0, class: !0 })),
					(At = f(tt)),
					(ye = r(tt, 'SPAN', { class: !0 }));
				var Is = o(ye);
				(It = u(Is, 'Name of the component')),
					Is.forEach(s),
					tt.forEach(s),
					et.forEach(s),
					(Lt = f(_)),
					(Z = r(_, 'DIV', { class: !0 }));
				var st = o(Z);
				fe = r(st, 'LABEL', { for: !0, class: !0 });
				var Ls = o(fe);
				(Dt = u(Ls, 'URL:')), Ls.forEach(s), (Pt = f(st)), (K = r(st, 'DIV', { class: !0 }));
				var lt = o(K);
				(k = r(lt, 'INPUT', { id: !0, type: !0, class: !0 })),
					(Ct = f(lt)),
					(ge = r(lt, 'SPAN', { class: !0 }));
				var Ds = o(ge);
				(Ot = u(Ds, 'The URL where to find it')),
					Ds.forEach(s),
					lt.forEach(s),
					st.forEach(s),
					(Vt = f(_)),
					(X = r(_, 'DIV', { class: !0 }));
				var at = o(X);
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
				var Os = o(de);
				(Rt = u(Os, 'NPM:')), Os.forEach(s), (kt = f(nt)), (te = r(nt, 'DIV', { class: !0 }));
				var ot = o(te);
				(O = r(ot, 'INPUT', { id: !0, type: !0, class: !0 })),
					(Jt = f(ot)),
					(Se = r(ot, 'SPAN', { class: !0 }));
				var Vs = o(Se);
				(Mt = u(Vs, 'The npm name of the component')),
					Vs.forEach(s),
					ot.forEach(s),
					nt.forEach(s),
					(Yt = f(_)),
					(se = r(_, 'DIV', { class: !0 }));
				var it = o(se);
				he = r(it, 'LABEL', { for: !0, class: !0 });
				var Us = o(he);
				(Ht = u(Us, 'Added On:')), Us.forEach(s), (Gt = f(it)), (le = r(it, 'DIV', { class: !0 }));
				var pt = o(le);
				(V = r(pt, 'INPUT', { id: !0, type: !0, class: !0 })),
					(zt = f(pt)),
					(Te = r(pt, 'SPAN', { class: !0 }));
				var js = o(Te);
				(Ft = u(
					js,
					'The date when the component have been added on the website (generally it\u2019s today)'
				)),
					js.forEach(s),
					pt.forEach(s),
					it.forEach(s),
					(Qt = f(_)),
					(ae = r(_, 'DIV', { class: !0 }));
				var ut = o(ae);
				be = r(ut, 'LABEL', { for: !0, class: !0 });
				var qs = o(be);
				(Wt = u(qs, 'Category:')), qs.forEach(s), (Zt = f(ut)), (re = r(ut, 'DIV', { class: !0 }));
				var vt = o(re);
				ht(J.$$.fragment, vt), (Xt = f(vt)), (Ne = r(vt, 'SPAN', { class: !0 }));
				var Bs = o(Ne);
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
				ht(M.$$.fragment, ct), (as = f(ct)), (Ae = r(ct, 'SPAN', { class: !0 }));
				var Rs = o(Ae);
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
				(os = u(Re, '')), (Me = u(Re, qe)), (me = r(Re, 'BUTTON', { class: !0 }));
				var Js = o(me);
				(Ye = u(Js, Be)),
					Js.forEach(s),
					(is = u(
						Re,
						`
`
					)),
					Re.forEach(s),
					(He = f(e)),
					(Ge = r(e, 'BR', {})),
					(ze = u(
						e,
						`
Copy this snippet and add it to
`
					)),
					(Y = r(e, 'A', { href: !0 }));
				var cs = o(Y);
				(Fe = u(cs, n[12])),
					(ps = u(cs, '.json')),
					cs.forEach(s),
					(We = u(
						e,
						`. You can
propose your changes
`
					)),
					(ie = r(e, 'A', { href: !0 }));
				var Ms = o(ie);
				(us = u(Ms, 'directly in GitHub')), Ms.forEach(s), (Ke = u(e, '.')), this.h();
			},
			h() {
				l(R, 'for', 'type'),
					l(R, 'class', 'svelte-b3ver3'),
					l(F, 'class', 'input-helper svelte-b3ver3'),
					l(P, 'class', 'svelte-b3ver3'),
					l(D, 'class', 'input-wrapper svelte-b3ver3'),
					l(ve, 'for', 'title'),
					l(ve, 'class', 'required svelte-b3ver3'),
					l(A, 'id', 'title'),
					l(A, 'type', 'text'),
					(A.required = !0),
					l(A, 'class', 'svelte-b3ver3'),
					l(ye, 'class', 'input-helper svelte-b3ver3'),
					l(W, 'class', 'svelte-b3ver3'),
					l(Q, 'class', 'input-wrapper svelte-b3ver3'),
					l(fe, 'for', 'url'),
					l(fe, 'class', 'svelte-b3ver3'),
					l(k, 'id', 'url'),
					l(k, 'type', 'url'),
					l(k, 'class', 'svelte-b3ver3'),
					l(ge, 'class', 'input-helper svelte-b3ver3'),
					l(K, 'class', 'svelte-b3ver3'),
					l(Z, 'class', 'input-wrapper svelte-b3ver3'),
					l(ce, 'for', 'desc'),
					l(ce, 'class', 'svelte-b3ver3'),
					l(C, 'id', 'desc'),
					l(C, 'type', 'text'),
					l(C, 'class', 'svelte-b3ver3'),
					l(we, 'class', 'input-helper svelte-b3ver3'),
					l(x, 'class', 'svelte-b3ver3'),
					l(X, 'class', 'input-wrapper svelte-b3ver3'),
					l(de, 'for', 'npm'),
					l(de, 'class', 'svelte-b3ver3'),
					l(O, 'id', 'npm'),
					l(O, 'type', 'text'),
					l(O, 'class', 'svelte-b3ver3'),
					l(Se, 'class', 'input-helper svelte-b3ver3'),
					l(te, 'class', 'svelte-b3ver3'),
					l(ee, 'class', 'input-wrapper svelte-b3ver3'),
					l(he, 'for', 'adden-on'),
					l(he, 'class', 'required svelte-b3ver3'),
					l(V, 'id', 'adden-on'),
					l(V, 'type', 'date'),
					(V.required = !0),
					l(V, 'class', 'svelte-b3ver3'),
					l(Te, 'class', 'input-helper svelte-b3ver3'),
					l(le, 'class', 'svelte-b3ver3'),
					l(se, 'class', 'input-wrapper svelte-b3ver3'),
					l(be, 'for', 'category'),
					l(be, 'class', 'svelte-b3ver3'),
					l(Ne, 'class', 'input-helper svelte-b3ver3'),
					l(re, 'class', 'svelte-b3ver3'),
					l(ae, 'class', 'input-wrapper svelte-b3ver3'),
					l(_e, 'for', 'tags'),
					l(_e, 'class', 'required svelte-b3ver3'),
					l(Ae, 'class', 'input-helper svelte-b3ver3'),
					l(oe, 'class', 'svelte-b3ver3'),
					l(ne, 'class', 'input-wrapper svelte-b3ver3'),
					l(d, 'class', 'json-generator svelte-b3ver3'),
					l(me, 'class', 'svelte-b3ver3'),
					l(U, 'class', 'svelte-b3ver3'),
					l(Y, 'href', (Qe = gt + '/blob/staging/src/routes/' + n[12] + '/' + n[12] + '.json')),
					l(ie, 'href', (Ze = gt + '/edit/staging/src/routes/' + n[12] + '/' + n[12] + '.json'));
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
					t(I, Oe),
					h(e, E, i),
					h(e, S, i),
					t(S, z),
					h(e, $, i),
					h(e, y, i),
					t(y, L),
					t(L, T),
					t(y, N),
					h(e, Ee, i),
					h(e, d, i),
					t(d, D),
					t(D, R),
					t(R, Ve),
					t(D, Ue),
					t(D, P),
					bt(g, P, null),
					t(P, b),
					t(P, F),
					t(F, wt),
					t(d, St),
					t(d, Q),
					t(Q, ve),
					t(ve, Tt),
					t(Q, Nt),
					t(Q, W),
					t(W, A),
					j(A, n[1]),
					t(W, At),
					t(W, ye),
					t(ye, It),
					t(d, Lt),
					t(d, Z),
					t(Z, fe),
					t(fe, Dt),
					t(Z, Pt),
					t(Z, K),
					t(K, k),
					j(k, n[2]),
					t(K, Ct),
					t(K, ge),
					t(ge, Ot),
					t(d, Vt),
					t(d, X),
					t(X, ce),
					t(ce, Ut),
					t(X, jt),
					t(X, x),
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
					t(te, O),
					j(O, n[4]),
					t(te, Jt),
					t(te, Se),
					t(Se, Mt),
					t(d, Yt),
					t(d, se),
					t(se, he),
					t(he, Ht),
					t(se, Gt),
					t(se, le),
					t(le, V),
					j(V, n[5]),
					t(le, zt),
					t(le, Te),
					t(Te, Ft),
					t(d, Qt),
					t(d, ae),
					t(ae, be),
					t(be, Wt),
					t(ae, Zt),
					t(ae, re),
					bt(J, re, null),
					t(re, Xt),
					t(re, Ne),
					t(Ne, xt),
					t(d, es),
					t(d, ne),
					t(ne, _e),
					t(_e, ts),
					t(ne, ss),
					t(ne, oe),
					bt(M, oe, null),
					t(oe, as),
					t(oe, Ae),
					t(Ae, rs),
					h(e, ke, i),
					h(e, Ie, i),
					t(Ie, ns),
					h(e, Je, i),
					h(e, U, i),
					t(U, os),
					t(U, Me),
					t(U, me),
					t(me, Ye),
					t(U, is),
					h(e, He, i),
					h(e, Ge, i),
					h(e, ze, i),
					h(e, Y, i),
					t(Y, Fe),
					t(Y, ps),
					h(e, We, i),
					h(e, ie, i),
					t(ie, us),
					h(e, Ke, i),
					(H = !0),
					vs ||
						((Es = [
							Pe(A, 'input', n[17]),
							Pe(k, 'input', n[18]),
							Pe(C, 'input', n[19]),
							Pe(O, 'input', n[20]),
							Pe(V, 'input', n[21]),
							Pe(me, 'click', n[14])
						]),
						(vs = !0));
			},
			p(e, [i]) {
				const $e = {};
				!je && i & 1 && ((je = !0), ($e.value = e[0]), bs(() => (je = !1))),
					g.$set($e),
					i & 2 && A.value !== e[1] && j(A, e[1]),
					i & 4 && j(k, e[2]),
					i & 8 && C.value !== e[3] && j(C, e[3]),
					i & 16 && O.value !== e[4] && j(O, e[4]),
					i & 32 && j(V, e[5]);
				const Le = {};
				i & 512 && (Le.items = e[9]),
					!Kt && i & 64 && ((Kt = !0), (Le.value = e[6]), bs(() => (Kt = !1))),
					J.$set(Le);
				const De = {};
				i & 1024 && (De.items = e[10]),
					!ls && i & 128 && ((ls = !0), (De.value = e[7]), bs(() => (ls = !1))),
					M.$set(De),
					(!H || i & 2048) && qe !== (qe = JSON.stringify(e[11], null, '	') + '') && _s(Me, qe),
					(!H || i & 256) && Be !== (Be = e[8] ? 'Copied' : 'Copy') && _s(Ye, Be),
					(!H || i & 4096) && _s(Fe, e[12]),
					(!H ||
						(i & 4096 &&
							Qe !== (Qe = gt + '/blob/staging/src/routes/' + e[12] + '/' + e[12] + '.json'))) &&
						l(Y, 'href', Qe),
					(!H ||
						(i & 4096 &&
							Ze !== (Ze = gt + '/edit/staging/src/routes/' + e[12] + '/' + e[12] + '.json'))) &&
						l(ie, 'href', Ze);
			},
			i(e) {
				H ||
					(_t(m.$$.fragment, e),
					_t(g.$$.fragment, e),
					_t(J.$$.fragment, e),
					_t(M.$$.fragment, e),
					(H = !0));
			},
			o(e) {
				mt(m.$$.fragment, e),
					mt(g.$$.fragment, e),
					mt(J.$$.fragment, e),
					mt(M.$$.fragment, e),
					(H = !1);
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
					e && s(S),
					e && s($),
					e && s(y),
					e && s(Ee),
					e && s(d),
					Et(g),
					Et(J),
					Et(M),
					e && s(ke),
					e && s(Ie),
					e && s(Je),
					e && s(U),
					e && s(He),
					e && s(Ge),
					e && s(ze),
					e && s(Y),
					e && s(We),
					e && s(ie),
					e && s(Ke),
					(vs = !1),
					Ks(Es);
			}
		}
	);
}
const gt = 'https://github.com/svelte-society/sveltesociety.dev';
function Hs(n) {
	return n.toString().padStart(2, '0');
}
function ll() {
	const n = new Date(),
		m = Hs(n.getDate()),
		c = Hs(n.getMonth() + 1),
		w = n.getFullYear(),
		q = '-';
	return [w, c, m].join(q);
}
function al(n, m, c) {
	let w, q, pe, B;
	const G = ['Component', 'Template', 'Tool'].map((b) => ({ label: b, value: b.toLowerCase() })),
		ue = {
			component: {
				tags: Ce(Ys, 'tags'),
				categories: [...Ce(Ys, 'category').filter((b) => b.label !== '')]
			},
			template: { tags: Ce(yt, 'tags'), categories: Ce(yt, 'category') },
			tool: { tags: Ce(yt, 'tags'), categories: Ce(yt, 'category') }
		};
	let I = !1;
	const Oe = () => {
		el(JSON.stringify(q, null, '	')).then(() => c(8, (I = !1))), c(8, (I = !0));
	};
	let E = G[0],
		S = 'svelte-lorem-ipsum',
		z = 'https://github.com/sveltejs/svelte-lorem-ipsum',
		$ = 'A dummy text generator that does not exist',
		y = 'svelte-lorem-ipsum',
		L = ll(),
		T,
		N;
	Xs(() => {
		const b = new URLSearchParams(location.search).get('type');
		c(0, (E = G.find((F) => F.value == b) || G[0]));
	});
	async function Ee() {
		await xs(), c(6, (T = null)), c(7, (N = null));
	}
	function d(b) {
		(E = b), c(0, E);
	}
	function D() {
		(S = this.value), c(1, S);
	}
	function R() {
		(z = this.value), c(2, z);
	}
	function Ve() {
		($ = this.value), c(3, $);
	}
	function Ue() {
		(y = this.value), c(4, y);
	}
	function P() {
		(L = this.value), c(5, L);
	}
	function g(b) {
		(T = b), c(6, T);
	}
	function je(b) {
		(N = b), c(7, N);
	}
	return (
		(n.$$.update = () => {
			n.$$.dirty & 1 && c(12, (w = `${E.value}s`)),
				n.$$.dirty & 254 &&
					c(
						11,
						(q = {
							title: S,
							url: z,
							description: $,
							npm: y,
							addedOn: L,
							category: T == null ? void 0 : T.value,
							tags: N == null ? void 0 : N.map((b) => b.value),
							stars: 0
						})
					),
				n.$$.dirty & 1 && c(10, (pe = ue[E.value].tags)),
				n.$$.dirty & 1 && c(9, (B = ue[E.value].categories));
		}),
		[E, S, z, $, y, L, T, N, I, B, pe, q, w, G, Oe, Ee, d, D, R, Ve, Ue, P, g, je]
	);
}
class fl extends Qs {
	constructor(m) {
		super(), Ws(this, m, al, sl, Zs, {});
	}
}
export { fl as default };
