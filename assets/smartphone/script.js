$(function(){
  //Global Vars
  // Mostrar overlay-bg.jpg al abrir el proyecto smartphone
  if ($('.iphoneMock').length) {
    $('body').find('.overlay-bg').remove();
    $('body').append('<div class="overlay-bg"></div>');
    $('.overlay-bg').css({
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'width': '100%',
      'height': '100%',
      'background-image': 'url(musicPlayerBackground/overlay-bg.jpg)',
      'background-attachment': 'fixed',
      'background-size': 'cover',
      'background-position': 'center center',
      'opacity': '0.2',
      'z-index': '-1'
    });
  }
  const globalState = {
    apps: [
      {
        nombre: 'Calendario',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fcalendario.png?alt=media&token=ae918b56-05c3-40a1-be64-1abcdb291c6f',
        type: 'widgetFull',
        dinamico: true,
        url: 'https://www.icloud.com/calendar/' // URL de Google Calendar
      },
      {
        nombre: 'Fotos',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Ffotos.png?alt=media&token=86d712fd-aab1-48a3-a6d0-f2b5b7f9a2ab',
        type: 'app',
        dinamico: false
      },
      {
        nombre: 'Cámara',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fcamara.png?alt=media&token=bd81cee7-b011-4773-a053-a7cd935e34c3',
        type: 'app',
        dinamico: false
      },
      {
        nombre: 'FaceTime',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Ffacetime.png?alt=media&token=4c66d073-d44e-4671-878e-6a8dd1dc7956',
        type: 'app',
        dinamico: false
      },
      {
        nombre: 'Clima',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fclima.png?alt=media&token=02edb357-5775-4bf1-91c0-8e3f4908ddea',
        type: 'app',
        dinamico: false
      },
      {
        nombre: 'Calendario',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fcalendario.png?alt=media&token=ae918b56-05c3-40a1-be64-1abcdb291c6f',
        type: 'app',
        dinamico: true
      },
      {
        nombre: 'Reloj',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Freloj.png?alt=media&token=d0d76558-79c6-4d21-8fe7-1d13de3a6a3e',
        type: 'app',
        dinamico: true
      },
      {
        nombre: 'Mapas',
        icono: 'https://developer.apple.com/assets/elements/icons/maps/maps-96x96_2x.png',
        type: 'app',
        dinamico: false,
        url: 'https://beta.maps.apple.com/?ll=10.500000001061041%2C-66.92&spn=0.055676938694237066%2C0.08466458928869258' // URL de Google Maps
      },
      {
        nombre: 'Musica',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fmusica.png?alt=media&token=4ee18c65-11d5-46bb-8c4f-3536e49e33b0',
        type: 'app',
        dinamico: false
      },
      {
        nombre: 'App Store',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fappstore.png?alt=media&token=fe121a13-738f-43cd-936b-45ee7fb90cec',
        type: 'app',
        dinamico: false,
        url: 'https://www.apple.com/app-store/' // URL de App Store
      },
      {
        nombre: 'Facebook',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Ffacebook.png?alt=media&token=f383d17e-32a7-49ef-8ebb-c723d556baa2',
        type: 'app',
        dinamico: false,
        url: 'https://www.facebook.com' // URL de Facebook
      },
      {
        nombre: 'X',
        icono: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b7/92/fd/b792fd44-ec1c-e737-3a12-e31e115faf7f/ProductionAppIcon-0-0-1x_U007emarketing-0-8-0-0-0-85-220.png/104x104sr.webp',
        type: 'app',
        dinamico: false,
        url: 'https://twitter.com' // URL de Twitter (X)
      },
      {
        nombre: 'WhatsApp',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fwhatsapp.png?alt=media&token=b3416a44-56fc-4991-a10b-e4a34944bf3c',
        type: 'app',
        dinamico: false,
        url: 'https://web.whatsapp.com' // URL de WhatsApp Web
      },
      {
        nombre: 'YouTube',
        icono: 'https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/ios14%2Fyoutube.png?alt=media&token=180f2d4c-32bf-4d40-855c-c70148d727e9',
        type: 'app',
        dinamico: false,
        url: 'https://www.youtube.com' // URL de YouTube
      },      
      {
        nombre: 'Instagram',
        icono: 'app_icons/instagram.png',
        type: 'app',
        dinamico: false,
        url: 'https://www.instagram.com' // URL de Instagram
      },
      {
        nombre: 'Steam',
        icono: 'app_icons/steam.jpeg',
        type: 'app',
        dinamico: false,
        url: 'https://store.steampowered.com' // URL de Steam
      },
      {
        nombre: 'Cinex',
        icono: 'app_icons/cinex.jpg',
        type: 'app',
        dinamico: false
      }
      ],
    wrapperApps: {
      appsGrupo: 16,
      grupoActivo: 1,
      medida: $('.wrapperApps').outerWidth(true),
      transform: 0
    },
    dateTime: {
      meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      dias: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    bateriaBaja: false,
    draggScreen: false
  }

  // Función para alternar entre modo de duración y conteo regresivo
  let isCountdownMode = false;

  // Estado de repetición (cargado desde localStorage) - centralizado aquí
  let isRepeatActive = loadRepeatState();
  // Aplicar el estado inicial al elemento audio si ya existe
  $(function(){
    const audioEl = $('audio')[0];
    if (audioEl) audioEl.loop = !!isRepeatActive;
    if (isRepeatActive) {
      $('#refresh-btn').css('color', '#1b8700');
    }
  });

function toggleCountdownMode() {
  isCountdownMode = !isCountdownMode;
  updateTimeDisplay();
}

function updateTimeDisplay() {
  const $audio = $('audio')[0];
  const duration = $audio.duration;
  const currentTime = $audio.currentTime;

  if (isCountdownMode) {
    const remainingTime = duration - currentTime;
    $('#total-time').text(formatTime(remainingTime));
  } else {
    $('#total-time').text(formatTime(duration));
  }
}

$('#total-time').on('click', function() {
  toggleCountdownMode();
});

/* ----------------------------- */
/* Responsive play-button override */
/* - For >=1280px: open anchored expanding modal near the left button
   - For <1280px: open centered modal in the middle of the screen */
/* This appended code removes previous handlers and replaces behavior safely. */
(function(){
  $(function(){
    var $playButton = $("#left-floating-btn.play-button");
    if (!$playButton.length) return;

    // Clean previously attached handlers to avoid duplicates
    try { $playButton.off(); } catch(e) {}
    try { $(document).off('click.smartphonePlay'); $(document).off('keydown.smartphoneVideo'); } catch(e) {}

    var localSrc = $playButton.attr('data-local-src') || $playButton.data('local-src') || 'app_video/plane.mp4';
    var $videoEl = null;

    function ensureModals(){
      if (!$('#video-center-modal').length){
        var $center = $(
          '<div id="video-center-modal" aria-hidden="true">' +
            '<div class="modal-inner"><div class="modal-content"></div><div class="close-video-btn" role="button" aria-label="Cerrar">✕</div></div>' +
          '</div>'
        );
        $('body').append($center);
        $center.find('.close-video-btn').on('click', closeAll);
        $center.on('click', function(e){ if (e.target.id === 'video-center-modal') closeAll(); });
      }
      if (!$('#video-anchor-modal').length){
        var $anchor = $(
          '<div id="video-anchor-modal" aria-hidden="true">' +
            '<div class="modal-inner"><div class="modal-content"></div><div class="close-video-btn" role="button" aria-label="Cerrar">✕</div></div>' +
          '</div>'
        );
        $('body').append($anchor);
        $anchor.find('.close-video-btn').on('click', closeAll);
      }
    }

    function createVideoEl(src){
      var v = $('<video>', { id: 'smartphone-local-video', src: src, controls: true, autoplay: true, playsinline: true }).css({ width: '100%', height: '100%', display: 'block', 'object-fit': 'cover' });
      v.on('click.smartphoneVideo', function(e){
        try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
        var vid = this;
        try {
          if (vid.paused) { var p = vid.play(); if (p && p.catch) p.catch(function(){/* ignore play promise error */}); }
          else vid.pause();
        } catch(err) { console.warn('Video play/pause failed', err); }
      });
      return v;
    }

    function openCenter(){
      ensureModals();
      closeAll();
      var $modal = $('#video-center-modal');
      var $content = $modal.find('.modal-content');
      $content.empty();
      $videoEl = createVideoEl(localSrc);
      $content.append($videoEl);
      $modal.addClass('active').attr('aria-hidden','false');
      try{ $videoEl.get(0).play(); } catch(e){}
    }

    function openAnchor(){
      ensureModals();
      // Do NOT call closeAll() here — we want the triangle's '-clicked' class
      // to be present so its CSS transition runs in sync with the overlay.
      // Use overlay expand approach (matches behavior from `smartphone - 1`)
      // Capture initial rect (triangle if available) so the overlay can animate
      var $container = $playButton.closest('.play-button-container');
      var triEl = $container.find('.play-button__triangle')[0];
      var triRect = null;
      try { if (triEl && triEl.getBoundingClientRect) triRect = triEl.getBoundingClientRect(); } catch(e) { triRect = null; }

      // ensure the container has the clicked class so triangle transitions
      try { $container.addClass('-clicked'); } catch(e) {}
      // store rect for later (used when closing to animate back)
      try { $container.data('triRect', triRect); } catch(e) {}

      // create overlay element
      var $overlay = $('#smartphone-video-overlay');
      if ($overlay.length) $overlay.remove();
      $overlay = $('<div id="smartphone-video-overlay"></div>');
      var initRect;
      try {
        if (triRect) initRect = triRect;
        else initRect = $playButton.get(0).getBoundingClientRect();
      } catch(e) { initRect = $playButton.get(0).getBoundingClientRect(); }

      $overlay.css({
        position: 'fixed',
        left: initRect.left + 'px',
        top: initRect.top + 'px',
        width: initRect.width + 'px',
        height: initRect.height + 'px',
        overflow: 'hidden',
        background: '#000',
        'z-index': 100000,
        display: 'block',
        'border-radius': '4px',
        opacity: 0
      });
      $('body').append($overlay);

      // move close button into overlay if present
      try {
        var $origClose = $playButton.find('.close-button');
        if ($origClose && $origClose.length) {
          var $origParent = $origClose.parent();
          var $origNext = $origClose.next();
          $container.data('origCloseParent', $origParent);
          $container.data('origCloseNext', ($origNext && $origNext.length) ? $origNext : null);
          $origClose.css({ position: 'absolute', top: '8px', right: '8px', 'z-index': 100002, cursor: 'pointer', 'margin-right': '4px' }).appendTo($overlay);
          // ensure clicking the moved close button closes with animation
          try { $origClose.off('click.smartphonePlay').on('click.smartphonePlay', function(ev){ ev.stopPropagation(); closeAll(); }); } catch(e) {}
        }
      } catch(e) {}

      // create video element and append
      $videoEl = createVideoEl(localSrc);
      $videoEl.css({ position: 'relative', 'z-index': 100001, display: 'block', width: '100%', height: '100%' });
      $overlay.append($videoEl);

      // compute final size (match smartphone - 1)
      var finalW = 500, finalH = 281.25;
      var cRect = $container[0].getBoundingClientRect();
      var finalLeft = cRect.left + (cRect.width / 2) - (finalW / 2);
      var finalTop = cRect.top + (cRect.height / 2) - (finalH / 2);

      // determine transition duration/timing from triangle if available
      var overlayTransitionDuration = '0.6s';
      var overlayTransitionTiming = 'ease';
      if (triEl && window.getComputedStyle) {
        try {
          var cs = window.getComputedStyle(triEl);
          var td = (cs.transitionDuration || '').split(',')[0] || '0.6s';
          var tt = (cs.transitionTimingFunction || '').split(',')[0] || 'ease';
          overlayTransitionDuration = td.trim();
          overlayTransitionTiming = tt.trim();
        } catch (ee) {}
      }
      var overlayTransition = 'left ' + overlayTransitionDuration + ' ' + overlayTransitionTiming + ', top ' + overlayTransitionDuration + ' ' + overlayTransitionTiming + ', width ' + overlayTransitionDuration + ' ' + overlayTransitionTiming + ', height ' + overlayTransitionDuration + ' ' + overlayTransitionTiming + ', opacity ' + overlayTransitionDuration + ' ' + overlayTransitionTiming;
      $overlay.css('transition', overlayTransition);

      // animate to final rect
      requestAnimationFrame(function(){
        setTimeout(function(){
          $overlay.css({ left: finalLeft + 'px', top: finalTop + 'px', width: finalW + 'px', height: finalH + 'px', opacity: 1 });
          try { $videoEl.css('opacity', 1); } catch(err) {}
        }, 8);
      });

      // ensure resize/scroll update
      function repositionOverlayImmediate(){
        var cRect2 = $container[0].getBoundingClientRect();
        var fLeft = cRect2.left + (cRect2.width / 2) - (finalW / 2);
        var fTop = cRect2.top + (cRect2.height / 2) - (finalH / 2);
        var oldTransition = $overlay.css('transition');
        $overlay.css('transition', 'none');
        $overlay.css({ left: fLeft + 'px', top: fTop + 'px' });
        requestAnimationFrame(function(){ $overlay.css('transition', overlayTransition); });
      }
      $(window).on('resize.smartphoneVideo scroll.smartphoneVideo', repositionOverlayImmediate);
      $container.data('videoOverlay', $overlay);

      try{ $videoEl.get(0).play(); } catch(e){}
    }

    function closeAll(){
      // If an overlay expansion exists, animate it back to the triangle before removing
      try {
        var $ov = $('#smartphone-video-overlay');
        var $container = $playButton.closest('.play-button-container');
        if ($ov && $ov.length && $container && $container.length) {
          // pause video but keep element until animation finishes
          try { if ($videoEl && $videoEl.length) { $videoEl.get(0).pause(); $videoEl.off('click.smartphoneVideo'); } } catch(e) {}

          // compute triangle rect (fallback to small centered rect)
          var triRect = $container.data('triRect');
          try {
            if (!triRect || typeof triRect.left === 'undefined') {
              var cRectForInit = $container[0].getBoundingClientRect();
              triRect = { left: cRectForInit.left + cRectForInit.width / 2 - 12, top: cRectForInit.top + cRectForInit.height / 2 - 12, width: 24, height: 24 };
            }
          } catch(e) {
            triRect = null;
          }

          // remove clicked class so triangle animates back
          try { $container.removeClass('-clicked'); } catch(e) {}

          // animate overlay to triangle rect + fade
          try {
            if (triRect) {
              // ensure transition is set
              var oldTransition = $ov.css('transition') || '';
              // trigger animation to small rect
              requestAnimationFrame(function(){
                setTimeout(function(){
                  $ov.css({ left: triRect.left + 'px', top: triRect.top + 'px', width: triRect.width + 'px', height: triRect.height + 'px', opacity: 0 });
                }, 8);
              });

              // after transition ends, cleanup
              $ov.one('transitionend.smartphoneVideoClose', function(evt){
                try {
                  // restore moved close button
                  try {
                    var $movedClose = $ov.find('.close-button');
                    var $origParent = $container.data('origCloseParent');
                    var $origNext = $container.data('origCloseNext');
                    if ($movedClose && $movedClose.length && $origParent && $origParent.length) {
                      $movedClose.css({ position: '', top: '', right: '', 'z-index': '', cursor: '', visibility: '' });
                      if ($origNext && $origNext.length) { $movedClose.insertBefore($origNext); }
                      else { $origParent.append($movedClose); }
                    }
                  } catch (ee) { /* ignore restore errors */ }

                  // remove overlay and video element
                  try { $ov.remove(); } catch(e) {}
                  try { if ($videoEl && $videoEl.length) { $videoEl.remove(); $videoEl = null; } } catch(e) {}
                  // unbind overlay-specific handlers
                  try { $(window).off('resize.smartphoneVideo scroll.smartphoneVideo'); } catch(e) {}
                } catch(e) {}
              });
              // also hide anchor/modal containers
              $('#video-center-modal').removeClass('active').attr('aria-hidden','true');
              $('#video-anchor-modal').removeClass('open').attr('aria-hidden','true').css({ opacity: 0, pointerEvents: 'none' });
              return; // done — cleanup will happen after transition
            }
          } catch(e) { /* fallthrough to immediate cleanup */ }
        }
      } catch(e) { /* ignore overlay animation errors */ }

      // fallback immediate cleanup (no overlay or animation supported)
      try { if ($videoEl && $videoEl.length) { $videoEl.get(0).pause(); $videoEl.get(0).currentTime = 0; $videoEl.off('click.smartphoneVideo'); $videoEl.remove(); $videoEl = null; } } catch(e) {}
      try { $('#video-center-modal').removeClass('active').attr('aria-hidden','true'); } catch(e) {}
      try { $('#video-anchor-modal').removeClass('open').attr('aria-hidden','true').css({ opacity: 0, pointerEvents: 'none' }); } catch(e) {}
      try { $('.play-button-container').removeClass('-clicked'); } catch(e) {}
      try { $('#smartphone-video-overlay').remove(); } catch(e) {}
      try { $(window).off('resize.smartphoneVideo scroll.smartphoneVideo'); } catch(e) {}
    }

    // Click handler: open anchor on large screens, center on smaller
    $playButton.on('click', function(e){ e.preventDefault(); e.stopPropagation(); $('.play-button-container').addClass('-clicked'); var width = window.innerWidth || document.documentElement.clientWidth; if (width >= 1280) openAnchor(); else openCenter(); });

    // Click fuera deshabilitado: el video solo se cierra con el botón de cierre.
    // Antes: el handler cerraba el video al hacer click fuera. Se deja comentado
    // en caso de querer restaurar este comportamiento en el futuro.
    // $(document).on('click.smartphonePlay', function(evt){ if (!$(evt.target).closest('.play-button-container, #video-center-modal, #video-anchor-modal, #smartphone-video-overlay').length) closeAll(); });

    // Escape key closes
    $(document).on('keydown.smartphoneVideo', function(e){ if (e.key === 'Escape') closeAll(); });
  });
})();

$('audio').on('timeupdate', function () {
  const $audio = $(this)[0];
  const currentTime = $audio.currentTime;
  const duration = $audio.duration;
  const percent = (currentTime / duration) * 100;

  $('#current-time').text(formatTime(currentTime));
  $('.progress').css('width', `${percent}%`);

  // Actualizar el tiempo de duración en modo conteo regresivo
  if (isCountdownMode) {
    const remainingTime = duration - currentTime;
    $('#total-time').text(formatTime(remainingTime));
  }
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Función para guardar el estado de isRepeatActive en localStorage
function saveRepeatState(state) {
  localStorage.setItem('isRepeatActive', state);
}

// Función para recuperar el estado de isRepeatActive desde localStorage
function loadRepeatState() {
  return localStorage.getItem('isRepeatActive') === 'true';
}
  // Función para manejar el clic en las aplicaciones
function handleAppClick(app) {
  console.log(`Clic en la aplicación: ${app.nombre}`);

  if (app.url && app.url !== '#') {
    window.open(app.url, '_blank');
  } else {
    switch (app.nombre) {
      case 'Cámara':
        camara();
        break;
      case 'Musica':
        // Ocultar el background-image y el overlay
        $('.background-container').css('background-image', 'none'); // Oculta el fondo
        $('.overlay-mf').hide(); // Oculta el overlay
        initializeMusicPlayer(); // Llamar directamente a la función para inicializar el reproductor
        break;
      case 'Cinex':
        openCinexApp();
        break;
      default:
        console.log(`Acción no definida para la aplicación: ${app.nombre}`);
        break;
    }
  }
}

function openCinexApp() {
    const $wrapper = $('#cinex-wrapper');
    const $iframe = $('#cinex-iframe');

    if ($wrapper.length) {
        // Recargar el iframe cada vez para mostrar el splash screen
        const currentSrc = $iframe.attr('src');
        if (currentSrc) {
            // Guardar el src actual
            const savedSrc = currentSrc;
            // Limpiar el src para forzar recarga
            $iframe.attr('src', '');
            // Restaurar el src después de un breve delay
            setTimeout(() => {
                $iframe.attr('src', savedSrc);
            }, 50);
        } else {
            // Si el iframe no tiene src, asignarlo por primera vez
            $iframe.attr('src', 'cinex/index.html');
        }
        
        // Verificar si touchMov ya está configurado para evitar duplicados
        if (!$wrapper.data('touchMov-configured')) {
            const $swipeArea = $('#cinex-swipe-area');
            
            // Configurar el deslizamiento para salir de Cinex con animación
            $swipeArea.touchMov({
                mov: 'y',
                updateMovY: function(e, mov) {
                    // Mover el wrapper mientras se arrastra hacia arriba
                    if (mov < 0) {
                        $wrapper.css({
                            transform: `translateY(${mov}px)`,
                            opacity: Math.max(0, 1 + mov / 200),
                            transition: 'none'
                        });
                    }
                },
                movUp: function (e) {
                    // Aplicar la animación de deslizamiento hacia arriba y fade out
                    $wrapper.css({
                        'opacity': '0',
                        'transform': 'translateY(-100%)',
                        'transition': 'opacity 1s ease, transform 1s ease'
                    });

                    // Ocultar el wrapper después de la animación
                    setTimeout(() => {
                        $wrapper.addClass('hidden');
                        $wrapper.css({
                            'opacity': '1',
                            'transform': 'translateY(0)',
                            'transition': ''
                        });
                        
                        // Mostrar el appScreen al cerrar Cinex
                        $('.appScreen').removeClass('hidden');
                    }, 1000);
                }
            });
            
            // Marcar como configurado para evitar duplicados
            $wrapper.data('touchMov-configured', true);
        }
        
        // Ocultar el appScreen cuando se abre Cinex
        $('.appScreen').addClass('hidden');
        $wrapper.removeClass('hidden');
    }
}

// Función para iniciar la señal telefonica
function simulateSignalChanges() {
  const signalElement = document.querySelector('.rightSide .signal');
  const datosElement = document.querySelector('.rightSide .datos');
  
  if (!signalElement || !datosElement) {
    console.error('Elementos no encontrados');
    return;
  }

  // Configuración de niveles (barras visibles y tecnología)
  const signalConfig = [
    { class: 'low', tech: '3G', bars: [true, false, false, false] },    // Solo 1 barra (3G)
    { class: 'mid-low', tech: '4G', bars: [true, true, false, false] }, // 2 barras (4G)
    { class: 'mid', tech: '5G', bars: [true, true, true, false] },     // 3 barras (5G)
    { class: 'high', tech: '5G', bars: [true, true, true, true] }      // 4 barras (5G)
  ];

  let currentLevel = 2; // Inicia en 5G (nivel medio)

  function updateSignal() {
    // Lógica aleatoria (40% bajar, 40% subir, 20% mantener)
    const change = Math.random();
    if (change < 0.4 && currentLevel > 0) currentLevel--;
    else if (change > 0.6 && currentLevel < signalConfig.length - 1) currentLevel++;

    // Actualizar clases
    signalElement.classList.remove(...signalConfig.map(conf => conf.class));
    signalElement.classList.add(signalConfig[currentLevel].class);
    
    // Actualizar texto (aquí estaba el error)
    datosElement.textContent = signalConfig[currentLevel].tech;
    
    // Actualizar barras individualmente
    updateBarsVisibility(signalConfig[currentLevel].bars);
  }

  function updateBarsVisibility(visibleBars) {
    // Control directo de cada barra
    const bars = [
      signalElement.style.setProperty('--bar1-opacity', visibleBars[0] ? '1' : '0.4'),
      signalElement.style.setProperty('--bar2-opacity', visibleBars[1] ? '1' : '0.4'),
      signalElement.style.setProperty('--bar3-opacity', visibleBars[2] ? '1' : '0.4'),
      signalElement.style.setProperty('--bar4-opacity', visibleBars[3] ? '1' : '0.4')
    ];
  }

  // Iniciar
  updateSignal();
  setInterval(updateSignal, 5000);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', simulateSignalChanges);
// Versión más robusta para esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Pequeño retraso para asegurar que todos los elementos estén renderizados
  setTimeout(simulateSignalChanges, 100);
});

// Alternativa si usas módulos o carga diferida
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(simulateSignalChanges, 100);
} else {
  document.addEventListener('DOMContentLoaded', simulateSignalChanges);
}


// Función para inicializar el reproductor de música
function initializeMusicPlayer() {
  // Verificar si el reproductor ya está inicializado
  if ($('#wrapper').length && $('#wrapper').is(':visible')) {
    return; // Si ya existe y está visible, no hacer nada
  }

  // Cargar jCarousel dinámicamente si no está cargado
  if (typeof $.fn.jcarousel === 'undefined') {
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jcarousel/0.3.1/jquery.jcarousel.min.js')
      .done(function() {
        // Una vez cargado, inicializar el reproductor
        initPlayerAfterJCarouselLoad();
      })
      .fail(function() {
        console.error('Error al cargar jCarousel');
      });
  } else {
    // Si ya está cargado, inicializar el reproductor directamente
    initPlayerAfterJCarouselLoad();
  }
}

function initPlayerAfterJCarouselLoad() {
  // Inicializar el modo de duración
  isCountdownMode = false;
  updateTimeDisplay();

  // Mostrar el contenedor del reproductor
  $('#wrapper').removeAttr('hidden');

  // Limpiar eventos anteriores de los botones
  $('#play-btn').off('click');
  $('#previous-btn').off('click');
  $('#next-btn').off('click');
  $('#close-btn').off('click');
  $('#random-btn').off('click');
  $('#refresh-btn').off('click');
  $('#heart-icon').off('click');
  $('#bluetooth-btn').off('click');

  // Lista de canciones
  var songs = [
    {
      title: "Nobody's Home",
      artist: "Avril Lavigne",
      cover: "music_covers/avril_lavigne.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/avril_lavigne_nobodys_home.mp3",
      color: "#c7c7c3",
      link: "https://www.youtube.com/watch?v=NGFSNE18Ywc&list=RDNGFSNE18Ywc&start_radio=1"
    },
    {
      title: "Broken",
      artist: "Seether Feat. Amy Lee",
      cover: "music_covers/seether.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/seether_broken.mp3",
      color: "#df5c70ff",
      link: "https://www.youtube.com/watch?v=hPC2Fp7IT7o&list=RDhPC2Fp7IT7o&start_radio=1"
    },
    {
      title: "My Heart is Broken",
      artist: "Evanescence",
      cover: "music_covers/evanescence.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/evanescence_my_heart_is_broken.mp3",
      color: "#6c4d9e",
      link: "https://www.youtube.com/watch?v=f1QGnq9jUU0&list=RDf1QGnq9jUU0&start_radio=1"
    },
    {
      title: "Promises",
      artist: "Megadeth",
      cover: "music_covers/megadeth.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/megadeth_promises.mp3",
      color: "#af3737ff",
      link: "https://www.youtube.com/watch?v=lltzcMvPJW0&list=RDlltzcMvPJW0&start_radio=1"
    },
    {
      title: "The Call of the Mountains",
      artist: "Eluveitie",
      cover: "music_covers/eluveitie.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/eluveitie_the_call_of_the_mountains.mp3",
      color: "#7494b5",
      link: "https://www.youtube.com/watch?v=-w2m-TeLi6I&list=RD-w2m-TeLi6I&start_radio=1"
    },
    {
      title: "Storm of Sorrow",
      artist: "Epica",
      cover: "music_covers/epica.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/epica_storm_of_sorrow.mp3",
      color: "#797979ff",
      link: "https://www.youtube.com/watch?v=dNoTvg0t52c&list=RDdNoTvg0t52c&start_radio=1"
    },
    {
      title: "Insane",
      artist: "Korn",
      cover: "music_covers/korn.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/korn_insane.mp3",
      color: "#3c9fbd",
      link: "https://www.youtube.com/watch?v=P-zb4C_k7Ek&list=RDP-zb4C_k7Ek&start_radio=1"
    },
    {
      title: "Under Attack",
      artist: "Destruction",
      cover: "music_covers/destruction.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/destruction_under_attack.mp3",
      color: "#de7a1d",
      link: "https://www.youtube.com/watch?v=KNmbUDA0Spg&list=RDKNmbUDA0Spg&start_radio=1"
    },
    {
      title: "Civilization Collapse",
      artist: "Kreator",
      cover: "music_covers/kreator.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/kreator_civilization_collapse.mp3",
      color: "#a02507ff",
      link: "https://www.youtube.com/watch?v=EApMitnsXgg&list=RDEApMitnsXgg&start_radio=1"
    },
    {
      title: "Storytime",
      artist: "Nightwish",
      cover: "music_covers/nightwish.jpg",
      audioFile: "https://crejohn.github.io/Music-Player/nightwish_storytime.mp3",
      color: "#495a7a",
      link: "https://www.youtube.com/watch?v=5g8ykQLYnX0&list=RD5g8ykQLYnX0&start_radio=1"
    }
  ];

  // Inicializar las canciones
  const $songsList = $('#songs');
  $songsList.empty();

  songs.forEach((song) => {
    $songsList.append(`
      <li class="song" data-audio="${song.audioFile}" data-color="${song.color}">
        <a href="${song.link}" target="_blank" style="text-decoration: none;">
          <img src="${song.cover}" style="cursor: pointer;">
        </a>
        <p class="song-title">${song.title}</p>
        <p class="song-artist">${song.artist}</p>
      </li>
    `);
  });

  // Inicializar el carrusel solo si existe el elemento
  if ($('.jcarousel').length) {
    $('.jcarousel').jcarousel({
      wrap: 'circular'
    });
  }

  // Configurar la línea de tiempo
  $('audio').on('timeupdate', function () {
    const $audio = $(this)[0];
    const currentTime = $audio.currentTime;
    const duration = $audio.duration;
    const percent = (currentTime / duration) * 100;

    $('#current-time').text(formatTime(currentTime));
    $('.progress').css('width', `${percent}%`);
  });

  // Evento de clic en el slider
  $('.slider').on('click', function (e) {
    const $audio = $('audio')[0];
    const duration = $audio.duration;
    const sliderOffset = $(this).offset().left;
    const clickPosition = e.pageX - sliderOffset;
    const sliderWidth = $(this).width();
    const newTime = (clickPosition / sliderWidth) * duration;
    
    $audio.currentTime = newTime;
    const percent = (newTime / duration) * 100;
    $('.progress').css('width', `${percent}%`);
  });

  // Configurar eventos del reproductor
  $('.jcarousel').on('jcarousel:visiblein', 'li', function (event, carousel) {
    const $song = $(this);
    const cover = $song.find('img').attr('src');
    const songTitle = $song.find('.song-title').text();
    const songArtist = $song.find('.song-artist').text();
    const audioSrc = $song.attr('data-audio');
    const backgroundColor = $song.attr('data-color');

    $('#background').css('background-image', `url(${cover})`);
    $('body')
      .css('transition', 'background-color 1s ease')
      .css('background-color', backgroundColor);

    $('body').find('.overlay-bg').remove();
    $('body').append('<div class="overlay-bg"></div>');

    $('.overlay-bg').css({
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'width': '100%',
      'height': '100%',
      'background-image': 'url(musicPlayerBackground/overlay-bg.jpg)',
      'background-attachment': 'fixed',
      'background-size': 'cover',
      'background-position': 'center center',
      'opacity': '0.2',
      'z-index': '-1'
    });

    $('#song-info img').attr('src', cover);
    $('#song-info .title').text(songTitle);
    $('#song-info .artist').text(songArtist);

    const $audio = $('audio');
    $audio.find('source').attr('src', audioSrc);
    $audio[0].load();

    $('#play-btn').find('i').removeClass('fa-pause').addClass('fa-play');
    $('#refresh-btn').removeClass('active');

    // Mantener la propiedad loop acorde al estado de repetición
    $audio[0].loop = !!isRepeatActive;

    $audio[0].onloadedmetadata = function () {
      const duration = $audio[0].duration;
      $('#total-time').text(formatTime(duration));
    };
  });

  function disableBackgroundColorEffect() {
    $('body').css({
      'transition': 'background-color 1s ease',
      'background-color': 'transparent'
    });

    setTimeout(() => {
      $('body').css('background-color', '');
    }, 500);
  }

  // Configurar la primera canción
  const $firstSong = $('.jcarousel li:first');
  $firstSong.trigger('jcarousel:visiblein');

  // Inicializar el botón de Bluetooth
  $('#bluetooth-btn').removeClass('active').removeClass('fa-bluetooth-b').addClass('fa-bluetooth');

  // Configurar botones de control
  $('#play-btn').click(function () {
    const $audio = $('audio')[0];
    if ($audio.paused) {
      $audio.play().then(() => {
        $(this).find('i').removeClass('fa-play').addClass('fa-pause');
      }).catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
    } else {
      $audio.pause();
      $(this).find('i').removeClass('fa-pause').addClass('fa-play');
    }
  });

  $('#previous-btn').click(function () {
    $('.jcarousel').jcarousel('scroll', '-=1');
  });

  // Manejador de eventos "ended"
  $('audio').on('ended', function () {
    if (isRepeatActive) {
      const $audio = $('audio')[0];
      $audio.currentTime = 0;
      $audio.play();
    } else {
      $('#next-btn').click();
    }
  });

  $('#next-btn').click(function () {
    $('.jcarousel').jcarousel('scroll', '+=1', function () {
      const $audio = $('audio')[0];
      $audio.play();
      $('#play-btn').find('i').removeClass('fa-play').addClass('fa-pause');
    });
  });

  // Configurar botones de control con stopPropagation
  $('#play-btn, #previous-btn, #next-btn, #close-btn, #random-btn, #refresh-btn, #heart-icon, #bluetooth-btn').on('touchstart', function (event) {
    event.stopPropagation();
  });

  // Configurar el deslizamiento para salir del reproductor
  $('#wrapper').touchMov({
    mov: 'y',
    movUp: function (e) {
      // Si el gesto inicia sobre el botón Play o cualquier botón de sub-controls, ignorar el swipe
      if (
        $(e.target).closest('#play-btn').length ||
        $(e.target).closest('#sub-controls').length
      ) {
        return;
      }
      $('audio')[0].pause();
      $('#wrapper').css({
        'opacity': '0',
        'transform': 'translateY(-100%)',
        'transition': 'opacity 1s ease, transform 1s ease'
      });

      disableBackgroundColorEffect();

      setTimeout(() => {
        $('#wrapper').attr('hidden', true);
        $('#wrapper').css({
          'opacity': '1',
          'transform': 'translateY(0)'
        });
        $('.background-container').css('background-image', 'url(assets/img/overlay-bg.jpg)');
        $('.overlay-mf').show();
      }, 1000);
    }
  });

  // Botón de random
  let lastRandomIndex = -1;
  $('#random-btn').click(function () {
    const $songsList = $('#songs li');
    const totalSongs = $songsList.length;

    if (totalSongs > 0) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * totalSongs);
      } while (randomIndex === lastRandomIndex && totalSongs > 1);

      lastRandomIndex = randomIndex;
      const $randomSong = $songsList.eq(randomIndex);
      $('.jcarousel').jcarousel('scroll', $randomSong);

      const audioSrc = $randomSong.attr('data-audio');
      const $audio = $('audio');
      $audio.find('source').attr('src', audioSrc);
      $audio[0].load();
      $audio[0].play();

      $('#play-btn').find('i').removeClass('fa-play').addClass('fa-pause');
    }
  });

  // Menú
  $("#menu-btn").click(function() {
    $("#content-wrap").addClass('inactive');
    $("#sidemenu").addClass('active');
  });

  // Overlay
  $("#overlay").click(function () {
    $("#content-wrap").removeClass('inactive');
    $("#sidemenu").removeClass('active');
  });

  // Options
  $("#options-btn").click(function() {
    $("#song-options").addClass('active');
  });

  // Bluetooth
  $("#bluetooth-btn").click(function() {
    $("#bluetooth-devices").addClass('active');
  });

  // Bluetooth Menu
  $("#bluetooth-devices ul li").click(function() {
    $(this).toggleClass('connected');
    $(this).siblings().removeClass('connected');
    
    if ($("#bluetooth-devices ul li").hasClass('connected')) {
      $("#sub-controls i.fa-bluetooth-b").addClass('active');
    } else {
      $("#sub-controls i.fa-bluetooth-b").removeClass('active');
    }
  });

  // Close Menu
  $(".close-btn").click(function() {
    $(".menu").removeClass('active');
  });

  // Botón de refresh: alternar repetición y sincronizar con el elemento audio
  $('#refresh-btn').click(function () {
    isRepeatActive = !isRepeatActive;
    saveRepeatState(isRepeatActive);

    // Actualizar color del botón
    if (isRepeatActive) {
      $(this).css('color', '#1b8700');
    } else {
      $(this).css('color', '');
    }

    // Asegurarse de que el elemento audio use la propiedad loop (actúa inmediatamente)
    const audioEl = $('audio')[0];
    if (audioEl) audioEl.loop = !!isRepeatActive;
  });

  // Botón de corazón
  $('#heart-icon').click(function () {
    const $heartIcon = $(this);
    if ($heartIcon.hasClass('fa-heart-o')) {
      $heartIcon.removeClass('fa-heart-o').addClass('fa-heart').css('color', '#e74c3c');
    } else {
      $heartIcon.removeClass('fa-heart').addClass('fa-heart-o').css('color', '');
    }
    $heartIcon.addClass('heart-animation');
    setTimeout(() => {
      $heartIcon.removeClass('heart-animation');
    }, 400);
  });

  // Botón de Bluetooth
  $('#bluetooth-btn').click(function() {
    if ($(this).hasClass('fa-bluetooth')) {
      $(this).removeClass('fa-bluetooth').addClass('fa-bluetooth-b active').css('color', '#3498db');
    } else {
      $(this).removeClass('fa-bluetooth-b active').addClass('fa-bluetooth').css('color', '');
    }
  });

  // Función para formatear el tiempo
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}

  //EXtended Functions
$.fn.extend({
    touchMov: function(config){
      config = jQuery.extend({
        mov: 'x',
        movIzq: function(){},
        movDer: function(){},
        movUp: function(){},
        movDown: function(){},
        updateMovX: function(){},
        updateMovY: function(){},
        finishMov: function(){}
      }, config);
      let el = this;
      let initCoords = { x: 0, y: 0 };
      let movCoords = { x: 0, y: 0 };
      let downCoords = { x: 0, y: 0 };
      el.mousedown(function (e) {
        initCoords = { x: e.pageX, y: e.pageY };
        downCoords = { x: movCoords.x, y: movCoords.y };
        el.mousemove(function (e2) {
          globalState.draggScreen = true;
          movCoords = { x: e2.pageX, y: e2.pageY };
          if (config.mov === 'x') {
            config.updateMovX(e2, (movCoords.x - initCoords.x))
          } else if (config.mov === 'y') {
            config.updateMovY(e2, (movCoords.y - initCoords.y))
          }
        })
        el.mouseup(function (ex) {
          if (config.mov === 'x') {
            if (movCoords.x - downCoords.x != 0) {
              (movCoords.x - initCoords.x) > 0 ? config.movDer(ex) : config.movIzq(ex);
            }
          } else if (config.mov === 'y') {
            if (movCoords.y - downCoords.y != 0) {
              (movCoords.y - initCoords.y) > 0 ? config.movDown(ex) : config.movUp(ex);
            }
          }
          globalState.draggScreen = false;
          config.finishMov(ex);
          el.off('mousemove');
          el.off('mouseup');
          el.off('mouseleave');
        })
        el.mouseleave(function (a) {
          if (config.mov === 'x') {
            if (movCoords.x - downCoords.x != 0) {
              (movCoords.x - initCoords.x) > 0 ? config.movDer(a) : config.movIzq(a);
            }
          } else if (config.mov === 'y') {
            if (movCoords.y - downCoords.y != 0) {
              (movCoords.y - initCoords.y) > 0 ? config.movDown(a) : config.movUp(a);
            }
          }
          globalState.draggScreen = false;
          config.finishMov(a);
          el.off('mousemove');
          el.off('mouseup');
          el.off('mouseleave');
        })
      })
      return this;
    },
    calendario: function(config){
      config = jQuery.extend({
        fecha: new Date(),
        diaCompleto: false
      }, config);
      let mes = globalState.dateTime.meses[config.fecha.getMonth()];
      let diasMes = new Date(config.fecha.getFullYear(), (config.fecha.getMonth() + 1), 0).getDate();
      let hoy = config.fecha.getDate();
      let primerDia = new Date(config.fecha.getFullYear(), config.fecha.getMonth(), 0).getDay();
      this.append(`
<div class="mes">
<p class="mesName">${mes}</p>
<div class="calendarioTabla">
<div class="tablaHeader"></div>
<div class="tablaContent"></div>
</div>
</div>`
                 );
      let header = this.find('.mes .tablaHeader');
      let content = this.find('.mes .tablaContent');
      globalState.dateTime.dias.map(dia => header.append(`<div class="diaName">${config.diaCompleto ? dia : dia.charAt(0)}</div>`))
      for (var k = 0; k <= primerDia; k++) {
        content.prepend('<div></div>');
      }
      for (let index = 1; index <= diasMes; index++) {
        content.append(`<div class="diaNum ${hoy == index ? 'activo':''}">${index}</div>`);
      }
      return this;
    },
    fechaIcono: function(config) {
      config = jQuery.extend({
        fecha: new Date(),
        diaCompleto: false
      }, config);

      let hoy = config.fecha.getDate();
      let dia = globalState.dateTime.dias[config.fecha.getDay()];

      // Crear el contenido del elemento
      let contenido = `<div class="fechaWrapper"><p class="diaNom">${config.diaCompleto ? dia : dia.substring(0, 3)}</p><p class="diaNum">${hoy}</p></div>`;

      // Agregar el contenido al elemento actual
      this.append(contenido);

      // Agregar un evento de clic para abrir el enlace
      this.on('click', function() {
        window.open('https://www.icloud.com/calendar/', '_blank'); // Abre en una nueva pestaña
      });

      return this;
    },
    reloj: function(){
      let tiempo = new Date();
      let numeros = '';
      for (let index = 1; index <= 12; index++) {
        numeros += `<div class="numero" data-num="${index}"></div>`;
      }
      let transformHora = `calc(${(360 / 12 - 360) * tiempo.getHours()}deg + ${(30 / 60) * tiempo.getMinutes()}deg)`;
      let transformMinutos = `calc(6deg * ${tiempo.getMinutes()} + ${(6 / 60) * tiempo.getSeconds()}deg)`;
      let transformSegundos = `calc(6deg * ${tiempo.getSeconds()})`;
      this.append(
        `<div class="relojWrapper">
<div class="reloj">
<div class="numeros">${numeros}</div>
<div class="manecillas">
<div class="manecilla hora" style="transform: rotate(${transformHora});"><div class="barra"></div></div>
<div class="manecilla minutos" style="transform: rotate(${transformMinutos});"><div class="barra"></div></div>
<div class="manecilla segundos" style="transform: rotate(${transformSegundos});"><div class="barra"></div></div>
</div>
</div>
</div>`
      );
      return this;
    },
    hora: function(config) {
      config = jQuery.extend({
        realtime: true
      }, config);
      var hoy = new Date();
      var hora = hoy.getHours();
      var minutos = hoy.getMinutes();
      hora = hora % 12;
      hora = hora ? hora : 12; // La hora '0' debe ser '12'
      // Eliminar el cero inicial de la hora
      hora = hora < 10 ? hora.toString() : hora.toString(); // No agregar '0' al inicio
      minutos = minutos < 10 ? '0' + minutos : minutos;
      if (config.realtime) {
        setInterval(() => {
          hoy = new Date();
          hora = hoy.getHours();
          minutos = hoy.getMinutes();
          hora = hora % 12;
          hora = hora ? hora : 12; // La hora '0' debe ser '12'
          // Eliminar el cero inicial de la hora
          hora = hora < 10 ? hora.toString() : hora.toString(); // No agregar '0' al inicio
          minutos = minutos < 10 ? '0' + minutos : minutos;
          this.empty();
          this.text(`${hora}:${minutos}`);
        }, 1000);
      }
      this.text(`${hora}:${minutos}`);
      this.css('font-weight', '500'); // Aplicar grosor a la hora
      return this;
    },
    fecha: function (config) {
      config = jQuery.extend({
        fecha: new Date(),
        diaCompleto: true
      }, config);
      let hoy = config.fecha.getDate();
      let dia = globalState.dateTime.dias[config.fecha.getDay()];
      let mes = globalState.dateTime.meses[config.fecha.getMonth()];
      this.text(`${config.diaCompleto ? dia : dia.substring(0, 3)}, ${hoy} de ${mes}`);
      this.css('font-weight', '600'); // Aplicar grosor a la fecha
      return this;
    },
  })

  //Functions
  function sanearString(string){
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
function pintarApps(apps, container, containerDots) {
  container.empty();
  containerDots.empty();
  globalState.wrapperApps.grupos = Math.ceil(apps.length / globalState.wrapperApps.appsGrupo);
  let appCount = 1;
  let html = '';

  apps.map((app, idArr) => {
    if (appCount == 1) html += '<div class="grupo">';

    let clases = 'app';
    if (app.type == 'widgetFull') clases += ' widgetFull';
    if (app.dinamico && app.type == 'app') clases += ` ${sanearString(app.nombre).toLowerCase()}Dinamico`;

    html += `<div class="${clases}" data-app="${app.type + sanearString(app.nombre)}" data-id="${idArr}">
      ${app.notificaciones ? `<div class="notificacion">${app.notificaciones}</div>` : ''}
      <div class="icono" style="${!app.dinamico ? `background-image:url(${app.icono});` : 'background-color:#fff;'}"></div>
      <p class="nombre">${app.nombre}</p>
    </div>`;

    if (app.type == 'widgetFull') {
      appCount += 8;
      if (appCount > globalState.wrapperApps.appsGrupo) {
        html += '</div>';
        appCount = 1;
      }
    } else {
      appCount++;
    }

    if (appCount > globalState.wrapperApps.appsGrupo) {
      html += '</div>';
      appCount = 1;
    }
  });

  // Cerrar el último grupo si es necesario
  if (appCount > 1) {
    html += '</div>';
  }

  // Agregar los puntos de navegación
  if (globalState.wrapperApps.grupos > 1) {
    for (let index = 0; index < globalState.wrapperApps.grupos; index++) {
      containerDots.append(`<div class="dot ${index == 0 ? 'activo' : ''}"></div>`);
    }
  }

  container.append(html);

  // Asignar eventos de clic a los íconos de las aplicaciones
  container.find('.app').on('click', function (e) {
    e.stopPropagation();
    const appId = $(this).data('id');
    const app = globalState.apps[appId];
    if (app) {
      handleAppClick(app);
    } else {
      console.error(`Aplicación con ID ${appId} no encontrada.`);
    }
  });
}
  function alertaiOS(config) {
    if ($('#iOSAlert').length || $('.mainScreen').hasClass('bloqueado')) return false;
    config = jQuery.extend({
      wrapper: $('.iphone .bordeNegro'),
      acciones: [
        {
          texto: 'Aceptar',
          warning: true,
          // callback: function(){console.log('callback aceptar')}
        },
        {
          texto: 'Cancelar',
          warning: false,
          // callback: function () { console.log('callback cancelar') }
        }
      ],
      closable: false,
      closeOnActions: true,
      encabezado: 'Encabezado de la modal',
      mensaje: 'Mensaje de la modal...',
      ocultar: false
    }, config);
    var acciones = '';
    if (config.acciones) {
      $.each(config.acciones, function (k, accion) {
        acciones += `<div class="accion ${accion.warning ? 'warning':''}">${accion.texto}</div>`;
      })
    }
    if (config.ocultar) {
      $(document).off('click', '#iOSAlert .accion');
      $('#iOSAlert').fadeOut(function () { $(this).remove() });
      return false;
    }
    config.wrapper.append(`
<div id="iOSAlert">
<div class="contenedor hidAnim">
<p class="encabezado">${config.encabezado}</p>
<p class="mensaje">${config.mensaje}</p>
<div class="acciones">${acciones}</div>
</div>
</div>
`);
    if (config.closable) $('#iOSAlert').prepend('<div class="closable"></div>');
    $('#iOSAlert').fadeIn('fast', function () {
      $(this).children('.contenedor').removeClass('hidAnim');
    }).css('display', 'flex');
    $(document).on('click', '#iOSAlert .accion', function (e) {
      let accion = config.acciones[$(e.currentTarget).index()];
      if (accion.callback && (typeof accion.callback == 'function')) {
        accion.callback(e);
      }
      if (config.closeOnActions) {
        $(document).off('click', '#iOSAlert .accion');
        $('#iOSAlert').fadeOut('fast', function () { $(this).remove() });
      }
    })
    if (config.hasOwnProperty('autoclose')) {
      setTimeout(function () {
        $(document).off('click', '#iOSAlert .accion');
        $('#iOSAlert').fadeOut('fast', function () { $(this).remove() });
      }, config.autoclose)
    }
    $(document).on('click', '#iOSAlert .closable', function () {
      $(document).off('click', '#iOSAlert .accion');
      $('#iOSAlert').fadeOut('fast', function () { $(this).remove() });
    })
  }
function camara() {
    if (!$('.camaraApp').length) {
        console.log("Inicializando cámara...");

        // Agregar el HTML de la cámara con un z-index alto
        $('.mainScreen').append(`
            <div class="camaraApp hidden" style="z-index: 90;">
                <div class="topBar">
                    <div class="camIco flash" style="margin-right: 50px">
                        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M41 6L13 34h14.187L23 58l27.998-29.999H37L41 6z"></path>
                        </svg>
                    </div>
                    <div class="video timer d-flex justify-content-center align-items-center" style="width: 60px; border-radius: 2px; padding-top: 2px">
                        <div id="timer" style="color: white;font-size: 14px;display: flex;justify-content: center; margin-bottom: 1px;">00:00:00</div>
                    </div>
                    <div class="4k d-flex justify-content-center align-items-center mr-0" style="width: 70px;color: white;font-size: 12px;display: flex;justify-content: center;">
                        4k<span style="vertical-align: middle; font-size: 10px;">&nbsp&nbsp·&nbsp&nbsp</span>30
                    </div>
                </div>
                <div class="camaraArea">
                    <video id="currentVideo" src="musicPlayerVideos/spider-man.mp4" loop="true"></video>
                    
                    <!-- Botón redondo (obturador) movido al lado izquierdo -->
                    <div class="circular-button">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path fill="white" d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
                        </svg>
                    </div>
                    <!-- Botón de pantalla completa (mantenido en su posición actual) -->
                    <div class="fullscreen-button">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path fill="white" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                    </div>

                    <div class="volume-control">
                        <div class="volume-slider">
                            <input type="range" min="0" max="1" step="0.1" value="1" orient="vertical">
                        </div>
                    </div>
                </div>
                <div class="modosCamara">
                    <div class="modo">CÁMARA RÁPIDA</div>
                    <div class="modo">CÁMARA LENTA</div>
                    <div class="modo activo">VIDEO</div>
                    <div class="modo">FOTO</div>
                    <div class="modo">CUADRADA</div>
                    <div class="modo">PANORÁMICA</div>
                </div>
                <div class="obturadorArea">
                    <div class="imgPreview" data-video-src="musicPlayerVideos/dead_island.mp4" style="background-image: url('thumbnails/dead_island.jpg'); cursor: pointer;"></div>
                    <div class="obturador"></div>
                    <div class="toggleCam">
                        <div class="camIco">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                                <path d="M54.741 28.14a23.002 23.002 0 0 1-39.088 19.124"></path>
                                <path d="M9.065 33.62A23.008 23.008 0 0 1 31.917 8a22.934 22.934 0 0 1 16.262 6.732"></path>
                                <path d="M2 24l7.065 9.619L18 26"></path>
                                <path d="M62 38l-7.259-9.86L46 36"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>`
        );

        // Código que va después de agregar el HTML de la cámara
        // Obtener el elemento de video
        const video = $('#currentVideo')[0];
        if (!video) {
            console.error("El elemento de video no se encontró."); // Depuración
        }

        // Variables para el temporizador
        let timerInterval;
        let seconds = 0;

        // Función para actualizar el temporizador
        function updateTimer() {
            seconds++;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            $('#timer').text(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
            );
        }

        // Función para reiniciar el temporizador
        function resetTimer() {
            clearInterval(timerInterval);
            seconds = 0;
            $('#timer').text('00:00:00');
        }

        // Duración de los videos en segundos
        const videoDurations = {
            'spider-man.mp4': 30,      // 30 segundos
            'face.mp4': 29,            // 29 segundos
            'dead_island.mp4': 187     // 3 minutos y 7 segundos (3 * 60 + 7 = 187 segundos)
        };

        // Función para sincronizar el temporizador con la duración del video
        function syncTimerWithVideoDuration(videoElement, videoName) {
            const duration = videoDurations[videoName]; // Obtener la duración del video

            if (duration) {
                // Reiniciar el temporizador cuando el video esté cerca de su duración total
                if (videoElement.currentTime >= duration - 0.1) {
                    resetTimer();
                    // Iniciar el temporizador nuevamente
                    timerInterval = setInterval(updateTimer, 1000);
                }
            }
        }

        // Variable para rastrear el estado del video actual
        let isFaceVideo = false;

        // Agregar evento de clic a camIco
        $('.camIco').on('click', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento

            // Pausar el video si está reproduciéndose
            if (!video.paused) {
                video.pause();
            }

            // Detener el temporizador y ocultar el recuadro rojo
            resetTimer();
            $('.video.timer').css('background-color', 'transparent');

            // Cambiar entre los videos
            if (isFaceVideo) {
                video.src = 'musicPlayerVideos/spider-man.mp4'; // Volver al video principal
                $('.imgPreview').css('visibility', 'visible'); // Mostrar el div imgPreview
                // Restablecer el video en imgPreview
                $('.imgPreview').data('video-src', 'musicPlayerVideos/dead_island.mp4');
                updateImgPreview();
            } else {
                video.src = 'musicPlayerVideos/face.mp4'; // Cambiar al video secundario
                $('.imgPreview').css('visibility', 'hidden'); // Ocultar el div imgPreview
            }

            // Invertir el estado del video
            isFaceVideo = !isFaceVideo;

            // Reiniciar el temporizador manualmente
            resetTimer();

            // Alternar la clase 'active' para cambiar el estado del flash
            $(this).toggleClass('active');
        });

        // Evitar eventos de deslizamiento en la barra de volumen
        $('.volume-slider input').on('input', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento
            const volumeValue = parseFloat(this.value);
            video.volume = volumeValue;

            // Calcular el porcentaje de volumen (0% a 100%)
            const volumePercent = (volumeValue * 100) + '%';

            // Actualizar la variable CSS --volume-percent
            this.style.setProperty('--volume-percent', volumePercent);

            // Sincronizar el estado de silencio con el volumen
            if (volumeValue === 0) {
                video.muted = true; // Silenciar el video si el volumen es 0
            } else {
                video.muted = false; // Activar el audio si el volumen es mayor que 0
            }

            // Mostrar el ícono correspondiente según el valor del volumen
            if (volumeValue === 1) {
                const audioIcon = $(`
                    <svg class="audio-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                `);
                $('.camaraArea').append(audioIcon);
                setTimeout(function() {
                    audioIcon.remove();
                }, 1000); // 1 segundo
            } else if (volumeValue === 0) {
                const muteIcon = $(`
                    <svg class="mute-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <path fill="white" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                `);
                $('.camaraArea').append(muteIcon);
                setTimeout(function() {
                    muteIcon.remove();
                }, 1000); // 1 segundo
            }
        });

// Configurar el deslizamiento para salir de la cámara
$('.camaraApp').touchMov({
  mov: 'y',
  movUp: function (e) {
    // Verificar si lockscreen2 está visible
    if ($('.lockScreen2').is(':visible')) {
      return; // No hacer nada si lockscreen2 está visible
    }

    // Verificar si el gesto ocurrió fuera del área de la barra de volumen
    if (!$(e.target).closest('.volume-slider').length) {
      video.pause(); // Pausar el video
      video.muted = true; // Silenciar el video

      // Aplicar la animación de deslizamiento hacia arriba
      $(e.currentTarget).addClass('slide-up');

      // Esperar a que termine la animación antes de ocultar el elemento
      setTimeout(() => {
        $(e.currentTarget).addClass('hidden');
        $(e.currentTarget).removeClass('slide-up'); // Eliminar la clase de animación
        $('.statusBar').removeClass('onlyLed camActiv');
      }, 500); // 500ms es la duración de la animación
    }
  }
});

        // Agregar evento de clic al botón de obturación para iniciar/pausar el video
        $('.obturador').on('click', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        // Función para actualizar la imagen en imgPreview basada en el video en obturadorArea
        function updateImgPreview() {
            const videoSrc = $('.imgPreview').data('video-src');
            const videoName = videoSrc.split('/').pop().split('.').shift();
            const thumbnailPath = `thumbnails/${videoName}.jpg`;
            $('.imgPreview').css('background-image', `url('${thumbnailPath}')`);
        }

        // Agregar evento de clic a la imagen para cambiar y reproducir el video
        $('.imgPreview').on('click', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento
            const newVideoSrc = $(this).data('video-src');
            const currentVideoSrc = video.src;

            // Intercambiar los videos
            video.src = newVideoSrc;
            $(this).data('video-src', currentVideoSrc);

            // Actualizar la imagen en imgPreview
            updateImgPreview();

            // Reiniciar el temporizador manualmente
            resetTimer();

            // Reproducir el video
            video.play();
        });

        // Variables para controlar el estado del control de volumen
        let isMouseOverVolumeSlider = false;
        let volumeSliderTimeout;

        // Detectar cuando el video comienza a reproducirse
        video.addEventListener('play', function() {
            // Iniciar el temporizador
            timerInterval = setInterval(updateTimer, 1000);
            // Mostrar el recuadro rojo del temporizador con bordes redondeados
            $('.video.timer').css({
                'background-color': 'red',
                'border-radius': '2px'
            });

            // Mostrar el control de volumen
            $('.volume-slider').addClass('visible');

            // Ocultar el control de volumen después de 1.5 segundos, solo si el cursor no está sobre él
            volumeSliderTimeout = setTimeout(function() {
                if (!isMouseOverVolumeSlider) {
                    $('.volume-slider').removeClass('visible');
                }
            }, 1500); // 1.5 segundos
        });

        // Detectar cuando el video se pausa
        video.addEventListener('pause', function() {
            // Detener el temporizador
            clearInterval(timerInterval);
            // Ocultar el recuadro rojo solo si el video no está reiniciándose
            if (video.currentTime !== 0) {
                $('.video.timer').css('background-color', 'transparent');
            }
        });

        // Detectar cuando el video se reinicia
        video.addEventListener('seeked', function() {
            // Si el video está en reproducción, asegurarse de que el recuadro rojo esté visible
            if (!video.paused) {
                $('.video.timer').css('background-color', 'red');
            }
        });

        // Sincronizar el temporizador con la duración del video
        video.addEventListener('timeupdate', function() {
            const videoSrc = video.src.split('/').pop(); // Obtener el nombre del archivo de video
            syncTimerWithVideoDuration(video, videoSrc); // Sincronizar el temporizador
        });

        // Detectar cuando el cursor entra en el control de volumen
        $('.volume-slider').on('mouseenter', function() {
            isMouseOverVolumeSlider = true;
            clearTimeout(volumeSliderTimeout); // Cancelar el temporizador de ocultación
        });

        // Detectar cuando el cursor sale del control de volumen
        $('.volume-slider').on('mouseleave', function() {
            isMouseOverVolumeSlider = false;
            // Ocultar el control de volumen después de 1.5 segundos
            volumeSliderTimeout = setTimeout(function() {
                $('.volume-slider').removeClass('visible');
            }, 1500); // 1.5 segundos
        });

        // Ajustar el volumen del video
        $('.volume-slider input[type="range"]').on('touchmove mousemove', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento
            const volumeValue = parseFloat(this.value);
            video.volume = volumeValue;

            // Sincronizar el estado de silencio con el volumen
            if (volumeValue === 0) {
                video.muted = true; // Silenciar el video si el volumen es 0
            } else {
                video.muted = false; // Activar el audio si el volumen es mayor que 0
            }

            // Mostrar el ícono correspondiente según el valor del volumen
            if (volumeValue === 1) {
                const audioIcon = $(`
                    <svg class="audio-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                `);
                $('.camaraArea').append(audioIcon);
                setTimeout(function() {
                    audioIcon.remove();
                }, 1000); // 1 segundo
            } else if (volumeValue === 0) {
                const muteIcon = $(`
                    <svg class="mute-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <path fill="white" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                `);
                $('.camaraArea').append(muteIcon);
                setTimeout(function() {
                    muteIcon.remove();
                }, 1000); // 1 segundo
            }
        });

        // Evitar la propagación del evento al hacer clic en el control de volumen
        $('.volume-slider').on('click', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento
        });

        // Evitar la propagación del evento al hacer clic en el input del control de volumen
        $('.volume-slider input').on('click', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento
        });

        // Dentro del evento de clic en .camaraArea
        $('.camaraArea').on('click', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento

            // Mostrar la barra de volumen
            $('.volume-slider').addClass('visible');

            // Ocultar la barra de volumen después de 1.5 segundos
            clearTimeout(volumeSliderTimeout); // Cancelar el temporizador anterior
            volumeSliderTimeout = setTimeout(function() {
                if (!isMouseOverVolumeSlider) {
                    $('.volume-slider').removeClass('visible');
                }
            }, 1500); // 1.5 segundos

            // Alternar entre silenciado y no silenciado
            if (video.muted) {
                // Activar el audio y restaurar el último volumen
                video.muted = false;
                video.volume = lastVolumeBeforeMute;
                $('.volume-slider input').val(lastVolumeBeforeMute); // Actualizar la barra de volumen
            } else {
                // Silenciar el audio y guardar el último volumen
                lastVolumeBeforeMute = video.volume; // Guardar el último volumen
                video.muted = true;
                video.volume = 0; // Establecer el volumen a 0
                $('.volume-slider input').val(0); // Actualizar la barra de volumen
            }

            // Mostrar el ícono correspondiente (silenciado o audio activado)
            if (video.muted) {
                const muteIcon = $(`
                    <svg class="mute-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <path fill="white" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                `);
                $('.camaraArea').append(muteIcon);
                setTimeout(function() {
                    muteIcon.remove();
                }, 1000); // 1 segundo
            } else {
                const audioIcon = $(`
                    <svg class="audio-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                `);
                $('.camaraArea').append(audioIcon);
                setTimeout(function() {
                    audioIcon.remove();
                }, 1000); // 1 segundo
            }
        });

        // Agregar evento de clic al botón circular
        $('.circular-button').on('click', function(event) {
            event.stopPropagation(); // Evitar que el clic se propague al área del video
            $('.camaraArea').toggleClass('active-camara'); // Alternar la clase active-camara
        });

        // Inicializar la imagen en imgPreview
        updateImgPreview();

        // Función para activar/desactivar el modo de pantalla completa
        function toggleFullscreen(videoElement) {
            if (!document.fullscreenElement) {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.mozRequestFullScreen) { // Firefox
                    videoElement.mozRequestFullScreen();
                } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari y Opera
                    videoElement.webkitRequestFullscreen();
                } else if (videoElement.msRequestFullscreen) { // IE/Edge
                    videoElement.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari y Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
            }
        }

        // Agregar evento de clic al botón de pantalla completa
        $('.camaraArea').on('click', '.fullscreen-button', function(event) {
            event.stopPropagation(); // Evitar la propagación del evento
            const video = $('#currentVideo')[0];
            toggleFullscreen(video);
        });

        // Escuchar cambios en el estado de pantalla completa
        document.addEventListener('fullscreenchange', function() {
            const video = $('#currentVideo')[0];
            if (document.fullscreenElement) {
                video.controls = true; // Mostrar controles del video en pantalla completa
            } else {
                video.controls = false; // Ocultar controles del video al salir de pantalla completa
            }
        });
    } else {
        // Si la cámara ya existe, restablecer su estado antes de mostrarla
        $('.camaraApp')
            .removeClass('slide-up hidden') // Eliminar clases de animación y ocultación
            .css({
                transform: 'translateY(0)', // Restablecer la posición
                opacity: 1 // Restablecer la opacidad
            });
    }

    // Mostrar la cámara después de un breve retraso
    setTimeout(function() {
        $('.statusBar').addClass('onlyLed camActiv');
        $('.camaraApp').removeClass('hidden');
    }, 100);
}
  function renderizarUI(){
    //Pintamos todas las apps en el contenedor principal
    pintarApps(globalState.apps, $('.wrapperApps'), $('.wrapperDots'));
    // Recalcular la medida después de renderizar las apps
    try {
      globalState.wrapperApps.medida = $('.wrapperApps').outerWidth(true) || $('.wrapperApps').width() || 0;
    } catch (err) {
      globalState.wrapperApps.medida = 0;
    }
    //Si existe el widget del calendario
    if ($('.wrapperApps .app[data-app="widgetFullCalendario"]').length) {
      //Preparamos el widget del calendario
      $('.wrapperApps .app[data-app="widgetFullCalendario"] .icono').append('<div class="eventos"><p>Sin más eventos para hoy</p></div><div class="calendarioWrapper"></div>');
      //Creamos el calendario del widget
      $('.wrapperApps .app[data-app="widgetFullCalendario"] .icono .calendarioWrapper').calendario();
    }
    //Si existe el icono dinamico del calendario
    if ($('.wrapperApps .app.calendarioDinamico').length) {
      //Icono dinamico del calendario
      $('.wrapperApps .app.calendarioDinamico .icono').fechaIcono();
    }
    //Si existe el reloj analogico dinamico
    if ($('.wrapperApps .app.relojDinamico').length) {
      //Reloj analogico dinamico
      $('.wrapperApps .app.relojDinamico .icono').reloj();
    }
  }

function encendido() {
  renderizarUI(); // Renderiza la interfaz de usuario
  setTimeout(() => {
    $('.interactionInfo').removeClass('hidden'); // Muestra la información de interacción
    // Quitar la clase preload-hidden del botón izquierdo para activar su animación de entrada
    // prefer removing preload-hidden and also add reusable show class
    $('#left-floating-btn').removeClass('preload-hidden').addClass('show');
    $('.iphone').removeClass('initAnimation').addClass('powerOn'); // Añade la clase powerOn
    setTimeout(() => {
      $('.iphone').removeClass('powerOn').addClass('arrhe'); // Añade la clase arrhe después de 2 segundos
      setTimeout(() => {
        $('.mainScreen').removeClass('bloqueado'); // Desbloquea la pantalla después de que el logo desaparezca
      }, 1000); // Espera 1 segundo (duración de la animación de desvanecimiento)
    }, 2000); // Espera 2 segundos antes de añadir la clase arrhe
  }, 1000); // Espera 1 segundo antes de añadir la clase powerOn
}
// Recalcula la medida del wrapperApps cuando el elemento se hace visible o cambia tamaño
function updateWrapperAppsMedida() {
  try {
    const w = $('.wrapperApps').outerWidth(true) || $('.wrapperApps').width() || 0;
    globalState.wrapperApps.medida = w;
  } catch (e) {
    globalState.wrapperApps.medida = 0;
  }
}

// Observar cambios en la clase de .appScreen para recalcular la medida cuando deje de estar oculta
$(document).ready(function () {
  const appScreenEl = document.querySelector('.appScreen');
  if (appScreenEl) {
    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const el = mutation.target;
          if (!el.classList.contains('hidden')) {
            // esperar al final del layout/animación
            setTimeout(updateWrapperAppsMedida, 50);
          }
        }
      }
    });
    observer.observe(appScreenEl, { attributes: true, attributeFilter: ['class'] });
  }

  // Recalcular en resize
  $(window).on('resize', function () {
    setTimeout(updateWrapperAppsMedida, 50);
  });
});

encendido(); // Llama a la función para iniciar la animación

  encendido();
// Hora de la statusBar
$('.statusBar .hora').hora();

// Hora de la pantalla de bloqueo
$('.lockScreen .hora').hora();

// Hora de la pantalla de bloqueo 2
$('.lockScreen2 .hora').hora();

// Fecha de la pantalla de bloqueo
$('.lockScreen .fecha').fecha();

// Fecha de la pantalla de bloqueo 2
$('.lockScreen2 .fecha').fecha();

// Eventos del día en la pantalla de widgetsCenter
$('.widgetCenter .block.eventos').fechaIcono({ diaCompleto: true });

// Función para ocultar el lockScreen con animación de slide-up
function hideLockScreen() {
  const lockScreen = $('.lockScreen')[0]; // Seleccionar el elemento lockScreen

  // Verificar si el elemento existe
  if (!lockScreen) {
    console.error('El elemento .lockScreen no fue encontrado.');
    return;
  }

  // Aplicar la clase slide-up para la animación
  lockScreen.classList.add('slide-up');

  // Añadir la clase hidden después de que termine la animación
  setTimeout(() => {
    lockScreen.classList.add('hidden');
    // No es necesario remover la clase slide-up aquí
  }, 300); // Duración de la animación (debe coincidir con la duración en CSS)
}

// Evento de deslizamiento para lockScreen
$('.lockScreen').touchMov({
  mov: 'y', // Solo movimiento vertical
  movUp: function (e) {
    // Aplicar animación de deslizamiento hacia arriba
    $(e.currentTarget).addClass('slide-up');

    // Ocultar lockScreen después de la animación
    setTimeout(() => {
      hideLockScreen(); // Ocultar lockScreen con animación
      // No es necesario remover la clase slide-up aquí
    }, 300);

    // Actualizar elementos relacionados
    $(e.currentTarget).siblings('.statusBar').addClass('mov');
    $(e.currentTarget).siblings('.appScreen.hidden').removeClass('hidden');

    setTimeout(() => {
      $(e.currentTarget).siblings('.statusBar').removeClass('mov');
      $(e.currentTarget).siblings('.statusBar').find('.operador').addClass('hidden');
      $(e.currentTarget).siblings('.statusBar').find('.hora').removeClass('hidden');
    }, 300);

// Simular el agotamiento de la batería después de 3 segundos
// Estado inicial de la batería
globalState.bateriaNivel = 100; // Comienza al 100%
globalState.bateriaBaja = false;

// Función para actualizar la visualización de la batería
function actualizarBateria() {
  const $bateria = $('.mainScreen .statusBar .rightSide .bateria');
  
  // Eliminar todas las clases de nivel
  $bateria.removeClass('full mid low nivel-100 nivel-90 nivel-80 nivel-70 nivel-60 nivel-50 nivel-40 nivel-30 nivel-20 nivel-10');
  
  // Añadir clase específica del nivel actual
  $bateria.addClass(`nivel-${globalState.bateriaNivel}`);
  
  // Mantener clases full/mid/low para compatibilidad (solo cambian el color, no el ancho)
  if (globalState.bateriaNivel > 70) {
    $bateria.addClass('full');
  } else if (globalState.bateriaNivel > 20) { // Cambiado de 30 a 20 para mejor transición
    $bateria.addClass('mid');
  } else {
    $bateria.addClass('low');
    globalState.bateriaBaja = true;
  }
  
  // Actualizar el texto del porcentaje (si existe el elemento)
  const $porcentaje = $('.mainScreen .statusBar .bateria-porcentaje');
  if ($porcentaje.length) {
    $porcentaje.text(`${globalState.bateriaNivel}%`);
  }
  
  // Actualizar el icono de la batería (opcional)
  const $iconoBateria = $('.mainScreen .statusBar .battery-icon');
  if ($iconoBateria.length) {
    $iconoBateria.removeClass('battery-100 battery-90 battery-80 battery-70 battery-60 battery-50 battery-40 battery-30 battery-20 battery-10');
    $iconoBateria.addClass(`battery-${globalState.bateriaNivel}`);
  }
  
  console.log(`Batería actualizada: ${globalState.bateriaNivel}%`); // Para depuración
}

// Función para mostrar alerta de batería baja
function mostrarAlertaBateriaBaja() {
  alertaiOS({
    encabezado: 'La batería se está agotando',
    mensaje: `Batería restante: ${globalState.bateriaNivel}%`,
    acciones: [
      {
        texto: 'Ok'
      }
    ]
  });
}

// Función principal para la descarga por pasos
function iniciarDescargaBateria() {
  // Mostrar el nivel inicial (100%)
  actualizarBateria();
  
  // Configurar el intervalo para la descarga
  const intervaloDescarga = setInterval(() => {
    // Disminuir la batería en 10%
    globalState.bateriaNivel -= 10;
    
    // Asegurarse de no pasar del 10%
    if (globalState.bateriaNivel < 10) {
      globalState.bateriaNivel = 10;
    }
    
    // Actualizar la visualización
    actualizarBateria();
    
    // Mostrar alerta si llegó a 10%
    if (globalState.bateriaNivel === 10) {
      mostrarAlertaBateriaBaja();
      clearInterval(intervaloDescarga); // Detener el intervalo
    }
    
    console.log(`Nuevo nivel de batería: ${globalState.bateriaNivel}%`); // Para depuración
  }, 15000); // 15 segundos = 15000 milisegundos
}

// Iniciar el proceso cuando el documento esté listo
$(document).ready(function() {
  // Comenzar la descarga después de 1 segundo (para que se vea el 100% inicial)
  setTimeout(iniciarDescargaBateria, 1000);
});
  },
  // Eliminamos la función movDown para desactivar el deslizamiento hacia abajo
});

// Función para ocultar el lockScreen2 con animación de slide up
function hideLockScreen2() {
  const lockScreen2 = $('.lockScreen2')[0];

  // Añadir la clase que activa la animación de slide up
  $(lockScreen2).addClass('slide-up');

  // Añadir la clase hidden después de la animación
  setTimeout(() => {
    $(lockScreen2).addClass('hidden');
    $(lockScreen2).removeClass('slide-up'); // Eliminar la clase de animación
  }, 500); // Esperar a que termine la animación
}

// Evento de deslizamiento para lockScreen2
$('.lockScreen2').touchMov({
  mov: 'y',
  movUp: function (e) {
    // Hacer que el desbloqueo reproduzca la misma animación que el cierre del reproductor Musica
    // Mover y fundir fuera (transform + opacity)
    $(e.currentTarget).css({
      'opacity': '0',
      'transform': 'translateY(-100%)',
      'transition': 'opacity 1s ease, transform 1s ease'
    });

    // Restaurar la statusBar y mostrar el appScreen después de la animación (1s)
    setTimeout(() => {
      $(e.currentTarget).addClass('hidden');
      // Limpiar estilos inline para evitar conflictos futuros
      $(e.currentTarget).css({
        'opacity': '',
        'transform': '',
        'transition': ''
      });

      // Actualizar el statusBar
      $(e.currentTarget).siblings('.statusBar').addClass('mov');
      
      // Mostrar el wrapper (como el reproductor) si aplica
      $('#wrapper').removeClass('hidden');

      // Mostrar la cámara solo si estaba visible antes de bloquear
      if (camaraVisible) {
        $('.camaraApp').removeClass('hidden');
      }

      // Mostrar Cinex solo si estaba visible antes de bloquear
      if (cinexVisible) {
        $('#cinex-wrapper').removeClass('hidden');
        // No mostrar el appScreen si Cinex está visible
      } else {
        // Solo mostrar el appScreen si Cinex NO está visible
        $(e.currentTarget).siblings('.appScreen.hidden').removeClass('hidden');
      }

      // Restaurar el statusBar después de 300ms
      setTimeout(() => {
        $(e.currentTarget).siblings('.statusBar').removeClass('mov');
        $(e.currentTarget).siblings('.statusBar').find('.operador').addClass('hidden');
        $(e.currentTarget).siblings('.statusBar').find('.hora').removeClass('hidden');
      }, 300);

    }, 1000); // Duración de la animación (1s) para que coincida con el reproductor

    // Simular el agotamiento de la batería después de 3 segundos
// Estado inicial de la batería
globalState.bateriaNivel = 100; // Comienza al 100%
globalState.bateriaBaja = false;

// Función para actualizar la visualización de la batería
function actualizarBateria() {
  const $bateria = $('.mainScreen .statusBar .rightSide .bateria');
  
  // Eliminar todas las clases de nivel
  $bateria.removeClass('full mid low nivel-100 nivel-90 nivel-80 nivel-70 nivel-60 nivel-50 nivel-40 nivel-30 nivel-20 nivel-10');
  
  // Añadir clase específica del nivel actual
  $bateria.addClass(`nivel-${globalState.bateriaNivel}`);
  
  // Mantener clases full/mid/low para compatibilidad (solo cambian el color, no el ancho)
  if (globalState.bateriaNivel > 70) {
    $bateria.addClass('full');
  } else if (globalState.bateriaNivel > 20) { // Cambiado de 30 a 20 para mejor transición
    $bateria.addClass('mid');
  } else {
    $bateria.addClass('low');
    globalState.bateriaBaja = true;
  }
  
  // Actualizar el texto del porcentaje (si existe el elemento)
  const $porcentaje = $('.mainScreen .statusBar .bateria-porcentaje');
  if ($porcentaje.length) {
    $porcentaje.text(`${globalState.bateriaNivel}%`);
  }
  
  // Actualizar el icono de la batería (opcional)
  const $iconoBateria = $('.mainScreen .statusBar .battery-icon');
  if ($iconoBateria.length) {
    $iconoBateria.removeClass('battery-100 battery-90 battery-80 battery-70 battery-60 battery-50 battery-40 battery-30 battery-20 battery-10');
    $iconoBateria.addClass(`battery-${globalState.bateriaNivel}`);
  }
  
  console.log(`Batería actualizada: ${globalState.bateriaNivel}%`); // Para depuración
}

// Función para mostrar alerta de batería baja
function mostrarAlertaBateriaBaja() {
  alertaiOS({
    encabezado: 'La batería se está agotando',
    mensaje: `Batería restante: ${globalState.bateriaNivel}%`,
    acciones: [
      {
        texto: 'Ok'
      }
    ]
  });
}

// Función principal para la descarga por pasos
function iniciarDescargaBateria() {
  // Mostrar el nivel inicial (100%)
  actualizarBateria();
  
  // Configurar el intervalo para la descarga
  const intervaloDescarga = setInterval(() => {
    // Disminuir la batería en 10%
    globalState.bateriaNivel -= 10;
    
    // Asegurarse de no pasar del 10%
    if (globalState.bateriaNivel < 10) {
      globalState.bateriaNivel = 10;
    }
    
    // Actualizar la visualización
    actualizarBateria();
    
    // Mostrar alerta si llegó a 10%
    if (globalState.bateriaNivel === 10) {
      mostrarAlertaBateriaBaja();
      clearInterval(intervaloDescarga); // Detener el intervalo
    }
    
    console.log(`Nuevo nivel de batería: ${globalState.bateriaNivel}%`); // Para depuración
  }, 15000); // 15 segundos = 15000 milisegundos
}

// Iniciar el proceso cuando el documento esté listo
$(document).ready(function() {
  // Comenzar la descarga después de 1 segundo (para que se vea el 100% inicial)
  setTimeout(iniciarDescargaBateria, 1000);
});
  },
  movDown: function (e) {
    showLockScreen2(); // Mostrar lockscreen2 con animación
  }
});

// Crear una hoja de estilo dinámica
const styleSheet = document.createElement('style');
document.head.appendChild(styleSheet);
const styles = styleSheet.sheet;

// Definir los keyframes para las animaciones
styles.insertRule(`
  @keyframes slideDown {
    from {
      transform: translateY(-100px);
      opacity: 0;
      visibility: hidden;
    }
    to {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
  }
`, styles.cssRules.length);

styles.insertRule(`
  @keyframes slideUp {
    from {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    to {
      transform: translateY(-100px);
      opacity: 0;
      visibility: hidden;
    }
  }
`, styles.cssRules.length);

// Definir las clases CSS dinámicas
styles.insertRule(`
  .controlCenter {
    display: flex;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(15px);
    cursor: grab;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    z-index: 20; /* Añadido z-index */
  }
`, styles.cssRules.length);

styles.insertRule(`
  .controlCenter.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-100px);
    z-index: 20; /* Añadido z-index */
  }
`, styles.cssRules.length);

styles.insertRule(`
  .controlCenter.slide-down {
    animation: slideDown 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
    z-index: 20; /* Añadido z-index */
  }
`, styles.cssRules.length);

styles.insertRule(`
  .controlCenter.slide-up {
    animation: slideUp 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
    z-index: 20; /* Añadido z-index */
  }
`, styles.cssRules.length);

// Función para mostrar el controlCenter con animación slide-down
function showControlCenter() {
  const controlCenter = document.querySelector('.controlCenter');

  // Eliminar la clase hidden y aplicar la animación slide-down
  controlCenter.classList.remove('hidden', 'slide-up');
  controlCenter.classList.add('slide-down');

  // Eliminar la clase de animación después de que termine
  setTimeout(() => {
    controlCenter.classList.remove('slide-down');
  }, 500); // Duración de la animación (0.5 segundos)
}

// Función para ocultar el controlCenter con animación slide-up
function hideControlCenter() {
  const controlCenter = document.querySelector('.controlCenter');

  // Aplicar la animación slide-up
  controlCenter.classList.remove('slide-down');
  controlCenter.classList.add('slide-up');

  // Añadir la clase hidden después de que termine la animación
  setTimeout(() => {
    controlCenter.classList.add('hidden');
  }, 500); // Duración de la animación (0.5 segundos)
}

// Ejemplo de uso con eventos
document.addEventListener('DOMContentLoaded', function () {
  // Mostrar el Control Center al hacer clic en un botón
  document.getElementById('showControlCenterButton').addEventListener('click', function () {
    showControlCenter();
  });

  // Ocultar el Control Center al hacer clic en un botón
  document.getElementById('hideControlCenterButton').addEventListener('click', function () {
    hideControlCenter();
  });
});

// Ejemplo de uso con eventos
$(document).ready(function () {
  // Mostrar el Control Center al hacer clic en un botón
  $('#showControlCenterButton').click(function () {
    showControlCenter();
  });

  // Ocultar el Control Center al hacer clic en un botón
  $('#hideControlCenterButton').click(function () {
    hideControlCenter();
  });
});

  $('.wrapperApps').touchMov({
    updateMovX: function(e, mov){
      $(e.currentTarget).css({
        transform: `translateX(${globalState.wrapperApps.transform + mov}px)`,
        transition: 'none'
      });
    },
    movIzq: function (e) {
      if (globalState.wrapperApps.grupoActivo != globalState.wrapperApps.grupos) {
        globalState.wrapperApps.grupoActivo++;
      }
      $(e.currentTarget).css({
        transform: `translateX(-${globalState.wrapperApps.medida * (globalState.wrapperApps.grupoActivo - 1)}px)`,
        transition: 'ease all 0.2s'
      });
      $('.wrapperDots .dot').removeClass('activo');
      $('.wrapperDots .dot').eq(globalState.wrapperApps.grupoActivo - 1).addClass('activo');
    },
    movDer: function (e) {
      if (globalState.wrapperApps.grupoActivo != 1) {
        globalState.wrapperApps.grupoActivo--;
        $(e.currentTarget).css({
          transform: `translateX(${globalState.wrapperApps.transform + globalState.wrapperApps.medida}px)`,
          transition: 'ease all 0.2s'
        });
      } else {
        $(e.currentTarget).parents('.mainScreen').addClass('blur');
        $(e.currentTarget).parents('.appScreen').addClass('moveOut');
        $(e.currentTarget).parents('.appScreen').siblings('.widgetCenter').removeClass('hidden');
        $(e.currentTarget).css({
          transform: `translateX(${globalState.wrapperApps.medida * (globalState.wrapperApps.grupoActivo - 1)}px)`,
          transition: 'ease all 0.2s'
        });
      }
      $('.wrapperDots .dot').removeClass('activo');
      $('.wrapperDots .dot').eq(globalState.wrapperApps.grupoActivo - 1).addClass('activo');
    },
    finishMov: function(e){
      transform = e.currentTarget.style.transform;
      if (transform.length) {
        transform = transform.split('(');
        transform = transform[1].split('px');
        transform = parseInt(transform[0]);
      } else {
        transform = 0;
      }
      globalState.wrapperApps.transform = transform;
    }
  });
  $('.widgetCenter .contenido').touchMov({
    mov: 'x',
    movIzq: function (e) {
      $(e.currentTarget).parents('.mainScreen').removeClass('blur');
      $(e.currentTarget).parent().addClass('hidden').removeAttr('style');
      $(e.currentTarget).parent().siblings('.appScreen.moveOut').removeClass('moveOut');
    },
    updateMovX: function (e, mov) {
      if (Math.sign(mov) == 1) {
        $(e.currentTarget).parent().css({
          transform: `translateX(${mov}px)`,
          transition: 'none'
        });
      }
    },
    movDer: function(e){
      $(e.currentTarget).parent().css({
        transform: 'none',
        transition: 'ease all .2s'
      });
      setTimeout(() => {
        $(e.currentTarget).parent().removeAttr('style');
      }, 200)
    }
  });

$(function() {
    function syncWidgetScreenVisibility() {
        const isLockScreen2Active = $('.lockScreen2').is(':visible');
        const isWidgetScreenVisible = $('.widgetScreen').is(':visible');
        
        if (isLockScreen2Active && isWidgetScreenVisible) {
            $('.widgetScreen').addClass('hidden');
            $('.mainScreen').removeClass('widgetScreenOpen');
        }
    }

    // Observador para cambios en lockScreen2
    new MutationObserver(syncWidgetScreenVisibility)
        .observe(document.querySelector('.lockScreen2'), { 
            attributes: true, 
            attributeFilter: ['class'] 
        });

    // Eventos críticos donde verificar
    $(document).ready(syncWidgetScreenVisibility);
    $('.widgetPlus').on('click', syncWidgetScreenVisibility);
    $(document).on('click', '.botonBloquear, .botonGirar', syncWidgetScreenVisibility);
});
$('.widgetScreen .wrapper').touchMov({
    mov: 'y',
    movDown: function(e) {
        // Añadir animación slide down antes de ocultar
        $(e.currentTarget).css({
            transform: 'translateY(100%)',
            transition: 'transform 0.3s ease-out'
        });
        
        setTimeout(() => {
            $(e.currentTarget).parents('.mainScreen').removeClass('widgetScreenOpen');
            $(e.currentTarget).parent().addClass('hidden');
            $(e.currentTarget).removeAttr('style');
        }, 300); // Tiempo igual a la duración de la animación
    },
    updateMovY: function (e, mov) {
        if (Math.sign(mov) == 1) {
            $(e.currentTarget).css({
                transform: `translateY(${mov}px)`,
                transition: 'none'
            });
        }
    }
});

$('.statusBar').touchMov({
  mov: 'y',
  movDown: function (e) {
    $(e.currentTarget).parent().addClass('blur');
    showControlCenter(); // Mostrar el controlCenter con animación
    $(e.currentTarget).siblings('.appScreen').addClass('hidden'); // Ocultar el appScreen

    // Ocultar lockScreen2 si está visible
    if ($('.lockScreen2').is(':visible')) {
      $('.lockScreen2').addClass('hidden');
    }
  }
});

$('.controlCenter').touchMov({
  mov: 'y',
  movUp: function (e) {
    hideControlCenter(); // Ocultar el controlCenter con animación
    $(e.currentTarget).parent().removeClass('blur');

    // Mostrar lockScreen2 si el dispositivo está bloqueado
    if ($('.mainScreen').hasClass('bloqueado')) {
      $('.lockScreen2').removeClass('hidden');
    } else {
      $(e.currentTarget).siblings('.appScreen').removeClass('hidden');
    }
  }
});

  //Menu flotante al presionar app por 1 segundo
  $('.mainScreen .appScreen').mousedown(function(e){
    if ($(this).parent().hasClass('shakingApps')) return false;
    let timeout = setTimeout(() => {
      console.log('a');
      if (!globalState.draggScreen) {
        if ($(e.target).hasClass('app') || $(e.target).parents('.app').length) {
          //Dio click en una app. Ok, le mostraremos el menu flotante
          $(this).parent().addClass('filterBlur');
          let app;
          if ($(e.target).hasClass('app')) {
            app = $(e.target);
          } else {
            app = $(e.target).parents('.app');
          }
          let appClon = app.clone();
          appClon.attr('id', 'fixedApp');
          appClon.css({
            top: app[0].getBoundingClientRect().top,
            left: app[0].getBoundingClientRect().left,
            width: app[0].getBoundingClientRect().width
          })
          $('body').append(appClon);
          let rectsIphone = $('.iphone .bordeNegro')[0].getBoundingClientRect();
          let rectsApp = appClon.children('.icono')[0].getBoundingClientRect();
          let cssMenu = `left: ${((rectsIphone.x + rectsIphone.width) - rectsApp.x) >= 190 ? rectsApp.x : (rectsApp.x + rectsApp.width) - 190}px;`;
          if ((rectsIphone.top + (65 * 2)) >= rectsApp.top) {
            cssMenu += `top : ${rectsApp.y + rectsApp.height}px; transform: translateY(10px)`;
          } else {
            cssMenu += `top: ${rectsApp.y}px; transform: translateY(calc(-100% - 10px));`;
          }
          $('body').append(`
<div class="fixedMenuFixedApp" style="${cssMenu}">
<div class="menuOption eliminar">Eliminar app
<div class="icono">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<circle cx="32" cy="32" r="30"></circle>
<path d="M48 32H16"></path>
</svg>
</div>
</div>
<div class="menuOption shaking">Editar pantalla de inicio
<div class="icono">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<path d="M14 59a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3v-9H14zM50 5a3 3 0 0 0-3-3H17a3 3 0 0 0-3 3v5h36zm0 45V10m-36 0v40"></path>
<circle cx="32" cy="56" r="2"></circle>
</svg>
</div>
</div>
</div>
`);
        } else {
          //Dio click en cualquier parte del appScreen. Ok, es hora del shaking apps
          $(this).parent().addClass('shakingApps');
          $('.appScreen .app').append('<div class="removeApp"></div>');
        }
      }
    }, 1000);
    $(this).mouseup(function(){
      clearTimeout(timeout);
    })
    $(this).mouseleave(function () {
      clearTimeout(timeout);
    })
  })
  //Shaking apps desde el menu flotante de la app
  $('body').on('click', '.fixedMenuFixedApp .menuOption.shaking', function(){
    $(this).parent().remove();
    $('#fixedApp').remove();
    $('.mainScreen').removeClass('filterBlur').addClass('shakingApps');
    $('.appScreen .app').append('<div class="removeApp"></div>');
  })
  //Salir del eliminador de apps (shaking apps)
  $('.exitShake').click(function(){
    $('.mainScreen').removeClass('shakingApps');
    $('.appScreen .app .removeApp').remove();
  })
  //Mostrar la widgetScreen
  $('.widgetPlus').click(function(){
    $('.widgetScreen').removeClass('hidden');
    $('.appScreen .app .removeApp').remove();
    $('.mainScreen').removeClass('shakingApps').addClass('widgetScreenOpen');
  })
  //Eliminar app
  $('body').on('click', '.fixedMenuFixedApp .menuOption.eliminar', function () {
    let idApp = $('#fixedApp').data('id');
    if (idApp == undefined) {
      var idDeck = $('#fixedApp').data('indeck');
    }
    $(this).parent().remove();
    $('#fixedApp').remove();
    $('.mainScreen').removeClass('filterBlur');
    alertaiOS({
      encabezado: `¿Transferir ${idApp !== undefined ? globalState.apps[idApp].nombre : 'app'} a la biblioteca de apps o eliminar la app?`,
      mensaje: 'Transferir la app la quitará de tu pantalla de inicio conservando todos los datos',
      acciones: [
        {
          texto: 'Eliminar app',
          warning: true,
          callback: function(){
            if (idApp !== undefined) {
              globalState.apps.splice(idApp, 1);
              renderizarUI();
            } else if (idDeck) {
              $('.deckApps .app[data-indeck="'+ idDeck +'"]').remove();
            }
          }
        },
        {
          texto: 'Transferir a la biblioteca de apps',
          callback: function () { console.log('Biblioteca de apps pendiente') }
        },
        {
          texto: 'Cancelar'
        },
      ]
    });
  })
  $('.appScreen').on('click', '.app .removeApp', function () {
    let idApp = $(this).parent('.app').data('id');
    if (idApp == 'undefined') {
      var idDeck = $(this).parent('.app').data('indeck');
    }
    $('.appScreen .app .removeApp').remove();
    $('.mainScreen').removeClass('shakingApps');
    alertaiOS({
      encabezado: `¿Transferir ${idApp !== undefined ? globalState.apps[idApp].nombre : 'app'} a la biblioteca de apps o eliminar la app?`,
      mensaje: 'Transferir la app la quitará de tu pantalla de inicio conservando todos los datos',
      acciones: [
        {
          texto: 'Eliminar app',
          warning: true,
          callback: function () {
            if (idApp !== undefined) {
              globalState.apps.splice(idApp, 1);
              renderizarUI();
            } else if (idDeck) {
              $('.deckApps .app[data-indeck="' + idDeck + '"]').remove();
            }
          }
        },
        {
          texto: 'Transferir a la biblioteca de apps',
          callback: function () { console.log('Biblioteca de apps pendiente') }
        },
        {
          texto: 'Cancelar'
        },
      ]
    });
  })
  //Toggles de los iconos del controlCenter
  $('.controlCenter .actionIcon').click(function(){
    $(this).toggleClass('activo');
    if ($(this).hasClass('modoVuelo')) {
      $(this).siblings('.datosCelulares, .wifi').removeClass('activo');
    } else if ($(this).hasClass('datosCelulares') || $(this).hasClass('wifi')) {
      $(this).siblings('.modoVuelo').removeClass('activo');
    }
  })

//botones del iphone
$('body').on('click', '.app[data-app="appCamara"]', function(){
  camara();
});
/*---------------------------------------------------------------------------------------------------------------------------
# LA SIGUIENTE CONFIGURACION DE LOCKSCREEN Y LOCKSCREEN2 ESTA PERFECTA!
----------------------------------------------------------------------------------------------------------------------------*/
// Variables globales
let camaraVisible = false;
let cinexVisible = false;
let lockScreenState = {
    lockScreen: false,
    lockScreen2: false
};

// Función para manejar la visibilidad de las pantallas de bloqueo
function handleBackSideLockScreen() {
    const $iphone = $('.iphone');
    const $mainScreen = $('.mainScreen');
    const isBackSide = $iphone.hasClass('showBackSide');
    const isLocked = $mainScreen.hasClass('bloqueado');

    if (isBackSide) {
        $('.lockScreen, .lockScreen2').addClass('hidden');
    } else {
        if (isLocked) {
            $('.lockScreen, .lockScreen2').removeClass('hidden');
        } else {
            $('.lockScreen').addClass('hidden');
            // No modificar lockScreen2 aquí, se maneja en toggleiPhoneState
        }
    }
}

// Función para alternar el estado del botón girar
function toggleBotonGirarDataBack() {
    // Implementación existente
}

// Función para guardar el estado actual de las pantallas de bloqueo
function saveLockScreenStates() {
    lockScreenState = {
        lockScreen: !$('.lockScreen').hasClass('hidden'),
        lockScreen2: !$('.lockScreen2').hasClass('hidden')
    };
}

// Función principal para alternar el estado del iPhone
function toggleiPhoneState() {
    const $iphone = $('.iphone');
    const $mainScreen = $('.mainScreen');
    const $botonGirar = $('.botonGirar');

    // Alternar el estado de "backSide"
    $botonGirar.toggleClass('activo');
    $iphone.toggleClass('showBackSide');

    const isBackSide = $iphone.hasClass('showBackSide');
    const isLocked = $mainScreen.hasClass('bloqueado');

    if (isBackSide) {
        // Modo "backSide": guardar estado y ocultar
        saveLockScreenStates();
        $('.lockScreen, .lockScreen2').addClass('hidden');
    } else {
        // Modo frontal
        if (isLocked) {
            // Estado bloqueado: mostrar ambos
            $('.lockScreen, .lockScreen2').removeClass('hidden');
        } else {
            // Estado desbloqueado
            $('.lockScreen').addClass('hidden');
            
            // Mostrar lockScreen2 solo si estaba visible antes de girar
            if (lockScreenState.lockScreen2) {
                $('.lockScreen2').removeClass('hidden');
            } else {
                $('.lockScreen2').addClass('hidden');
            }
        }
    }

    toggleBotonGirarDataBack();
}

// Función para manejar el botón de bloqueo
function handleLockButton() {
    const $mainScreen = $('.mainScreen');
    const $lockScreen = $('.lockScreen');
    const $lockScreen2 = $('.lockScreen2');
    const $appScreen = $('.appScreen');
    const $camaraApp = $('.camaraApp');
    const $cinexWrapper = $('#cinex-wrapper');
    const $widgetCenter = $('.widgetCenter');
    const $botonBloquear = $(this);

    if (!$botonBloquear.hasClass('activo')) {
        let sonido = new Audio('https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/sonidos%2FiphoneLockScreen.mp3?alt=media&token=e2a00013-3c33-429b-866b-b2d6399b343f');
        sonido.play();
    }
    $botonBloquear.toggleClass('activo');

    // Desactivar transiciones temporalmente
    $('.mainScreen, .lockScreen, .lockScreen2, .appScreen').css('transition', 'none');

    // Bloquear/Desbloquear
    $mainScreen.toggleClass('bloqueado');

    // Verificar si el widgetCenter está activo y desactivarlo
    if ($widgetCenter.is(':visible')) {
        $widgetCenter.addClass('hidden');
        $mainScreen.removeClass('blur');
        $appScreen.removeClass('moveOut');
    }

    // Guardar el estado de la cámara y Cinex antes de bloquear
    camaraVisible = !$camaraApp.hasClass('hidden');
    cinexVisible = !$cinexWrapper.hasClass('hidden');

    if (!$mainScreen.hasClass('bloqueado')) {
        // Al desbloquear
        $lockScreen.addClass('hidden');
        $lockScreen2.removeClass('hidden');
        $appScreen.addClass('hidden');
        $('#wrapper').addClass('hidden');
        $camaraApp.addClass('hidden');
        $cinexWrapper.addClass('hidden');
        $botonBloquear.attr('data-reset-top', 'true');
        
        // Actualizar estado (lockScreen2 visible al desbloquear)
        saveLockScreenStates();
    } else {
        // Al bloquear
        $lockScreen2.addClass('hidden');
        $appScreen.removeClass('hidden');
        $botonBloquear.attr('data-reset-top', 'false');
        
        // Actualizar estado
        saveLockScreenStates();
    }

    // Restaurar transiciones
    setTimeout(() => {
        $('.mainScreen, .lockScreen, .lockScreen2, .appScreen').css('transition', '');
    }, 50);

    // Ocultar controlCenter si está visible
    const controlCenter = document.querySelector('.controlCenter');
    if (!controlCenter.classList.contains('hidden')) {
        hideControlCenter();
    }

    handleBackSideLockScreen();
}

// Asignación de eventos
$(document).ready(function() {
    // Inicialización mejorada
    $('.lockScreen').addClass('hidden'); // Oculta lockScreen inicialmente
    lockScreenState.lockScreen = false;  // Actualiza estado
    lockScreenState.lockScreen2 = true;  // lockScreen2 visible por defecto
    $('.lockScreen2').removeClass('hidden');
    
    $('.botonGirar').click(toggleiPhoneState);
    $('.botonBloquear').click(handleLockButton);
});
})

// Back Button: position adjustment and click behavior (replicated from assets/aaa)
document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('backButton');
  if (!backButton) return;

  function adjustButtonPosition() {
    // Detect a possible scrollable gallery container and nudge the button away from the scrollbar
    const gallery = document.querySelector('.main .container') || document.getElementById('gallery-container');
    try {
      if (gallery && gallery.scrollHeight > gallery.clientHeight) {
        backButton.style.right = '15px';
      } else {
        backButton.style.right = '0px';
      }
    } catch (e) {
      backButton.style.right = '0px';
    }
  }

  // Initial adjust
  adjustButtonPosition();

  // Recalculate on resize
  window.addEventListener('resize', adjustButtonPosition);

  // Recalculate on DOM changes
  const observer = new MutationObserver(function() {
    adjustButtonPosition();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Click behavior: back if possible, otherwise go to the site root; if inside iframe, postMessage to parent
  backButton.addEventListener('click', function () {
    try {
      if (window.self === window.top) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // fallback to main index (same as original)
          window.location.href = '../../index.html';
        }
      } else {
        window.parent.postMessage({ action: 'closeGallery' }, '*');
      }
    } catch (e) {
      console.error('Back button error:', e);
    }
  });
});

/* ----------------------------- */
/* Play-button (local video) */
/* --------------------------- */
// Wire the left play button to open a local HTML5 video from `app_video/` when expanded
(function() {
  $(function() {
    var $playButton = $("#left-floating-btn.play-button");
    if (!$playButton.length) return;

    // prefer an explicit data-local-src attribute; fallback to app_video/plane.mp4
    var localSrc = $playButton.attr('data-local-src') || $playButton.data('local-src') || 'app_video/plane.mp4';
    var $videoContainer = $playButton.find('#video-container');
    var $container = $playButton.closest('.play-button-container');
    var $videoEl = null;

    function createVideo() {
      if ($videoEl) return $videoEl;
      $videoEl = $('<video>', {
        id: 'smartphone-local-video',
        src: localSrc,
        controls: true,
        autoplay: true,
        playsinline: true
      }).css({
        width: '100%',
        height: '100%',
        display: 'block',
        'object-fit': 'cover'
      });
      // ensure the container is cleared and append
      $videoContainer.empty().append($videoEl);
      // clicking the video should toggle pause/play, and must not close the container
      $videoEl.on('click.smartphoneVideo', function(e) {
        // prevent native toggling and stop propagation so the click does not
        // reach other handlers that might reopen the player
        e.preventDefault();
        e.stopPropagation();
        var vid = this;
        try {
          if (vid.paused) vid.play();
          else vid.pause();
        } catch (err) { console.warn('Video play/pause failed', err); }
      });
      // try to play (some browsers require user gesture; this is triggered by click)
      try { $videoEl.get(0).play(); } catch (err) { console.warn('Video play failed', err); }
      return $videoEl;
    }

    function destroyVideo() {
      if (!$videoEl) return;
      try {
        $videoEl.get(0).pause();
        $videoEl.get(0).currentTime = 0;
      } catch (e) {}
      // remove event handlers and empty container
      try { $videoEl.off('click.smartphoneVideo'); } catch(e) {}
      $videoContainer.empty();
      $videoEl = null;
    }

    // Toggle on click of the play button
    $playButton.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $container.toggleClass('-clicked');
      if ($container.hasClass('-clicked')) {
        createVideo();
      } else {
        destroyVideo();
      }
    });

    // Close via close-button
    $playButton.find('.close-button').on('click', function(e) {
      e.stopPropagation();
      $container.removeClass('-clicked');
      destroyVideo();
    });

    // clicking elsewhere closes
    $('body').on('click.smartphonePlay', function(evt) {
      if (!$(evt.target).closest('.play-button-container').length) {
        $('.play-button-container').removeClass('-clicked');
        destroyVideo();
      }
    });
  });
})();