'use strict';

// ===== Datos originales =====
const CATEGORIES=[
  'Manteleria','PastoSintetico','Carpas','Charcuteria','Desayunos','Mobiliario',
  'Tapes','Cafe','Jardin','Salon','MesaDeDulces','Salas','PlatosBase','Copas',
  'PistaLED','Inflables','Sillones','MesaDeNovios','Letras','Ubicacion'
];
const IMAGES={
  PastoSintetico:['images/PastoSintetico/pasto1.jpeg','images/PastoSintetico/pasto2.jpeg','images/PastoSintetico/pasto3.jpeg'],
  Manteleria:Array.from({length:18},(_,i)=>`images/Manteleria/manteleria${i+1}.jpeg`),
  Carpas:Array.from({length:16},(_,i)=>`images/Carpas/Carpas${i+1}.jpeg`),
  Charcuteria:Array.from({length:18},(_,i)=>`images/Charcuteria/Charcuteria${i+1}.jpeg`),
  Desayunos:Array.from({length:10},(_,i)=>`images/Desayunos/Desayunos${i+1}.jpeg`),
  Mobiliario:Array.from({length:20},(_,i)=>`images/Mobiliario/Mobiliario${i+1}.jpeg`),
  Tapes:['images/Tapes/tape1.jpeg'],
  Cafe:Array.from({length:5},(_,i)=>`images/Cafe/Cafe${i+1}.jpeg`),
  Jardin:['images/Jardin/Jardin1.jpeg','images/Jardin/Jardin2.jpeg','images/Jardin/Jardin3.jpeg'],
  Salon:['images/Salon/Salon1.jpeg','images/Salon/salon2.jpeg','images/Salon/salon3.jpeg'],
  MesaDeDulces:Array.from({length:7},(_,i)=>`images/MesaDeDulces/MesadeDulces${i+1}.jpeg`),
  Salas:['images/Salas/sala1.jpeg','images/Salas/sala2.jpeg'],
  PlatosBase:['images/PlatosBase/platobase1.jpeg','images/PlatosBase/platobase2.jpeg','images/PlatosBase/platobase3.jpeg','images/PlatosBase/platobase4.jpeg','images/PlatosBase/platobase5.jpeg'],
  Copas:Array.from({length:5},(_,i)=>`images/Copas/copa${i+1}.jpeg`),
  PistaLED:['images/PistaLED/pistas led.jpeg'],
  Inflables:['images/Inflables/inflables.jpeg'],
  Sillones:['images/Sillones/sillones.jpeg'],
  MesaDeNovios:['images/MesaDeNovios/mesa de novios.jpeg'],
  Letras:['images/Letras/Letras.jpeg'],
  Ubicacion:[]
};

const $=(s,ctx=document)=>ctx.querySelector(s);
const E=(t,a={},...c)=>{const el=document.createElement(t);for(const[k,v]of Object.entries(a)){if(k==='class')el.className=v;else el.setAttribute(k,v);}c.flat().forEach(ch=>{if(typeof ch==='string')el.appendChild(document.createTextNode(ch));else if(ch)el.appendChild(ch);});return el;};
const nice=k=>k.replace(/([A-Z])/g,' $1').trim().replace('De ','de ');

// ===== Construcción =====
(function build(){
  const nav=$('#nav'), pages=$('#pages');

  // Botón Portada primero
  nav.appendChild(E('a',{href:'#Portada',class:'active'},'Portada'));

  // Portada
  const cover=E('section',{class:'section cover',id:'Portada'});
  const hero=E('div',{class:'hero parallax'}); // parallax sobre indice_bg si existe
  const title=E('div',{class:'title'},
    E('h2',{},"CATÁLOGO PIGO'S"),
    E('div',{class:'subtitle'},'Eventos · Jardín · Mobiliario')
  );
  const cta=E('div',{class:'cta'}, E('a',{href:'#'+CATEGORIES[0]},'Entrar al catálogo'));
  cover.appendChild(hero); cover.appendChild(title); cover.appendChild(cta);
  pages.appendChild(cover);

  // Categorías
  CATEGORIES.forEach(key=>{
    nav.appendChild(E('a',{href:'#'+key},nice(key)));

    const sec=E('section',{class:'section page',id:key});
    const head=E('div',{class:'heading'}, E('h3',{},nice(key)), E('div',{class:'underline'}));
    const grid=E('div',{class:'grid'});

    (IMAGES[key]||[]).forEach(src=>{
      const card=E('figure',{class:'card'});
      const img=E('img',{loading:'lazy',decoding:'async',src:encodeURI(src),alt:''});
      card.appendChild(img); grid.appendChild(card);
    });

    sec.appendChild(head); sec.appendChild(grid); pages.appendChild(sec);
  });

  // Footer visible también en nav
  nav.appendChild(E('a',{href:'#contacto'},'Contacto'));
})();

// ===== Lightbox =====
(function(){
  const lb=$('#lb'), pic=$('#lbImg'), close=$('#lbClose');
  document.addEventListener('click',ev=>{
    const fig=ev.target.closest('.card'); if(!fig) return;
    const img=fig.querySelector('img'); if(!img) return;
    pic.src=img.currentSrc||img.src; lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
  });
  const hide=()=>{ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); };
  lb.addEventListener('click',e=>{ if(e.target===lb) hide(); });
  close.addEventListener('click',hide);
  window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&lb.classList.contains('open')) hide(); });
})();

// ===== Tema (auto / claro / oscuro) =====
(function(){
  const btn=$('#themeToggle');
  function setTheme(mode){ document.documentElement.setAttribute('data-theme', mode); localStorage.setItem('theme-mode', mode); }
  const saved=localStorage.getItem('theme-mode'); if(saved) setTheme(saved);
  btn.addEventListener('click',()=>{
    const current=document.documentElement.getAttribute('data-theme')||'auto';
    const next = current==='dark' ? 'auto' : current==='auto' ? 'dark' : 'dark';
    setTheme(next);
  });
})();

// ===== Nav activo + pase de sección con teclado =====
(function(){
  const pages=$('#pages'); const links=[...document.querySelectorAll('#nav a')];
  const byId={}; links.forEach(a=>{ const id=a.getAttribute('href').slice(1); byId[id]=a; });
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ const id=e.target.id; links.forEach(a=>a.classList.remove('active')); byId[id]?.classList.add('active'); }
    });
  },{root:pages, threshold:.6});
  document.querySelectorAll('.section').forEach(sec=>io.observe(sec));

  function go(delta){
    const secs=[...document.querySelectorAll('.section')];
    const rects=secs.map(s=>({s, r:s.getBoundingClientRect()}));
    rects.sort((a,b)=>a.r.top-b.r.top);
    const mid=window.innerHeight/2; let idx=rects.findIndex(x=>x.r.top<=mid && x.r.bottom>=mid); if(idx<0) idx=0;
    const next = rects[Math.min(Math.max(idx+delta,0), rects.length-1)].s;
    next.scrollIntoView({behavior:'smooth', block:'start'});
  }
  window.addEventListener('keydown',e=>{ if(e.key==='PageDown' || e.key==='ArrowDown') { e.preventDefault(); go(+1);} if(e.key==='PageUp'|| e.key==='ArrowUp'){ e.preventDefault(); go(-1);} });
})();

// ===== Parallax suave en portada =====
(function(){
  const hero=document.querySelector('.cover .hero'); if(!hero) return;
  const root=$('#pages');
  const onScroll=()=>{
    const y = root.scrollTop; // pequeño desplazamiento
    hero.style.setProperty('--py', Math.min(60, y*0.2)+'px');
  };
  root.addEventListener('scroll', onScroll, {passive:true});
})();
