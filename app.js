'use strict';

// ===== Datos (usa mismo árbol de imágenes de tu repo) =====
const CATEGORIES=[
  'Manteleria','PastoSintetico','Carpas','Charcuteria','Desayunos','Mobiliario','Tapes','Cafe','Jardin','Salon','MesaDeDulces','Salas','PlatosBase','Copas','PistaLED','Inflables','Sillones','MesaDeNovios','Letras','Ubicacion'
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

function niceName(k){return k.replace(/([A-Z])/g,' $1').trim().replace('De ','de ')}

function build(){
  const nav=$('#nav');
  const pages=$('#pages');
  CATEGORIES.forEach(key=>{
    // Nav
    const a=E('a',{href:'#'+key},niceName(key));
    nav.appendChild(a);

    // Sección (página)
    const sec=E('section',{class:'section',id:key});
    sec.appendChild(E('h2',{}, niceName(key)));

    const grid=E('div',{class:'grid'});
    (IMAGES[key]||[]).forEach(src=>{
      const card=E('figure',{class:'card'});
      const img=E('img',{loading:'lazy',decoding:'async',alt:'',src:encodeURI(src)});
      card.appendChild(img);
      grid.appendChild(card);
    });
    sec.appendChild(grid);
    pages.appendChild(sec);
  });
}

function setupLightbox(){
  const lb=$('#lb'); const img=$('.lb-img',lb); const close=$('.lb-close',lb);
  document.addEventListener('click',ev=>{
    const fig=ev.target.closest('.card'); if(!fig) return;
    const pic=fig.querySelector('img'); if(!pic) return;
    img.src=pic.currentSrc||pic.src; lb.classList.add('open');
  });
  const hide=()=>lb.classList.remove('open');
  lb.addEventListener('click',hide); close.addEventListener('click',hide);
  window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&lb.classList.contains('open')) hide(); });
}

build();
setupLightbox();
