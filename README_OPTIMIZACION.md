# Optimización de imágenes y carga para tu Flipbook (PIGO'S)

Este paquete **no cambia tu layout ni navegación**. Solo optimiza **peso y carga**:

1. El **grid** usa **miniaturas (thumbs)** en WebP.
2. El **Lightbox** carga la imagen **grande** (WebP) **solo cuando el usuario la toca**.
3. Incluye un **GitHub Action** que genera automáticamente `images/webp/**` (full ~1600px) y `images/thumbs/**` (thumb ~900px) a partir de tus imágenes existentes (`images/**.jpg|jpeg|png`).
4. Incluye `package.json` con scripts por si prefieres generar localmente.

## Cómo usar este ZIP

1. **Descomprime** en la **raíz** de tu repo (donde están `index.html`, `styles.css`, `script.js`, carpeta `images/`, etc.).
2. **Acepta sobrescribir** `script.js` (se incluye ya modificado para usar thumbs y full). No se tocan tus layouts ni eventos.
3. **Haz commit y push**. El **GitHub Action** (`.github/workflows/optimize.yml`) generará automáticamente `images/webp/...` y `images/thumbs/...` y hará un commit con esos archivos optimizados.
4. Si quieres construir **localmente** en lugar de la Action, ejecuta:
   ```bash
   npm install
   # Genera FULL (1600px) WebP en images/webp/**
   npm run imgs:full
   # Genera THUMBS (900px) WebP en images/thumbs/**
   npm run imgs:thumbs
   ```

> **Nota**: El código hace *fallback* a tu imagen original si la WebP/Thumb aún no existe (útil en local). Cuando el Action termine, el grid usará thumbs y el lightbox las full automáticamente.

## ¿Qué cambió exactamente?
- `script.js` → función `gridDom(...)` ahora publica miniaturas WebP en el grid y guarda la ruta **full** en `data-full`. En el lightbox, al abrir, se usa `data-full`.
- PageFlip conserva tus opciones originales; solo se habilita `mobileScrollSupport: true` para mejor tacto en móvil.
- Se añade workflow `.github/workflows/optimize.yml` y `package.json` con scripts de Squoosh/Esbuild (estos no alteran el runtime si no los usas).

## Requisitos
- Tu árbol de imágenes original se mantiene (p.ej. `images/Manteleria/manteleria1.jpeg`).
- El Action/los scripts crearán:
  - `images/webp/Manteleria/manteleria1.webp` (FULL)
  - `images/thumbs/Manteleria/manteleria1.webp` (THUMB)

¡Listo! Solo sube y revisa GitHub Actions. Cuando termine, abre GitHub Pages y verifica la mejora de carga.
