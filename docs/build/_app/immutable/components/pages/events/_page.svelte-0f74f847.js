import {
	S as U,
	i as Y,
	s as K,
	$ as i1,
	a0 as u1,
	m as g,
	h as m,
	n as p,
	b as A,
	A as I,
	k as C,
	q as E,
	a as S,
	l as L,
	r as k,
	c as y,
	C as v,
	f as w,
	g as s1,
	d as c1,
	t as $,
	D as o1,
	e as X,
	v as N,
	w as B,
	x as T,
	y as q,
	u as F
} from '../../../chunks/index-2fe5515f.js';
import { S as h1 } from '../../../chunks/Seo-534e6b2c.js';
import '../../../chunks/stores-5d0174eb.js';
import '../../../chunks/singletons-99c9cfe2.js';
function f1(i) {
	let e,
		r = i[3].svg + '',
		l;
	return {
		c() {
			(e = i1('svg')), this.h();
		},
		l(t) {
			e = u1(t, 'svg', { class: !0, focusable: !0, width: !0, height: !0, viewBox: !0 });
			var s = g(e);
			s.forEach(m), this.h();
		},
		h() {
			p(e, 'class', (l = 'svgicon ' + i[0] + ' svelte-1dyed4p')),
				p(e, 'focusable', 'false'),
				p(e, 'width', i[1]),
				p(e, 'height', i[2]),
				p(e, 'viewBox', '0 0 ' + i[3].box);
		},
		m(t, s) {
			A(t, e, s), (e.innerHTML = r);
		},
		p(t, [s]) {
			s & 1 && l !== (l = 'svgicon ' + t[0] + ' svelte-1dyed4p') && p(e, 'class', l),
				s & 2 && p(e, 'width', t[1]),
				s & 4 && p(e, 'height', t[2]);
		},
		i: I,
		o: I,
		d(t) {
			t && m(e);
		}
	};
}
function m1(i, e, r) {
	let { name: l } = e,
		{ width: t = '24px' } = e,
		{ height: s = '24px' } = e,
		c = [
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
		].find((n) => n.name === l);
	if (!c) throw Error(`Could not find icon with name ${l}`);
	return (
		(i.$$set = (n) => {
			'name' in n && r(0, (l = n.name)),
				'width' in n && r(1, (t = n.width)),
				'height' in n && r(2, (s = n.height));
		}),
		[l, t, s, c]
	);
}
class J extends U {
	constructor(e) {
		super(), Y(this, e, m1, f1, K, { name: 0, width: 1, height: 2 });
	}
}
const Q = [
	{ continent: '\u{1F1EA}\u{1F1FA} Europe', type: 'contintent' },
	{
		name: 'London Svelte Meetup',
		country: '\u{1F1EC}\u{1F1E7} Great Britain',
		url: 'https://www.meetup.com/svelte/'
	},
	{
		name: 'Svelte Dublin',
		country: '\u{1F1EE}\u{1F1EA} Ireland',
		url: 'https://www.downtomeet.com/Svelte-Dublin'
	},
	{
		name: 'Sveltejs Meetup Hamburg',
		country: '\u{1F1E9}\u{1F1EA} Germany',
		url: 'https://www.meetup.com/de-DE/Svelte-js-Meetup-Hamburg/',
		githuburl: 'https://github.com/svelte-meetup-hamburg/meetups/issues'
	},
	{
		name: 'Amsterdam SvelteJS',
		country: '\u{1F1F3}\u{1F1F1} Netherlands',
		url: 'https://www.meetup.com/Amsterdam-SvelteJS/'
	},
	{
		name: 'Svelte Bergen',
		country: '\u{1F1F3}\u{1F1F4} Norway',
		twitter: '@stephanevanraes',
		url: 'https://www.downtomeet.com/Svelte-Bergen'
	},
	{
		name: 'Svelte Society Stockholm',
		country: '\u{1F1F8}\u{1F1EA} Sweden',
		twitter: '@kevmodrome',
		url: 'https://www.downtomeet.com/Svelte-Society-Stockholm'
	},
	{
		name: 'Svelte Society CZ/SK',
		country: '\u{1F1E8}\u{1F1FF} Czechia and \u{1F1F8}\u{1F1F0} Slovakia',
		discord: 'https://discord.gg/snCuuPnqmH',
		url: 'https://discord.gg/snCuuPnqmH'
	},
	{
		name: 'Svelte Society Austria - Svienna',
		country: '\u{1F1E6}\u{1F1F9} Austria',
		url: 'https://austria.sveltesociety.dev/',
		discord: 'https://discord.gg/3XAVv99r',
		twitter: '@svelteaustria'
	},
	{ continent: 'South America', type: 'contintent' },
	{
		name: 'Svelte Brasil',
		country: '\u{1F1E7}\u{1F1F7} Brazil',
		telegram: 'https://t.me/sveltebrasil',
		twitter: '@sveltebrasil',
		url: 'https://sveltebrasil.dev/',
		youtube: 'https://www.youtube.com/channel/UCp8jamqJRGg86eMnewxjWng',
		githuburl: 'https://github.com/svelte-brasil'
	},
	{ continent: 'North America', type: 'contintent' },
	{
		name: 'Svelte Chicago',
		country: '\u{1F1FA}\u{1F1F8} United States (chicago)',
		twitter: '@sveltechicago',
		githuburl: 'https://github.com/Svelte-Chicago',
		url: 'https://sveltechi.dev'
	}
];
function e1(i, e, r) {
	const l = i.slice();
	return (l[0] = e[r]), l;
}
function v1(i) {
	let e,
		r = i[0].country + '',
		l,
		t,
		s,
		u,
		c,
		n,
		a,
		h,
		o = i[0].name + '',
		d,
		f,
		_,
		z,
		j,
		G,
		x;
	n = new J({ props: { name: 'globe' } });
	let M = i[0].twitter && d1(i),
		H = i[0].telegram && g1(i),
		V = i[0].youtube && _1(i),
		D = i[0].githuburl && C1(i);
	return {
		c() {
			(e = C('h5')),
				(l = E(r)),
				(t = S()),
				(s = C('ul')),
				(u = C('li')),
				(c = C('span')),
				N(n.$$.fragment),
				(a = S()),
				(h = C('a')),
				(d = E(o)),
				(f = S()),
				M && M.c(),
				(_ = S()),
				H && H.c(),
				(z = S()),
				V && V.c(),
				(j = S()),
				D && D.c(),
				(G = S()),
				this.h();
		},
		l(b) {
			e = L(b, 'H5', { class: !0 });
			var Z = g(e);
			(l = k(Z, r)), Z.forEach(m), (t = y(b)), (s = L(b, 'UL', { class: !0 }));
			var P = g(s);
			u = L(P, 'LI', {});
			var O = g(u);
			c = L(O, 'SPAN', { class: !0 });
			var R = g(c);
			B(n.$$.fragment, R), (a = y(R)), (h = L(R, 'A', { href: !0, rel: !0 }));
			var W = g(h);
			(d = k(W, o)),
				W.forEach(m),
				R.forEach(m),
				O.forEach(m),
				(f = y(P)),
				M && M.l(P),
				(_ = y(P)),
				H && H.l(P),
				(z = y(P)),
				V && V.l(P),
				(j = y(P)),
				D && D.l(P),
				(G = y(P)),
				P.forEach(m),
				this.h();
		},
		h() {
			p(e, 'class', 'society svelte-331ce1'),
				p(h, 'href', i[0].url),
				p(h, 'rel', 'noopener'),
				p(c, 'class', 'icon-wrapper svelte-331ce1'),
				p(s, 'class', 'society svelte-331ce1');
		},
		m(b, Z) {
			A(b, e, Z),
				v(e, l),
				A(b, t, Z),
				A(b, s, Z),
				v(s, u),
				v(u, c),
				T(n, c, null),
				v(c, a),
				v(c, h),
				v(h, d),
				v(s, f),
				M && M.m(s, null),
				v(s, _),
				H && H.m(s, null),
				v(s, z),
				V && V.m(s, null),
				v(s, j),
				D && D.m(s, null),
				v(s, G),
				(x = !0);
		},
		p(b, Z) {
			b[0].twitter && M.p(b, Z),
				b[0].telegram && H.p(b, Z),
				b[0].youtube && V.p(b, Z),
				b[0].githuburl && D.p(b, Z);
		},
		i(b) {
			x || (w(n.$$.fragment, b), w(M), w(H), w(V), w(D), (x = !0));
		},
		o(b) {
			$(n.$$.fragment, b), $(M), $(H), $(V), $(D), (x = !1);
		},
		d(b) {
			b && m(e), b && m(t), b && m(s), q(n), M && M.d(), H && H.d(), V && V.d(), D && D.d();
		}
	};
}
function p1(i) {
	let e,
		r = i[0].continent + '',
		l;
	return {
		c() {
			(e = C('h4')), (l = E(r)), this.h();
		},
		l(t) {
			e = L(t, 'H4', { class: !0 });
			var s = g(e);
			(l = k(s, r)), s.forEach(m), this.h();
		},
		h() {
			p(e, 'class', 'continent svelte-331ce1');
		},
		m(t, s) {
			A(t, e, s), v(e, l);
		},
		p: I,
		i: I,
		o: I,
		d(t) {
			t && m(e);
		}
	};
}
function d1(i) {
	let e,
		r,
		l,
		t,
		s = i[0].twitter + '',
		u,
		c;
	return (
		(r = new J({ props: { name: 'twitter' } })),
		{
			c() {
				(e = C('span')), N(r.$$.fragment), (l = S()), (t = C('a')), (u = E(s)), this.h();
			},
			l(n) {
				e = L(n, 'SPAN', { class: !0 });
				var a = g(e);
				B(r.$$.fragment, a), (l = y(a)), (t = L(a, 'A', { href: !0, rel: !0 }));
				var h = g(t);
				(u = k(h, s)), h.forEach(m), a.forEach(m), this.h();
			},
			h() {
				p(t, 'href', 'https://twitter.com/' + i[0].twitter),
					p(t, 'rel', 'noopener'),
					p(e, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(n, a) {
				A(n, e, a), T(r, e, null), v(e, l), v(e, t), v(t, u), (c = !0);
			},
			p: I,
			i(n) {
				c || (w(r.$$.fragment, n), (c = !0));
			},
			o(n) {
				$(r.$$.fragment, n), (c = !1);
			},
			d(n) {
				n && m(e), q(r);
			}
		}
	);
}
function g1(i) {
	let e, r, l, t, s, u;
	return (
		(r = new J({ props: { name: 'telegram' } })),
		{
			c() {
				(e = C('span')),
					N(r.$$.fragment),
					(l = S()),
					(t = C('a')),
					(s = E('Join on Telegram')),
					this.h();
			},
			l(c) {
				e = L(c, 'SPAN', { class: !0 });
				var n = g(e);
				B(r.$$.fragment, n), (l = y(n)), (t = L(n, 'A', { href: !0, target: !0, rel: !0 }));
				var a = g(t);
				(s = k(a, 'Join on Telegram')), a.forEach(m), n.forEach(m), this.h();
			},
			h() {
				p(t, 'href', i[0].telegram),
					p(t, 'target', '_blank'),
					p(t, 'rel', 'noopener'),
					p(e, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(c, n) {
				A(c, e, n), T(r, e, null), v(e, l), v(e, t), v(t, s), (u = !0);
			},
			p: I,
			i(c) {
				u || (w(r.$$.fragment, c), (u = !0));
			},
			o(c) {
				$(r.$$.fragment, c), (u = !1);
			},
			d(c) {
				c && m(e), q(r);
			}
		}
	);
}
function _1(i) {
	let e,
		r,
		l,
		t,
		s = i[0].name + '',
		u,
		c,
		n;
	return (
		(r = new J({ props: { name: 'youtube' } })),
		{
			c() {
				(e = C('span')),
					N(r.$$.fragment),
					(l = S()),
					(t = C('a')),
					(u = E(s)),
					(c = E(' YouTube Channel')),
					this.h();
			},
			l(a) {
				e = L(a, 'SPAN', { class: !0 });
				var h = g(e);
				B(r.$$.fragment, h), (l = y(h)), (t = L(h, 'A', { href: !0, target: !0, rel: !0 }));
				var o = g(t);
				(u = k(o, s)), (c = k(o, ' YouTube Channel')), o.forEach(m), h.forEach(m), this.h();
			},
			h() {
				p(t, 'href', i[0].youtube),
					p(t, 'target', '_blank'),
					p(t, 'rel', 'noopener'),
					p(e, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(a, h) {
				A(a, e, h), T(r, e, null), v(e, l), v(e, t), v(t, u), v(t, c), (n = !0);
			},
			p: I,
			i(a) {
				n || (w(r.$$.fragment, a), (n = !0));
			},
			o(a) {
				$(r.$$.fragment, a), (n = !1);
			},
			d(a) {
				a && m(e), q(r);
			}
		}
	);
}
function C1(i) {
	let e, r, l, t, s, u, c;
	return (
		(l = new J({ props: { name: 'github' } })),
		{
			c() {
				(e = C('li')),
					(r = C('span')),
					N(l.$$.fragment),
					(t = S()),
					(s = C('a')),
					(u = E('GitHub')),
					this.h();
			},
			l(n) {
				e = L(n, 'LI', {});
				var a = g(e);
				r = L(a, 'SPAN', { class: !0 });
				var h = g(r);
				B(l.$$.fragment, h), (t = y(h)), (s = L(h, 'A', { href: !0, target: !0, rel: !0 }));
				var o = g(s);
				(u = k(o, 'GitHub')), o.forEach(m), h.forEach(m), a.forEach(m), this.h();
			},
			h() {
				p(s, 'href', i[0].githuburl),
					p(s, 'target', '_blank'),
					p(s, 'rel', 'noopener'),
					p(r, 'class', 'icon-wrapper svelte-331ce1');
			},
			m(n, a) {
				A(n, e, a), v(e, r), T(l, r, null), v(r, t), v(r, s), v(s, u), (c = !0);
			},
			p: I,
			i(n) {
				c || (w(l.$$.fragment, n), (c = !0));
			},
			o(n) {
				$(l.$$.fragment, n), (c = !1);
			},
			d(n) {
				n && m(e), q(l);
			}
		}
	);
}
function t1(i) {
	let e, r, l, t;
	const s = [p1, v1],
		u = [];
	function c(n, a) {
		return n[0].continent ? 0 : 1;
	}
	return (
		(e = c(i)),
		(r = u[e] = s[e](i)),
		{
			c() {
				r.c(), (l = X());
			},
			l(n) {
				r.l(n), (l = X());
			},
			m(n, a) {
				u[e].m(n, a), A(n, l, a), (t = !0);
			},
			p(n, a) {
				r.p(n, a);
			},
			i(n) {
				t || (w(r), (t = !0));
			},
			o(n) {
				$(r), (t = !1);
			},
			d(n) {
				u[e].d(n), n && m(l);
			}
		}
	);
}
function L1(i) {
	let e,
		r,
		l,
		t,
		s,
		u = Q,
		c = [];
	for (let a = 0; a < u.length; a += 1) c[a] = t1(e1(i, u, a));
	const n = (a) =>
		$(c[a], 1, 1, () => {
			c[a] = null;
		});
	return {
		c() {
			(e = C('div')), (r = C('h3')), (l = E('Societies around the world')), (t = S());
			for (let a = 0; a < c.length; a += 1) c[a].c();
			this.h();
		},
		l(a) {
			e = L(a, 'DIV', { class: !0 });
			var h = g(e);
			r = L(h, 'H3', { class: !0 });
			var o = g(r);
			(l = k(o, 'Societies around the world')), o.forEach(m), (t = y(h));
			for (let d = 0; d < c.length; d += 1) c[d].l(h);
			h.forEach(m), this.h();
		},
		h() {
			p(r, 'class', 'title'), p(e, 'class', 'society-wrapper svelte-331ce1');
		},
		m(a, h) {
			A(a, e, h), v(e, r), v(r, l), v(e, t);
			for (let o = 0; o < c.length; o += 1) c[o].m(e, null);
			s = !0;
		},
		p(a, [h]) {
			if (h & 0) {
				u = Q;
				let o;
				for (o = 0; o < u.length; o += 1) {
					const d = e1(a, u, o);
					c[o]
						? (c[o].p(d, h), w(c[o], 1))
						: ((c[o] = t1(d)), c[o].c(), w(c[o], 1), c[o].m(e, null));
				}
				for (s1(), o = u.length; o < c.length; o += 1) n(o);
				c1();
			}
		},
		i(a) {
			if (!s) {
				for (let h = 0; h < u.length; h += 1) w(c[h]);
				s = !0;
			}
		},
		o(a) {
			c = c.filter(Boolean);
			for (let h = 0; h < c.length; h += 1) $(c[h]);
			s = !1;
		},
		d(a) {
			a && m(e), o1(c, a);
		}
	};
}
class b1 extends U {
	constructor(e) {
		super(), Y(this, e, null, L1, K, {});
	}
}
function l1(i) {
	let e, r;
	return {
		c() {
			(e = C('span')), (r = E('Past event')), this.h();
		},
		l(l) {
			e = L(l, 'SPAN', { class: !0 });
			var t = g(e);
			(r = k(t, 'Past event')), t.forEach(m), this.h();
		},
		h() {
			p(e, 'class', 'past-event svelte-16w909o');
		},
		m(l, t) {
			A(l, e, t), v(e, r);
		},
		d(l) {
			l && m(e);
		}
	};
}
function w1(i) {
	let e,
		r,
		l,
		t,
		s,
		u,
		c,
		n,
		a,
		h = r1(i[1]) + '',
		o,
		d,
		f = i[3] === !0 && l1();
	return (
		(a = new J({ props: { name: 'calendar', width: '25px', height: '25px' } })),
		{
			c() {
				(e = C('article')),
					f && f.c(),
					(r = S()),
					(l = C('h2')),
					(t = C('a')),
					(s = E(i[0])),
					(u = S()),
					(c = C('p')),
					(n = C('span')),
					N(a.$$.fragment),
					(o = E(h)),
					this.h();
			},
			l(_) {
				e = L(_, 'ARTICLE', { class: !0 });
				var z = g(e);
				f && f.l(z), (r = y(z)), (l = L(z, 'H2', { class: !0 }));
				var j = g(l);
				t = L(j, 'A', { href: !0, class: !0 });
				var G = g(t);
				(s = k(G, i[0])), G.forEach(m), j.forEach(m), (u = y(z)), (c = L(z, 'P', {}));
				var x = g(c);
				n = L(x, 'SPAN', { class: !0 });
				var M = g(n);
				B(a.$$.fragment, M), (o = k(M, h)), M.forEach(m), x.forEach(m), z.forEach(m), this.h();
			},
			h() {
				p(t, 'href', i[2]),
					p(t, 'class', 'svelte-16w909o'),
					p(l, 'class', 'svelte-16w909o'),
					p(n, 'class', 'icon-wrapper svelte-16w909o'),
					p(e, 'class', 'event-tile svelte-16w909o');
			},
			m(_, z) {
				A(_, e, z),
					f && f.m(e, null),
					v(e, r),
					v(e, l),
					v(l, t),
					v(t, s),
					v(e, u),
					v(e, c),
					v(c, n),
					T(a, n, null),
					v(n, o),
					(d = !0);
			},
			p(_, [z]) {
				_[3] === !0 ? f || ((f = l1()), f.c(), f.m(e, r)) : f && (f.d(1), (f = null)),
					(!d || z & 1) && F(s, _[0]),
					(!d || z & 4) && p(t, 'href', _[2]),
					(!d || z & 2) && h !== (h = r1(_[1]) + '') && F(o, h);
			},
			i(_) {
				d || (w(a.$$.fragment, _), (d = !0));
			},
			o(_) {
				$(a.$$.fragment, _), (d = !1);
			},
			d(_) {
				_ && m(e), f && f.d(), q(a);
			}
		}
	);
}
function r1(i) {
	return new Date(i).toDateString();
}
function $1(i, e, r) {
	let l,
		{ title: t, date: s, url: u = '' } = e;
	const c = 24 * 60 * 60 * 1e3;
	return (
		(i.$$set = (n) => {
			'title' in n && r(0, (t = n.title)),
				'date' in n && r(1, (s = n.date)),
				'url' in n && r(2, (u = n.url));
		}),
		(i.$$.update = () => {
			i.$$.dirty & 2 && r(3, (l = Date.now() - new Date(s).getTime() > c));
		}),
		[t, s, u, l]
	);
}
class z1 extends U {
	constructor(e) {
		super(), Y(this, e, $1, w1, K, { title: 0, date: 1, url: 2 });
	}
}
function a1(i, e, r) {
	const l = i.slice();
	return (l[1] = e[r]), l;
}
function n1(i) {
	let e, r;
	return (
		(e = new z1({
			props: {
				title: i[1].title,
				url: '/events/' + i[1].filename.replace('.svx', ''),
				date: i[1].date
			}
		})),
		{
			c() {
				N(e.$$.fragment);
			},
			l(l) {
				B(e.$$.fragment, l);
			},
			m(l, t) {
				T(e, l, t), (r = !0);
			},
			p(l, t) {
				const s = {};
				t & 1 && (s.title = l[1].title),
					t & 1 && (s.url = '/events/' + l[1].filename.replace('.svx', '')),
					t & 1 && (s.date = l[1].date),
					e.$set(s);
			},
			i(l) {
				r || (w(e.$$.fragment, l), (r = !0));
			},
			o(l) {
				$(e.$$.fragment, l), (r = !1);
			},
			d(l) {
				q(e, l);
			}
		}
	);
}
function S1(i) {
	let e, r, l, t, s, u, c;
	e = new h1({ props: { title: 'Events' } });
	let n = i[0].events,
		a = [];
	for (let o = 0; o < n.length; o += 1) a[o] = n1(a1(i, n, o));
	const h = (o) =>
		$(a[o], 1, 1, () => {
			a[o] = null;
		});
	return (
		(u = new b1({})),
		{
			c() {
				N(e.$$.fragment), (r = S()), (l = C('article')), (t = C('section'));
				for (let o = 0; o < a.length; o += 1) a[o].c();
				(s = S()), N(u.$$.fragment), this.h();
			},
			l(o) {
				B(e.$$.fragment, o), (r = y(o)), (l = L(o, 'ARTICLE', { class: !0 }));
				var d = g(l);
				t = L(d, 'SECTION', { class: !0 });
				var f = g(t);
				for (let _ = 0; _ < a.length; _ += 1) a[_].l(f);
				f.forEach(m), (s = y(d)), B(u.$$.fragment, d), d.forEach(m), this.h();
			},
			h() {
				p(t, 'class', 'event-wrapper svelte-1g1aqj2'), p(l, 'class', 'wrapper svelte-1g1aqj2');
			},
			m(o, d) {
				T(e, o, d), A(o, r, d), A(o, l, d), v(l, t);
				for (let f = 0; f < a.length; f += 1) a[f].m(t, null);
				v(l, s), T(u, l, null), (c = !0);
			},
			p(o, [d]) {
				if (d & 1) {
					n = o[0].events;
					let f;
					for (f = 0; f < n.length; f += 1) {
						const _ = a1(o, n, f);
						a[f]
							? (a[f].p(_, d), w(a[f], 1))
							: ((a[f] = n1(_)), a[f].c(), w(a[f], 1), a[f].m(t, null));
					}
					for (s1(), f = n.length; f < a.length; f += 1) h(f);
					c1();
				}
			},
			i(o) {
				if (!c) {
					w(e.$$.fragment, o);
					for (let d = 0; d < n.length; d += 1) w(a[d]);
					w(u.$$.fragment, o), (c = !0);
				}
			},
			o(o) {
				$(e.$$.fragment, o), (a = a.filter(Boolean));
				for (let d = 0; d < a.length; d += 1) $(a[d]);
				$(u.$$.fragment, o), (c = !1);
			},
			d(o) {
				q(e, o), o && m(r), o && m(l), o1(a, o), q(u);
			}
		}
	);
}
function y1(i, e, r) {
	let { data: l } = e;
	return (
		(i.$$set = (t) => {
			'data' in t && r(0, (l = t.data));
		}),
		[l]
	);
}
class H1 extends U {
	constructor(e) {
		super(), Y(this, e, y1, S1, K, { data: 0 });
	}
}
export { H1 as default };
