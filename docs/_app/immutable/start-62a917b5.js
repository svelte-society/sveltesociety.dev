import {
	S as Te,
	i as Ue,
	s as Ve,
	a as je,
	e as O,
	c as Ne,
	b as B,
	g as J,
	t as P,
	d as H,
	f as I,
	h as j,
	j as Ce,
	o as _e,
	k as qe,
	l as ze,
	m as Ke,
	n as le,
	p as W,
	q as Be,
	r as Je,
	u as He,
	v as N,
	w as G,
	x as C,
	y as q,
	z as Re
} from './chunks/index-2fad9c0c.js';
import {
	g as Le,
	f as Se,
	a as Ae,
	s as M,
	b as de,
	i as We,
	c as Fe
} from './chunks/singletons-9297043a.js';
import { _ as V, H as ce, R as Oe, e as Me } from './chunks/preload-helper-e2690c66.js';
function Ge(s, e) {
	return s === '/' || e === 'ignore'
		? s
		: e === 'never'
		? s.endsWith('/')
			? s.slice(0, -1)
			: s
		: e === 'always' && !s.endsWith('/')
		? s + '/'
		: s;
}
function Ye(s) {
	for (const e in s)
		s[e] = s[e]
			.replace(/%23/g, '#')
			.replace(/%3[Bb]/g, ';')
			.replace(/%2[Cc]/g, ',')
			.replace(/%2[Ff]/g, '/')
			.replace(/%3[Ff]/g, '?')
			.replace(/%3[Aa]/g, ':')
			.replace(/%40/g, '@')
			.replace(/%26/g, '&')
			.replace(/%3[Dd]/g, '=')
			.replace(/%2[Bb]/g, '+')
			.replace(/%24/g, '$');
	return s;
}
class Xe extends URL {
	get hash() {
		throw new Error(
			'url.hash is inaccessible from load. Consider accessing hash from the page store within the script tag of your component.'
		);
	}
}
function Ze(s) {
	let e = 5381,
		n = s.length;
	if (typeof s == 'string') for (; n; ) e = (e * 33) ^ s.charCodeAt(--n);
	else for (; n; ) e = (e * 33) ^ s[--n];
	return (e >>> 0).toString(36);
}
const pe = window.fetch;
function Qe(s, e) {
	let a = `script[sveltekit\\:data-type="data"][sveltekit\\:data-url=${JSON.stringify(
		typeof s == 'string' ? s : s.url
	)}]`;
	e && typeof e.body == 'string' && (a += `[sveltekit\\:data-body="${Ze(e.body)}"]`);
	const r = document.querySelector(a);
	if (r && r.textContent) {
		const { body: u, ...t } = JSON.parse(r.textContent);
		return Promise.resolve(new Response(u, t));
	}
	return pe(s, e);
}
const xe = /^(\.\.\.)?(\w+)(?:=(\w+))?$/;
function et(s) {
	const e = [],
		n = [];
	let a = !0;
	return {
		pattern:
			s === ''
				? /^\/$/
				: new RegExp(
						`^${s
							.split(/(?:@[a-zA-Z0-9_-]+)?(?:\/|$)/)
							.map((u, t, l) => {
								const o = decodeURIComponent(u),
									c = /^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(o);
								if (c) return e.push(c[1]), n.push(c[2]), '(?:/(.*))?';
								const h = t === l.length - 1;
								return (
									o &&
									'/' +
										o
											.split(/\[(.+?)\]/)
											.map((v, D) => {
												if (D % 2) {
													const T = xe.exec(v);
													if (!T)
														throw new Error(
															`Invalid param: ${v}. Params and matcher names can only have underscores and alphanumeric characters.`
														);
													const [, b, X, Z] = T;
													return e.push(X), n.push(Z), b ? '(.*?)' : '([^/]+?)';
												}
												return (
													h && v.includes('.') && (a = !1),
													v
														.normalize()
														.replace(/%5[Bb]/g, '[')
														.replace(/%5[Dd]/g, ']')
														.replace(/#/g, '%23')
														.replace(/\?/g, '%3F')
														.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
												);
											})
											.join('')
								);
							})
							.join('')}${a ? '/?' : ''}$`
				  ),
		names: e,
		types: n
	};
}
function tt(s, e, n, a) {
	const r = {};
	for (let u = 0; u < e.length; u += 1) {
		const t = e[u],
			l = n[u],
			o = s[u + 1] || '';
		if (l) {
			const c = a[l];
			if (!c) throw new Error(`Missing "${l}" param matcher`);
			if (!c(o)) return;
		}
		r[t] = o;
	}
	return r;
}
function nt(s, e, n) {
	return Object.entries(e).map(([a, [r, u, t, l]]) => {
		const { pattern: o, names: c, types: h } = et(a),
			v = {
				id: a,
				exec: (D) => {
					const T = o.exec(D);
					if (T) return tt(T, c, h, n);
				},
				errors: r.map((D) => s[D]),
				layouts: u.map((D) => s[D]),
				leaf: s[t],
				uses_server_data: !!l
			};
		return (v.errors.length = v.layouts.length = Math.max(v.errors.length, v.layouts.length)), v;
	});
}
function rt(s) {
	let e, n, a;
	var r = s[0][0];
	function u(t) {
		return { props: { data: t[1], errors: t[5] } };
	}
	return (
		r && (e = new r(u(s))),
		{
			c() {
				e && N(e.$$.fragment), (n = O());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = O());
			},
			m(t, l) {
				e && C(e, t, l), B(t, n, l), (a = !0);
			},
			p(t, l) {
				const o = {};
				if ((l & 2 && (o.data = t[1]), l & 32 && (o.errors = t[5]), r !== (r = t[0][0]))) {
					if (e) {
						J();
						const c = e;
						P(c.$$.fragment, 1, 0, () => {
							q(c, 1);
						}),
							H();
					}
					r
						? ((e = new r(u(t))), N(e.$$.fragment), I(e.$$.fragment, 1), C(e, n.parentNode, n))
						: (e = null);
				} else r && e.$set(o);
			},
			i(t) {
				a || (e && I(e.$$.fragment, t), (a = !0));
			},
			o(t) {
				e && P(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function at(s) {
	let e, n, a;
	var r = s[0][0];
	function u(t) {
		return { props: { data: t[1], $$slots: { default: [ut] }, $$scope: { ctx: t } } };
	}
	return (
		r && (e = new r(u(s))),
		{
			c() {
				e && N(e.$$.fragment), (n = O());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = O());
			},
			m(t, l) {
				e && C(e, t, l), B(t, n, l), (a = !0);
			},
			p(t, l) {
				const o = {};
				if (
					(l & 2 && (o.data = t[1]),
					l & 2109 && (o.$$scope = { dirty: l, ctx: t }),
					r !== (r = t[0][0]))
				) {
					if (e) {
						J();
						const c = e;
						P(c.$$.fragment, 1, 0, () => {
							q(c, 1);
						}),
							H();
					}
					r
						? ((e = new r(u(t))), N(e.$$.fragment), I(e.$$.fragment, 1), C(e, n.parentNode, n))
						: (e = null);
				} else r && e.$set(o);
			},
			i(t) {
				a || (e && I(e.$$.fragment, t), (a = !0));
			},
			o(t) {
				e && P(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function st(s) {
	let e, n, a;
	var r = s[0][1];
	function u(t) {
		return { props: { data: t[2], errors: t[5] } };
	}
	return (
		r && (e = new r(u(s))),
		{
			c() {
				e && N(e.$$.fragment), (n = O());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = O());
			},
			m(t, l) {
				e && C(e, t, l), B(t, n, l), (a = !0);
			},
			p(t, l) {
				const o = {};
				if ((l & 4 && (o.data = t[2]), l & 32 && (o.errors = t[5]), r !== (r = t[0][1]))) {
					if (e) {
						J();
						const c = e;
						P(c.$$.fragment, 1, 0, () => {
							q(c, 1);
						}),
							H();
					}
					r
						? ((e = new r(u(t))), N(e.$$.fragment), I(e.$$.fragment, 1), C(e, n.parentNode, n))
						: (e = null);
				} else r && e.$set(o);
			},
			i(t) {
				a || (e && I(e.$$.fragment, t), (a = !0));
			},
			o(t) {
				e && P(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function it(s) {
	let e, n, a;
	var r = s[0][1];
	function u(t) {
		return { props: { data: t[2], $$slots: { default: [ft] }, $$scope: { ctx: t } } };
	}
	return (
		r && (e = new r(u(s))),
		{
			c() {
				e && N(e.$$.fragment), (n = O());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = O());
			},
			m(t, l) {
				e && C(e, t, l), B(t, n, l), (a = !0);
			},
			p(t, l) {
				const o = {};
				if (
					(l & 4 && (o.data = t[2]),
					l & 2105 && (o.$$scope = { dirty: l, ctx: t }),
					r !== (r = t[0][1]))
				) {
					if (e) {
						J();
						const c = e;
						P(c.$$.fragment, 1, 0, () => {
							q(c, 1);
						}),
							H();
					}
					r
						? ((e = new r(u(t))), N(e.$$.fragment), I(e.$$.fragment, 1), C(e, n.parentNode, n))
						: (e = null);
				} else r && e.$set(o);
			},
			i(t) {
				a || (e && I(e.$$.fragment, t), (a = !0));
			},
			o(t) {
				e && P(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function ot(s) {
	let e, n, a;
	var r = s[0][2];
	function u(t) {
		return { props: { data: t[3], errors: t[5] } };
	}
	return (
		r && (e = new r(u(s))),
		{
			c() {
				e && N(e.$$.fragment), (n = O());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = O());
			},
			m(t, l) {
				e && C(e, t, l), B(t, n, l), (a = !0);
			},
			p(t, l) {
				const o = {};
				if ((l & 8 && (o.data = t[3]), l & 32 && (o.errors = t[5]), r !== (r = t[0][2]))) {
					if (e) {
						J();
						const c = e;
						P(c.$$.fragment, 1, 0, () => {
							q(c, 1);
						}),
							H();
					}
					r
						? ((e = new r(u(t))), N(e.$$.fragment), I(e.$$.fragment, 1), C(e, n.parentNode, n))
						: (e = null);
				} else r && e.$set(o);
			},
			i(t) {
				a || (e && I(e.$$.fragment, t), (a = !0));
			},
			o(t) {
				e && P(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function lt(s) {
	let e, n, a;
	var r = s[0][2];
	function u(t) {
		return { props: { data: t[3], $$slots: { default: [ct] }, $$scope: { ctx: t } } };
	}
	return (
		r && (e = new r(u(s))),
		{
			c() {
				e && N(e.$$.fragment), (n = O());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = O());
			},
			m(t, l) {
				e && C(e, t, l), B(t, n, l), (a = !0);
			},
			p(t, l) {
				const o = {};
				if (
					(l & 8 && (o.data = t[3]),
					l & 2065 && (o.$$scope = { dirty: l, ctx: t }),
					r !== (r = t[0][2]))
				) {
					if (e) {
						J();
						const c = e;
						P(c.$$.fragment, 1, 0, () => {
							q(c, 1);
						}),
							H();
					}
					r
						? ((e = new r(u(t))), N(e.$$.fragment), I(e.$$.fragment, 1), C(e, n.parentNode, n))
						: (e = null);
				} else r && e.$set(o);
			},
			i(t) {
				a || (e && I(e.$$.fragment, t), (a = !0));
			},
			o(t) {
				e && P(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function ct(s) {
	let e, n, a;
	var r = s[0][3];
	function u(t) {
		return { props: { data: t[4] } };
	}
	return (
		r && (e = new r(u(s))),
		{
			c() {
				e && N(e.$$.fragment), (n = O());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = O());
			},
			m(t, l) {
				e && C(e, t, l), B(t, n, l), (a = !0);
			},
			p(t, l) {
				const o = {};
				if ((l & 16 && (o.data = t[4]), r !== (r = t[0][3]))) {
					if (e) {
						J();
						const c = e;
						P(c.$$.fragment, 1, 0, () => {
							q(c, 1);
						}),
							H();
					}
					r
						? ((e = new r(u(t))), N(e.$$.fragment), I(e.$$.fragment, 1), C(e, n.parentNode, n))
						: (e = null);
				} else r && e.$set(o);
			},
			i(t) {
				a || (e && I(e.$$.fragment, t), (a = !0));
			},
			o(t) {
				e && P(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function ft(s) {
	let e, n, a, r;
	const u = [lt, ot],
		t = [];
	function l(o, c) {
		return o[0][3] ? 0 : 1;
	}
	return (
		(e = l(s)),
		(n = t[e] = u[e](s)),
		{
			c() {
				n.c(), (a = O());
			},
			l(o) {
				n.l(o), (a = O());
			},
			m(o, c) {
				t[e].m(o, c), B(o, a, c), (r = !0);
			},
			p(o, c) {
				let h = e;
				(e = l(o)),
					e === h
						? t[e].p(o, c)
						: (J(),
						  P(t[h], 1, 1, () => {
								t[h] = null;
						  }),
						  H(),
						  (n = t[e]),
						  n ? n.p(o, c) : ((n = t[e] = u[e](o)), n.c()),
						  I(n, 1),
						  n.m(a.parentNode, a));
			},
			i(o) {
				r || (I(n), (r = !0));
			},
			o(o) {
				P(n), (r = !1);
			},
			d(o) {
				t[e].d(o), o && j(a);
			}
		}
	);
}
function ut(s) {
	let e, n, a, r;
	const u = [it, st],
		t = [];
	function l(o, c) {
		return o[0][2] ? 0 : 1;
	}
	return (
		(e = l(s)),
		(n = t[e] = u[e](s)),
		{
			c() {
				n.c(), (a = O());
			},
			l(o) {
				n.l(o), (a = O());
			},
			m(o, c) {
				t[e].m(o, c), B(o, a, c), (r = !0);
			},
			p(o, c) {
				let h = e;
				(e = l(o)),
					e === h
						? t[e].p(o, c)
						: (J(),
						  P(t[h], 1, 1, () => {
								t[h] = null;
						  }),
						  H(),
						  (n = t[e]),
						  n ? n.p(o, c) : ((n = t[e] = u[e](o)), n.c()),
						  I(n, 1),
						  n.m(a.parentNode, a));
			},
			i(o) {
				r || (I(n), (r = !0));
			},
			o(o) {
				P(n), (r = !1);
			},
			d(o) {
				t[e].d(o), o && j(a);
			}
		}
	);
}
function Pe(s) {
	let e,
		n = s[7] && Ie(s);
	return {
		c() {
			(e = qe('div')), n && n.c(), this.h();
		},
		l(a) {
			e = ze(a, 'DIV', { id: !0, 'aria-live': !0, 'aria-atomic': !0, style: !0 });
			var r = Ke(e);
			n && n.l(r), r.forEach(j), this.h();
		},
		h() {
			le(e, 'id', 'svelte-announcer'),
				le(e, 'aria-live', 'assertive'),
				le(e, 'aria-atomic', 'true'),
				W(e, 'position', 'absolute'),
				W(e, 'left', '0'),
				W(e, 'top', '0'),
				W(e, 'clip', 'rect(0 0 0 0)'),
				W(e, 'clip-path', 'inset(50%)'),
				W(e, 'overflow', 'hidden'),
				W(e, 'white-space', 'nowrap'),
				W(e, 'width', '1px'),
				W(e, 'height', '1px');
		},
		m(a, r) {
			B(a, e, r), n && n.m(e, null);
		},
		p(a, r) {
			a[7] ? (n ? n.p(a, r) : ((n = Ie(a)), n.c(), n.m(e, null))) : n && (n.d(1), (n = null));
		},
		d(a) {
			a && j(e), n && n.d();
		}
	};
}
function Ie(s) {
	let e;
	return {
		c() {
			e = Be(s[8]);
		},
		l(n) {
			e = Je(n, s[8]);
		},
		m(n, a) {
			B(n, e, a);
		},
		p(n, a) {
			a & 256 && He(e, n[8]);
		},
		d(n) {
			n && j(e);
		}
	};
}
function _t(s) {
	let e, n, a, r, u;
	const t = [at, rt],
		l = [];
	function o(h, v) {
		return h[0][1] ? 0 : 1;
	}
	(e = o(s)), (n = l[e] = t[e](s));
	let c = s[6] && Pe(s);
	return {
		c() {
			n.c(), (a = je()), c && c.c(), (r = O());
		},
		l(h) {
			n.l(h), (a = Ne(h)), c && c.l(h), (r = O());
		},
		m(h, v) {
			l[e].m(h, v), B(h, a, v), c && c.m(h, v), B(h, r, v), (u = !0);
		},
		p(h, [v]) {
			let D = e;
			(e = o(h)),
				e === D
					? l[e].p(h, v)
					: (J(),
					  P(l[D], 1, 1, () => {
							l[D] = null;
					  }),
					  H(),
					  (n = l[e]),
					  n ? n.p(h, v) : ((n = l[e] = t[e](h)), n.c()),
					  I(n, 1),
					  n.m(a.parentNode, a)),
				h[6]
					? c
						? c.p(h, v)
						: ((c = Pe(h)), c.c(), c.m(r.parentNode, r))
					: c && (c.d(1), (c = null));
		},
		i(h) {
			u || (I(n), (u = !0));
		},
		o(h) {
			P(n), (u = !1);
		},
		d(h) {
			l[e].d(h), h && j(a), c && c.d(h), h && j(r);
		}
	};
}
function dt(s, e, n) {
	let { stores: a } = e,
		{ page: r } = e,
		{ components: u } = e,
		{ data_0: t = null } = e,
		{ data_1: l = null } = e,
		{ data_2: o = null } = e,
		{ data_3: c = null } = e,
		{ errors: h } = e;
	Ce(a.page.notify);
	let v = !1,
		D = !1,
		T = null;
	return (
		_e(() => {
			const b = a.page.subscribe(() => {
				v && (n(7, (D = !0)), n(8, (T = document.title || 'untitled page')));
			});
			return n(6, (v = !0)), b;
		}),
		(s.$$set = (b) => {
			'stores' in b && n(9, (a = b.stores)),
				'page' in b && n(10, (r = b.page)),
				'components' in b && n(0, (u = b.components)),
				'data_0' in b && n(1, (t = b.data_0)),
				'data_1' in b && n(2, (l = b.data_1)),
				'data_2' in b && n(3, (o = b.data_2)),
				'data_3' in b && n(4, (c = b.data_3)),
				'errors' in b && n(5, (h = b.errors));
		}),
		(s.$$.update = () => {
			s.$$.dirty & 1536 && a.page.set(r);
		}),
		[u, t, l, o, c, h, v, D, T, a, r]
	);
}
class pt extends Te {
	constructor(e) {
		super(),
			Ue(this, e, dt, _t, Ve, {
				stores: 9,
				page: 10,
				components: 0,
				data_0: 1,
				data_1: 2,
				data_2: 3,
				data_3: 4,
				errors: 5
			});
	}
}
const mt = {},
	re = [
		() =>
			V(
				() => import('./chunks/0-14faffd9.js'),
				[
					'chunks/0-14faffd9.js',
					'components/pages/_layout.svelte-de343b50.js',
					'assets/+layout-1798ff3d.css',
					'chunks/index-2fad9c0c.js',
					'chunks/Link-2f41dbb7.js',
					'assets/Link-5c73b3cb.css',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/1-4288da4b.js'),
				[
					'chunks/1-4288da4b.js',
					'components/error.svelte-cbb4e852.js',
					'chunks/index-2fad9c0c.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/2-f8e383dd.js'),
				[
					'chunks/2-f8e383dd.js',
					'components/pages/about/_layout.svelte-5da6c71f.js',
					'assets/+layout-a7dc71bf.css',
					'chunks/index-2fad9c0c.js',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/3-2e2d7b85.js'),
				[
					'chunks/3-2e2d7b85.js',
					'components/pages/help/_layout.svelte-61d16e27.js',
					'chunks/index-2fad9c0c.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/4-c66b93f9.js'),
				[
					'chunks/4-c66b93f9.js',
					'components/pages/_page.svelte-35216bb9.js',
					'assets/+page-609cc40a.css',
					'chunks/index-2fad9c0c.js',
					'chunks/Link-2f41dbb7.js',
					'assets/Link-5c73b3cb.css',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/5-c277b245.js'),
				[
					'chunks/5-c277b245.js',
					'components/pages/about/_page.svx-6d9de31a.js',
					'chunks/index-2fad9c0c.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/6-8ed0bb9e.js'),
				[
					'chunks/6-8ed0bb9e.js',
					'components/pages/cultproposals/_page.svelte-e189cfe8.js',
					'chunks/index-2fad9c0c.js',
					'chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js',
					'assets/Select-6318a4e1.css',
					'chunks/cultproposals-be315c4c.js',
					'chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js',
					'assets/Select-ddd51714.css',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/7-e7f1ad8d.js'),
				[
					'chunks/7-e7f1ad8d.js',
					'chunks/_page-cd0d65eb.js',
					'chunks/preload-helper-e2690c66.js',
					'components/pages/events/_page.svelte-b501d02a.js',
					'assets/+page-154cd178.css',
					'chunks/index-2fad9c0c.js',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/8-15ccb4d6.js'),
				[
					'chunks/8-15ccb4d6.js',
					'components/pages/events/2022-eth-barcelona/_page.svx-097ffaad.js',
					'assets/+page-76af88bd.css',
					'chunks/index-2fad9c0c.js',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/9-42520f1d.js'),
				[
					'chunks/9-42520f1d.js',
					'components/pages/help/submitting/_page.svelte-9570c182.js',
					'assets/+page-891482f7.css',
					'chunks/index-2fad9c0c.js',
					'chunks/Select-8360dfd8.js',
					'chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js',
					'assets/Select-ddd51714.css',
					'chunks/components-9abf80d5.js',
					'chunks/cultproposals-be315c4c.js',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/10-ce298453.js'),
				[
					'chunks/10-ce298453.js',
					'components/pages/markets/_page.svelte-2b3e4f75.js',
					'assets/+page-613d2aea.css',
					'chunks/index-2fad9c0c.js',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/11-00da66a0.js'),
				[
					'chunks/11-00da66a0.js',
					'components/pages/news/_page.svelte-cf2c4c85.js',
					'chunks/index-2fad9c0c.js',
					'chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js',
					'assets/Select-6318a4e1.css',
					'chunks/Select-8360dfd8.js',
					'chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js',
					'assets/Select-ddd51714.css',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js',
					'chunks/singletons-9297043a.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/12-2de937b4.js'),
				[
					'chunks/12-2de937b4.js',
					'components/pages/resources/_page.svelte-89838982.js',
					'chunks/index-2fad9c0c.js'
				],
				import.meta.url
			),
		() =>
			V(
				() => import('./chunks/13-9c09e40e.js'),
				[
					'chunks/13-9c09e40e.js',
					'components/pages/rvltproposals/_page.svelte-80d07458.js',
					'assets/+page-25b901e9.css',
					'chunks/index-2fad9c0c.js',
					'chunks/singletons-9297043a.js',
					'chunks/components-9abf80d5.js',
					'chunks/Select.svelte_svelte_type_style_lang-e1f3ca44.js',
					'assets/Select-6318a4e1.css',
					'chunks/Select.svelte_svelte_type_style_lang-bb1ab90c.js',
					'assets/Select-ddd51714.css',
					'chunks/Seo-fad38391.js',
					'chunks/stores-df887d2e.js'
				],
				import.meta.url
			)
	],
	ht = {
		'': [[1], [0], 4],
		about: [[1], [0, 2], 5],
		cultproposals: [[1], [0], 6],
		events: [[1], [0], 7],
		markets: [[1], [0], 10],
		news: [[1], [0], 11],
		resources: [[1], [0], 12],
		rvltproposals: [[1], [0], 13],
		'events/2022-eth-barcelona': [[1], [0], 8],
		'help/submitting': [[1], [0, 3], 9]
	},
	De = 'sveltekit:scroll',
	F = 'sveltekit:index',
	fe = nt(re, ht, mt),
	gt = re[0](),
	wt = re[1]();
let ee = {};
try {
	ee = JSON.parse(sessionStorage[De]);
} catch {}
function ue(s) {
	ee[s] = de();
}
function bt({ target: s, base: e, trailing_slash: n }) {
	var $e;
	const a = [],
		r = { id: null, promise: null },
		u = { before_navigate: [], after_navigate: [] };
	let t = { branch: [], error: null, session_id: 0, url: null },
		l = !1,
		o = !0,
		c = !1,
		h = 1,
		v = null,
		D,
		T = !0,
		b = ($e = history.state) == null ? void 0 : $e[F];
	b || ((b = Date.now()), history.replaceState({ ...history.state, [F]: b }, '', location.href));
	const X = ee[b];
	X && ((history.scrollRestoration = 'manual'), scrollTo(X.x, X.y));
	let Z = !1,
		ae,
		me;
	async function he(
		i,
		{ noscroll: p = !1, replaceState: g = !1, keepfocus: f = !1, state: _ = {} },
		E
	) {
		if ((typeof i == 'string' && (i = new URL(i, Le(document))), T))
			return ie({
				url: i,
				scroll: p ? de() : null,
				keepfocus: f,
				redirect_chain: E,
				details: { state: _, replaceState: g },
				accepted: () => {},
				blocked: () => {}
			});
		await Q(i);
	}
	async function ge(i) {
		const p = ye(i);
		if (!p) throw new Error('Attempted to prefetch a URL that does not belong to this app');
		return (r.promise = ve(p)), (r.id = p.id), r.promise;
	}
	async function we(i, p, g, f) {
		var y, A, L;
		const _ = ye(i),
			E = (me = {});
		let m = _ && (await ve(_));
		if (
			(!m &&
				i.origin === location.origin &&
				i.pathname === location.pathname &&
				(m = await ne({
					status: 404,
					error: new Error(`Not found: ${i.pathname}`),
					url: i,
					routeId: null
				})),
			!m)
		)
			return await Q(i), !1;
		if (((i = (_ == null ? void 0 : _.url) || i), me !== E)) return !1;
		if (((a.length = 0), m.type === 'redirect'))
			if (p.length > 10 || p.includes(i.pathname))
				m = await ne({ status: 500, error: new Error('Redirect loop'), url: i, routeId: null });
			else
				return (
					T
						? he(new URL(m.location, i).href, {}, [...p, i.pathname])
						: await Q(new URL(m.location, location.href)),
					!1
				);
		else
			((A = (y = m.props) == null ? void 0 : y.page) == null ? void 0 : A.status) >= 400 &&
				(await M.updated.check()) &&
				(await Q(i));
		if (((c = !0), g && g.details)) {
			const { details: S } = g,
				k = S.replaceState ? 0 : 1;
			(S.state[F] = b += k), history[S.replaceState ? 'replaceState' : 'pushState'](S.state, '', i);
		}
		if ((l ? ((t = m.state), m.props.page && (m.props.page.url = i), D.$set(m.props)) : be(m), g)) {
			const { scroll: S, keepfocus: k } = g;
			if (!k) {
				const w = document.body,
					d = w.getAttribute('tabindex');
				(w.tabIndex = -1),
					w.focus({ preventScroll: !0 }),
					setTimeout(() => {
						var $;
						($ = getSelection()) == null || $.removeAllRanges();
					}),
					d !== null ? w.setAttribute('tabindex', d) : w.removeAttribute('tabindex');
			}
			if ((await Re(), o)) {
				const w = i.hash && document.getElementById(i.hash.slice(1));
				S ? scrollTo(S.x, S.y) : w ? w.scrollIntoView() : scrollTo(0, 0);
			}
		} else await Re();
		(r.promise = null), (r.id = null), (o = !0), m.props.page && (ae = m.props.page);
		const R = m.state.branch[m.state.branch.length - 1];
		(T = ((L = R == null ? void 0 : R.node.shared) == null ? void 0 : L.router) !== !1),
			f && f(),
			(c = !1);
	}
	function be(i) {
		t = i.state;
		const p = document.querySelector('style[data-sveltekit]');
		if (
			(p && p.remove(),
			(ae = i.props.page),
			(D = new pt({ target: s, props: { ...i.props, stores: M }, hydrate: !0 })),
			T)
		) {
			const g = { from: null, to: new URL(location.href) };
			u.after_navigate.forEach((f) => f(g));
		}
		l = !0;
	}
	async function te({
		url: i,
		params: p,
		branch: g,
		status: f,
		error: _,
		routeId: E,
		validation_errors: m
	}) {
		const R = g.filter(Boolean),
			y = {
				type: 'loaded',
				state: { url: i, params: p, branch: g, error: _, session_id: h },
				props: { components: R.map((k) => k.node.component), errors: m }
			};
		let A = {},
			L = !1;
		for (let k = 0; k < R.length; k += 1)
			(A = { ...A, ...R[k].data }),
				(L || !t.branch.some((w) => w === R[k])) && ((y.props[`data_${k}`] = A), (L = !0));
		if (!t.url || i.href !== t.url.href || t.error !== _ || L) {
			y.props.page = { error: _, params: p, routeId: E, status: f, url: i, data: A };
			const k = (w, d) => {
				Object.defineProperty(y.props.page, w, {
					get: () => {
						throw new Error(`$page.${w} has been replaced by $page.url.${d}`);
					}
				});
			};
			k('origin', 'origin'), k('path', 'pathname'), k('query', 'searchParams');
		}
		return y;
	}
	async function se({ node: i, parent: p, url: g, params: f, routeId: _, server_data: E }) {
		var S, k;
		const m = { params: new Set(), url: !1, dependencies: new Set(), parent: !1 };
		function R(...w) {
			for (const d of w) {
				const { href: $ } = new URL(d, g);
				m.dependencies.add($);
			}
		}
		let y = null;
		i.server && (m.dependencies.add(g.href), (m.url = !0));
		const A = {};
		for (const w in f)
			Object.defineProperty(A, w, {
				get() {
					return m.params.add(w), f[w];
				},
				enumerable: !0
			});
		const L = new Xe(g);
		if ((S = i.shared) != null && S.load) {
			const w = {
				routeId: _,
				params: A,
				data: E,
				get url() {
					return (m.url = !0), L;
				},
				async fetch(d, $) {
					let U;
					typeof d == 'string'
						? (U = d)
						: ((U = d.url),
						  ($ = {
								body: d.method === 'GET' || d.method === 'HEAD' ? void 0 : await d.blob(),
								cache: d.cache,
								credentials: d.credentials,
								headers: d.headers,
								integrity: d.integrity,
								keepalive: d.keepalive,
								method: d.method,
								mode: d.mode,
								redirect: d.redirect,
								referrer: d.referrer,
								referrerPolicy: d.referrerPolicy,
								signal: d.signal,
								...$
						  }));
					const z = new URL(U, g).href;
					return R(z), l ? pe(z, $) : Qe(U, $);
				},
				setHeaders: () => {},
				depends: R,
				get parent() {
					return (m.parent = !0), p;
				}
			};
			Object.defineProperties(w, {
				props: {
					get() {
						throw new Error(
							'@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693'
						);
					},
					enumerable: !1
				},
				session: {
					get() {
						throw new Error(
							'session is no longer available. See https://github.com/sveltejs/kit/discussions/5883'
						);
					},
					enumerable: !1
				},
				stuff: {
					get() {
						throw new Error(
							'@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693'
						);
					},
					enumerable: !1
				}
			}),
				(y = (k = await i.shared.load.call(null, w)) != null ? k : null);
		}
		return { node: i, data: y || E, uses: m };
	}
	async function ve({ id: i, url: p, params: g, route: f }) {
		if (r.id === i && r.promise) return r.promise;
		const { errors: _, layouts: E, leaf: m } = f,
			R = t.url && {
				url: i !== t.url.pathname + t.url.search,
				params: Object.keys(g).filter((d) => t.params[d] !== g[d])
			};
		[..._, ...E, m].forEach((d) => (d == null ? void 0 : d().catch(() => {})));
		const y = [...E, m],
			A = [];
		for (let d = 0; d < y.length; d++)
			if (!y[d]) A.push(!1);
			else {
				const $ = t.branch[d],
					U =
						!$ ||
						(R.url && $.uses.url) ||
						R.params.some((z) => $.uses.params.has(z)) ||
						Array.from($.uses.dependencies).some((z) => a.some((x) => x(z))) ||
						($.uses.parent && A.includes(!0));
				A.push(U);
			}
		let L = null;
		if (f.uses_server_data) {
			try {
				const d = await pe(
					`${p.pathname}${p.pathname.endsWith('/') ? '' : '/'}__data.json${p.search}`
				);
				if (((L = await d.json()), !d.ok)) throw L;
			} catch {
				throw new Error('TODO render fallback error page');
			}
			if (L.type === 'redirect') return L;
		}
		const S = L == null ? void 0 : L.nodes,
			k = y.map(async (d, $) =>
				Promise.resolve().then(async () => {
					var Y;
					if (!d) return;
					const U = await d(),
						z = t.branch[$];
					if (A[$] || !z || U !== z.node) {
						const K = S == null ? void 0 : S[$];
						if (K != null && K.status) throw Me(K.status, K.message);
						if (K != null && K.error) throw K.error;
						return await se({
							node: U,
							url: p,
							params: g,
							routeId: f.id,
							parent: async () => {
								var Ee;
								const ke = {};
								for (let oe = 0; oe < $; oe += 1)
									Object.assign(ke, (Ee = await k[oe]) == null ? void 0 : Ee.data);
								return ke;
							},
							server_data: (Y = K == null ? void 0 : K.data) != null ? Y : null
						});
					} else return z;
				})
			);
		for (const d of k) d.catch(() => {});
		const w = [];
		for (let d = 0; d < y.length; d += 1)
			if (y[d])
				try {
					w.push(await k[d]);
				} catch ($) {
					const U = $;
					if (U instanceof Oe) return { type: 'redirect', location: U.location };
					const z = $ instanceof ce ? $.status : 500;
					for (; d--; )
						if (_[d]) {
							let x,
								Y = d;
							for (; !w[Y]; ) Y -= 1;
							try {
								return (
									(x = {
										node: await _[d](),
										data: {},
										uses: { params: new Set(), url: !1, dependencies: new Set(), parent: !1 }
									}),
									await te({
										url: p,
										params: g,
										branch: w.slice(0, Y + 1).concat(x),
										status: z,
										error: U,
										routeId: f.id
									})
								);
							} catch {
								continue;
							}
						}
					return await ne({ status: z, error: U, url: p, routeId: f.id });
				}
			else w.push(void 0);
		return await te({ url: p, params: g, branch: w, status: 200, error: null, routeId: f.id });
	}
	async function ne({ status: i, error: p, url: g, routeId: f }) {
		const _ = {},
			E = await se({
				node: await gt,
				url: g,
				params: _,
				routeId: f,
				parent: () => Promise.resolve({}),
				server_data: null
			}),
			m = {
				node: await wt,
				data: null,
				uses: { params: new Set(), url: !1, dependencies: new Set(), parent: !1 }
			};
		return await te({ url: g, params: _, branch: [E, m], status: i, error: p, routeId: f });
	}
	function ye(i) {
		if (i.origin !== location.origin || !i.pathname.startsWith(e)) return;
		const p = decodeURI(i.pathname.slice(e.length) || '/');
		for (const g of fe) {
			const f = g.exec(p);
			if (f) {
				const _ = new URL(i.origin + Ge(i.pathname, n) + i.search + i.hash);
				return { id: _.pathname + _.search, route: g, params: Ye(f), url: _ };
			}
		}
	}
	async function ie({
		url: i,
		scroll: p,
		keepfocus: g,
		redirect_chain: f,
		details: _,
		accepted: E,
		blocked: m
	}) {
		const R = t.url;
		let y = !1;
		const A = { from: R, to: i, cancel: () => (y = !0) };
		if ((u.before_navigate.forEach((L) => L(A)), y)) {
			m();
			return;
		}
		ue(b),
			E(),
			l && M.navigating.set({ from: t.url, to: i }),
			await we(i, f, { scroll: p, keepfocus: g, details: _ }, () => {
				const L = { from: R, to: i };
				u.after_navigate.forEach((S) => S(L)), M.navigating.set(null);
			});
	}
	function Q(i) {
		return (location.href = i.href), new Promise(() => {});
	}
	return {
		after_navigate: (i) => {
			_e(
				() => (
					u.after_navigate.push(i),
					() => {
						const p = u.after_navigate.indexOf(i);
						u.after_navigate.splice(p, 1);
					}
				)
			);
		},
		before_navigate: (i) => {
			_e(
				() => (
					u.before_navigate.push(i),
					() => {
						const p = u.before_navigate.indexOf(i);
						u.before_navigate.splice(p, 1);
					}
				)
			);
		},
		disable_scroll_handling: () => {
			(c || !l) && (o = !1);
		},
		goto: (i, p = {}) => he(i, p, []),
		invalidate: (i) => {
			if (i === void 0) {
				for (const p of t.branch) p == null || p.uses.dependencies.add('');
				a.push(() => !0);
			} else if (typeof i == 'function') a.push(i);
			else {
				const { href: p } = new URL(i, location.href);
				a.push((g) => g === p);
			}
			return (
				v ||
					(v = Promise.resolve().then(async () => {
						await we(new URL(location.href), []), (v = null);
					})),
				v
			);
		},
		prefetch: async (i) => {
			const p = new URL(i, Le(document));
			await ge(p);
		},
		prefetch_routes: async (i) => {
			const g = (i ? fe.filter((f) => i.some((_) => f.exec(_))) : fe).map((f) =>
				Promise.all([...f.layouts, f.leaf].map((_) => (_ == null ? void 0 : _())))
			);
			await Promise.all(g);
		},
		_start_router: () => {
			(history.scrollRestoration = 'manual'),
				addEventListener('beforeunload', (f) => {
					let _ = !1;
					const E = { from: t.url, to: null, cancel: () => (_ = !0) };
					u.before_navigate.forEach((m) => m(E)),
						_ ? (f.preventDefault(), (f.returnValue = '')) : (history.scrollRestoration = 'auto');
				}),
				addEventListener('visibilitychange', () => {
					if (document.visibilityState === 'hidden') {
						ue(b);
						try {
							sessionStorage[De] = JSON.stringify(ee);
						} catch {}
					}
				});
			const i = (f) => {
				const _ = Se(f);
				_ && _.href && _.hasAttribute('sveltekit:prefetch') && ge(Ae(_));
			};
			let p;
			const g = (f) => {
				clearTimeout(p),
					(p = setTimeout(() => {
						var _;
						(_ = f.target) == null ||
							_.dispatchEvent(new CustomEvent('sveltekit:trigger_prefetch', { bubbles: !0 }));
					}, 20));
			};
			addEventListener('touchstart', i),
				addEventListener('mousemove', g),
				addEventListener('sveltekit:trigger_prefetch', i),
				addEventListener('click', (f) => {
					if (
						!T ||
						f.button ||
						f.which !== 1 ||
						f.metaKey ||
						f.ctrlKey ||
						f.shiftKey ||
						f.altKey ||
						f.defaultPrevented
					)
						return;
					const _ = Se(f);
					if (!_ || !_.href) return;
					const E = _ instanceof SVGAElement,
						m = Ae(_);
					if (!E && !(m.protocol === 'https:' || m.protocol === 'http:')) return;
					const R = (_.getAttribute('rel') || '').split(/\s+/);
					if (
						_.hasAttribute('download') ||
						R.includes('external') ||
						_.hasAttribute('sveltekit:reload') ||
						(E ? _.target.baseVal : _.target)
					)
						return;
					const [y, A] = m.href.split('#');
					if (A !== void 0 && y === location.href.split('#')[0]) {
						(Z = !0), ue(b), M.page.set({ ...ae, url: m }), M.page.notify();
						return;
					}
					ie({
						url: m,
						scroll: _.hasAttribute('sveltekit:noscroll') ? de() : null,
						keepfocus: !1,
						redirect_chain: [],
						details: { state: {}, replaceState: m.href === location.href },
						accepted: () => f.preventDefault(),
						blocked: () => f.preventDefault()
					});
				}),
				addEventListener('popstate', (f) => {
					if (f.state && T) {
						if (f.state[F] === b) return;
						ie({
							url: new URL(location.href),
							scroll: ee[f.state[F]],
							keepfocus: !1,
							redirect_chain: [],
							details: null,
							accepted: () => {
								b = f.state[F];
							},
							blocked: () => {
								const _ = b - f.state[F];
								history.go(_);
							}
						});
					}
				}),
				addEventListener('hashchange', () => {
					Z && ((Z = !1), history.replaceState({ ...history.state, [F]: ++b }, '', location.href));
				});
			for (const f of document.querySelectorAll('link')) f.rel === 'icon' && (f.href = f.href);
			addEventListener('pageshow', (f) => {
				f.persisted && M.navigating.set(null);
			});
		},
		_hydrate: async ({ status: i, error: p, node_ids: g, params: f, routeId: _ }) => {
			const E = new URL(location.href);
			let m;
			try {
				const R = (S, k) => {
						const w = document.querySelector(`script[sveltekit\\:data-type="${S}"]`);
						return w != null && w.textContent ? JSON.parse(w.textContent) : k;
					},
					y = R('server_data', []),
					A = R('validation_errors', void 0),
					L = g.map(async (S, k) => {
						var w;
						return se({
							node: await re[S](),
							url: E,
							params: f,
							routeId: _,
							parent: async () => {
								const d = {};
								for (let $ = 0; $ < k; $ += 1) Object.assign(d, (await L[$]).data);
								return d;
							},
							server_data: (w = y[k]) != null ? w : null
						});
					});
				m = await te({
					url: E,
					params: f,
					branch: await Promise.all(L),
					status: i,
					error: p != null && p.__is_http_error ? new ce(p.status, p.message) : p,
					validation_errors: A,
					routeId: _
				});
			} catch (R) {
				const y = R;
				if (y instanceof Oe) {
					await Q(new URL(R.location, location.href));
					return;
				}
				m = await ne({ status: y instanceof ce ? y.status : 500, error: y, url: E, routeId: _ });
			}
			be(m);
		}
	};
}
function kt(s) {}
async function Et({ paths: s, target: e, route: n, spa: a, trailing_slash: r, hydrate: u }) {
	const t = bt({ target: e, base: s.base, trailing_slash: r });
	We({ client: t }),
		Fe(s),
		u && (await t._hydrate(u)),
		n && (a && t.goto(location.href, { replaceState: !0 }), t._start_router()),
		dispatchEvent(new CustomEvent('sveltekit:start'));
}
export { kt as set_public_env, Et as start };
