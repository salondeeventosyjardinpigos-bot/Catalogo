'use strict';

document.addEventListener('DOMContentLoaded', () => {

/* ===========================
   ROOTS Y VERIFICACIÓN
=========================== */
const root = document.querySelector('.flipbook-root');
const book = document.getElementById('book');

if (!root || !book){
  console.error("❌ Falta .flipbook-root o #book en el HTML");
  return;
}
if (!window.St || !St.PageFlip){
  console.error("❌ No cargó PageFlip");
  return;
}

/* ===========================
   DATOS
=========================== */
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

/* ===========================
   HELPERS
=========================== */
const E = (tag, attrs={}, ...children)=>{
  const el=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if (k === 'class') el.className = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);   // ✅ data-*
    else el.setAttribute(k, v);
  }
  children.flat().forEach(ch=>{
    if (typeof ch === 'string') el.appendChild(document.createTextNode(ch));
    else if (ch) el.appendChild(ch);
  });
  return el;
};

const chunk=(arr,size)=>{
  const out=[]; for(let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size));
  return out;
};

const pageDom=(density='soft')=>{
  const p=E('div',{class:'page'}); p.dataset.density=density; return p;
};

/* ===========================
   GRID (FALLBACK RUTAS)
=========================== */
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

/* ===========================
   BUILD PAGES
=========================== */
const pages=[];

// 🔹 Mapa robusto: primera página (0-based) de cada categoría
const firstIndexByCat = Object.create(null);

/* ---- PORTADA ---- */
{
  const p=pageDom('hard');
  const section=E('section',{class:'cover-custom'},
    E('div',{class:'left-side'}, E('div',{class:'marble'})),
    E('div',{class:'right-side'},
      E('h1',{class:'title-cover'},"NUESTROS",E('br'),"PRODUCTOS",E('br'),"PIGO´S"),
      E('div',{class:'author'},'José Antonio Gómez Domínguez'),
      E('div',{class:'phone'},'7226307655')
    )
  );
  p.appendChild(section);
  pages.push(p);
}

/* ---- ÍNDICE ---- */
const INDEX_PAGE = pages.length;
{
  const p = pageDom('hard');

  const cols = E('div',{class:'cols'});
  CATEGORIES.forEach(c=>{
    // ✅ CLAVE exacta en data-goto (no el texto bonito)
    const row = E('div',{class:'row',dataset:{goto:c}});
    row.appendChild(E('img',{src:'assets/bullet.png',alt:''}));
    const nice = c.replace(/([A-Z])/g,' $1').trim().replace('De ','de ');
    row.appendChild(E('span',{}, nice));
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

/* ---- CATEGORÍAS ---- */
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

    // ✅ Marca la PRIMERA página real de la categoría y registra su índice 0-based
    if (groupIdx === 0) {
      p.dataset.cat = key;                // (opcional, para inspección)
      firstIndexByCat[key] = pages.length; // ← índice que tendrá al montarse
    }

    // Título
    cat.appendChild(
      E('div',{class:'title-bar'},
        E('h2',{class:'h2 title-with-logo'},
          E('img',{class:'title-logo',src:'assets/logo_circle.png',alt:''}),
          E('span',{class:'title-text'},title)
        )
      )
    );

    // Grid
    cat.appendChild( gridDom(group,gridClass) );
    p.appendChild(cat);

    // FAB Home
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

// Crea TODAS las categorías
for (const k of CATEGORIES){
  addCategory(
    k.replace(/([A-Z])/g,' $1').replace(/^ /,'').replace('De ','de '),
    k,
    IMAGES[k]
  );
}

/* ---- UBICACIÓN (página especial) ---- */
{
  // Marca y registra índice 0‑based para que el Índice pueda navegar aquí
  const p = pageDom();
  p.dataset.cat = 'Ubicacion';
  if (typeof firstIndexByCat === 'object') {
    firstIndexByCat['Ubicacion'] = pages.length;
  }

  const mapsUrl = 'https://www.google.com/maps/place/Av.+Miguel+Hidalgo+26,+Centro,+50900+Villa+de+Almoloya+de+Ju%C3%A9rez,+M%C3%A9x.,+M%C3%A9xico/@19.3700759,-99.7664634,17z/data=!3m1!4b1!4m6!3m5!1s0x85d279a6c6dc32ef:0x88e46e428e82e6ff!8m2!3d19.3700759!4d-99.7638831!16s%2Fg%2F11hbqks6x6?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D';

  const section = E('section', { class: 'contact contact-ubicacion' },

    // ⬇⬇ TÍTULO con el MISMO formato que el resto (logo + texto + línea dorada)
    E('div', { class: 'title-bar' },
      E('h2', { class: 'h2 title-with-logo' },
        E('img', { class: 'title-logo', src: 'assets/logo_circle.png', alt: '' }),
        E('span', { class: 'title-text' }, 'UBICACIÓN & CONTACTO')
      )
    ),

    // Bloque QR (centrado y abajo). Al presionarlo → Google Maps
    E('div', { class: 'qr-block' },
      E('a', { href: mapsUrl, target: '_blank', rel: 'noopener' },
        E('img', { src: 'assets/ubi.jpeg', alt: 'Abrir en Google Maps' })
      ),
      E('p', { class: 'qr-note' }, 'Toca el código QR para abrir Google Maps')
    ),

    // Links sociales (iconos más grandes y con destino)
    E('div', { class: 'links' },
      E('a', {
          class: 'social',
          href: 'https://wa.me/527226307655?text=Hola%20quiero%20m%C3%A1s%20informaci%C3%B3n',
          target: '_blank', rel: 'noopener'
        },
        E('img', { src: 'assets/WHATS.jpg', alt: 'WhatsApp' }),
        E('span', {}, 'WhatsApp: 722 630 7655')
      ),
      E('a', {
          class: 'social',
          href: 'https://www.instagram.com/pigosalquiler/',
          target: '_blank', rel: 'noopener'
        },
        E('img', { src: 'assets/INSTA.jpg', alt: 'Instagram' }),
        E('span', {}, '@pigosalquiler')
      ),
      E('a', {
          class: 'social',
          href: 'https://www.facebook.com/share/1DDrS8JTB6/?mibextid=wwXIfr',
          target: '_blank', rel: 'noopener'
        },
        E('img', { src: 'assets/FACE.jpg', alt: 'Facebook' }),
        E('span', {}, 'Facebook')
      )
    )
  );

  p.appendChild(section);
  pages.push(p);
}
/* ===========================
   INIT FLIPBOOK (stretch)
=========================== */
pages.forEach(pg => book.appendChild(pg));
const domPages = Array.from(book.querySelectorAll('.page'));

const pageFlip = new St.PageFlip(root, {
  // Estos tamaños sirven como PROPORCIÓN; el escalado real lo dicta el contenedor (size:'stretch')
  width: 850,
  height: 1100,
  size: 'stretch',
  minWidth: 300,
  maxWidth: 1600,
  minHeight: 400,
  maxHeight: 2200,
  showCover: true,
  usePortrait: true,          // ← por defecto permite “una página” en portrait
  mobileScrollSupport: true,
  flippingTime: 1000
});
pageFlip.loadFromHTML(domPages);

/* ====== Forzar DOBLE en landscape, UNA en portrait ====== */
function applyOrientationMode(){
  // true => PageFlip permite “una página”; false => fuerza doble hoja
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  pageFlip.setOptions({ usePortrait: isPortrait });
  pageFlip.update();
}

const onResize = () => pageFlip.update();

window.addEventListener('resize', onResize, { passive: true });
window.addEventListener('orientationchange', () => {
  applyOrientationMode();
  onResize();
}, { passive: true });

// iOS barras/visibilidad
window.addEventListener('visibilitychange', onResize);

// Primera aplicación
applyOrientationMode();
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

  function closeLB(){
    lb.classList.remove('open');
    document.body.classList.remove('lb-open');
  }
  lb.addEventListener('click', closeLB);
  lbBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeLB(); });

  window.addEventListener('keydown', (e)=>{
    if (!document.body.classList.contains('lb-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLB(); }
  }, true);
})();

/* ===========================
   BLOQUEAR GESTOS EN ZOOM
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
   HOME / ÍNDICE
=========================== */
document.addEventListener("click",(ev)=>{
  const go=ev.target.closest(".js-go-index,.fab-home");
  if(!go) return;
  ev.preventDefault(); ev.stopPropagation();
  pageFlip.turnToPage(INDEX_PAGE);
}, true);

/* ===========================
   ÍNDICE → CATEGORÍA (DINÁMICO por mapa calculado)
=========================== */
// Usamos el índice calculado al construir (firstIndexByCat),
// y ganamos al flipbook en pointerdown (capture).
document.addEventListener('pointerdown', (ev)=>{
  const row = ev.target.closest('.index .row');
  if (!row) return;

  ev.preventDefault();
  ev.stopImmediatePropagation();

  const key = row.dataset.goto;                 // ej. "MesaDeDulces"
  const idx = firstIndexByCat[key];

  if (typeof idx !== 'number') {
    console.warn('[ÍNDICE] clave sin índice calculado:', key, firstIndexByCat);
    return;
  }
  pageFlip.turnToPage(idx);                     // 0‑based real
}, true);

}); // FIN DOMContentLoaded