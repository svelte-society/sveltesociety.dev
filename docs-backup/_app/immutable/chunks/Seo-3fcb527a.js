import{S as A,i as H,s as k,k as s,R as C,l as c,h as m,n as e,I as l,L as E,K as L}from"./singletons-ced5e616.js";import{p as z}from"./stores-18d6c20c.js";function S(o){let r,a,u,p,v,h,g,d,n,w,_,M,b,T,y;return document.title=r=f,{c(){a=s("meta"),u=s("meta"),p=s("meta"),h=s("meta"),g=s("meta"),d=s("meta"),n=s("meta"),w=s("meta"),_=s("meta"),M=s("meta"),b=s("meta"),y=s("meta"),this.h()},l(i){const t=C('[data-svelte="svelte-df90ok"]',document.head);a=c(t,"META",{name:!0,content:!0}),u=c(t,"META",{property:!0,content:!0}),p=c(t,"META",{property:!0,content:!0}),h=c(t,"META",{property:!0,content:!0}),g=c(t,"META",{property:!0,content:!0}),d=c(t,"META",{property:!0,name:!0,content:!0}),n=c(t,"META",{name:!0,content:!0}),w=c(t,"META",{name:!0,content:!0}),_=c(t,"META",{name:!0,content:!0}),M=c(t,"META",{name:!0,content:!0}),b=c(t,"META",{name:!0,content:!0}),y=c(t,"META",{name:!0,content:!0}),t.forEach(m),this.h()},h(){e(a,"name","description"),e(a,"content",o[1]),e(u,"property","og:type"),e(u,"content","website"),e(p,"property","og:title"),e(p,"content",v=`${o[0]} - ${f}`),e(h,"property","og:site_name"),e(h,"content",f),e(g,"property","og:description"),e(g,"content",o[1]),e(d,"property","og:image"),e(d,"name","og:image"),e(d,"content",o[2]),e(n,"name","og:url"),e(n,"content",o[3]),e(w,"name","twitter:site"),e(w,"content",o[4]),e(_,"name","twitter:image"),e(_,"content",o[2]),e(M,"name","twitter:card"),e(M,"content","summary_large_image"),e(b,"name","twitter:title"),e(b,"content",T=`${o[0]} - ${f}`),e(y,"name","twitter:description"),e(y,"content",o[1])},m(i,t){l(document.head,a),l(document.head,u),l(document.head,p),l(document.head,h),l(document.head,g),l(document.head,d),l(document.head,n),l(document.head,w),l(document.head,_),l(document.head,M),l(document.head,b),l(document.head,y)},p(i,[t]){t&0&&r!==(r=f)&&(document.title=r),t&2&&e(a,"content",i[1]),t&1&&v!==(v=`${i[0]} - ${f}`)&&e(p,"content",v),t&2&&e(g,"content",i[1]),t&4&&e(d,"content",i[2]),t&8&&e(n,"content",i[3]),t&16&&e(w,"content",i[4]),t&4&&e(_,"content",i[2]),t&1&&T!==(T=`${i[0]} - ${f}`)&&e(b,"content",T),t&2&&e(y,"content",i[1])},i:E,o:E,d(i){m(a),m(u),m(p),m(h),m(g),m(d),m(n),m(w),m(_),m(M),m(b),m(y)}}}const f="CULT Magazine";function U(o,r,a){let u;L(o,z,n=>a(5,u=n));let{title:p=f}=r,{description:v='We are a network of cultdao.io fans promoting freedom, fairness, education and love." data-svelte="svelte-1h4pbpd"><meta property="og:type" content="website" data-svelte="svelte-1h4pbpd"><meta property="og:title" content="Home - CULT Magazine" data-svelte="svelte-1h4pbpd"><meta property="og:site_name" content="CULT Magazine" data-svelte="svelte-1h4pbpd"><meta property="og:description" content="We are a network of cultdao.io fans promoting freedom, fairness, education and love." data-svelte="svelte-1h4pbpd"><meta property="og:image" name="og:image" content="https://raw.githubusercontent.com/michael-spengler/fairness/main/diagrams-documents-images/cult-money-1500x500.jpeg" data-svelte="svelte-1h4pbpd"><meta name="og:url" content="https://undefined/" data-svelte="svelte-1h4pbpd"><meta name="twitter:site" content="@sveltesociety" data-svelte="svelte-1h4pbpd"><meta name="twitter:image" content="https://raw.githubusercontent.com/michael-spengler/fairness/main/diagrams-documents-images/cult-money-1500x500.jpeg" data-svelte="svelte-1h4pbpd"><meta name="twitter:card" content="summary_large_image" data-svelte="svelte-1h4pbpd"><meta name="twitter:title" content="Home - CULT Magazine" data-svelte="svelte-1h4pbpd"><meta name="twitter:description" content="We are a network of cultdao.io fans promoting freedom, fairness, education and love.'}=r,{image:h="https://raw.githubusercontent.com/michael-spengler/fairness/main/diagrams-documents-images/cult-money-1500x500.jpeg"}=r,{url:g=`https://${u.host}${u.url.pathname}`}=r,{twitterHandle:d="@Peer2PeerE"}=r;return o.$$set=n=>{"title"in n&&a(0,p=n.title),"description"in n&&a(1,v=n.description),"image"in n&&a(2,h=n.image),"url"in n&&a(3,g=n.url),"twitterHandle"in n&&a(4,d=n.twitterHandle)},[p,v,h,g,d]}class q extends A{constructor(r){super(),H(this,r,U,S,k,{title:0,description:1,image:2,url:3,twitterHandle:4})}}export{q as S};