# PIGO'S Flipbook — Instrucciones rápidas

## 1) Dónde colocar las imágenes

Pega tus imágenes dentro de estas carpetas (respeta los nombres si quieres usar el `script.js` tal cual):

- images/Carpas/Carpas1.jpeg … Carpas16.jpeg
- images/Charcuteria/Charcuteria1.jpeg … Charcuteria18.jpeg
- images/Desayunos/Desayunos1.jpeg … Desayunos10.jpeg
- images/Mobiliario/Mobiliario1.jpeg … Mobiliario20.jpeg
- images/Tapes/tape1.jpeg
- images/Cafe/Cafe1.jpeg … Cafe5.jpeg
- images/Jardin/Jardin1.jpeg … Jardin3.jpeg
- images/Salon/Salon1.jpeg, salon2.jpeg, salon3.jpeg
- images/MesaDeDulces/MesadeDulces1.jpeg … MesadeDulces7.jpeg
- images/Salas/sala1.jpeg, sala2.jpeg
- images/PlatosBase/platobase1.jpeg … platobase5.jpeg (agrega más si quieres y ajusta script.js)
- images/Copas/copa1.jpeg … copa5.jpeg
- images/PistaLED/pistas led.jpeg
- images/Inflables/inflables.jpeg
- images/Sillones/sillones.jpeg
- images/MesaDeNovios/mesa de novios.jpeg
- images/Letras/Letras.jpeg

Además, coloca en **assets/**:

- assets/logo_pigos.jpg
- assets/indice_bg.jpg (fondo del índice)
- assets/ubi.jpeg (QR)
- assets/WHATS.jpg, assets/INSTA.jpg, assets/FACE.jpg
- assets/bullet.jpg (icono de lista del índice)

> Si tus nombres de archivo cambian, edita `script.js` en el objeto **IMAGES** para que coincidan.

## 2) Activar el efecto de pasar página real

Este proyecto incluye un **stub** de `page-flip.browser.min.js` para que se abra sin errores. Para el efecto real:

1. Reemplaza el archivo `page-flip.browser.min.js` por la versión **real** que ya tienes (la del proyecto PageFlip que compartiste).  
2. Abre `index.html` en tu navegador.  

## 3) Cómo navegar

- Portada → Índice → Categorías.  
- En cada hoja: botón **“Regresar al índice”**.  
- Click en cualquier imagen → **Lightbox** con Zoom y navegación.  
- Botones **📱 / 💻** para alternar tamaño del contenedor.  

## 4) Ajustes comunes

- Cambia proporciones de cuadrículas en `script.js` (parámetros `perPage` y clase de grid) si deseas otra composición.
- Puedes añadir más imágenes: agrega rutas al arreglo correspondiente en `IMAGES`.

## 5) Soporte

Si algo no se ve, revisa la **consola del navegador**: te indicará qué imagen no encontró.
