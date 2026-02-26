  // Pausar videos al cambiar de slide
  document.querySelectorAll('.gallery-container').forEach(function(container) {
    container.addEventListener('lgAfterSlide', function(e) {
      const outer = document.querySelector('.lg-outer');
      if (!outer) return;
      // Pausar todos los videos excepto el del slide activo
      const current = outer.querySelector('.lg-item.lg-current');
      outer.querySelectorAll('video').forEach(video => {
        if (!current || !current.contains(video)) {
          video.pause();
        }
      });
    });
  });
// Eliminada funcionalidad de Back Button
// Variables globales
let currentHoveredIcon = null;
let isOverMenu = false;

// Inicializar cuando el documento esté listo
$(document).ready(function(){
  // Agregar el evento de mousemove para la navegación al portfolio
  document.body.addEventListener('mousemove', function(e) {
      // Si el mouse está cerca del borde izquierdo (por ejemplo, < 30px)
      if (e.clientX < 30) {
          // Redirigir al portfolio si no estamos en un iframe
          if (window.self === window.top) {
              window.location.href = '../portfolio/index.html';
          }
      }
  });

  // Inicializar funcionalidad de iconos
  initMenu();
  
  // Cerrar menús al hacer clic fuera
  $(document).click(function(e){
    if (!$(e.target).closest('.icon-container').length) {
      $(".menu").removeClass("showMenu");
    }
  });

  // Manejar clic en el icono home
  $("#pic1").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '../../index.html';
  });

  // Inicializar lightGallery
  initGallery();

  // Si existe una portada por contenedor, abrir la galería correspondiente al hacer click en ella
  // (mantenemos los anchors como items reales de la galería; la portada no es un anchor para evitar que
  // aparezca entre los thumbnails)
  $('#videoGallery .container-cover').on('click', function(e){
    e.preventDefault();
    const firstAnchor = document.querySelector('#videoGallery a');
    if (firstAnchor) firstAnchor.click();
  });
});

function initMenu() {
  // Manejar clic en iconos
  $(".icon-container").click(function(e) {
    e.stopPropagation();
    var iconId = $(this).find(".ic").attr("id");
    var menu = $(this).find(".menu");
    
    // Alternar menú sin ocultar la página
    $(".menu").not(menu).removeClass("showMenu");
    menu.toggleClass("showMenu");
    
    // Resaltar icono
    switch(iconId) {
      case 'pic1': $(this).toggleClass('active-icon-1'); break;
      case 'pic2': $(this).toggleClass('active-icon-2'); break;
      case 'pic3': $(this).toggleClass('active-icon-3'); break;
      case 'pic4': $(this).toggleClass('active-icon-4'); break;
    }
  });

  // Evento hover para iconos
  $(".icon-container").hover(
    function() {
      currentHoveredIcon = $(this).attr('id');
      if ($(".menu.showMenu").length > 0) {
        var menu = $(this).find(".menu");
        $(".menu").removeClass("showMenu");
        menu.addClass("showMenu");
      }
    },
    function() {
      currentHoveredIcon = null;
    }
  );
  
  // Manejar clic en items del menú
  $(".menu li").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const frameId = $(this).attr('data-frame');
    if (frameId) {
      let url = '';
      switch(frameId) {
        case 'portfolio-frame':
          url = '../portfolio/index.html';
          break;
        case 'logo-frame':
          url = '../logo_design/index.html';
          break;
        case 'graphic-frame':
          url = '../graphic_design/index.html';
          break;
        case 'website-frame':
          url = '../websites/index.html';
          break;
        case 'social-frame':
          url = '../social_media/index.html';
          break;
        case 'illustration-frame':
          url = '../hand-drawn/index.html';
          break;
        case 'video-frame':
          url = '../video_editing/index.html';
          break;
        case 'aboutme-frame':
          url = '../about/about/index.html';
          break;
        case 'timeline-frame':
          url = '../about/timeline/index.html';
          break;
        case 'contact-frame':
          url = '../contact/contact form/index.html';
          break;
      }
      
      if (url) {
        window.location.href = url;
      }
    }
  });
}

function initGallery() {
  // Inicializar lightGallery en cada contenedor individual (.gallery-container)
  document.querySelectorAll('.gallery-container').forEach(function(container) {
    // Antes de inicializar, asegurar que cada <a> tenga un data-lg-size correcto
    // (ancho-alt0) basado en las dimensiones reales de la imagen/video para
    // evitar que la transición de lightGallery estire imágenes verticales.
    try {
      container.querySelectorAll('a').forEach(a => {
        try {
          const img = a.querySelector('img');
          if (img) {
            if (img.complete && img.naturalWidth) {
              a.setAttribute('data-lg-size', img.naturalWidth + '-' + img.naturalHeight);
            } else {
              const onLoad = function() {
                a.setAttribute('data-lg-size', img.naturalWidth + '-' + img.naturalHeight);
                img.removeEventListener('load', onLoad);
              };
              img.addEventListener('load', onLoad);
            }
          } else {
            // Fallback: precargar desde el href (por ejemplo thumbnails de video)
            const pre = new Image();
            pre.src = a.href;
            pre.onload = function() {
              a.setAttribute('data-lg-size', pre.naturalWidth + '-' + pre.naturalHeight);
            };
          }
        } catch (err) {
          if (typeof console !== 'undefined' && console.warn) console.warn('set data-lg-size error', err);
        }
      });
    } catch (err) {
      if (typeof console !== 'undefined' && console.warn) console.warn('pre-size container error', err);
    }

    lightGallery(container, {
      plugins: [lgThumbnail, lgZoom, lgFullscreen, lgShare, lgAutoplay, lgRotate, lgVideo],
      thumbnail: true,
      animateThumb: true,
      showThumbByDefault: true,
      selector: 'a',
      mode: 'lg-fade',
      speed: 500,
      download: true,
      rotate: true,
      fullScreen: true,
      share: true,
      counter: true,
      autoplay: true,
      autoplayControls: true,
      autoplayTimeout: 3000,
      pauseOnHover: true,
      hideScrollbar: true,
      enableDrag: true,
      enableSwipe: true,
      mousewheel: true,
      videojs: true,
      videojsOptions: {
        muted: true
      },
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: true,
        rotate: true,
        autoplay: true
      },
      strings: {
        download: 'Descargar',
        close: 'Cerrar',
        zoomIn: 'Acercar',
        zoomOut: 'Alejar',
        rotateLeft: 'Rotar izquierda',
        rotateRight: 'Rotar derecha',
        fullScreen: 'Pantalla completa',
        share: 'Compartir',
        playVideo: 'Reproducir',
        toggleAutoplay: 'Reproducción automática'
      }
    });
  });
    
  // Crear pestaña Toggle thumbnails en .lg-components (comportamiento original)
  $('.gallery-container').each(function(){
    this.addEventListener('lgAfterOpen', function() {
      // Clear any previous toggle state to avoid leftover classes/styles
      // que puedan persistir entre aperturas o al entrar en pantalla completa.
      clearGlobalToggleState();
      
      // Esperar a que .lg-components exista
      setTimeout(() => {
        document.querySelectorAll('.lg-outer').forEach(outer => {
          const components = outer.querySelector('.lg-components');
          console.log('lgAfterOpen: found .lg-outer, components=', !!components, outer);
          if (!components) {
            // Retry breve: a veces lightGallery inserta components ligeramente más tarde
            setTimeout(() => {
              const compRetry = outer.querySelector('.lg-components');
              console.log('lgAfterOpen retry: components=', !!compRetry, outer);
              if (!compRetry) return; // nada que hacer
              createGlobalToggleInComponents(compRetry, outer);
            }, 150);
            return;
          }
          // Evitar duplicados y crear botón de forma separada (función para repetición)
          if (!components.querySelector('#global-toggle-thumb')) {
            createGlobalToggleInComponents(components, outer);
          }
        });
      }, 0);
    });
    
    function createGlobalToggleInComponents(components, outer) {
      const btn = document.createElement('button');
      btn.id = 'global-toggle-thumb';
      btn.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/32/3603/3603050.png" alt="Thumbnails" style="width:24px;height:24px;vertical-align:middle;filter:invert(65%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%);display:block;margin:0 auto;">';
      btn.style.position = 'absolute';
      btn.style.top = '8px';
      btn.style.right = '20px';
      btn.style.background = '#0D0A0A';
      btn.style.color = '#999';
      btn.style.border = 'none';
      btn.style.borderRadius = '20%';
      btn.style.fontSize = '24px';
      btn.style.padding = '10px 10px';
      btn.style.cursor = 'pointer';
      btn.style.outline = 'none';
      btn.style.zIndex = '10';
      btn.onclick = function(e) {
        e.stopPropagation();
        document.querySelectorAll('.lg-outer').forEach(outer2 => {
          const components2 = outer2.querySelector('.lg-components');
          if (!components2) return;
          const subHtml = components2.querySelector('.lg-sub-html');
          let anyHidden = false;
          Array.from(components2.children).forEach(child => {
            if (child !== subHtml && child !== btn) {
              child.classList.toggle('hide-lg-comp');
              if (child.classList.contains('hide-lg-comp')) {
                anyHidden = true;
              }
            }
          });
          const inner = outer2.querySelector('.lg-inner');
          if (anyHidden) {
            // Distinguish between video slides and image slides.
            // Videos should keep the original fullscreen-like expansion behavior,
            // while images should be sized to stay within the area above .lg-sub-html.
            const isVideoSlide = !!outer2.querySelector('.lg-current .lg-video-cont');
            if (isVideoSlide) {
              outer2.classList.add('lg-expanded-media');
            } else {
              outer2.classList.add('lg-expanded-img');
            }
            if (!isVideoSlide && inner && components2) {
              // For images, expand only up to the top of .lg-components
              // (which contains the toggle and sub-html)
              // This ensures the image never expands below the UI.
              // Force reflow to ensure layout is up to date
              void inner.offsetHeight;
              const innerRect = inner.getBoundingClientRect();
              const compRect = components2.getBoundingClientRect();
              // Calculate available height from inner top to components top
              const availableHeight = Math.max(0, compRect.top - innerRect.top);
              // Set CSS variable for components height
              const componentsHeight = compRect.height;
              document.documentElement.style.setProperty('--lg-components-height', componentsHeight + 'px');
              
              if (availableHeight > 0) {
                inner.style.height = availableHeight + 'px';
                inner.style.maxHeight = availableHeight + 'px';
                inner.style.overflow = 'hidden';
                // Ensure the image container respects the height limit
                const imageContainer = outer2.querySelector('.lg-current .lg-item');
                if (imageContainer) {
                  imageContainer.style.maxHeight = availableHeight + 'px';
                  imageContainer.style.overflow = 'hidden';
                }
              }
            }
          } else {
            // Remove either expansion class (media or img) and reset inline styles.
            outer2.classList.remove('lg-expanded-media');
            outer2.classList.remove('lg-expanded-img');
            if (subHtml && inner) {
              const innerRect = inner.getBoundingClientRect();
              const subHtmlRect = subHtml.getBoundingClientRect();
              const availableHeight = Math.max(0, subHtmlRect.top - innerRect.top);
              if (availableHeight > 0) {
                // Keep a reasonable height if needed, otherwise clear inline sizes
                // (this mirrors earlier logic but avoids forcing fullscreen for images)
                inner.style.height = availableHeight + 'px';
                inner.style.maxHeight = availableHeight + 'px';
                inner.style.overflow = 'hidden';
              } else {
                inner.style.height = '';
                inner.style.maxHeight = '';
                inner.style.overflow = '';
              }
              // Reset image container styles
              const imageContainer = outer2.querySelector('.lg-current .lg-item');
              if (imageContainer) {
                imageContainer.style.maxHeight = '';
                imageContainer.style.overflow = '';
              }
            }
          }
        });
      };
      if (getComputedStyle(components).position === 'static') {
        components.style.position = 'relative';
      }
      components.appendChild(btn);
    }
    this.addEventListener('lgAfterClose', function() {
      // Al cerrar la galería, eliminar el botón y limpiar cualquier rastro
      document.querySelectorAll('#global-toggle-thumb').forEach(function(btn) { btn.remove(); });
      clearGlobalToggleState();
    });
  });

  // Llamar limpieza antes de abrir/cerrar para evitar estados residuales
  document.addEventListener('lgBeforeOpen', function() { clearGlobalToggleState(); });
  document.addEventListener('lgBeforeClose', function() { clearGlobalToggleState(); });
}

// Limpia cualquier estado dejado por el botón global-toggle-thumb sin tocar
// las medidas originales: elimina clases y resetea estilos inline aplicados
// a los elementos `.lg-inner` y a los componentes auxiliares.
function clearGlobalToggleState() {
  try {
    document.querySelectorAll('.lg-outer').forEach(function(outer) {
      // Quitar cualquier clase de estado expandido (compatibilidad con versiones previas)
      outer.classList.remove('lg-expanded');
      outer.classList.remove('lg-expanded-media');
      outer.classList.remove('lg-expanded-img');

      var components = outer.querySelector('.lg-components');
      if (!components) return;

      var subHtml = components.querySelector('.lg-sub-html');
      // Remover cualquier clase hide-lg-comp dentro de components (más robusto)
      components.querySelectorAll('.hide-lg-comp').forEach(function(el) {
        // No tocar el subHtml por si contiene información importante
        if (subHtml && (el === subHtml || subHtml.contains(el))) return;
        el.classList.remove('hide-lg-comp');
      });

      // Resetear los estilos inline que se usaron para forzar alturas
      var inner = outer.querySelector('.lg-inner');
      if (inner) {
        inner.style.height = '';
        inner.style.maxHeight = '';
        inner.style.overflow = '';
      }
      
      // Resetear estilos del contenedor de imagen
      var imageContainer = outer.querySelector('.lg-current .lg-item');
      if (imageContainer) {
        imageContainer.style.maxHeight = '';
        imageContainer.style.overflow = '';
      }
      
      // Resetear también estilos del contenedor de video
      var videoCont = outer.querySelector('.lg-current .lg-video-cont');
      if (videoCont) {
        videoCont.style.height = '';
        videoCont.style.maxHeight = '';
      }
      
      // Resetear variable CSS de altura de componentes
      document.documentElement.style.removeProperty('--lg-components-height');
    });
  } catch (err) {
    // No bloquear en caso de error, solo registrar en consola en desarrollo
    if (typeof console !== 'undefined' && console.warn) console.warn('clearGlobalToggleState error', err);
  }
}

// Escuchar cambios de pantalla completa para limpiar el estado si el usuario
// entra o sale del modo full-screen y evitar que quede registrado.
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(function(evt) {
  document.addEventListener(evt, function() {
    // Limpiar siempre: tanto al entrar como al salir de pantalla completa.
    // Ejecutar una vez más con pequeño retardo por si el DOM se reestructura.
    clearGlobalToggleState();
    setTimeout(clearGlobalToggleState, 50);
  });
});

// Funciones auxiliares para el menú flotante
function getNextIcon(currentId) {
  const icons = ['homepic', 'codepic', 'workpic', 'studypic'];
  const currentIndex = icons.indexOf(currentId);
  return icons[(currentIndex + 1) % icons.length];
}

function getPreviousIcon(currentId) {
  const icons = ['homepic', 'codepic', 'workpic', 'studypic'];
  const currentIndex = icons.indexOf(currentId);
  return icons[(currentIndex - 1 + icons.length) % icons.length];
}

function activateIcon(iconId) {
  const icon = document.getElementById(iconId);
  if (icon) {
    // Aplicar clase de scroll al icono activo
    icon.classList.add('scroll-active');
    
    // Remover clase de scroll de otros iconos
    ['homepic', 'codepic', 'workpic', 'studypic'].forEach(id => {
      if (id !== iconId) {
        const otherIcon = document.getElementById(id);
        if (otherIcon) {
          otherIcon.classList.remove('scroll-active');
        }
      }
    });

    // Si hay algún menú abierto, cambiar al menú correspondiente al icono activo
    if ($(".menu.showMenu").length > 0) {
      $(".menu").removeClass("showMenu");
      const menu = $(icon).find(".menu");
      menu.addClass("showMenu");
    }
  }
}

// Evento de rueda del mouse para el menú flotante
document.addEventListener('wheel', (e) => {
  const menuArea = document.querySelector('.dropholder');
  const rect = menuArea.getBoundingClientRect();
  isOverMenu = e.clientX >= rect.left && 
               e.clientX <= rect.right && 
               e.clientY >= rect.top && 
               e.clientY <= rect.bottom;

  if (isOverMenu && currentHoveredIcon) {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.deltaY > 0) {
      const nextIcon = getNextIcon(currentHoveredIcon);
      activateIcon(nextIcon);
      currentHoveredIcon = nextIcon;
    } else if (e.deltaY < 0) {
      const prevIcon = getPreviousIcon(currentHoveredIcon);
      activateIcon(prevIcon);
      currentHoveredIcon = prevIcon;
    }
  }
}, { passive: false });

$(".dropholder").mouseleave(function() {
  ['homepic', 'codepic', 'workpic', 'studypic'].forEach(id => {
    const icon = document.getElementById(id);
    if (icon) {
      icon.classList.remove('scroll-active');
    }
  });
  currentHoveredIcon = null;
});

// Back Button: add functionality same as photo_editing
document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    // Ajustar posición respecto a la barra deslizadora
    function adjustButtonPosition() {
      const galleryContainer = document.querySelector('.main .container') || document.querySelector('#gallery-container');
      if (galleryContainer && backButton) {
        const hasScrollbar = galleryContainer.scrollHeight > galleryContainer.clientHeight;
        if (hasScrollbar) {
          backButton.style.right = '15px';
        } else {
          backButton.style.right = '0px';
        }
      }
    }
    adjustButtonPosition();
    window.addEventListener('resize', adjustButtonPosition);
    const observer = new MutationObserver(adjustButtonPosition);
    observer.observe(document.body, { childList: true, subtree: true });
    backButton.addEventListener('click', function() {
      if (window.self === window.top) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '../design_extras/index.html';
        }
      } else {
        window.parent.postMessage({ action: 'closeGallery' }, '*');
      }
    });
  }
});
