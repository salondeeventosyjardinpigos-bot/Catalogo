'use strict';

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

(function build(){
  const nav=$('#nav'), pages=$('#pages');

  // PORTADA
  nav.appendChild(E('a',{href:'#Portada',class:'active'},'Portada'));
  const cover=E('section',{class:'section cover',id:'Portada'});
  const hero=E('div',{class:'hero parallax'});
  const title=E('div',{class:'title'}, E('h2',{},"CATÁLOGO PIGO'S"), E('div',{class:'subtitle'},'Eventos · Jardín · Mobiliario'));
  const cta=E('div',{class:'cta'}, E('a',{href:'#'+CATEGORIES[0]},'Entrar al catálogo'));
  cover.appendChild(hero); cover.appendChild(title); cover.appendChild(cta); pages.appendChild(cover);

  // CATEGORÍAS
  CATEGORIES.forEach(key=>{
    nav.appendChild(E('a',{href:'#'+key},nice(key)));

    const sec=E('section',{class:'section page',id:key});
    const head=E('div',{class:'heading'}, E('h3',{},nice(key)), E('div',{class:'underline'}));
    sec.appendChild(head);

    // --- UBICACIÓN compuesta (QR + botón + mapa en vivo) ---
    if(key==='Ubicacion'){
      const mapsUrl='https://www.google.com/maps/place/Av.+Miguel+Hidalgo+26,+Centro,+50900+Villa+de+Almoloya+de+Ju%C3%A9rez,+M%C3%A9x.,+M%C3%A9xico';
      const box=E('div',{class:'ubicacion-box'},
        E('div',{class:'ubi-row'},
          E('img',{class:'ubi-img',src:'assets/ubi.jpeg',alt:'QR Google Maps',loading:'lazy'}),
          E('a',{class:'map-btn',href:mapsUrl,target:'_blank',rel:'noopener'},'Abrir en Google Maps')
        ),
        E('div',{class:'map-frame'},
          E('iframe',{
            src:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.265547016214!2d-99.7664634!3d19.3700759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d279a6c6dc32ef%3A0x88e46e428e82e6ff!2sAv.%20Miguel%20Hidalgo%2026%2C%20Centro%2C%2050900%20Villa%20de%20Almoloya%20de%20Ju%C3%A1rez%2C%20M%C3%A9x.%2C%20M%C3%A9xico!5e0!3m2!1ses-419!2smx!4v1680000000000!5m2!1ses-419!2smx',
            loading:'lazy', referrerpolicy:'no-referrer-when-downgrade', allowfullscreen:''
          })
        )
      );
      sec.appendChild(box);
      pages.appendChild(sec);
      return; // saltar grid vacío
    }

    // Resto de categorías → galería
    const grid=E('div',{class:'grid'});
    (IMAGES[key]||[]).forEach(src=>{ const card=E('figure',{class:'card'}); const img=E('img',{loading:'lazy',decoding:'async',src:encodeURI(src),alt:''}); card.appendChild(img); grid.appendChild(card); });
    sec.appendChild(grid); pages.appendChild(sec);
  });

  // Footer en nav
  nav.appendChild(E('a',{href:'#contacto'},'Contacto'));
})();

// Lightbox
(function(){ const lb=$('#lb'), pic=$('#lbImg'), close=$('#lbClose');
  document.addEventListener('click',ev=>{ const fig=ev.target.closest('.card'); if(!fig) return; const img=fig.querySelector('img'); if(!img) return; pic.src=img.currentSrc||img.src; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); });
  const hide=()=>{ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); };
  lb.addEventListener('click',e=>{ if(e.target===lb) hide(); }); close.addEventListener('click',hide);
  window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&lb.classList.contains('open')) hide(); });
})();

// Tema
(function(){ const btn=$('#themeToggle'); function setTheme(m){ document.documentElement.setAttribute('data-theme',m); localStorage.setItem('theme-mode',m); }
  const saved=localStorage.getItem('theme-mode'); if(saved) setTheme(saved);
  btn.addEventListener('click',()=>{ const cur=document.documentElement.getAttribute('data-theme')||'auto'; const next = cur==='dark' ? 'auto' : cur==='auto' ? 'dark' : 'dark'; setTheme(next); });
})();

// Nav activo + teclado
(function(){ const pages=$('#pages'); const links=[...document.querySelectorAll('#nav a')]; const byId={}; links.forEach(a=>{ const id=a.getAttribute('href').slice(1); byId[id]=a; });
  const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ const id=e.target.id; links.forEach(a=>a.classList.remove('active')); byId[id]?.classList.add('active'); } }); },{root:pages, threshold:.6});
  const secs=()=>document.querySelectorAll('.section'); secs().forEach(sec=>io.observe(sec));
  function go(d){ const arr=[...secs()].map(s=>({s,r:s.getBoundingClientRect()})).sort((a,b)=>a.r.top-b.r.top); const mid=window.innerHeight/2; let i=arr.findIndex(x=>x.r.top<=mid&&x.r.bottom>=mid); if(i<0) i=0; const next=arr[Math.min(Math.max(i+d,0),arr.length-1)].s; next.scrollIntoView({behavior:'smooth',block:'start'}); }
  window.addEventListener('keydown',e=>{ if(e.key==='PageDown'||e.key==='ArrowDown'){ e.preventDefault(); go(+1);} if(e.key==='PageUp'||e.key==='ArrowUp'){ e.preventDefault(); go(-1);} });
})();

// Parallax portada
(function(){ const hero=document.querySelector('.cover .hero'); if(!hero) return; const root=$('#pages'); root.addEventListener('scroll',()=>{ const y=root.scrollTop; hero.style.setProperty('--py', Math.min(60, y*0.2)+'px'); },{passive:true}); })();
