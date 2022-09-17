import {
	S as $e,
	i as xe,
	s as Ke,
	k as h,
	q as u,
	a as b,
	l as c,
	m as i,
	r as d,
	h as a,
	c as k,
	n as o,
	b as je,
	C as e,
	A as J,
	D as Ge
} from '../../../chunks/index-2fe5515f.js';
function Ye(_, t, s) {
	const v = _.slice();
	return (v[2] = t[s].name), (v[3] = t[s].link), (v[4] = t[s].author), v;
}
function Oe(_, t, s) {
	const v = _.slice();
	return (v[2] = t[s].name), (v[3] = t[s].link), (v[4] = t[s].author), v;
}
function We(_) {
	let t,
		s,
		v = _[2] + '',
		w,
		E,
		A = _[4] + '',
		y;
	return {
		c() {
			(t = h('li')), (s = h('a')), (w = u(v)), (E = u(' by ')), (y = u(A)), this.h();
		},
		l(f) {
			t = c(f, 'LI', { class: !0 });
			var g = i(t);
			s = c(g, 'A', { href: !0, target: !0 });
			var S = i(s);
			(w = d(S, v)), S.forEach(a), (E = d(g, ' by ')), (y = d(g, A)), g.forEach(a), this.h();
		},
		h() {
			o(s, 'href', _[3]), o(s, 'target', '_blank'), o(t, 'class', 'svelte-1da61j2');
		},
		m(f, g) {
			je(f, t, g), e(t, s), e(s, w), e(t, E), e(t, y);
		},
		p: J,
		d(f) {
			f && a(t);
		}
	};
}
function Ze(_) {
	let t,
		s,
		v = _[2] + '',
		w,
		E,
		A = _[4] + '',
		y;
	return {
		c() {
			(t = h('li')), (s = h('a')), (w = u(v)), (E = u(' by ')), (y = u(A)), this.h();
		},
		l(f) {
			t = c(f, 'LI', { class: !0 });
			var g = i(t);
			s = c(g, 'A', { href: !0, target: !0 });
			var S = i(s);
			(w = d(S, v)), S.forEach(a), (E = d(g, ' by ')), (y = d(g, A)), g.forEach(a), this.h();
		},
		h() {
			o(s, 'href', _[3]), o(s, 'target', '_blank'), o(t, 'class', 'svelte-1da61j2');
		},
		m(f, g) {
			je(f, t, g), e(t, s), e(s, w), e(t, E), e(t, y);
		},
		p: J,
		d(f) {
			f && a(t);
		}
	};
}
function Je(_) {
	let t,
		s,
		v,
		w,
		E,
		A,
		y,
		f,
		g,
		S,
		X,
		ee,
		U,
		te,
		M,
		le,
		ae,
		Z,
		se,
		re,
		N,
		Q,
		V,
		oe,
		ne,
		$,
		he,
		ce,
		j,
		R,
		T,
		ie,
		ue,
		D,
		F,
		de,
		ve,
		fe,
		z,
		P,
		_e,
		ge,
		x,
		me,
		pe,
		I,
		G,
		q,
		be,
		ke,
		H,
		B,
		Ee,
		we,
		Y = _[0],
		m = [];
	for (let n = 0; n < Y.length; n += 1) m[n] = We(Oe(_, Y, n));
	let O = _[1],
		p = [];
	for (let n = 0; n < O.length; n += 1) p[n] = Ze(Ye(_, O, n));
	return {
		c() {
			(t = h('div')),
				(s = h('h2')),
				(v = u('Books')),
				(w = b()),
				(E = h('div')),
				(A = u('There are a few books from major publishers:')),
				(y = b()),
				(f = h('ul'));
			for (let n = 0; n < m.length; n += 1) m[n].c();
			(g = b()),
				(S = h('div')),
				(X = u('As well as a couple self-published books:')),
				(ee = b()),
				(U = h('ul'));
			for (let n = 0; n < p.length; n += 1) p[n].c();
			(te = b()),
				(M = h('h2')),
				(le = u('Videos')),
				(ae = b()),
				(Z = h('div')),
				(se = u('Rich Harris, the creator of Svelte, taught a course:')),
				(re = b()),
				(N = h('ul')),
				(Q = h('li')),
				(V = h('a')),
				(oe = u('Frontend Masters')),
				(ne = b()),
				($ = h('div')),
				(he = u('There are also a number of third-party courses:')),
				(ce = b()),
				(j = h('ul')),
				(R = h('li')),
				(T = h('a')),
				(ie = u('Egghead')),
				(ue = b()),
				(D = h('li')),
				(F = h('a')),
				(de = u('Udemy')),
				(ve = u(` (Note:
			Udemy frequently has discounts over 90%)`)),
				(fe = b()),
				(z = h('li')),
				(P = h('a')),
				(_e = u('Pluralsight')),
				(ge = b()),
				(x = h('div')),
				(me = u('Finally, there are also YouTube channels and playlists that teach Svelte:')),
				(pe = b()),
				(I = h('ul')),
				(G = h('li')),
				(q = h('a')),
				(be = u('Svelte Master')),
				(ke = b()),
				(H = h('li')),
				(B = h('a')),
				(Ee = u('Svelte Tutorial for Beginners')),
				(we = u(' by The Net Ninja')),
				this.h();
		},
		l(n) {
			t = c(n, 'DIV', {});
			var r = i(t);
			s = c(r, 'H2', { class: !0 });
			var l = i(s);
			(v = d(l, 'Books')), l.forEach(a), (w = k(r)), (E = c(r, 'DIV', {}));
			var L = i(E);
			(A = d(L, 'There are a few books from major publishers:')),
				L.forEach(a),
				(y = k(r)),
				(f = c(r, 'UL', { class: !0 }));
			var Ae = i(f);
			for (let C = 0; C < m.length; C += 1) m[C].l(Ae);
			Ae.forEach(a), (g = k(r)), (S = c(r, 'DIV', {}));
			var Ie = i(S);
			(X = d(Ie, 'As well as a couple self-published books:')),
				Ie.forEach(a),
				(ee = k(r)),
				(U = c(r, 'UL', { class: !0 }));
			var Le = i(U);
			for (let C = 0; C < p.length; C += 1) p[C].l(Le);
			Le.forEach(a), (te = k(r)), (M = c(r, 'H2', { class: !0 }));
			var Ue = i(M);
			(le = d(Ue, 'Videos')), Ue.forEach(a), (ae = k(r)), (Z = c(r, 'DIV', {}));
			var Ve = i(Z);
			(se = d(Ve, 'Rich Harris, the creator of Svelte, taught a course:')),
				Ve.forEach(a),
				(re = k(r)),
				(N = c(r, 'UL', { class: !0 }));
			var Te = i(N);
			Q = c(Te, 'LI', { class: !0 });
			var De = i(Q);
			V = c(De, 'A', { href: !0, target: !0 });
			var Fe = i(V);
			(oe = d(Fe, 'Frontend Masters')),
				Fe.forEach(a),
				De.forEach(a),
				Te.forEach(a),
				(ne = k(r)),
				($ = c(r, 'DIV', {}));
			var Pe = i($);
			(he = d(Pe, 'There are also a number of third-party courses:')),
				Pe.forEach(a),
				(ce = k(r)),
				(j = c(r, 'UL', { class: !0 }));
			var W = i(j);
			R = c(W, 'LI', { class: !0 });
			var qe = i(R);
			T = c(qe, 'A', { href: !0, target: !0 });
			var He = i(T);
			(ie = d(He, 'Egghead')),
				He.forEach(a),
				qe.forEach(a),
				(ue = k(W)),
				(D = c(W, 'LI', { class: !0 }));
			var ye = i(D);
			F = c(ye, 'A', { href: !0, target: !0 });
			var Be = i(F);
			(de = d(Be, 'Udemy')),
				Be.forEach(a),
				(ve = d(
					ye,
					` (Note:
			Udemy frequently has discounts over 90%)`
				)),
				ye.forEach(a),
				(fe = k(W)),
				(z = c(W, 'LI', { class: !0 }));
			var Ce = i(z);
			P = c(Ce, 'A', { href: !0, target: !0 });
			var Me = i(P);
			(_e = d(Me, 'Pluralsight')),
				Me.forEach(a),
				Ce.forEach(a),
				W.forEach(a),
				(ge = k(r)),
				(x = c(r, 'DIV', {}));
			var Ne = i(x);
			(me = d(Ne, 'Finally, there are also YouTube channels and playlists that teach Svelte:')),
				Ne.forEach(a),
				(pe = k(r)),
				(I = c(r, 'UL', { class: !0 }));
			var K = i(I);
			G = c(K, 'LI', { class: !0 });
			var Qe = i(G);
			q = c(Qe, 'A', { href: !0, target: !0 });
			var Re = i(q);
			(be = d(Re, 'Svelte Master')),
				Re.forEach(a),
				Qe.forEach(a),
				(ke = k(K)),
				(H = c(K, 'LI', { class: !0 }));
			var Se = i(H);
			B = c(Se, 'A', { href: !0, target: !0 });
			var ze = i(B);
			(Ee = d(ze, 'Svelte Tutorial for Beginners')),
				ze.forEach(a),
				(we = d(Se, ' by The Net Ninja')),
				Se.forEach(a),
				K.forEach(a),
				r.forEach(a),
				this.h();
		},
		h() {
			o(s, 'class', 'svelte-1da61j2'),
				o(f, 'class', 'svelte-1da61j2'),
				o(U, 'class', 'svelte-1da61j2'),
				o(M, 'class', 'svelte-1da61j2'),
				o(V, 'href', 'https://frontendmasters.com/courses/svelte/'),
				o(V, 'target', '_blank'),
				o(Q, 'class', 'svelte-1da61j2'),
				o(N, 'class', 'svelte-1da61j2'),
				o(T, 'href', 'https://egghead.io/browse/frameworks/svelte'),
				o(T, 'target', '_blank'),
				o(R, 'class', 'svelte-1da61j2'),
				o(F, 'href', 'https://www.udemy.com/courses/search/?q=sveltejs+svelte'),
				o(F, 'target', '_blank'),
				o(D, 'class', 'svelte-1da61j2'),
				o(P, 'href', 'https://www.pluralsight.com/search?q=svelte'),
				o(P, 'target', '_blank'),
				o(z, 'class', 'svelte-1da61j2'),
				o(j, 'class', 'svelte-1da61j2'),
				o(q, 'href', 'https://www.youtube.com/channel/UCg6SQd5jnWo5Y70rZD9SQFA'),
				o(q, 'target', '_blank'),
				o(G, 'class', 'svelte-1da61j2'),
				o(
					B,
					'href',
					'https://www.youtube.com/watch?v=zojEMeQGGHs&list=PL4cUxeGkcC9hlbrVO_2QFVqVPhlZmz7tO'
				),
				o(B, 'target', '_blank'),
				o(H, 'class', 'svelte-1da61j2'),
				o(I, 'class', 'svelte-1da61j2');
		},
		m(n, r) {
			je(n, t, r), e(t, s), e(s, v), e(t, w), e(t, E), e(E, A), e(t, y), e(t, f);
			for (let l = 0; l < m.length; l += 1) m[l].m(f, null);
			e(t, g), e(t, S), e(S, X), e(t, ee), e(t, U);
			for (let l = 0; l < p.length; l += 1) p[l].m(U, null);
			e(t, te),
				e(t, M),
				e(M, le),
				e(t, ae),
				e(t, Z),
				e(Z, se),
				e(t, re),
				e(t, N),
				e(N, Q),
				e(Q, V),
				e(V, oe),
				e(t, ne),
				e(t, $),
				e($, he),
				e(t, ce),
				e(t, j),
				e(j, R),
				e(R, T),
				e(T, ie),
				e(j, ue),
				e(j, D),
				e(D, F),
				e(F, de),
				e(D, ve),
				e(j, fe),
				e(j, z),
				e(z, P),
				e(P, _e),
				e(t, ge),
				e(t, x),
				e(x, me),
				e(t, pe),
				e(t, I),
				e(I, G),
				e(G, q),
				e(q, be),
				e(I, ke),
				e(I, H),
				e(H, B),
				e(B, Ee),
				e(H, we);
		},
		p(n, [r]) {
			if (r & 1) {
				Y = n[0];
				let l;
				for (l = 0; l < Y.length; l += 1) {
					const L = Oe(n, Y, l);
					m[l] ? m[l].p(L, r) : ((m[l] = We(L)), m[l].c(), m[l].m(f, null));
				}
				for (; l < m.length; l += 1) m[l].d(1);
				m.length = Y.length;
			}
			if (r & 2) {
				O = n[1];
				let l;
				for (l = 0; l < O.length; l += 1) {
					const L = Ye(n, O, l);
					p[l] ? p[l].p(L, r) : ((p[l] = Ze(L)), p[l].c(), p[l].m(U, null));
				}
				for (; l < p.length; l += 1) p[l].d(1);
				p.length = O.length;
			}
		},
		i: J,
		o: J,
		d(n) {
			n && a(t), Ge(m, n), Ge(p, n);
		}
	};
}
function Xe(_) {
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
class tt extends $e {
	constructor(t) {
		super(), xe(this, t, Xe, Je, Ke, {});
	}
}
export { tt as default };
