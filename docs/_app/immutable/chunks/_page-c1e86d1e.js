import{e as p,_ as i}from"./preload-helper-e2690c66.js";async function c(e){return await Promise.all(Object.entries(e).map(async([t,o])=>{const{metadata:s}=await o(),r=t.replace("/+page.svx",""),n=r.split("/").pop();return{...s,filename:n,path:r}}))}async function l(){const e=await c(Object.assign({"./2022-eth-barcelona/+page.svx":()=>i(()=>import("../components/pages/events/2022-eth-barcelona/_page.svx-47ff9d01.js"),["../components/pages/events/2022-eth-barcelona/_page.svx-47ff9d01.js","../assets/+page-76af88bd.css","index-2fad9c0c.js","Seo-364de34b.js","stores-7319b9f4.js","singletons-d908f1f9.js"],import.meta.url)}));if(e)return e.sort((a,t)=>Date.parse(t.date)-Date.parse(a.date)),{events:e};throw p(500)}const g=Object.freeze(Object.defineProperty({__proto__:null,load:l},Symbol.toStringTag,{value:"Module"}));export{g as _,l};
