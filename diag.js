(function(){
  var logEl = document.getElementById('log');
  function log(s){ if(logEl) logEl.textContent += '
' + s; }

  log('[DIAG] start');
  log('[DIAG] window.St: ' + (!!window.St));
  log('[DIAG] St.PageFlip: ' + (window.St && !!St.PageFlip));

  if (!window.St || !St.PageFlip) {
    log('NO cargó la librería PageFlip. Revisa el NOMBRE/RUTA del archivo en <script src=...>');
    log('Tip: abre directamente /page-flip.browser.min.js en el navegador; si 404, el nombre no coincide.');
    return;
  }

  // Contenedor mínimo a pantalla completa
  var root = document.createElement('div');
  root.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;overflow:hidden;background:#fff';
  document.body.appendChild(root);

  // Dos páginas de prueba
  var book = document.createElement('div');
  book.innerHTML =
    '<div class="page" data-density="hard" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:24px system-ui">PORTADA</div>'+
    '<div class="page" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:24px system-ui">PAG 2</div>';
  root.appendChild(book);

  try {
    var vw = Math.max(1, window.innerWidth);
    var vh = Math.max(1, window.innerHeight);
    var isP = vh >= vw;
    var pageW = isP ? vw : Math.floor(vw/2);
    var pageH = vh;

    var pf = new St.PageFlip(root, {
      size: 'fixed',
      width: pageW,
      height: pageH,
      showCover: true,
      usePortrait: isP
    });

    pf.loadFromHTML(book.querySelectorAll('.page'));
    setTimeout(function(){ try{ pf.update(); }catch(e){} }, 120);
    setTimeout(function(){ try{ pf.update(); }catch(e){} }, 320);

    log('OK: libro mínimo creado. pageW=' + pageW + ' pageH=' + pageH + ' isPortrait=' + isP);
  } catch (e) {
    log('ERROR creando PageFlip: ' + (e && e.message ? e.message : e));
  }
})();
