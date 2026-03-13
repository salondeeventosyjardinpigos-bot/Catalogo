# Instrucciones rápidas

1) Sube `flip_pdf2flip_index.html` a la **raíz** de `/Catalogo/`.
2) Sube tu PDF final como `catalogo.pdf` en la **raíz** de `/Catalogo/`.
3) Sube `images/manifest.gallery.json` y edítalo con **tus rutas reales**.
   - `indexImage` → imagen de cabecera del panel (usa rutas del sitio, NO URLs de GitHub UI).
   - `categories.{Nombre}` → lista de imágenes por categoría (rutas tipo `images/...`).
   - `pageToCategory` → mapea la **primera página (1-based)** de cada categoría.
4) Abre: `https://<usuario>.github.io/Catalogo/flip_pdf2flip_index.html`
5) Botón **☰** → índice con imagen; **tap centro** → galería de la categoría actual.

> Importante: No uses enlaces `https://github.com/.../blob/...` ni `.../tree/...` dentro del manifest. Usa **rutas del sitio**:
>  - `assets/indice_bg.jpg`
>  - `images/Manteleria/manteleria01.jpg`
>  etc.
