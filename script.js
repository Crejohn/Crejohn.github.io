/**
 * Complete Modified JavaScript for Crejohn Design
 * Includes slider functionality
 */

// ==============================================
// LOADER FUNCTIONALITY
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.querySelector('.loader');
  
  window.addEventListener('load', function() {
    // Ocultar el loader cuando la página termine de cargar
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    document.body.classList.remove('loading');
  });
});

// ==============================================
// SIMPLE SLIDER FUNCTIONALITY
// ==============================================
const simpleSlider = function (opts) {
  let images = opts.images;
  let _currentSlide = 0;
  let totalSlides = images.length;
  let isAnimating = false;

  const changeSlide = function(slideId) {
    if (isAnimating) return;

    if (slideId >= 0 && slideId < totalSlides) {
      isAnimating = true;
      // Detectar si el elemento seleccionado es un <video>
      let isVideo = false;
      try {
        const selectedEl = images[slideId];
        isVideo = selectedEl && selectedEl.tagName && selectedEl.tagName.toLowerCase() === 'video';
        if (!isVideo) {
        const vids = document.querySelectorAll('#slider video');
        vids.forEach(function(v) { v.muted = true; });
        }
      } catch (err) {
        // no hacer nada si ocurre algún error de lectura
      }

      // Actualizar clase activa
      document.getElementById('pagination').querySelectorAll('.active')[0].className = '';
      document.querySelector(`#pagination button[data-slide="${slideId}"]`).className = 'active';

      // Ocultar todas las imágenes/videos
      images.forEach(img => {
        img.style.opacity = '0';
      });

      // Mostrar la imagen o video seleccionado
      TweenLite.to(images[slideId], 0.5, {
        opacity: 1,
        ease: 'Expo.easeInOut',
        onComplete: function () {
          isAnimating = false;
          _currentSlide = slideId;
        }
      });

      // Mostrar u ocultar el bloque de texto del slider según si es video
      const sliderContent = document.getElementById('slider-content');
      let slideTitleEl = document.getElementById('slide-title');
      let slideStatusEl = document.getElementById('slide-status');

      if (isVideo) {
        // Ocultar todo el contenedor de texto para el slide de video
        TweenLite.to(sliderContent, 0.35, { autoAlpha: 0, ease: 'Expo.easeInOut' });
      } else {
        // Asegurar que el contenedor de texto está visible y animar su contenido
        TweenLite.to(sliderContent, 0.35, { autoAlpha: 1, ease: 'Expo.easeInOut' });

        let nextSlideTitle = document.querySelectorAll(`[data-slide-title="${slideId}"]`)[0].innerHTML;
        let nextSlideStatus = document.querySelectorAll(`[data-slide-status="${slideId}"]`)[0].innerHTML;

        // Si el contenedor de texto estaba oculto (p. ej. venimos de un video),
        // establecemos el contenido inmediatamente y animamos la aparición.
        const contentOpacity = parseFloat(window.getComputedStyle(sliderContent).opacity || '0');
        const contentVisible = contentOpacity > 0.05;

        if (!contentVisible) {
          // establecer contenido nuevo antes de mostrar para evitar "rebote"
          slideTitleEl.innerHTML = nextSlideTitle;
          slideStatusEl.innerHTML = nextSlideStatus;

          // preparar posición/alpha para animar la entrada
          TweenLite.set(slideTitleEl, { autoAlpha: 0, y: 20 });
          TweenLite.set(slideStatusEl, { autoAlpha: 0, y: 20 });

          // mostrar el contenedor y animar título/estado a la vista
          TweenLite.to(sliderContent, 0.35, { autoAlpha: 1, ease: 'Expo.easeInOut' });
          TweenLite.to(slideTitleEl, 0.5, { autoAlpha: 1, y: 0 });
          TweenLite.to(slideStatusEl, 0.5, { autoAlpha: 1, y: 0, delay: 0.1 });
        } else {
          // comportamiento previo: animar fuera el texto viejo, cambiar y traer de nuevo
          TweenLite.fromTo(slideTitleEl, 0.5,
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: 20, ease: 'Expo.easeIn',
              onComplete: function () {
                slideTitleEl.innerHTML = nextSlideTitle;
                TweenLite.to(slideTitleEl, 0.5, { autoAlpha: 1, y: 0 });
              }
            });

          TweenLite.fromTo(slideStatusEl, 0.5,
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: 20, ease: 'Expo.easeIn',
              onComplete: function () {
                slideStatusEl.innerHTML = nextSlideStatus;
                TweenLite.to(slideStatusEl, 0.5, {
                  autoAlpha: 1,
                  y: 0,
                  delay: 0.1
                });
              }
            });
        }
      }
    }
  };

  let addEvents = function () {
    let pagButtons = document.querySelectorAll('#pagination button');
    pagButtons.forEach(function(el) {
      el.addEventListener('click', function() {
        let slideId = parseInt(this.getAttribute('data-slide'));
        changeSlide(slideId);
      });
    });

    let startY = 0;
    document.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
    }, {passive: true});

    document.addEventListener('touchend', function(e) {
      if (!e.changedTouches[0]) return;
      let endY = e.changedTouches[0].clientY;
      let diffY = startY - endY;
      
      if (diffY > 50) {
        let nextSlide = Math.min(_currentSlide + 1, totalSlides - 1);
        changeSlide(nextSlide);
      } else if (diffY < -50) {
        let prevSlide = Math.max(_currentSlide - 1, 0);
        changeSlide(prevSlide);
      }
    }, {passive: true});

    window.addEventListener('wheel', function(e) {
        const menuArea = document.querySelector('.dropholder');
        const rect = menuArea.getBoundingClientRect();
        const isOverMenu = e.clientX >= rect.left && 
                          e.clientX <= rect.right && 
                          e.clientY >= rect.top && 
                          e.clientY <= rect.bottom;

        if (!isOverMenu) {
            e.preventDefault();
            if (e.deltaY > 0 && _currentSlide < totalSlides - 1) {
                changeSlide(_currentSlide + 1);
            } else if (e.deltaY < 0 && _currentSlide > 0) {
                changeSlide(_currentSlide - 1);
            }
        }
    }, { passive: false });
  };

  addEvents();

  const init = function() {
    // Inicialización del slider
    addEvents();
    // Mostrar la primera imagen
    images[0].style.opacity = '1';
    // Si el primer slide es un video, ocultamos el bloque de texto inicialmente
    try {
      const firstIsVideo = images[0] && images[0].tagName && images[0].tagName.toLowerCase() === 'video';
      const sliderContent = document.getElementById('slider-content');
      if (firstIsVideo) {
        TweenLite.set(sliderContent, { autoAlpha: 0 });
      } else {
        TweenLite.set(sliderContent, { autoAlpha: 1 });
      }
    } catch (err) {
      // ignore
    }
  };

  return {
    init: init,
    changeSlide: changeSlide,
    get currentSlide() { return _currentSlide; },
    set currentSlide(value) { _currentSlide = value; },
    totalSlides: totalSlides
  };
};

// Inicializar el slider
document.addEventListener('DOMContentLoaded', function() {
  const slider = simpleSlider({
    parent: document.getElementById('slider'),
    images: document.querySelectorAll('#slider img, #slider video')
  });
  slider.init();
  // Añadir toggle de audio al hacer click sobre el/los video(s)
  // (esto solo altera la propiedad `muted` al hacer click)
  const sliderVideos = document.querySelectorAll('#slider video');
  sliderVideos.forEach(function(vid) {
    vid.addEventListener('click', function() {
      this.muted = !this.muted;
    });
  });
  // Fallback: si el video está cubierto por capas y el click no llega al elemento <video>,
  // capturamos clicks en el contenedor #slider y alternamos el audio solo cuando el video
  // está actualmente visible (opacity alto). Ignora clicks en la paginación.
  const sliderEl = document.getElementById('slider');
  if (sliderEl) {
    sliderEl.addEventListener('click', function(e) {
      if (e.target.closest('#pagination')) return; // no interferir con controles
      const vid = sliderEl.querySelector('video');
      if (!vid) return;
      const vidStyle = window.getComputedStyle(vid);
      const vidOpacity = parseFloat(vidStyle.opacity || '0');
      if (vidOpacity > 0.5) {
        vid.muted = !vid.muted;
      }
    });
  }
});

// Intentional minimal safeguard: reintentar reproducción cuando la página vuelva a ser visible
// Esto no cambia la estructura ni la funcionalidad del slider; sólo intenta reanudar
// videos en casos donde el navegador los detuvo por visibilidad/gestión de pestañas.
(function() {
  function tryResumeVideos() {
    try {
      const vids = document.querySelectorAll('#slider video');
      vids.forEach(function(v) {
        // Sólo intentar play si está pausado y es visible (opacity alta)
        try {
          var opacity = parseFloat(window.getComputedStyle(v).opacity || '0');
          if (v.paused && opacity > 0.1) {
            const p = v.play();
            if (p && p.catch) p.catch(function(){});
          }
        } catch (e) {
          // ignorar errores mínimos
        }
      });
    } catch (e) {}
  }

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      tryResumeVideos();
    }
  });

  window.addEventListener('focus', function() {
    tryResumeVideos();
  });
})();