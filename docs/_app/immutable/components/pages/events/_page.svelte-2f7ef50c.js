import {
	S as s1,
	i as o1,
	s as i1,
	L as T1,
	M as H1,
	m as C,
	h,
	n as v,
	b as U,
	A as O,
	k as _,
	q as $,
	l as L,
	r as M,
	C as o,
	f as S,
	g as M1,
	d as E1,
	t as V,
	D as A1,
	e as g1,
	a as T,
	v as j,
	c as H,
	w as W,
	x as G,
	y as Y,
	u as _1
} from '../../../chunks/index-bbe4a303.js';
import { S as S1 } from '../../../chunks/Seo-75e3160f.js';
import '../../../chunks/stores-e89956e6.js';
import '../../../chunks/singletons-c431273f.js';
function U1(s) {
	let e,
		r = s[3].svg + '',
		l;
	return {
		c() {
			(e = T1('svg')), this.h();
		},
		l(t) {
			e = H1(t, 'svg', { class: !0, focusable: !0, width: !0, height: !0, viewBox: !0 });
			var n = C(e);
			n.forEach(h), this.h();
		},
		h() {
			v(e, 'class', (l = 'svgicon ' + s[0] + ' svelte-1dyed4p')),
				v(e, 'focusable', 'false'),
				v(e, 'width', s[1]),
				v(e, 'height', s[2]),
				v(e, 'viewBox', '0 0 ' + s[3].box);
		},
		m(t, n) {
			U(t, e, n), (e.innerHTML = r);
		},
		p(t, [n]) {
			n & 1 && l !== (l = 'svgicon ' + t[0] + ' svelte-1dyed4p') && v(e, 'class', l),
				n & 2 && v(e, 'width', t[1]),
				n & 4 && v(e, 'height', t[2]);
		},
		i: O,
		o: O,
		d(t) {
			t && h(e);
		}
	};
}
function V1(s, e, r) {
	let { name: l } = e,
		{ width: t = '24px' } = e,
		{ height: n = '24px' } = e,
		u = [
			{
				box: '24 24',
				name: 'archive',
				svg: `<path
      d="M3 10h18v10.004c0 .55-.445.996-.993.996H3.993A.994.994 0 0 1 3 20.004V10zm6 2v2h6v-2H9zM2 4c0-.552.455-1 .992-1h18.016c.548 0 .992.444.992 1v4H2V4z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'bug',
				svg: `<path
      d="M6.056 8.3a7.01 7.01 0 0 1 .199-.3h11.49c.069.098.135.199.199.3l2.02-1.166l1 1.732l-2.213 1.278c.162.59.249 1.213.249 1.856v1h3v2h-3a6.96 6.96 0 0 1-.536 2.69l2.5 1.444l-1 1.732l-2.526-1.458A6.992 6.992 0 0 1 13 21.929V14h-2v7.93a6.992 6.992 0 0 1-4.438-2.522l-2.526 1.458l-1-1.732l2.5-1.443A6.979 6.979 0 0 1 5 15H2v-2h3v-1c0-.643.087-1.265.249-1.856L3.036 8.866l1-1.732L6.056 8.3zM8 6a4 4 0 1 1 8 0H8z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'calendar',
				svg: `<path
      d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zm3 6V5h-3v2h-2V5H9v2H7V5H4v4h16zm0 2H4v8h16v-8zM6 13h5v4H6v-4z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'code',
				svg: `<path
      d="M24 12l-5.657 5.657l-1.414-1.414L21.172 12l-4.243-4.243l1.414-1.414L24 12zM2.828 12l4.243 4.243l-1.414 1.414L0 12l5.657-5.657L7.07 7.757L2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'close',
				svg: `<path
      d="M12 10.586l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.414 1.414l-4.95-4.95l-4.95 4.95l-1.414-1.414l4.95-4.95l-4.95-4.95L7.05 5.636z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'database',
				svg: `<path
      d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5s-4.03 4.5-9 4.5z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'discord',
				svg: `<path
      d="M10.076 11c.6 0 1.086.45 1.075 1c0 .55-.474 1-1.075 1C9.486 13 9 12.55 9 12s.475-1 1.076-1zm3.848 0c.601 0 1.076.45 1.076 1s-.475 1-1.076 1c-.59 0-1.075-.45-1.075-1s.474-1 1.075-1zm4.967-9C20.054 2 21 2.966 21 4.163V23l-2.211-1.995l-1.245-1.176l-1.317-1.25l.546 1.943H5.109C3.946 20.522 3 19.556 3 18.359V4.163C3 2.966 3.946 2 5.109 2H18.89zm-3.97 13.713c2.273-.073 3.148-1.596 3.148-1.596c0-3.381-1.482-6.122-1.482-6.122c-1.48-1.133-2.89-1.102-2.89-1.102l-.144.168c1.749.546 2.561 1.334 2.561 1.334a8.263 8.263 0 0 0-3.096-1.008a8.527 8.527 0 0 0-2.077.02c-.062 0-.114.011-.175.021c-.36.032-1.235.168-2.335.662c-.38.178-.607.305-.607.305s.854-.83 2.705-1.376l-.103-.126s-1.409-.031-2.89 1.103c0 0-1.481 2.74-1.481 6.121c0 0 .864 1.522 3.137 1.596c0 0 .38-.472.69-.871c-1.307-.4-1.8-1.24-1.8-1.24s.102.074.287.179c.01.01.02.021.041.031c.031.022.062.032.093.053c.257.147.514.262.75.357c.422.168.926.336 1.513.452a7.06 7.06 0 0 0 2.664.01a6.666 6.666 0 0 0 1.491-.451c.36-.137.761-.337 1.183-.62c0 0-.514.861-1.862 1.25c.309.399.68.85.68.85z"
      fill="currentColor"
    />`
			},
			{
				box: '256 185',
				name: 'docker',
				svg: `<path
      d="M250.716 70.497c-5.765-4-18.976-5.5-29.304-3.5c-1.2-10-6.725-18.749-16.333-26.499l-5.524-4l-3.844 5.75c-4.803 7.5-7.205 18-6.485 28c.24 3.499 1.441 9.749 5.044 15.249c-3.362 2-10.328 4.5-19.455 4.5H1.155l-.48 2c-1.682 9.999-1.682 41.248 18.014 65.247c14.892 18.249 36.99 27.499 66.053 27.499c62.93 0 109.528-30.25 131.386-84.997c8.647.25 27.142 0 36.51-18.75c.24-.5.72-1.5 2.401-5.249l.961-2l-5.284-3.25zM139.986 0h-26.42v24.999h26.42V0zm0 29.999h-26.42v24.999h26.42v-25zm-31.225 0h-26.42v24.999h26.42v-25zm-31.225 0H51.115v24.999h26.421v-25zM46.311 59.998H19.89v24.999H46.31v-25zm31.225 0H51.115v24.999h26.421v-25zm31.225 0h-26.42v24.999h26.42v-25zm31.226 0h-26.422v24.999h26.422v-25zm31.225 0H144.79v24.999h26.422v-25z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'double-checkmark',
				svg: `<path
      d="M11.602 13.76l1.412 1.412l8.466-8.466l1.414 1.414l-9.88 9.88l-6.364-6.364l1.414-1.414l2.125 2.125l1.413 1.412zm.002-2.828l4.952-4.953l1.41 1.41l-4.952 4.953l-1.41-1.41zm-2.827 5.655L7.364 18L1 11.636l1.414-1.414l1.413 1.413l-.001.001l4.951 4.951z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'github',
				svg: `<path
                      d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
                      fill="currentColor"
                    />`
			},
			{
				box: '24 24',
				name: 'globe',
				svg: `<path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.008 8.008 0 0 0 5.648 6.667zM10.03 13c.151 2.439.848 4.73 1.97 6.752A15.905 15.905 0 0 0 13.97 13h-3.94zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.008 8.008 0 0 0 19.938 13zM4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.008 8.008 0 0 0 4.062 11zm5.969 0h3.938A15.905 15.905 0 0 0 12 4.248A15.905 15.905 0 0 0 10.03 11zm4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.008 8.008 0 0 0-5.648-6.667z"
                  fill="currentColor"
                />`
			},
			{
				box: '24 24',
				name: 'hammer',
				svg: `<path
      d="M17 8V2h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3zm-2 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V8H2.5V6.074a1 1 0 0 1 .496-.863L8.5 2H15v20z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'palette',
				svg: `<path d="M12.5708+2C18.0928+2+22.5708+5.978+22.5708+10.889C22.5692+13.9566+20.0825+16.4429+17.0148+16.444L15.0488+16.444C14.1268+16.444+13.3818+17.189+13.3818+18.111C13.3818+18.533+13.5488+18.922+13.8038+19.211C14.0708+19.511+14.2378+19.9+14.2378+20.333C14.2378+21.256+13.4708+22+12.5708+22C7.04881+22+2.57081+17.522+2.57081+12C2.57081+6.478+7.04881+2+12.5708+2ZM8.07081+12C8.89924+12+9.57081+11.3284+9.57081+10.5C9.57081+9.67157+8.89924+9+8.07081+9C7.24239+9+6.57081+9.67157+6.57081+10.5C6.57081+11.3284+7.24239+12+8.07081+12ZM17.0708+12C17.8992+12+18.5708+11.3284+18.5708+10.5C18.5708+9.67157+17.8992+9+17.0708+9C16.2424+9+15.5708+9.67157+15.5708+10.5C15.5708+11.3284+16.2424+12+17.0708+12ZM12.5708+9C13.3992+9+14.0708+8.32843+14.0708+7.5C14.0708+6.67157+13.3992+6+12.5708+6C11.7424+6+11.0708+6.67157+11.0708+7.5C11.0708+8.32843+11.7424+9+12.5708+9Z" opacity="1" fill="#854d0e"/>
  <path d="M8.14863+8.91325L8.14863+8.91325C9.02461+8.91325+9.73473+9.62336+9.73473+10.4993L9.73473+10.4993C9.73473+11.3753+9.02461+12.0854+8.14863+12.0854L8.14863+12.0854C7.27266+12.0854+6.56254+11.3753+6.56254+10.4993L6.56254+10.4993C6.56254+9.62336+7.27266+8.91325+8.14863+8.91325Z" opacity="1" fill="#dc2626"/>
  <path d="M12.5708+5.85437L12.5708+5.85437C13.5146+5.85437+14.2796+6.61942+14.2796+7.56315L14.2796+7.56315C14.2796+8.50689+13.5146+9.27194+12.5708+9.27194L12.5708+9.27194C11.6271+9.27194+10.862+8.50689+10.862+7.56315L10.862+7.56315C10.862+6.61942+11.6271+5.85437+12.5708+5.85437Z" opacity="1" fill="#15803d"/>
  <path d="M17.245+8.79055L17.245+8.79055C18.1887+8.79055+18.9537+9.5556+18.9537+10.4993L18.9537+10.4993C18.9537+11.4431+18.1887+12.2081+17.245+12.2081L17.245+12.2081C16.3012+12.2081+15.5362+11.4431+15.5362+10.4993L15.5362+10.4993C15.5362+9.5556+16.3012+8.79055+17.245+8.79055Z" opacity="1" fill="#facc15"/>
  `
			},
			{
				box: '24 24',
				name: 'telegram',
				svg: `<path
      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm-3.11-8.83l.013-.007l.87 2.87c.112.311.266.367.453.341c.188-.025.287-.126.41-.244l1.188-1.148l2.55 1.888c.466.257.801.124.917-.432l1.657-7.822c.183-.728-.137-1.02-.702-.788l-9.733 3.76c-.664.266-.66.638-.12.803l2.497.78z"
      fill="currentColor"
    />`
			},
			{
				box: '24 24',
				name: 'twitter',
				svg: `<path
                  d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814a11.874 11.874 0 0 1-8.62-4.37a4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101a4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732a11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9c0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
                  fill="currentColor"
                />`
			},
			{
				box: '24 24',
				name: 'virus',
				svg: `<path d="M13.717+1.947L17.451+3.381L16.734+5.248L15.8+4.889L15.054+6.834C15.8324+7.29588+16.4971+7.92675+16.999+8.68L18.902+7.833L18.495+6.919L20.322+6.106L21.949+9.76L20.122+10.573L19.715+9.66L17.813+10.507C18.0374+11.3837+18.0613+12.2998+17.883+13.187L19.827+13.933L20.185+13L22.053+13.717L20.619+17.451L18.752+16.734L19.11+15.801L17.166+15.054C16.7041+15.8324+16.0733+16.4971+15.32+16.999L16.167+18.902L17.081+18.495L17.894+20.322L14.24+21.949L13.427+20.122L14.34+19.715L13.493+17.813C12.6159+18.0372+11.6995+18.0608+10.812+17.882L10.066+19.827L11+20.185L10.283+22.053L6.549+20.619L7.266+18.752L8.198+19.11L8.946+17.166C8.16749+16.7039+7.5025+16.0731+7+15.32L5.097+16.167L5.504+17.081L3.677+17.894L2.05+14.24L3.877+13.427L4.283+14.341L6.186+13.493C5.96355+12.616+5.93997+11.7003+6.117+10.813L4.172+10.067L3.815+11L1.947+10.283L3.381+6.55L5.248+7.267L4.889+8.2L6.834+8.947C7.2958+8.16798+7.92666+7.50261+8.68+7L7.833+5.097L6.919+5.504L6.106+3.677L9.76+2.051L10.573+3.878L9.66+4.285L10.507+6.187C11.3837+5.96262+12.2998+5.9387+13.187+6.117L13.932+4.172L13+3.815L13.717+1.947ZM10.134+13.232C9.85786+13.7106+10.0219+14.3224+10.5005+14.5985C10.9791+14.8746+11.5909+14.7106+11.867+14.232C12.1431+13.7534+11.9791+13.1416+11.5005+12.8655C11.0219+12.5894+10.4101+12.7534+10.134+13.232ZM14+11C13.4477+11+13+11.4477+13+12C13+12.5523+13.4477+13+14+13C14.5523+13+15+12.5523+15+12C15+11.4477+14.5523+11+14+11ZM10.5+9.402C10.0217+9.67842+9.85808+10.2902+10.1345+10.7685C10.4109+11.2468+11.0227+11.4104+11.501+11.134C11.9791+10.8575+12.1426+10.2458+11.8662+9.76767C11.5898+9.28951+10.9783+9.12581+10.5+9.402Z" opacity="1" fill="#fb7185"/>
  <path d="M11.0058+12.5876L11.0058+12.5876C11.6116+12.5876+12.1026+13.0787+12.1026+13.6845L12.1026+13.6845C12.1026+14.2902+11.6116+14.7813+11.0058+14.7813L11.0058+14.7813C10.4001+14.7813+9.90898+14.2902+9.90898+13.6845L9.90898+13.6845C9.90898+13.0787+10.4001+12.5876+11.0058+12.5876Z" opacity="1" fill="#f43f5e"/>
  <path d="M11.0058+8.8978L11.0058+8.8978C11.728+8.8978+12.3135+9.48326+12.3135+10.2054L12.3135+10.2054C12.3135+10.9276+11.728+11.5131+11.0058+11.5131L11.0058+11.5131C10.2836+11.5131+9.69817+10.9276+9.69817+10.2054L9.69817+10.2054C9.69817+9.48326+10.2836+8.8978+11.0058+8.8978Z" opacity="1" fill="#f43f5e"/>
  <path d="M13.9035+10.8667L13.9035+10.8667C14.5294+10.8667+15.0368+11.3741+15.0368+12L15.0368+12C15.0368+12.6259+14.5294+13.1333+13.9035+13.1333L13.9035+13.1333C13.2776+13.1333+12.7702+12.6259+12.7702+12L12.7702+12C12.7702+11.3741+13.2776+10.8667+13.9035+10.8667Z" opacity="1" fill="#f43f5e"/>
  `
			},
			{
				box: '24 24',
				name: 'youtube',
				svg: `<path
      d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5l-6-3.5v7z"
      fill="currentColor"
    />`
			}
		].find((a) => a.name === l);
	if (!u) throw Error(`Could not find icon with name ${l}`);
	return (
		(s.$$set = (a) => {
			'name' in a && r(0, (l = a.name)),
				'width' in a && r(1, (t = a.width)),
				'height' in a && r(2, (n = a.height));
		}),
		[l, t, n, u]
	);
}
class t1 extends s1 {
	constructor(e) {
		super(), o1(this, e, V1, U1, i1, { name: 0, width: 1, height: 2 });
	}
}
const L1 = [
	{ continent: '\u{1F1EA}\u{1F1FA} Europe', type: 'contintent' },
	{
		name: 'London Svelte Meetup',
		country: '\u{1F1EC}\u{1F1E7} Great Britain',
		url: 'https://cultdao.io'
	},
	{ name: 'CULT Dublin', country: '\u{1F1EE}\u{1F1EA} Ireland', url: 'https://cultdao.io' },
	{
		name: 'CULT Meetup Hamburg',
		country: '\u{1F1E9}\u{1F1EA} Germany',
		url: 'https://cultdao.io',
		githuburl: 'https://github.com/michael-spengler/cultmagazine'
	},
	{ name: 'Amsterdam CULT', country: '\u{1F1F3}\u{1F1F1} Netherlands', url: 'https://cultdao.io' },
	{
		name: 'CULT Bergen',
		country: '\u{1F1F3}\u{1F1F4} Norway',
		twitter: '@MrOmodulus',
		url: 'https://cultdao.io'
	},
	{
		name: 'CULT Society Stockholm',
		country: '\u{1F1F8}\u{1F1EA} Sweden',
		twitter: '@MrOmodulus',
		url: 'https://cultdao.io'
	},
	{
		name: 'CULT Society CZ/SK',
		country: '\u{1F1E8}\u{1F1FF} Czechia and \u{1F1F8}\u{1F1F0} Slovakia',
		discord: 'https://discord.gg/wearecultdao',
		url: 'https://cultdao.io'
	},
	{
		name: 'CULT Society Austria - Svienna',
		country: '\u{1F1E6}\u{1F1F9} Austria',
		url: 'https://cultdao.io',
		discord: 'https://discord.gg/wearecultdao',
		twitter: '@MrOmodulus'
	},
	{ continent: 'South America', type: 'contintent' },
	{
		name: 'CULT Brasil',
		country: '\u{1F1E7}\u{1F1F7} Brazil',
		telegram: 'https://t.me/cultdaothemany',
		twitter: '@MrOmodulus',
		url: 'https://cultdao.io',
		youtube: 'https://rumble.com/c/c-1902267',
		githuburl: 'https://github.com/michael-spengler/cultmagazine'
	},
	{ continent: 'Russia', type: 'contintent' },
	{
		name: 'CULT Moscow',
		country: '\u{1F1F7}\u{1F1FA} Russia',
		telegram: 'https://t.me/sveltebrasil',
		twitter: '@MrOmodulus',
		url: 'https://cultdao.io/',
		youtube: 'https://rumble.com/c/c-1902267',
		githuburl: 'https://github.com/michael-spengler/cultmagazine'
	},
	{ continent: 'North America', type: 'contintent' },
	{
		name: 'CULT Chicago',
		country: '\u{1F1FA}\u{1F1F8} United States (chicago)',
		twitter: '@MrOmodulus',
		githuburl: 'https://github.com/michael-spengler/cultmagazine',
		url: 'https://cultdao.io'
	}
];
function C1(s, e, r) {
	const l = s.slice();
	return (l[0] = e[r]), l;
}
function P1(s) {
	let e,
		r = s[0].country + '',
		l,
		t,
		n,
		c,
		u,
		a,
		f,
		i,
		k = s[0].name + '',
		g,
		d,
		m,
		y,
		D,
		q,
		R;
	a = new t1({ props: { name: 'globe' } });
	let E = s[0].twitter && D1(s),
		B = s[0].telegram && B1(s),
		I = s[0].youtube && I1(s),
		P = s[0].githuburl && N1(s);
	return {
		c() {
			(e = _('h5')),
				(l = $(r)),
				(t = T()),
				(n = _('ul')),
				(c = _('li')),
				(u = _('span')),
				j(a.$$.fragment),
				(f = T()),
				(i = _('a')),
				(g = $(k)),
				(d = T()),
				E && E.c(),
				(m = T()),
				B && B.c(),
				(y = T()),
				I && I.c(),
				(D = T()),
				P && P.c(),
				(q = T()),
				this.h();
		},
		l(w) {
			e = L(w, 'H5', { class: !0 });
			var N = C(e);
			(l = M(N, r)), N.forEach(h), (t = H(w)), (n = L(w, 'UL', { class: !0 }));
			var Z = C(n);
			c = L(Z, 'LI', {});
			var e1 = C(c);
			u = L(e1, 'SPAN', { class: !0 });
			var J = C(u);
			W(a.$$.fragment, J), (f = H(J)), (i = L(J, 'A', { href: !0, rel: !0 }));
			var K = C(i);
			(g = M(K, k)),
				K.forEach(h),
				J.forEach(h),
				e1.forEach(h),
				(d = H(Z)),
				E && E.l(Z),
				(m = H(Z)),
				B && B.l(Z),
				(y = H(Z)),
				I && I.l(Z),
				(D = H(Z)),
				P && P.l(Z),
				(q = H(Z)),
				Z.forEach(h),
				this.h();
		},
		h() {
			v(e, 'class', 'society svelte-331ce1'),
				v(i, 'href', s[0].url),
				v(i, 'rel', 'noopener'),
				v(u, 'class', 'icon-wrapper svelte-331ce1'),
				v(n, 'class', 'society svelte-331ce1');
		},
		m(w, N) {
			U(w, e, N),
				o(e, l),
				U(w, t, N),
				U(w, n, N),
				o(n, c),
				o(c, u),
				G(a, u, null),
				o(u, f),
				o(u, i),
				o(i, g),
				o(n, d),
				E && E.m(n, null),
				o(n, m),
				B && B.m(n, null),
				o(n, y),
				I && I.m(n, null),
				o(n, D),
				P && P.m(n, null),
				o(n, q),
				(R = !0);
		},
		p(w, N) {
			w[0].twitter && E.p(w, N),
				w[0].telegram && B.p(w, N),
				w[0].youtube && I.p(w, N),
				w[0].githuburl && P.p(w, N);
		},
		i(w) {
			R || (S(a.$$.fragment, w), S(E), S(B), S(I), S(P), (R = !0));
		},
		o(w) {
			V(a.$$.fragment, w), V(E), V(B), V(I), V(P), (R = !1);
		},
		d(w) {
			w && h(e), w && h(t), w && h(n), Y(a), E && E.d(), B && B.d(), I && I.d(), P && P.d();
		}
	};
}
function Z1(s) {
	let e,
		r = s[0].continent + '',
		l;
	return {
		c() {
			(e = _('h4')), (l = $(r)), this.h();
		},
		l(t) {
			e = L(t, 'H4', { class: !0 });
			var n = C(e);
			(l = M(n, r)), n.forEach(h), this.h();
		},
		h() {
			v(e, 'class', 'continent svelte-331ce1');
		},
		m(t, n) {
			U(t, e, n), o(e, l);
		},
		p: O,
		i: O,
		o: O,
		d(t) {
			t && h(e);
		}
	};
}
function D1(s) {
	let e,
		r,
		l,
		t,
		n = s[0].twitter + '',
		c,
		u;
	return (
		(r = new t1({ props: { name: 'twitter' } })),
		{
			c() {
				(e = _('span')), j(r.$$.fragment), (l = T()), (t = _('a')), (c = $(n)), this.h();
			},
			l(a) {
				e = L(a, 'SPAN', { class: !0 });
				var f = C(e);
				W(r.$$.fragment, f), (l = H(f)), (t = L(f, 'A', { href: !0, rel: !0 }));
				var i = C(t);
				(c = M(i, n)), i.forEach(h), f.forEach(h), this.h();
			},
			h() {
				v(t, 'href', 'https://twitter.com/' + s[0].twitter),
					v(t, 'rel', 'noopener'),
					v(e, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(a, f) {
				U(a, e, f), G(r, e, null), o(e, l), o(e, t), o(t, c), (u = !0);
			},
			p: O,
			i(a) {
				u || (S(r.$$.fragment, a), (u = !0));
			},
			o(a) {
				V(r.$$.fragment, a), (u = !1);
			},
			d(a) {
				a && h(e), Y(r);
			}
		}
	);
}
function B1(s) {
	let e, r, l, t, n, c;
	return (
		(r = new t1({ props: { name: 'telegram' } })),
		{
			c() {
				(e = _('span')),
					j(r.$$.fragment),
					(l = T()),
					(t = _('a')),
					(n = $('Join on Telegram')),
					this.h();
			},
			l(u) {
				e = L(u, 'SPAN', { class: !0 });
				var a = C(e);
				W(r.$$.fragment, a), (l = H(a)), (t = L(a, 'A', { href: !0, target: !0, rel: !0 }));
				var f = C(t);
				(n = M(f, 'Join on Telegram')), f.forEach(h), a.forEach(h), this.h();
			},
			h() {
				v(t, 'href', s[0].telegram),
					v(t, 'target', '_blank'),
					v(t, 'rel', 'noopener'),
					v(e, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(u, a) {
				U(u, e, a), G(r, e, null), o(e, l), o(e, t), o(t, n), (c = !0);
			},
			p: O,
			i(u) {
				c || (S(r.$$.fragment, u), (c = !0));
			},
			o(u) {
				V(r.$$.fragment, u), (c = !1);
			},
			d(u) {
				u && h(e), Y(r);
			}
		}
	);
}
function I1(s) {
	let e,
		r,
		l,
		t,
		n = s[0].name + '',
		c,
		u,
		a;
	return (
		(r = new t1({ props: { name: 'youtube' } })),
		{
			c() {
				(e = _('span')),
					j(r.$$.fragment),
					(l = T()),
					(t = _('a')),
					(c = $(n)),
					(u = $(' YouTube Channel')),
					this.h();
			},
			l(f) {
				e = L(f, 'SPAN', { class: !0 });
				var i = C(e);
				W(r.$$.fragment, i), (l = H(i)), (t = L(i, 'A', { href: !0, target: !0, rel: !0 }));
				var k = C(t);
				(c = M(k, n)), (u = M(k, ' YouTube Channel')), k.forEach(h), i.forEach(h), this.h();
			},
			h() {
				v(t, 'href', s[0].youtube),
					v(t, 'target', '_blank'),
					v(t, 'rel', 'noopener'),
					v(e, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(f, i) {
				U(f, e, i), G(r, e, null), o(e, l), o(e, t), o(t, c), o(t, u), (a = !0);
			},
			p: O,
			i(f) {
				a || (S(r.$$.fragment, f), (a = !0));
			},
			o(f) {
				V(r.$$.fragment, f), (a = !1);
			},
			d(f) {
				f && h(e), Y(r);
			}
		}
	);
}
function N1(s) {
	let e, r, l, t, n, c, u;
	return (
		(l = new t1({ props: { name: 'github' } })),
		{
			c() {
				(e = _('li')),
					(r = _('span')),
					j(l.$$.fragment),
					(t = T()),
					(n = _('a')),
					(c = $('GitHub')),
					this.h();
			},
			l(a) {
				e = L(a, 'LI', {});
				var f = C(e);
				r = L(f, 'SPAN', { class: !0 });
				var i = C(r);
				W(l.$$.fragment, i), (t = H(i)), (n = L(i, 'A', { href: !0, target: !0, rel: !0 }));
				var k = C(n);
				(c = M(k, 'GitHub')), k.forEach(h), i.forEach(h), f.forEach(h), this.h();
			},
			h() {
				v(n, 'href', s[0].githuburl),
					v(n, 'target', '_blank'),
					v(n, 'rel', 'noopener'),
					v(r, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(a, f) {
				U(a, e, f), o(e, r), G(l, r, null), o(r, t), o(r, n), o(n, c), (u = !0);
			},
			p: O,
			i(a) {
				u || (S(l.$$.fragment, a), (u = !0));
			},
			o(a) {
				V(l.$$.fragment, a), (u = !1);
			},
			d(a) {
				a && h(e), Y(l);
			}
		}
	);
}
function b1(s) {
	let e, r, l, t;
	const n = [Z1, P1],
		c = [];
	function u(a, f) {
		return a[0].continent ? 0 : 1;
	}
	return (
		(e = u(s)),
		(r = c[e] = n[e](s)),
		{
			c() {
				r.c(), (l = g1());
			},
			l(a) {
				r.l(a), (l = g1());
			},
			m(a, f) {
				c[e].m(a, f), U(a, l, f), (t = !0);
			},
			p(a, f) {
				r.p(a, f);
			},
			i(a) {
				t || (S(r), (t = !0));
			},
			o(a) {
				V(r), (t = !1);
			},
			d(a) {
				c[e].d(a), a && h(l);
			}
		}
	);
}
function R1(s) {
	let e,
		r,
		l,
		t,
		n,
		c,
		u,
		a,
		f = L1,
		i = [];
	for (let g = 0; g < f.length; g += 1) i[g] = b1(C1(s, f, g));
	const k = (g) =>
		V(i[g], 1, 1, () => {
			i[g] = null;
		});
	return {
		c() {
			(e = _('div')),
				(r = _('h3')),
				(l = $('Communities Around the World')),
				(t = $(`
	Maintain 
	 `)),
				(n = _('a')),
				(c = $('here')),
				(u = $(`
	via pull request.
	`));
			for (let g = 0; g < i.length; g += 1) i[g].c();
			this.h();
		},
		l(g) {
			e = L(g, 'DIV', { class: !0 });
			var d = C(e);
			r = L(d, 'H3', { class: !0 });
			var m = C(r);
			(l = M(m, 'Communities Around the World')),
				m.forEach(h),
				(t = M(
					d,
					`
	Maintain 
	 `
				)),
				(n = L(d, 'A', { href: !0, target: !0 }));
			var y = C(n);
			(c = M(y, 'here')),
				y.forEach(h),
				(u = M(
					d,
					`
	via pull request.
	`
				));
			for (let D = 0; D < i.length; D += 1) i[D].l(d);
			d.forEach(h), this.h();
		},
		h() {
			v(r, 'class', 'title'),
				v(
					n,
					'href',
					'https://github.com/michael-spengler/cultmagazine/blob/staging/src/lib/components/communities/communities.json'
				),
				v(n, 'target', '_blank'),
				v(e, 'class', 'society-wrapper svelte-331ce1');
		},
		m(g, d) {
			U(g, e, d), o(e, r), o(r, l), o(e, t), o(e, n), o(n, c), o(e, u);
			for (let m = 0; m < i.length; m += 1) i[m].m(e, null);
			a = !0;
		},
		p(g, [d]) {
			if (d & 0) {
				f = L1;
				let m;
				for (m = 0; m < f.length; m += 1) {
					const y = C1(g, f, m);
					i[m]
						? (i[m].p(y, d), S(i[m], 1))
						: ((i[m] = b1(y)), i[m].c(), S(i[m], 1), i[m].m(e, null));
				}
				for (M1(), m = f.length; m < i.length; m += 1) k(m);
				E1();
			}
		},
		i(g) {
			if (!a) {
				for (let d = 0; d < f.length; d += 1) S(i[d]);
				a = !0;
			}
		},
		o(g) {
			i = i.filter(Boolean);
			for (let d = 0; d < i.length; d += 1) V(i[d]);
			a = !1;
		},
		d(g) {
			g && h(e), A1(i, g);
		}
	};
}
class q1 extends s1 {
	constructor(e) {
		super(), o1(this, e, null, R1, i1, {});
	}
}
function w1(s) {
	let e, r;
	return {
		c() {
			(e = _('span')), (r = $('Past event')), this.h();
		},
		l(l) {
			e = L(l, 'SPAN', { class: !0 });
			var t = C(e);
			(r = M(t, 'Past event')), t.forEach(h), this.h();
		},
		h() {
			v(e, 'class', 'past-event svelte-16w909o');
		},
		m(l, t) {
			U(l, e, t), o(e, r);
		},
		d(l) {
			l && h(e);
		}
	};
}
function x1(s) {
	let e,
		r,
		l,
		t,
		n,
		c,
		u,
		a,
		f,
		i = y1(s[1]) + '',
		k,
		g,
		d = s[3] === !0 && w1();
	return (
		(f = new t1({ props: { name: 'calendar', width: '25px', height: '25px' } })),
		{
			c() {
				(e = _('article')),
					d && d.c(),
					(r = T()),
					(l = _('h2')),
					(t = _('a')),
					(n = $(s[0])),
					(c = T()),
					(u = _('p')),
					(a = _('span')),
					j(f.$$.fragment),
					(k = $(i)),
					this.h();
			},
			l(m) {
				e = L(m, 'ARTICLE', { class: !0 });
				var y = C(e);
				d && d.l(y), (r = H(y)), (l = L(y, 'H2', { class: !0 }));
				var D = C(l);
				t = L(D, 'A', { href: !0, class: !0 });
				var q = C(t);
				(n = M(q, s[0])), q.forEach(h), D.forEach(h), (c = H(y)), (u = L(y, 'P', {}));
				var R = C(u);
				a = L(R, 'SPAN', { class: !0 });
				var E = C(a);
				W(f.$$.fragment, E), (k = M(E, i)), E.forEach(h), R.forEach(h), y.forEach(h), this.h();
			},
			h() {
				v(t, 'href', s[2]),
					v(t, 'class', 'svelte-16w909o'),
					v(l, 'class', 'svelte-16w909o'),
					v(a, 'class', 'icon-wrapper svelte-16w909o'),
					v(e, 'class', 'event-tile svelte-16w909o');
			},
			m(m, y) {
				U(m, e, y),
					d && d.m(e, null),
					o(e, r),
					o(e, l),
					o(l, t),
					o(t, n),
					o(e, c),
					o(e, u),
					o(u, a),
					G(f, a, null),
					o(a, k),
					(g = !0);
			},
			p(m, [y]) {
				m[3] === !0 ? d || ((d = w1()), d.c(), d.m(e, r)) : d && (d.d(1), (d = null)),
					(!g || y & 1) && _1(n, m[0]),
					(!g || y & 4) && v(t, 'href', m[2]),
					(!g || y & 2) && i !== (i = y1(m[1]) + '') && _1(k, i);
			},
			i(m) {
				g || (S(f.$$.fragment, m), (g = !0));
			},
			o(m) {
				V(f.$$.fragment, m), (g = !1);
			},
			d(m) {
				m && h(e), d && d.d(), Y(f);
			}
		}
	);
}
function y1(s) {
	return new Date(s).toDateString();
}
function O1(s, e, r) {
	let l,
		{ title: t, date: n, url: c = '' } = e;
	const u = 24 * 60 * 60 * 1e3;
	return (
		(s.$$set = (a) => {
			'title' in a && r(0, (t = a.title)),
				'date' in a && r(1, (n = a.date)),
				'url' in a && r(2, (c = a.url));
		}),
		(s.$$.update = () => {
			s.$$.dirty & 2 && r(3, (l = Date.now() - new Date(n).getTime() > u));
		}),
		[t, n, c, l]
	);
}
class j1 extends s1 {
	constructor(e) {
		super(), o1(this, e, O1, x1, i1, { title: 0, date: 1, url: 2 });
	}
}
function z1(s, e, r) {
	const l = s.slice();
	return (l[1] = e[r]), l;
}
function $1(s) {
	let e, r;
	return (
		(e = new j1({
			props: {
				title: s[1].title,
				url: '/events/' + s[1].filename.replace('.svx', ''),
				date: s[1].date
			}
		})),
		{
			c() {
				j(e.$$.fragment);
			},
			l(l) {
				W(e.$$.fragment, l);
			},
			m(l, t) {
				G(e, l, t), (r = !0);
			},
			p(l, t) {
				const n = {};
				t & 1 && (n.title = l[1].title),
					t & 1 && (n.url = '/events/' + l[1].filename.replace('.svx', '')),
					t & 1 && (n.date = l[1].date),
					e.$set(n);
			},
			i(l) {
				r || (S(e.$$.fragment, l), (r = !0));
			},
			o(l) {
				V(e.$$.fragment, l), (r = !1);
			},
			d(l) {
				Y(e, l);
			}
		}
	);
}
function W1(s) {
	let e,
		r,
		l,
		t,
		n,
		c,
		u,
		a,
		f,
		i,
		k,
		g,
		d,
		m,
		y,
		D,
		q,
		R,
		E,
		B,
		I,
		P,
		w,
		N,
		Z,
		e1,
		J,
		K,
		x,
		F,
		c1,
		Q,
		r1;
	e = new S1({ props: { title: 'Events' } });
	let X = s[0].events,
		z = [];
	for (let p = 0; p < X.length; p += 1) z[p] = $1(z1(s, X, p));
	const k1 = (p) =>
		V(z[p], 1, 1, () => {
			z[p] = null;
		});
	return (
		(Q = new q1({})),
		{
			c() {
				j(e.$$.fragment),
					(r = T()),
					(l = _('p')),
					(t = _('br')),
					(n = T()),
					(c = _('div')),
					(u = _('h1')),
					(a = $('CULT Events')),
					(f = T()),
					(i = _('p')),
					(k = $('Everyone is invited to add CULT events via ')),
					(g = _('a')),
					(d = $('pull request')),
					(m = $('.')),
					(y = T()),
					(D = _('p')),
					(q = _('br')),
					(R = $(`
	We promote events where guests get free entrance when proving they have CULT or RVLT in their wallet.
	`)),
					(E = _('p')),
					(B = _('br')),
					(I = $(`
	We also promote CULT related Twitter Spaces and Youtube Live Streams.

	`)),
					(P = _('p')),
					(w = _('br')),
					(N = T()),
					(Z = _('p')),
					(e1 = _('br')),
					(J = $(`
	The following is just to get some design- / layout ideas`)),
					(K = T()),
					(x = _('article')),
					(F = _('section'));
				for (let p = 0; p < z.length; p += 1) z[p].c();
				(c1 = T()), j(Q.$$.fragment), this.h();
			},
			l(p) {
				W(e.$$.fragment, p), (r = H(p)), (l = L(p, 'P', {}));
				var A = C(l);
				(t = L(A, 'BR', {})), A.forEach(h), (n = H(p)), (c = L(p, 'DIV', { class: !0 }));
				var b = C(c);
				u = L(b, 'H1', {});
				var l1 = C(u);
				(a = M(l1, 'CULT Events')), l1.forEach(h), (f = H(b)), (i = L(b, 'P', {}));
				var a1 = C(i);
				(k = M(a1, 'Everyone is invited to add CULT events via ')),
					(g = L(a1, 'A', { href: !0, target: !0 }));
				var h1 = C(g);
				(d = M(h1, 'pull request')),
					h1.forEach(h),
					(m = M(a1, '.')),
					a1.forEach(h),
					(y = H(b)),
					(D = L(b, 'P', {}));
				var f1 = C(D);
				(q = L(f1, 'BR', {})),
					f1.forEach(h),
					(R = M(
						b,
						`
	We promote events where guests get free entrance when proving they have CULT or RVLT in their wallet.
	`
					)),
					(E = L(b, 'P', {}));
				var m1 = C(E);
				(B = L(m1, 'BR', {})),
					m1.forEach(h),
					(I = M(
						b,
						`
	We also promote CULT related Twitter Spaces and Youtube Live Streams.

	`
					)),
					(P = L(b, 'P', {}));
				var p1 = C(P);
				(w = L(p1, 'BR', {})), p1.forEach(h), (N = H(b)), (Z = L(b, 'P', {}));
				var v1 = C(Z);
				(e1 = L(v1, 'BR', {})),
					v1.forEach(h),
					(J = M(
						b,
						`
	The following is just to get some design- / layout ideas`
					)),
					b.forEach(h),
					(K = H(p)),
					(x = L(p, 'ARTICLE', { class: !0 }));
				var n1 = C(x);
				F = L(n1, 'SECTION', { class: !0 });
				var d1 = C(F);
				for (let u1 = 0; u1 < z.length; u1 += 1) z[u1].l(d1);
				d1.forEach(h), (c1 = H(n1)), W(Q.$$.fragment, n1), n1.forEach(h), this.h();
			},
			h() {
				v(g, 'href', 'https://www.youtube.com/watch?v=8lGpZkjnkt4'),
					v(g, 'target', '_blank'),
					v(c, 'class', 'text-center'),
					v(F, 'class', 'event-wrapper svelte-1g1aqj2'),
					v(x, 'class', 'wrapper svelte-1g1aqj2');
			},
			m(p, A) {
				G(e, p, A),
					U(p, r, A),
					U(p, l, A),
					o(l, t),
					U(p, n, A),
					U(p, c, A),
					o(c, u),
					o(u, a),
					o(c, f),
					o(c, i),
					o(i, k),
					o(i, g),
					o(g, d),
					o(i, m),
					o(c, y),
					o(c, D),
					o(D, q),
					o(c, R),
					o(c, E),
					o(E, B),
					o(c, I),
					o(c, P),
					o(P, w),
					o(c, N),
					o(c, Z),
					o(Z, e1),
					o(c, J),
					U(p, K, A),
					U(p, x, A),
					o(x, F);
				for (let b = 0; b < z.length; b += 1) z[b].m(F, null);
				o(x, c1), G(Q, x, null), (r1 = !0);
			},
			p(p, [A]) {
				if (A & 1) {
					X = p[0].events;
					let b;
					for (b = 0; b < X.length; b += 1) {
						const l1 = z1(p, X, b);
						z[b]
							? (z[b].p(l1, A), S(z[b], 1))
							: ((z[b] = $1(l1)), z[b].c(), S(z[b], 1), z[b].m(F, null));
					}
					for (M1(), b = X.length; b < z.length; b += 1) k1(b);
					E1();
				}
			},
			i(p) {
				if (!r1) {
					S(e.$$.fragment, p);
					for (let A = 0; A < X.length; A += 1) S(z[A]);
					S(Q.$$.fragment, p), (r1 = !0);
				}
			},
			o(p) {
				V(e.$$.fragment, p), (z = z.filter(Boolean));
				for (let A = 0; A < z.length; A += 1) V(z[A]);
				V(Q.$$.fragment, p), (r1 = !1);
			},
			d(p) {
				Y(e, p), p && h(r), p && h(l), p && h(n), p && h(c), p && h(K), p && h(x), A1(z, p), Y(Q);
			}
		}
	);
}
function G1(s, e, r) {
	let { data: l } = e;
	return (
		(s.$$set = (t) => {
			'data' in t && r(0, (l = t.data));
		}),
		[l]
	);
}
class Q1 extends s1 {
	constructor(e) {
		super(), o1(this, e, G1, W1, i1, { data: 0 });
	}
}
export { Q1 as default };
