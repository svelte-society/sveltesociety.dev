import {
	S as ut,
	i as ft,
	s as vt,
	k as r,
	q as f,
	a as k,
	l as o,
	m as n,
	r as v,
	h as l,
	c as E,
	n as h,
	b as L,
	C as e,
	A as oe,
	D as ot
} from '../../../chunks/index-2fad9c0c.js';
function nt(_, a, i) {
	const d = _.slice();
	return (d[2] = a[i].name), (d[3] = a[i].link), (d[4] = a[i].author), d;
}
function ht(_, a, i) {
	const d = _.slice();
	return (d[2] = a[i].name), (d[3] = a[i].link), (d[4] = a[i].author), d;
}
function it(_) {
	let a,
		i,
		d = _[2] + '',
		w,
		T,
		U = _[4] + '',
		j;
	return {
		c() {
			(a = r('li')), (i = r('a')), (w = f(d)), (T = f(' by ')), (j = f(U)), this.h();
		},
		l(y) {
			a = o(y, 'LI', { class: !0 });
			var p = n(a);
			i = o(p, 'A', { href: !0, target: !0 });
			var S = n(i);
			(w = v(S, d)), S.forEach(l), (T = v(p, ' by ')), (j = v(p, U)), p.forEach(l), this.h();
		},
		h() {
			h(i, 'href', _[3]), h(i, 'target', '_blank'), h(a, 'class', 'svelte-1da61j2');
		},
		m(y, p) {
			L(y, a, p), e(a, i), e(i, w), e(a, T), e(a, j);
		},
		p: oe,
		d(y) {
			y && l(a);
		}
	};
}
function ct(_) {
	let a,
		i,
		d = _[2] + '',
		w,
		T,
		U = _[4] + '',
		j;
	return {
		c() {
			(a = r('li')), (i = r('a')), (w = f(d)), (T = f(' by ')), (j = f(U)), this.h();
		},
		l(y) {
			a = o(y, 'LI', { class: !0 });
			var p = n(a);
			i = o(p, 'A', { href: !0, target: !0 });
			var S = n(i);
			(w = v(S, d)), S.forEach(l), (T = v(p, ' by ')), (j = v(p, U)), p.forEach(l), this.h();
		},
		h() {
			h(i, 'href', _[3]), h(i, 'target', '_blank'), h(a, 'class', 'svelte-1da61j2');
		},
		m(y, p) {
			L(y, a, p), e(a, i), e(i, w), e(a, T), e(a, j);
		},
		p: oe,
		d(y) {
			y && l(a);
		}
	};
}
function dt(_) {
	let a,
		i,
		d,
		w,
		T,
		U,
		j,
		y,
		p,
		S,
		ne,
		se,
		c,
		z,
		he,
		ie,
		X,
		ce,
		ue,
		V,
		fe,
		ee,
		ve,
		de,
		R,
		_e,
		G,
		pe,
		me,
		te,
		be,
		ge,
		Y,
		O,
		q,
		ke,
		Ee,
		le,
		ye,
		we,
		A,
		W,
		C,
		je,
		Se,
		D,
		F,
		Te,
		Le,
		Ue,
		Z,
		B,
		Ae,
		Ie,
		ae,
		Pe,
		Ve,
		I,
		$,
		H,
		Re,
		qe,
		M,
		N,
		Ce,
		De,
		x = _[0],
		b = [];
	for (let t = 0; t < x.length; t += 1) b[t] = it(ht(_, x, t));
	let K = _[1],
		g = [];
	for (let t = 0; t < K.length; t += 1) g[t] = ct(nt(_, K, t));
	return {
		c() {
			(a = r('h1')),
				(i = f('CULT Resources')),
				(d = k()),
				(w = r('p')),
				(T = r('br')),
				(U = f(`

Under construction - everyone is invited to add CULT Resources via pull request. This should also be
automated as far as possible to have all resources from acts of revolt easily available.

`)),
				(j = r('p')),
				(y = r('br')),
				(p = f(`
The following is just to get some design- / layout- / first automation ideas

`)),
				(S = r('p')),
				(ne = r('br')),
				(se = k()),
				(c = r('div')),
				(z = r('h2')),
				(he = f('Books')),
				(ie = k()),
				(X = r('div')),
				(ce = f('There are a few books from major publishers:')),
				(ue = k()),
				(V = r('ul'));
			for (let t = 0; t < b.length; t += 1) b[t].c();
			(fe = k()),
				(ee = r('div')),
				(ve = f('As well as a couple self-published books:')),
				(de = k()),
				(R = r('ul'));
			for (let t = 0; t < g.length; t += 1) g[t].c();
			(_e = k()),
				(G = r('h2')),
				(pe = f('Videos')),
				(me = k()),
				(te = r('div')),
				(be = f('Rich Harris, the creator of Svelte, taught a course:')),
				(ge = k()),
				(Y = r('ul')),
				(O = r('li')),
				(q = r('a')),
				(ke = f('Frontend Masters')),
				(Ee = k()),
				(le = r('div')),
				(ye = f('There are also a number of third-party courses:')),
				(we = k()),
				(A = r('ul')),
				(W = r('li')),
				(C = r('a')),
				(je = f('Egghead')),
				(Se = k()),
				(D = r('li')),
				(F = r('a')),
				(Te = f('Udemy')),
				(Le = f(` (Note:
			Udemy frequently has discounts over 90%)`)),
				(Ue = k()),
				(Z = r('li')),
				(B = r('a')),
				(Ae = f('Pluralsight')),
				(Ie = k()),
				(ae = r('div')),
				(Pe = f('Finally, there are also YouTube channels and playlists that teach Svelte:')),
				(Ve = k()),
				(I = r('ul')),
				($ = r('li')),
				(H = r('a')),
				(Re = f('Svelte Master')),
				(qe = k()),
				(M = r('li')),
				(N = r('a')),
				(Ce = f('Svelte Tutorial for Beginners')),
				(De = f(' by The Net Ninja')),
				this.h();
		},
		l(t) {
			a = o(t, 'H1', {});
			var m = n(a);
			(i = v(m, 'CULT Resources')), m.forEach(l), (d = E(t)), (w = o(t, 'P', {}));
			var s = n(w);
			(T = o(s, 'BR', {})),
				s.forEach(l),
				(U = v(
					t,
					`

Under construction - everyone is invited to add CULT Resources via pull request. This should also be
automated as far as possible to have all resources from acts of revolt easily available.

`
				)),
				(j = o(t, 'P', {}));
			var P = n(j);
			(y = o(P, 'BR', {})),
				P.forEach(l),
				(p = v(
					t,
					`
The following is just to get some design- / layout- / first automation ideas

`
				)),
				(S = o(t, 'P', {}));
			var He = n(S);
			(ne = o(He, 'BR', {})), He.forEach(l), (se = E(t)), (c = o(t, 'DIV', {}));
			var u = n(c);
			z = o(u, 'H2', { class: !0 });
			var Me = n(z);
			(he = v(Me, 'Books')), Me.forEach(l), (ie = E(u)), (X = o(u, 'DIV', {}));
			var Ne = n(X);
			(ce = v(Ne, 'There are a few books from major publishers:')),
				Ne.forEach(l),
				(ue = E(u)),
				(V = o(u, 'UL', { class: !0 }));
			var Qe = n(V);
			for (let Q = 0; Q < b.length; Q += 1) b[Q].l(Qe);
			Qe.forEach(l), (fe = E(u)), (ee = o(u, 'DIV', {}));
			var ze = n(ee);
			(ve = v(ze, 'As well as a couple self-published books:')),
				ze.forEach(l),
				(de = E(u)),
				(R = o(u, 'UL', { class: !0 }));
			var Ge = n(R);
			for (let Q = 0; Q < g.length; Q += 1) g[Q].l(Ge);
			Ge.forEach(l), (_e = E(u)), (G = o(u, 'H2', { class: !0 }));
			var Ye = n(G);
			(pe = v(Ye, 'Videos')), Ye.forEach(l), (me = E(u)), (te = o(u, 'DIV', {}));
			var Oe = n(te);
			(be = v(Oe, 'Rich Harris, the creator of Svelte, taught a course:')),
				Oe.forEach(l),
				(ge = E(u)),
				(Y = o(u, 'UL', { class: !0 }));
			var We = n(Y);
			O = o(We, 'LI', { class: !0 });
			var Ze = n(O);
			q = o(Ze, 'A', { href: !0, target: !0 });
			var $e = n(q);
			(ke = v($e, 'Frontend Masters')),
				$e.forEach(l),
				Ze.forEach(l),
				We.forEach(l),
				(Ee = E(u)),
				(le = o(u, 'DIV', {}));
			var xe = n(le);
			(ye = v(xe, 'There are also a number of third-party courses:')),
				xe.forEach(l),
				(we = E(u)),
				(A = o(u, 'UL', { class: !0 }));
			var J = n(A);
			W = o(J, 'LI', { class: !0 });
			var Ke = n(W);
			C = o(Ke, 'A', { href: !0, target: !0 });
			var Je = n(C);
			(je = v(Je, 'Egghead')),
				Je.forEach(l),
				Ke.forEach(l),
				(Se = E(J)),
				(D = o(J, 'LI', { class: !0 }));
			var Fe = n(D);
			F = o(Fe, 'A', { href: !0, target: !0 });
			var Xe = n(F);
			(Te = v(Xe, 'Udemy')),
				Xe.forEach(l),
				(Le = v(
					Fe,
					` (Note:
			Udemy frequently has discounts over 90%)`
				)),
				Fe.forEach(l),
				(Ue = E(J)),
				(Z = o(J, 'LI', { class: !0 }));
			var et = n(Z);
			B = o(et, 'A', { href: !0, target: !0 });
			var tt = n(B);
			(Ae = v(tt, 'Pluralsight')),
				tt.forEach(l),
				et.forEach(l),
				J.forEach(l),
				(Ie = E(u)),
				(ae = o(u, 'DIV', {}));
			var lt = n(ae);
			(Pe = v(lt, 'Finally, there are also YouTube channels and playlists that teach Svelte:')),
				lt.forEach(l),
				(Ve = E(u)),
				(I = o(u, 'UL', { class: !0 }));
			var re = n(I);
			$ = o(re, 'LI', { class: !0 });
			var at = n($);
			H = o(at, 'A', { href: !0, target: !0 });
			var st = n(H);
			(Re = v(st, 'Svelte Master')),
				st.forEach(l),
				at.forEach(l),
				(qe = E(re)),
				(M = o(re, 'LI', { class: !0 }));
			var Be = n(M);
			N = o(Be, 'A', { href: !0, target: !0 });
			var rt = n(N);
			(Ce = v(rt, 'Svelte Tutorial for Beginners')),
				rt.forEach(l),
				(De = v(Be, ' by The Net Ninja')),
				Be.forEach(l),
				re.forEach(l),
				u.forEach(l),
				this.h();
		},
		h() {
			h(z, 'class', 'svelte-1da61j2'),
				h(V, 'class', 'svelte-1da61j2'),
				h(R, 'class', 'svelte-1da61j2'),
				h(G, 'class', 'svelte-1da61j2'),
				h(q, 'href', 'https://frontendmasters.com/courses/svelte/'),
				h(q, 'target', '_blank'),
				h(O, 'class', 'svelte-1da61j2'),
				h(Y, 'class', 'svelte-1da61j2'),
				h(C, 'href', 'https://egghead.io/browse/frameworks/svelte'),
				h(C, 'target', '_blank'),
				h(W, 'class', 'svelte-1da61j2'),
				h(F, 'href', 'https://www.udemy.com/courses/search/?q=sveltejs+svelte'),
				h(F, 'target', '_blank'),
				h(D, 'class', 'svelte-1da61j2'),
				h(B, 'href', 'https://www.pluralsight.com/search?q=svelte'),
				h(B, 'target', '_blank'),
				h(Z, 'class', 'svelte-1da61j2'),
				h(A, 'class', 'svelte-1da61j2'),
				h(H, 'href', 'https://www.youtube.com/channel/UCg6SQd5jnWo5Y70rZD9SQFA'),
				h(H, 'target', '_blank'),
				h($, 'class', 'svelte-1da61j2'),
				h(
					N,
					'href',
					'https://www.youtube.com/watch?v=zojEMeQGGHs&list=PL4cUxeGkcC9hlbrVO_2QFVqVPhlZmz7tO'
				),
				h(N, 'target', '_blank'),
				h(M, 'class', 'svelte-1da61j2'),
				h(I, 'class', 'svelte-1da61j2');
		},
		m(t, m) {
			L(t, a, m),
				e(a, i),
				L(t, d, m),
				L(t, w, m),
				e(w, T),
				L(t, U, m),
				L(t, j, m),
				e(j, y),
				L(t, p, m),
				L(t, S, m),
				e(S, ne),
				L(t, se, m),
				L(t, c, m),
				e(c, z),
				e(z, he),
				e(c, ie),
				e(c, X),
				e(X, ce),
				e(c, ue),
				e(c, V);
			for (let s = 0; s < b.length; s += 1) b[s].m(V, null);
			e(c, fe), e(c, ee), e(ee, ve), e(c, de), e(c, R);
			for (let s = 0; s < g.length; s += 1) g[s].m(R, null);
			e(c, _e),
				e(c, G),
				e(G, pe),
				e(c, me),
				e(c, te),
				e(te, be),
				e(c, ge),
				e(c, Y),
				e(Y, O),
				e(O, q),
				e(q, ke),
				e(c, Ee),
				e(c, le),
				e(le, ye),
				e(c, we),
				e(c, A),
				e(A, W),
				e(W, C),
				e(C, je),
				e(A, Se),
				e(A, D),
				e(D, F),
				e(F, Te),
				e(D, Le),
				e(A, Ue),
				e(A, Z),
				e(Z, B),
				e(B, Ae),
				e(c, Ie),
				e(c, ae),
				e(ae, Pe),
				e(c, Ve),
				e(c, I),
				e(I, $),
				e($, H),
				e(H, Re),
				e(I, qe),
				e(I, M),
				e(M, N),
				e(N, Ce),
				e(M, De);
		},
		p(t, [m]) {
			if (m & 1) {
				x = t[0];
				let s;
				for (s = 0; s < x.length; s += 1) {
					const P = ht(t, x, s);
					b[s] ? b[s].p(P, m) : ((b[s] = it(P)), b[s].c(), b[s].m(V, null));
				}
				for (; s < b.length; s += 1) b[s].d(1);
				b.length = x.length;
			}
			if (m & 2) {
				K = t[1];
				let s;
				for (s = 0; s < K.length; s += 1) {
					const P = nt(t, K, s);
					g[s] ? g[s].p(P, m) : ((g[s] = ct(P)), g[s].c(), g[s].m(R, null));
				}
				for (; s < g.length; s += 1) g[s].d(1);
				g.length = K.length;
			}
		},
		i: oe,
		o: oe,
		d(t) {
			t && l(a),
				t && l(d),
				t && l(w),
				t && l(U),
				t && l(j),
				t && l(p),
				t && l(S),
				t && l(se),
				t && l(c),
				ot(b, t),
				ot(g, t);
		}
	};
}
function _t(_) {
	return [
		[
			{
				name: 'Svelte Handbook',
				link: 'https://flaviocopes.com/page/svelte-handbook/',
				author: 'Flavio Copes'
			},
			{
				name: 'Svelte 3 Up and Running',
				link: 'https://www.amazon.com/dp/B08D6T6BKS/',
				author: 'Alessandro Segala'
			},
			{
				name: 'Svelte and Sapper in Action',
				link: 'https://www.manning.com/books/svelte-and-sapper-in-action',
				author: 'R. Mark Volkmann'
			}
		],
		[
			{
				name: 'Svelte Handbook',
				link: 'https://flaviocopes.com/page/svelte-handbook/',
				author: 'Flavio Copes'
			},
			{
				name: 'Simple Svelte',
				link: 'https://wfq.gumroad.com/l/simple_svelte',
				author: 'Darren Wang'
			}
		]
	];
}
class mt extends ut {
	constructor(a) {
		super(), ft(this, a, _t, dt, vt, {});
	}
}
export { mt as default };
