import {
	S as Te,
	i as Ve,
	s as Ue,
	a as je,
	e as P,
	c as Ne,
	b as B,
	g as J,
	t as S,
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
} from './chunks/index-2fe5515f.js';
import {
	g as Le,
	f as Ae,
	a as Oe,
	s as M,
	b as de,
	i as We,
	c as Fe
} from './chunks/singletons-a3426cc4.js';
import { _ as D, H as ce, R as Pe, e as Me } from './chunks/preload-helper-e2690c66.js';
function Ge(i, e) {
	return i === '/' || e === 'ignore'
		? i
		: e === 'never'
		? i.endsWith('/')
			? i.slice(0, -1)
			: i
		: e === 'always' && !i.endsWith('/')
		? i + '/'
		: i;
}
function Ye(i) {
	for (const e in i)
		i[e] = i[e]
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
	return i;
}
class Xe extends URL {
	get hash() {
		throw new Error(
			'url.hash is inaccessible from load. Consider accessing hash from the page store within the script tag of your component.'
		);
	}
}
function Ze(i) {
	let e = 5381,
		n = i.length;
	if (typeof i == 'string') for (; n; ) e = (e * 33) ^ i.charCodeAt(--n);
	else for (; n; ) e = (e * 33) ^ i[--n];
	return (e >>> 0).toString(36);
}
const pe = window.fetch;
function Qe(i, e) {
	let a = `script[sveltekit\\:data-type="data"][sveltekit\\:data-url=${JSON.stringify(
		typeof i == 'string' ? i : i.url
	)}]`;
	e && typeof e.body == 'string' && (a += `[sveltekit\\:data-body="${Ze(e.body)}"]`);
	const r = document.querySelector(a);
	if (r && r.textContent) {
		const { body: u, ...t } = JSON.parse(r.textContent);
		return Promise.resolve(new Response(u, t));
	}
	return pe(i, e);
}
const xe = /^(\.\.\.)?(\w+)(?:=(\w+))?$/;
function et(i) {
	const e = [],
		n = [];
	let a = !0;
	return {
		pattern:
			i === ''
				? /^\/$/
				: new RegExp(
						`^${i
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
											.map((b, T) => {
												if (T % 2) {
													const V = xe.exec(b);
													if (!V)
														throw new Error(
															`Invalid param: ${b}. Params and matcher names can only have underscores and alphanumeric characters.`
														);
													const [, v, X, Z] = V;
													return e.push(X), n.push(Z), v ? '(.*?)' : '([^/]+?)';
												}
												return (
													h && b.includes('.') && (a = !1),
													b
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
function tt(i, e, n, a) {
	const r = {};
	for (let u = 0; u < e.length; u += 1) {
		const t = e[u],
			l = n[u],
			o = i[u + 1] || '';
		if (l) {
			const c = a[l];
			if (!c) throw new Error(`Missing "${l}" param matcher`);
			if (!c(o)) return;
		}
		r[t] = o;
	}
	return r;
}
function nt(i, e, n) {
	return Object.entries(e).map(([a, [r, u, t, l]]) => {
		const { pattern: o, names: c, types: h } = et(a),
			b = {
				id: a,
				exec: (T) => {
					const V = o.exec(T);
					if (V) return tt(V, c, h, n);
				},
				errors: r.map((T) => i[T]),
				layouts: u.map((T) => i[T]),
				leaf: i[t],
				uses_server_data: !!l
			};
		return (b.errors.length = b.layouts.length = Math.max(b.errors.length, b.layouts.length)), b;
	});
}
function rt(i) {
	let e, n, a;
	var r = i[0][0];
	function u(t) {
		return { props: { data: t[1], errors: t[5] } };
	}
	return (
		r && (e = new r(u(i))),
		{
			c() {
				e && N(e.$$.fragment), (n = P());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = P());
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
						S(c.$$.fragment, 1, 0, () => {
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
				e && S(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function at(i) {
	let e, n, a;
	var r = i[0][0];
	function u(t) {
		return { props: { data: t[1], $$slots: { default: [ut] }, $$scope: { ctx: t } } };
	}
	return (
		r && (e = new r(u(i))),
		{
			c() {
				e && N(e.$$.fragment), (n = P());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = P());
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
						S(c.$$.fragment, 1, 0, () => {
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
				e && S(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function it(i) {
	let e, n, a;
	var r = i[0][1];
	function u(t) {
		return { props: { data: t[2], errors: t[5] } };
	}
	return (
		r && (e = new r(u(i))),
		{
			c() {
				e && N(e.$$.fragment), (n = P());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = P());
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
						S(c.$$.fragment, 1, 0, () => {
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
				e && S(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function st(i) {
	let e, n, a;
	var r = i[0][1];
	function u(t) {
		return { props: { data: t[2], $$slots: { default: [ft] }, $$scope: { ctx: t } } };
	}
	return (
		r && (e = new r(u(i))),
		{
			c() {
				e && N(e.$$.fragment), (n = P());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = P());
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
						S(c.$$.fragment, 1, 0, () => {
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
				e && S(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function ot(i) {
	let e, n, a;
	var r = i[0][2];
	function u(t) {
		return { props: { data: t[3], errors: t[5] } };
	}
	return (
		r && (e = new r(u(i))),
		{
			c() {
				e && N(e.$$.fragment), (n = P());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = P());
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
						S(c.$$.fragment, 1, 0, () => {
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
				e && S(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function lt(i) {
	let e, n, a;
	var r = i[0][2];
	function u(t) {
		return { props: { data: t[3], $$slots: { default: [ct] }, $$scope: { ctx: t } } };
	}
	return (
		r && (e = new r(u(i))),
		{
			c() {
				e && N(e.$$.fragment), (n = P());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = P());
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
						S(c.$$.fragment, 1, 0, () => {
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
				e && S(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function ct(i) {
	let e, n, a;
	var r = i[0][3];
	function u(t) {
		return { props: { data: t[4] } };
	}
	return (
		r && (e = new r(u(i))),
		{
			c() {
				e && N(e.$$.fragment), (n = P());
			},
			l(t) {
				e && G(e.$$.fragment, t), (n = P());
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
						S(c.$$.fragment, 1, 0, () => {
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
				e && S(e.$$.fragment, t), (a = !1);
			},
			d(t) {
				t && j(n), e && q(e, t);
			}
		}
	);
}
function ft(i) {
	let e, n, a, r;
	const u = [lt, ot],
		t = [];
	function l(o, c) {
		return o[0][3] ? 0 : 1;
	}
	return (
		(e = l(i)),
		(n = t[e] = u[e](i)),
		{
			c() {
				n.c(), (a = P());
			},
			l(o) {
				n.l(o), (a = P());
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
						  S(t[h], 1, 1, () => {
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
				S(n), (r = !1);
			},
			d(o) {
				t[e].d(o), o && j(a);
			}
		}
	);
}
function ut(i) {
	let e, n, a, r;
	const u = [st, it],
		t = [];
	function l(o, c) {
		return o[0][2] ? 0 : 1;
	}
	return (
		(e = l(i)),
		(n = t[e] = u[e](i)),
		{
			c() {
				n.c(), (a = P());
			},
			l(o) {
				n.l(o), (a = P());
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
						  S(t[h], 1, 1, () => {
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
				S(n), (r = !1);
			},
			d(o) {
				t[e].d(o), o && j(a);
			}
		}
	);
}
function Se(i) {
	let e,
		n = i[7] && Ie(i);
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
function Ie(i) {
	let e;
	return {
		c() {
			e = Be(i[8]);
		},
		l(n) {
			e = Je(n, i[8]);
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
function _t(i) {
	let e, n, a, r, u;
	const t = [at, rt],
		l = [];
	function o(h, b) {
		return h[0][1] ? 0 : 1;
	}
	(e = o(i)), (n = l[e] = t[e](i));
	let c = i[6] && Se(i);
	return {
		c() {
			n.c(), (a = je()), c && c.c(), (r = P());
		},
		l(h) {
			n.l(h), (a = Ne(h)), c && c.l(h), (r = P());
		},
		m(h, b) {
			l[e].m(h, b), B(h, a, b), c && c.m(h, b), B(h, r, b), (u = !0);
		},
		p(h, [b]) {
			let T = e;
			(e = o(h)),
				e === T
					? l[e].p(h, b)
					: (J(),
					  S(l[T], 1, 1, () => {
							l[T] = null;
					  }),
					  H(),
					  (n = l[e]),
					  n ? n.p(h, b) : ((n = l[e] = t[e](h)), n.c()),
					  I(n, 1),
					  n.m(a.parentNode, a)),
				h[6]
					? c
						? c.p(h, b)
						: ((c = Se(h)), c.c(), c.m(r.parentNode, r))
					: c && (c.d(1), (c = null));
		},
		i(h) {
			u || (I(n), (u = !0));
		},
		o(h) {
			S(n), (u = !1);
		},
		d(h) {
			l[e].d(h), h && j(a), c && c.d(h), h && j(r);
		}
	};
}
function dt(i, e, n) {
	let { stores: a } = e,
		{ page: r } = e,
		{ components: u } = e,
		{ data_0: t = null } = e,
		{ data_1: l = null } = e,
		{ data_2: o = null } = e,
		{ data_3: c = null } = e,
		{ errors: h } = e;
	Ce(a.page.notify);
	let b = !1,
		T = !1,
		V = null;
	return (
		_e(() => {
			const v = a.page.subscribe(() => {
				b && (n(7, (T = !0)), n(8, (V = document.title || 'untitled page')));
			});
			return n(6, (b = !0)), v;
		}),
		(i.$$set = (v) => {
			'stores' in v && n(9, (a = v.stores)),
				'page' in v && n(10, (r = v.page)),
				'components' in v && n(0, (u = v.components)),
				'data_0' in v && n(1, (t = v.data_0)),
				'data_1' in v && n(2, (l = v.data_1)),
				'data_2' in v && n(3, (o = v.data_2)),
				'data_3' in v && n(4, (c = v.data_3)),
				'errors' in v && n(5, (h = v.errors));
		}),
		(i.$$.update = () => {
			i.$$.dirty & 1536 && a.page.set(r);
		}),
		[u, t, l, o, c, h, b, T, V, a, r]
	);
}
class pt extends Te {
	constructor(e) {
		super(),
			Ve(this, e, dt, _t, Ue, {
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
			D(
				() => import('./chunks/0-57d281c1.js'),
				[
					'chunks/0-57d281c1.js',
					'components/pages/_layout.svelte-de96207a.js',
					'assets/+layout-1798ff3d.css',
					'chunks/index-2fe5515f.js',
					'chunks/Link-9339c978.js',
					'assets/Link-5c73b3cb.css',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/1-2df4bf8b.js'),
				[
					'chunks/1-2df4bf8b.js',
					'components/error.svelte-dbcf03c7.js',
					'chunks/index-2fe5515f.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/2-a1942a93.js'),
				[
					'chunks/2-a1942a93.js',
					'components/pages/about/_layout.svelte-4a5dd4cb.js',
					'assets/+layout-a7dc71bf.css',
					'chunks/index-2fe5515f.js',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/3-44e24c9e.js'),
				[
					'chunks/3-44e24c9e.js',
					'components/pages/help/_layout.svelte-247ad70b.js',
					'chunks/index-2fe5515f.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/4-841f5644.js'),
				[
					'chunks/4-841f5644.js',
					'components/pages/_page.svelte-ce8edfce.js',
					'assets/+page-609cc40a.css',
					'chunks/index-2fe5515f.js',
					'chunks/Link-9339c978.js',
					'assets/Link-5c73b3cb.css',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/5-e247b6dd.js'),
				[
					'chunks/5-e247b6dd.js',
					'components/pages/about/_page.svx-38c163ce.js',
					'chunks/index-2fe5515f.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/6-3eb25d61.js'),
				[
					'chunks/6-3eb25d61.js',
					'components/pages/cultproposals/_page.svelte-c06b5941.js',
					'chunks/index-2fe5515f.js',
					'chunks/SearchLayout-13a80f1b.js',
					'assets/SearchLayout-6318a4e1.css',
					'chunks/Select-0fad25ba.js',
					'assets/Select-ddd51714.css',
					'chunks/cultproposals-ee6a2386.js',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/7-8b23e346.js'),
				[
					'chunks/7-8b23e346.js',
					'chunks/_page-beaadccf.js',
					'chunks/preload-helper-e2690c66.js',
					'components/pages/events/_page.svelte-bc02f7ef.js',
					'assets/+page-154cd178.css',
					'chunks/index-2fe5515f.js',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/8-c4c77164.js'),
				[
					'chunks/8-c4c77164.js',
					'components/pages/events/2021-summit-fall/_page.svx-9ebfb627.js',
					'chunks/index-2fe5515f.js',
					'chunks/EventPage-a016509a.js',
					'assets/EventPage-76af88bd.css',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/9-137ad591.js'),
				[
					'chunks/9-137ad591.js',
					'components/pages/events/2021-summit-spring/_page.svx-121944bc.js',
					'chunks/index-2fe5515f.js',
					'chunks/EventPage-a016509a.js',
					'assets/EventPage-76af88bd.css',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/10-c481b16d.js'),
				[
					'chunks/10-c481b16d.js',
					'components/pages/events/frsocietyday2020/_page.svx-0a93051e.js',
					'chunks/index-2fe5515f.js',
					'chunks/EventPage-a016509a.js',
					'assets/EventPage-76af88bd.css',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/11-6db8fdf5.js'),
				[
					'chunks/11-6db8fdf5.js',
					'components/pages/events/societyday2020/_page.svx-f67904af.js',
					'chunks/index-2fe5515f.js',
					'chunks/EventPage-a016509a.js',
					'assets/EventPage-76af88bd.css',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/12-3d05eff1.js'),
				[
					'chunks/12-3d05eff1.js',
					'components/pages/events/summit2020/_page.svx-0624e6bb.js',
					'chunks/index-2fe5515f.js',
					'chunks/EventPage-a016509a.js',
					'assets/EventPage-76af88bd.css',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/13-4b0d07c1.js'),
				[
					'chunks/13-4b0d07c1.js',
					'components/pages/help/submitting/_page.svelte-421c4757.js',
					'assets/+page-891482f7.css',
					'chunks/index-2fe5515f.js',
					'chunks/Select-0fad25ba.js',
					'assets/Select-ddd51714.css',
					'chunks/components-9abf80d5.js',
					'chunks/cultproposals-ee6a2386.js',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/14-02a40620.js'),
				[
					'chunks/14-02a40620.js',
					'components/pages/markets/_page.svelte-d667aee6.js',
					'assets/+page-613d2aea.css',
					'chunks/index-2fe5515f.js',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/15-d76b9235.js'),
				[
					'chunks/15-d76b9235.js',
					'components/pages/news/_page.svelte-dcf21022.js',
					'chunks/index-2fe5515f.js',
					'chunks/SearchLayout-13a80f1b.js',
					'assets/SearchLayout-6318a4e1.css',
					'chunks/Select-0fad25ba.js',
					'assets/Select-ddd51714.css',
					'chunks/cultproposals-ee6a2386.js',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js',
					'chunks/singletons-a3426cc4.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/16-80f75c51.js'),
				[
					'chunks/16-80f75c51.js',
					'components/pages/resources/_page.svelte-556fadb0.js',
					'assets/+page-5a41033f.css',
					'chunks/index-2fe5515f.js'
				],
				import.meta.url
			),
		() =>
			D(
				() => import('./chunks/17-87246f6f.js'),
				[
					'chunks/17-87246f6f.js',
					'components/pages/rvltproposals/_page.svelte-3edfb0e5.js',
					'assets/+page-25b901e9.css',
					'chunks/index-2fe5515f.js',
					'chunks/singletons-a3426cc4.js',
					'chunks/components-9abf80d5.js',
					'chunks/SearchLayout-13a80f1b.js',
					'assets/SearchLayout-6318a4e1.css',
					'chunks/Select-0fad25ba.js',
					'assets/Select-ddd51714.css',
					'chunks/Seo-fb4a23a4.js',
					'chunks/stores-e1bb27ae.js'
				],
				import.meta.url
			)
	],
	ht = {
		'': [[1], [0], 4],
		about: [[1], [0, 2], 5],
		cultproposals: [[1], [0], 6],
		events: [[1], [0], 7],
		markets: [[1], [0], 14],
		news: [[1], [0], 15],
		resources: [[1], [0], 16],
		rvltproposals: [[1], [0], 17],
		'events/2021-summit-fall': [[1], [0], 8],
		'events/2021-summit-spring': [[1], [0], 9],
		'events/frsocietyday2020': [[1], [0], 10],
		'events/societyday2020': [[1], [0], 11],
		'events/summit2020': [[1], [0], 12],
		'help/submitting': [[1], [0, 3], 13]
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
function ue(i) {
	ee[i] = de();
}
function vt({ target: i, base: e, trailing_slash: n }) {
	var $e;
	const a = [],
		r = { id: null, promise: null },
		u = { before_navigate: [], after_navigate: [] };
	let t = { branch: [], error: null, session_id: 0, url: null },
		l = !1,
		o = !0,
		c = !1,
		h = 1,
		b = null,
		T,
		V = !0,
		v = ($e = history.state) == null ? void 0 : $e[F];
	v || ((v = Date.now()), history.replaceState({ ...history.state, [F]: v }, '', location.href));
	const X = ee[v];
	X && ((history.scrollRestoration = 'manual'), scrollTo(X.x, X.y));
	let Z = !1,
		ae,
		me;
	async function he(
		s,
		{ noscroll: p = !1, replaceState: g = !1, keepfocus: f = !1, state: _ = {} },
		k
	) {
		if ((typeof s == 'string' && (s = new URL(s, Le(document))), V))
			return se({
				url: s,
				scroll: p ? de() : null,
				keepfocus: f,
				redirect_chain: k,
				details: { state: _, replaceState: g },
				accepted: () => {},
				blocked: () => {}
			});
		await Q(s);
	}
	async function ge(s) {
		const p = ye(s);
		if (!p) throw new Error('Attempted to prefetch a URL that does not belong to this app');
		return (r.promise = be(p)), (r.id = p.id), r.promise;
	}
	async function we(s, p, g, f) {
		var y, O, L;
		const _ = ye(s),
			k = (me = {});
		let m = _ && (await be(_));
		if (
			(!m &&
				s.origin === location.origin &&
				s.pathname === location.pathname &&
				(m = await ne({
					status: 404,
					error: new Error(`Not found: ${s.pathname}`),
					url: s,
					routeId: null
				})),
			!m)
		)
			return await Q(s), !1;
		if (((s = (_ == null ? void 0 : _.url) || s), me !== k)) return !1;
		if (((a.length = 0), m.type === 'redirect'))
			if (p.length > 10 || p.includes(s.pathname))
				m = await ne({ status: 500, error: new Error('Redirect loop'), url: s, routeId: null });
			else
				return (
					V
						? he(new URL(m.location, s).href, {}, [...p, s.pathname])
						: await Q(new URL(m.location, location.href)),
					!1
				);
		else
			((O = (y = m.props) == null ? void 0 : y.page) == null ? void 0 : O.status) >= 400 &&
				(await M.updated.check()) &&
				(await Q(s));
		if (((c = !0), g && g.details)) {
			const { details: A } = g,
				E = A.replaceState ? 0 : 1;
			(A.state[F] = v += E), history[A.replaceState ? 'replaceState' : 'pushState'](A.state, '', s);
		}
		if ((l ? ((t = m.state), m.props.page && (m.props.page.url = s), T.$set(m.props)) : ve(m), g)) {
			const { scroll: A, keepfocus: E } = g;
			if (!E) {
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
				const w = s.hash && document.getElementById(s.hash.slice(1));
				A ? scrollTo(A.x, A.y) : w ? w.scrollIntoView() : scrollTo(0, 0);
			}
		} else await Re();
		(r.promise = null), (r.id = null), (o = !0), m.props.page && (ae = m.props.page);
		const R = m.state.branch[m.state.branch.length - 1];
		(V = ((L = R == null ? void 0 : R.node.shared) == null ? void 0 : L.router) !== !1),
			f && f(),
			(c = !1);
	}
	function ve(s) {
		t = s.state;
		const p = document.querySelector('style[data-sveltekit]');
		if (
			(p && p.remove(),
			(ae = s.props.page),
			(T = new pt({ target: i, props: { ...s.props, stores: M }, hydrate: !0 })),
			V)
		) {
			const g = { from: null, to: new URL(location.href) };
			u.after_navigate.forEach((f) => f(g));
		}
		l = !0;
	}
	async function te({
		url: s,
		params: p,
		branch: g,
		status: f,
		error: _,
		routeId: k,
		validation_errors: m
	}) {
		const R = g.filter(Boolean),
			y = {
				type: 'loaded',
				state: { url: s, params: p, branch: g, error: _, session_id: h },
				props: { components: R.map((E) => E.node.component), errors: m }
			};
		let O = {},
			L = !1;
		for (let E = 0; E < R.length; E += 1)
			(O = { ...O, ...R[E].data }),
				(L || !t.branch.some((w) => w === R[E])) && ((y.props[`data_${E}`] = O), (L = !0));
		if (!t.url || s.href !== t.url.href || t.error !== _ || L) {
			y.props.page = { error: _, params: p, routeId: k, status: f, url: s, data: O };
			const E = (w, d) => {
				Object.defineProperty(y.props.page, w, {
					get: () => {
						throw new Error(`$page.${w} has been replaced by $page.url.${d}`);
					}
				});
			};
			E('origin', 'origin'), E('path', 'pathname'), E('query', 'searchParams');
		}
		return y;
	}
	async function ie({ node: s, parent: p, url: g, params: f, routeId: _, server_data: k }) {
		var A, E;
		const m = { params: new Set(), url: !1, dependencies: new Set(), parent: !1 };
		function R(...w) {
			for (const d of w) {
				const { href: $ } = new URL(d, g);
				m.dependencies.add($);
			}
		}
		let y = null;
		s.server && (m.dependencies.add(g.href), (m.url = !0));
		const O = {};
		for (const w in f)
			Object.defineProperty(O, w, {
				get() {
					return m.params.add(w), f[w];
				},
				enumerable: !0
			});
		const L = new Xe(g);
		if ((A = s.shared) != null && A.load) {
			const w = {
				routeId: _,
				params: O,
				data: k,
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
				(y = (E = await s.shared.load.call(null, w)) != null ? E : null);
		}
		return { node: s, data: y || k, uses: m };
	}
	async function be({ id: s, url: p, params: g, route: f }) {
		if (r.id === s && r.promise) return r.promise;
		const { errors: _, layouts: k, leaf: m } = f,
			R = t.url && {
				url: s !== t.url.pathname + t.url.search,
				params: Object.keys(g).filter((d) => t.params[d] !== g[d])
			};
		[..._, ...k, m].forEach((d) => (d == null ? void 0 : d().catch(() => {})));
		const y = [...k, m],
			O = [];
		for (let d = 0; d < y.length; d++)
			if (!y[d]) O.push(!1);
			else {
				const $ = t.branch[d],
					U =
						!$ ||
						(R.url && $.uses.url) ||
						R.params.some((z) => $.uses.params.has(z)) ||
						Array.from($.uses.dependencies).some((z) => a.some((x) => x(z))) ||
						($.uses.parent && O.includes(!0));
				O.push(U);
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
		const A = L == null ? void 0 : L.nodes,
			E = y.map(async (d, $) =>
				Promise.resolve().then(async () => {
					var Y;
					if (!d) return;
					const U = await d(),
						z = t.branch[$];
					if (O[$] || !z || U !== z.node) {
						const K = A == null ? void 0 : A[$];
						if (K != null && K.status) throw Me(K.status, K.message);
						if (K != null && K.error) throw K.error;
						return await ie({
							node: U,
							url: p,
							params: g,
							routeId: f.id,
							parent: async () => {
								var ke;
								const Ee = {};
								for (let oe = 0; oe < $; oe += 1)
									Object.assign(Ee, (ke = await E[oe]) == null ? void 0 : ke.data);
								return Ee;
							},
							server_data: (Y = K == null ? void 0 : K.data) != null ? Y : null
						});
					} else return z;
				})
			);
		for (const d of E) d.catch(() => {});
		const w = [];
		for (let d = 0; d < y.length; d += 1)
			if (y[d])
				try {
					w.push(await E[d]);
				} catch ($) {
					const U = $;
					if (U instanceof Pe) return { type: 'redirect', location: U.location };
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
	async function ne({ status: s, error: p, url: g, routeId: f }) {
		const _ = {},
			k = await ie({
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
		return await te({ url: g, params: _, branch: [k, m], status: s, error: p, routeId: f });
	}
	function ye(s) {
		if (s.origin !== location.origin || !s.pathname.startsWith(e)) return;
		const p = decodeURI(s.pathname.slice(e.length) || '/');
		for (const g of fe) {
			const f = g.exec(p);
			if (f) {
				const _ = new URL(s.origin + Ge(s.pathname, n) + s.search + s.hash);
				return { id: _.pathname + _.search, route: g, params: Ye(f), url: _ };
			}
		}
	}
	async function se({
		url: s,
		scroll: p,
		keepfocus: g,
		redirect_chain: f,
		details: _,
		accepted: k,
		blocked: m
	}) {
		const R = t.url;
		let y = !1;
		const O = { from: R, to: s, cancel: () => (y = !0) };
		if ((u.before_navigate.forEach((L) => L(O)), y)) {
			m();
			return;
		}
		ue(v),
			k(),
			l && M.navigating.set({ from: t.url, to: s }),
			await we(s, f, { scroll: p, keepfocus: g, details: _ }, () => {
				const L = { from: R, to: s };
				u.after_navigate.forEach((A) => A(L)), M.navigating.set(null);
			});
	}
	function Q(s) {
		return (location.href = s.href), new Promise(() => {});
	}
	return {
		after_navigate: (s) => {
			_e(
				() => (
					u.after_navigate.push(s),
					() => {
						const p = u.after_navigate.indexOf(s);
						u.after_navigate.splice(p, 1);
					}
				)
			);
		},
		before_navigate: (s) => {
			_e(
				() => (
					u.before_navigate.push(s),
					() => {
						const p = u.before_navigate.indexOf(s);
						u.before_navigate.splice(p, 1);
					}
				)
			);
		},
		disable_scroll_handling: () => {
			(c || !l) && (o = !1);
		},
		goto: (s, p = {}) => he(s, p, []),
		invalidate: (s) => {
			if (s === void 0) {
				for (const p of t.branch) p == null || p.uses.dependencies.add('');
				a.push(() => !0);
			} else if (typeof s == 'function') a.push(s);
			else {
				const { href: p } = new URL(s, location.href);
				a.push((g) => g === p);
			}
			return (
				b ||
					(b = Promise.resolve().then(async () => {
						await we(new URL(location.href), []), (b = null);
					})),
				b
			);
		},
		prefetch: async (s) => {
			const p = new URL(s, Le(document));
			await ge(p);
		},
		prefetch_routes: async (s) => {
			const g = (s ? fe.filter((f) => s.some((_) => f.exec(_))) : fe).map((f) =>
				Promise.all([...f.layouts, f.leaf].map((_) => (_ == null ? void 0 : _())))
			);
			await Promise.all(g);
		},
		_start_router: () => {
			(history.scrollRestoration = 'manual'),
				addEventListener('beforeunload', (f) => {
					let _ = !1;
					const k = { from: t.url, to: null, cancel: () => (_ = !0) };
					u.before_navigate.forEach((m) => m(k)),
						_ ? (f.preventDefault(), (f.returnValue = '')) : (history.scrollRestoration = 'auto');
				}),
				addEventListener('visibilitychange', () => {
					if (document.visibilityState === 'hidden') {
						ue(v);
						try {
							sessionStorage[De] = JSON.stringify(ee);
						} catch {}
					}
				});
			const s = (f) => {
				const _ = Ae(f);
				_ && _.href && _.hasAttribute('sveltekit:prefetch') && ge(Oe(_));
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
			addEventListener('touchstart', s),
				addEventListener('mousemove', g),
				addEventListener('sveltekit:trigger_prefetch', s),
				addEventListener('click', (f) => {
					if (
						!V ||
						f.button ||
						f.which !== 1 ||
						f.metaKey ||
						f.ctrlKey ||
						f.shiftKey ||
						f.altKey ||
						f.defaultPrevented
					)
						return;
					const _ = Ae(f);
					if (!_ || !_.href) return;
					const k = _ instanceof SVGAElement,
						m = Oe(_);
					if (!k && !(m.protocol === 'https:' || m.protocol === 'http:')) return;
					const R = (_.getAttribute('rel') || '').split(/\s+/);
					if (
						_.hasAttribute('download') ||
						R.includes('external') ||
						_.hasAttribute('sveltekit:reload') ||
						(k ? _.target.baseVal : _.target)
					)
						return;
					const [y, O] = m.href.split('#');
					if (O !== void 0 && y === location.href.split('#')[0]) {
						(Z = !0), ue(v), M.page.set({ ...ae, url: m }), M.page.notify();
						return;
					}
					se({
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
					if (f.state && V) {
						if (f.state[F] === v) return;
						se({
							url: new URL(location.href),
							scroll: ee[f.state[F]],
							keepfocus: !1,
							redirect_chain: [],
							details: null,
							accepted: () => {
								v = f.state[F];
							},
							blocked: () => {
								const _ = v - f.state[F];
								history.go(_);
							}
						});
					}
				}),
				addEventListener('hashchange', () => {
					Z && ((Z = !1), history.replaceState({ ...history.state, [F]: ++v }, '', location.href));
				});
			for (const f of document.querySelectorAll('link')) f.rel === 'icon' && (f.href = f.href);
			addEventListener('pageshow', (f) => {
				f.persisted && M.navigating.set(null);
			});
		},
		_hydrate: async ({ status: s, error: p, node_ids: g, params: f, routeId: _ }) => {
			const k = new URL(location.href);
			let m;
			try {
				const R = (A, E) => {
						const w = document.querySelector(`script[sveltekit\\:data-type="${A}"]`);
						return w != null && w.textContent ? JSON.parse(w.textContent) : E;
					},
					y = R('server_data', []),
					O = R('validation_errors', void 0),
					L = g.map(async (A, E) => {
						var w;
						return ie({
							node: await re[A](),
							url: k,
							params: f,
							routeId: _,
							parent: async () => {
								const d = {};
								for (let $ = 0; $ < E; $ += 1) Object.assign(d, (await L[$]).data);
								return d;
							},
							server_data: (w = y[E]) != null ? w : null
						});
					});
				m = await te({
					url: k,
					params: f,
					branch: await Promise.all(L),
					status: s,
					error: p != null && p.__is_http_error ? new ce(p.status, p.message) : p,
					validation_errors: O,
					routeId: _
				});
			} catch (R) {
				const y = R;
				if (y instanceof Pe) {
					await Q(new URL(R.location, location.href));
					return;
				}
				m = await ne({ status: y instanceof ce ? y.status : 500, error: y, url: k, routeId: _ });
			}
			ve(m);
		}
	};
}
function Et(i) {}
async function kt({ paths: i, target: e, route: n, spa: a, trailing_slash: r, hydrate: u }) {
	const t = vt({ target: e, base: i.base, trailing_slash: r });
	We({ client: t }),
		Fe(i),
		u && (await t._hydrate(u)),
		n && (a && t.goto(location.href, { replaceState: !0 }), t._start_router()),
		dispatchEvent(new CustomEvent('sveltekit:start'));
}
export { Et as set_public_env, kt as start };
