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
  // Inicializar lightGallery en el contenedor principal con thumbnails
  // Asegurar que cada <a> dentro de #gallery-container tenga un data-lg-size
  // correcto (ancho-alt0) basado en la imagen real para que la animación de
  // apertura respete la relación de aspecto y no estire imágenes verticales.
  try {
    const galleryEl = document.getElementById('gallery-container');
    if (galleryEl) {
      galleryEl.querySelectorAll('a').forEach(a => {
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
            // Fallback: precargar desde href (útil para thumbs o videos)
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
    }
  } catch (err) {
    if (typeof console !== 'undefined' && console.warn) console.warn('pre-size gallery error', err);
  }

  lightGallery(document.getElementById('gallery-container'), {
    plugins: [lgThumbnail, lgZoom, lgFullscreen, lgShare, lgAutoplay, lgRotate],
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
    
  // Crear botón global dinámicamente sobre .lg-components al abrir galería (icono igual que galeria de imagenes sin video - 2 - copia)
  const galleryContainer = document.getElementById('gallery-container');
  if (galleryContainer) {
    galleryContainer.addEventListener('lgAfterOpen', function() {
      setTimeout(() => {
        document.querySelectorAll('.lg-outer').forEach(outer => {
          const components = outer.querySelector('.lg-components');
          if (!components) return;
          // Limpiar cualquier estado residual antes de crear el botón
          clearGlobalToggleState();
          // Evitar duplicados
          if (!components.querySelector('#global-toggle-thumb')) {
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
                  outer2.classList.add('lg-expanded');
                  // Esperar a que el DOM se actualice para recalcular la posición real de .lg-sub-html
                  requestAnimationFrame(() => {
                    if (subHtml && inner) {
                      const innerRect = inner.getBoundingClientRect();
                      const subHtmlRect = subHtml.getBoundingClientRect();
                      const availableHeight = subHtmlRect.top - innerRect.top;
                      if (availableHeight > 0) {
                        inner.style.height = availableHeight + 'px';
                        inner.style.maxHeight = availableHeight + 'px';
                        inner.style.overflow = 'hidden';
                      }
                    }
                  });
                } else {
                  outer2.classList.remove('lg-expanded');
                  // Restaurar altura original (auto) para que la imagen nunca sobresalga de .lg-sub-html
                  requestAnimationFrame(() => {
                    if (subHtml && inner) {
                      const innerRect = inner.getBoundingClientRect();
                      const subHtmlRect = subHtml.getBoundingClientRect();
                      const availableHeight = subHtmlRect.top - innerRect.top;
                      if (availableHeight > 0) {
                        inner.style.height = availableHeight + 'px';
                        inner.style.maxHeight = availableHeight + 'px';
                        inner.style.overflow = 'hidden';
                      } else {
                        inner.style.height = '';
                        inner.style.maxHeight = '';
                        inner.style.overflow = '';
                      }
                    }
                  });
                }
              });
            };
            // Asegurar que .lg-components tenga position: relative
            if (getComputedStyle(components).position === 'static') {
              components.style.position = 'relative';
            }
            components.appendChild(btn);
          }
        });
      }, 0);
    });
    galleryContainer.addEventListener('lgAfterClose', function() {
      // Eliminar todos los botones al cerrar cualquier galería
      document.querySelectorAll('#global-toggle-thumb').forEach(btn => btn.remove());
      clearGlobalToggleState();
    });
    // Llamar limpieza antes de abrir/cerrar para evitar estados residuales
    galleryContainer.addEventListener('lgBeforeOpen', function() { clearGlobalToggleState(); });
    galleryContainer.addEventListener('lgBeforeClose', function() { clearGlobalToggleState(); });
  }
}

// Limpia cualquier estado dejado por el botón global-toggle-thumb sin tocar
// las medidas originales: elimina clases y resetea estilos inline aplicados
// a los elementos `.lg-inner` y a los componentes auxiliares.
function clearGlobalToggleState() {
  try {
    document.querySelectorAll('.lg-outer').forEach(function(outer) {
      // Quitar la clase de estado expandido
      outer.classList.remove('lg-expanded');

      var components = outer.querySelector('.lg-components');
      if (!components) return;

      var subHtml = components.querySelector('.lg-sub-html');
      // Remover cualquier clase hide-lg-comp dentro de components (más robusto)
      components.querySelectorAll('.hide-lg-comp').forEach(function(el) {
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
    });
  } catch (err) {
    if (typeof console !== 'undefined' && console.warn) console.warn('clearGlobalToggleState error', err);
  }
}

// Escuchar cambios de pantalla completa para limpiar el estado si el usuario
// entra o sale del modo full-screen y evitar que quede registrado.
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(function(evt) {
  document.addEventListener(evt, function() {
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
