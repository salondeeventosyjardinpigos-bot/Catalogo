'use strict';

document.addEventListener('DOMContentLoaded', () => {
console.log('[INIT] DOMContentLoaded');

const root = document.querySelector('.flipbook-root');
const book = document.getElementById('book');

if (!root || !book){
  console.error('❌ Falta .flipbook-root o #book en el HTML');
  return;
}
if (!window.St || !St.PageFlip){
  console.error('❌ No cargó PageFlip (revisa el NOMBRE del archivo de la librería y el orden en index.html)');
  return;
}

/* ===== Datos / helpers idénticos a tu versión ===== */
const CATEGORIES = [
  'Manteleria','PastoSintetico','Carpas','Charcuteria','Desayunos','Mobiliario',
  'Tapes','Cafe','Jardin','Salon','MesaDeDulces','Salas','PlatosBase','Copas',
  'PistaLED','Inflables','Sillones','MesaDeNovios','Letras','Ubicacion'
];

const IMAGES = {
  PastoSintetico: ['images/PastoSintetico/pasto1.jpeg','images/PastoSintetico/pasto2.jpeg','images/PastoSintetico/pasto3.jpeg'],
  Manteleria: Array.from({length:18}, (_,i)=>`images/Manteleria/manteleria${i+1}.jpeg`),
  Carpas: Array.from({length:16}, (_,i)=>`images/Carpas/Carpas${i+1}.jpeg`),
  Charcuteria: Array.from({length:18}, (_,i)=>`images/Charcuteria/Charcuteria${i+1}.jpeg`),
  Desayunos: Array.from({length:10}, (_,i)=>`images/Desayunos/Desayunos${i+1}.jpeg`),
  Mobiliario: Array.from({length:20}, (_,i)=>`images/Mobiliario/Mobiliario${i+1}.jpeg`),
  Tapes: ['images/Tapes/tape1.jpeg'],
  Cafe: Array.from({length:5}, (_,i)=>`images/Cafe/Cafe${i+1}.jpeg`),
  Jardin: ['images/Jardin/Jardin1.jpeg','images/Jardin/Jardin2.jpeg','images/Jardin/Jardin3.jpeg'],
  Salon: ['images/Salon/Salon1.jpeg','images/Salon/salon2.jpeg','images/Salon/salon3.jpeg'],
  MesaDeDulces: Array.from({length:7}, (_,i)=>`images/MesaDeDulces/MesadeDulces${i+1}.jpeg`),
  Salas: ['images/Salas/sala1.jpeg','images/Salas/sala2.jpeg'],
  PlatosBase: [
    'images/PlatosBase/platobase1.jpeg','images/PlatosBase/platobase2.jpeg',
    'images/PlatosBase/platobase3.jpeg','images/PlatosBase/platobase4.jpeg',
    'images/PlatosBase/platobase5.jpeg'
  ],
  Copas: Array.from({length:5}, (_,i)=>`images/Copas/copa${i+1}.jpeg`),
  PistaLED: ['images/PistaLED/pistas led.jpeg'],
  Inflables: ['images/Inflables/inflables.jpeg'],
  Sillones: ['images/Sillones/sillones.jpeg'],
  MesaDeNovios: ['images/MesaDeNovios/mesa de novios.jpeg'],
  Letras: ['images/Letras/Letras.jpeg'],
  Ubicacion: []
};

const E = (tag, attrs={}, ...children)=>{
  const el=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if (k === 'class') el.className = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v);
  }
  children.flat().forEach(ch=>{
    if (typeof ch === 'string') el.appendChild(document.createTextNode(ch));
    else if (ch) el.appendChild(ch);
  });
  return el;
};
const chunk=(arr,size)=>{ const out=[]; for(let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; };
const pageDom=(density='soft')=>{ const p=E('div',{class:'page'}); p.dataset.density=density; return p; };

const gridDom = (images, cls)=>{
  const wrap = E('div',{class:cls});
  images.forEach(raw=>{
    const a   = E('a',{href:'#',class:'img-card js-lightbox'});
    const img = E('img',{loading:'lazy',src:encodeURI(raw),alt:''});
    img.onerror=()=>{
      let fix = raw;
      if(fix.includes('Mesa_De_Dulces')) fix = fix.replace('Mesa_De_Dulces','MesaDeDulces');
      if(/\.jpeg$/i.test(fix)) fix = fix.replace(/\.jpeg$/i,'.jpg');
      else if(/\.jpg$/i.test(fix)) fix = fix.replace(/\.jpg$/i,'.jpeg');
      if(fix.includes(' ')) fix = fix.replace(/ /g,'%20');
      img.src = encodeURI(fix);
    };
    a.appendChild(img);
    wrap.appendChild(a);
  });
  return wrap;
};

/* ========== Construcción de páginas (idéntica a la tuya) ========== */
const pages=[];
const firstIndexByCat = Object.create(null);

/* Portada */
{
  const p=pageDom('hard');
  p.appendChild(
    E('section',{class:'cover-custom'},
      E('div',{class:'left-side'}, E('div',{class:'marble'})),
      E('div',{class:'right-side'},
        E('h1',{class:'title-cover'},"NUESTROS",E('br'),"PRODUCTOS",E('br'),"PIGO´S"),
        E('div',{class:'author'},'José Antonio Gómez Domínguez'),
        E('div',{class:'phone'},'7226307655')
      )
    )
  );
  pages.push(p);
}

/* Índice */
const INDEX_PAGE = pages.length;
{
  const p = pageDom('hard');
  const cols = E('div',{class:'cols'});
  CATEGORIES.forEach(c=>{
    const row = E('div',{class:'row',dataset:{goto:c}});
    row.appendChild(E('img',{src:'assets/bullet.png',alt:''}));
    row.appendChild(E('span',{}, c.replace(/([A-Z])/g,' $1').trim().replace('De ','de ')));
    cols.appendChild(row);
  });
  p.appendChild(
    E('section',{class:'index'},
      E('div',{class:'bg'}),
      E('div',{class:'wrap'},
        E('h1',{class:'title'},'ÍNDICE'),
        cols
      )
    )
  );
  pages.push(p);
}

/* Categorías */
function addCategory(title,key,imgs){
  if(!imgs?.length) return;
  const groups=chunk(imgs,6);
  groups.forEach((group, groupIdx)=>{
    const n=group.length;
    const gridClass =
      n===1?'layout-1-hero':
      n===2?'layout-2-split':
      n===3?'layout-3-split':
      n===4?'layout-4-2x2':'layout-6-hero-3-2';
    const p   = pageDom();
    const cat = E('div',{class:'cat-page'});
    if (groupIdx === 0) {
      p.dataset.cat = key;
      firstIndexByCat[key] = pages.length;
    }
    cat.appendChild(
      E('div',{class:'title-bar'},
        E('h2',{class:'h2 title-with-logo'},
          E('img',{class:'title-logo',src:'assets/logo_circle.png',alt:''}),
          E('span',{class:'title-text'},title)
        )
      )
    );
    cat.appendChild( gridDom(group,gridClass) );
    p.appendChild(cat);
    p.appendChild(
      E('a',{href:'#',class:'fab-home js-go-index','aria-label':'Regresar al índice'},
        (()=>{
          const svg=E('svg',{viewBox:'0 0 24 24',width:'22',height:'22'});
          svg.appendChild(E('path',{fill:'currentColor',
            d:'M10.707 2.293a1 1 0 0 1 1.414 0l9 9a1 1 0 1 1-1.414 1.414L20 12.414V20a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-5H11v5a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-7.586l-.707.707A1 1 0 0 1 1.879 11.293l9-9Z'}));
          return svg;
        })()
      )
    );
    pages.push(p);
  });
}
CATEGORIES.forEach(k=>{
  addCategory(
    k.replace(/([A-Z])/g,' $1').replace(/^ /,'').replace('De ','de '),
    k,
    IMAGES[k]
  );
});

/* Ubicación */
{
  const p = pageDom();
  p.dataset.cat = 'Ubicacion';
  firstIndexByCat['Ubicacion'] = pages.length;
  const mapsUrl = 'https://www.google.com/maps/place/Av.+Miguel+Hidalgo+26,+Centro,+50900+Villa+de+Almoloya+de+Juárez';
  p.appendChild(
    E('section',{class:'contact contact-ubicacion'},
      E('div',{class:'title-bar'},
        E('h2',{class:'h2 title-with-logo'},
          E('img',{class:'title-logo',src:'assets/logo_circle.png',alt:''}),
          E('span',{class:'title-text'},'UBICACIÓN & CONTACTO')
        )
      ),
      E('div',{class:'qr-block'},
        E('a',{href:mapsUrl,target:'_blank',rel:'noopener'},
          E('img',{src:'assets/ubi.jpeg',alt:'Abrir en Google Maps'})
        ),
        E('p',{class:'qr-note'},'Toca el código QR para abrir Google Maps')
      )
    )
  );
  pages.push(p);
}

/* ===========================
   INIT FLIPBOOK (blindado: viewport directo)
=========================== */
pages.forEach(pg => book.appendChild(pg));
const domPages = Array.from(book.querySelectorAll('.page'));

let pageFlip = null;

function getViewport(){
  // Usa innerWidth/innerHeight directo para evitar 0 por barras en el primer frame
  const vw = Math.max(1, window.innerWidth  || document.documentElement.clientWidth  || 0);
  const vh = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 0);
  return { vw, vh };
}

function createFlipbook(width, height, usePortrait){
  // Destruye si existía
  if (pageFlip && typeof pageFlip.destroy === 'function'){
    try { pageFlip.destroy(); } catch(_) {}
  }
  // Crea
  pageFlip = new St.PageFlip(root, {
    size: 'fixed',
    width,
    height,
    showCover: true,
    usePortrait,
    mobileScrollSupport: true,
    flippingTime: 900,
    drawShadow: true,
    maxShadowOpacity: 0.18
  });
  pageFlip.loadFromHTML(domPages);

  // Segundo ajuste tras animación de barras (iOS/Android)
  setTimeout(()=>{ try{ pageFlip.update(); }catch(_){} }, 120);
  setTimeout(()=>{ try{ pageFlip.update(); }catch(_){} }, 320);
}

function fit(){
  const { vw, vh } = getViewport();

  // Calcula directo por orientación
  const isPortrait = vh >= vw;
  const pageW = isPortrait ? vw : Math.floor(vw/2);
  const pageH = vh;

  // Como ahora `.flipbook-root` es fixed+inset:0, no dependemos de clientWidth/Height
  // (evita el “Invalid width/height”)
  createFlipbook(pageW, pageH, isPortrait);
}

// Recalcula en cambios (debounce suave)
let _tid;
const requestFit = ()=>{ clearTimeout(_tid); _tid = setTimeout(fit, 80); };

window.addEventListener('resize', requestFit, { passive:true });
window.addEventListener('orientationchange', requestFit, { passive:true });
document.addEventListener('visibilitychange', requestFit);

// PRIMERA MEDIDA (y además después de load por si el navegador tardó)
fit();
window.addEventListener('load', ()=> setTimeout(fit, 60), { once:true });

/* ===========================
   HOME / ÍNDICE (prioridad)
=========================== */
document.addEventListener('pointerdown', (ev)=>{
  // Home → índice
  const go = ev.target.closest('.js-go-index,.fab-home');
  if (go){
    ev.preventDefault(); ev.stopImmediatePropagation();
    try { pageFlip.turnToPage(INDEX_PAGE); } catch(_){}
    return;
  }
  // Índice → categoría
  const row = ev.target.closest('.index .row');
  if (row){
    ev.preventDefault(); ev.stopImmediatePropagation();
    const idx = firstIndexByCat[row.dataset.goto];
    if (typeof idx === 'number'){
      try { pageFlip.turnToPage(idx); } catch(_){}
    } else {
      console.warn('[ÍNDICE] clave sin índice calculado:', row.dataset.goto, firstIndexByCat);
    }
  }
}, true);
/* ===========================
   NUMERACIÓN
=========================== */
book.querySelectorAll('.page').forEach((p,i)=> p.dataset.pageno=i+1);

/* ===========================
   LIGHTBOX (abre en pointerdown)
=========================== */
(function setupLightbox(){
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lb-close" type="button" aria-label="Regresar">Regresar</button>
    <img class="lb-img" alt="">
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.lb-img');
  const lbBtn = lb.querySelector('.lb-close');

  function openLB(ev){
    const card = ev.target.closest('.img-card');
    if (!card) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    const img = card.querySelector('img');
    if (!img) return;
    lbImg.src = img.currentSrc || img.src;
    lb.classList.add('open');
    document.body.classList.add('lb-open');
  }
  document.addEventListener('pointerdown', openLB, true);

  function closeLB(){ lb.classList.remove('open'); document.body.classList.remove('lb-open'); }
  lb.addEventListener('click', closeLB);
  lbBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeLB(); });

  window.addEventListener('keydown', (e)=>{
    if (!document.body.classList.contains('lb-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLB(); }
  }, true);
})();

/* ===========================
   BLOQUEAR GESTOS EN ZOOM (mientras LB)
=========================== */
(function blockGesturesWhileLB(){
  const block = (ev) => {
    if (!document.body.classList.contains('lb-open')) return;
    if (ev.target && ev.target.closest('.lightbox')) return;
    ev.stopImmediatePropagation(); ev.preventDefault();
  };
  ['pointerdown','pointermove','pointerup','mousedown','mousemove','mouseup','click','touchstart','touchmove','touchend','wheel','keydown']
    .forEach(t => window.addEventListener(t, block, true));
})();

/* ===========================
   HOME / ÍNDICE (prioridad)
=========================== */
document.addEventListener('pointerdown', (ev)=>{
  const go = ev.target.closest('.js-go-index,.fab-home');
  if (go){
    ev.preventDefault(); ev.stopImmediatePropagation();
    try { pageFlip.turnToPage(INDEX_PAGE); } catch(_){}
    return;
  }
  const row = ev.target.closest('.index .row');
  if (row){
    ev.preventDefault(); ev.stopImmediatePropagation();
    const idx = firstIndexByCat[row.dataset.goto];
    if (typeof idx === 'number'){
      try { pageFlip.turnToPage(idx); } catch(_){}
    } else {
      console.warn('[ÍNDICE] clave sin índice calculado:', row.dataset.goto, firstIndexByCat);
    }
  }
}, true);

}); // FIN DOMContentLoaded