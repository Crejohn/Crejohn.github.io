// Pausar videos al cambiar de slide
  document.getElementById('gallery-container').addEventListener('lgAfterSlide', function(e) {
    const outer = document.querySelector('.lg-outer');
    if (!outer) return;
    // Pausar todos los videos excepto el del slide activo
    const current = outer.querySelector('.lg-item.lg-current');
    outer.querySelectorAll('video').forEach(video => {
      if (!current || !current.contains(video)) {
        video.pause();
      }
    });
    // Ajustar comportamiento del toggle global de thumbs/expansión
    try {
      const toggled = outer.getAttribute('data-thumb-toggled');
      const hasVideo = current && (current.querySelector('video') || current.querySelector('.lg-video-cont') || current.querySelector('iframe'));
      if (toggled === '1' && hasVideo) {
        outer.classList.add('lg-expanded');
      } else {
        // Si la diapositiva no tiene video, no mantener tamaño expandido
        outer.classList.remove('lg-expanded');
      }
    } catch (err) {
      if (typeof console !== 'undefined' && console.warn) console.warn('toggle adjust error', err);
    }
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
  // Antes de inicializar, asegurar que cada <a> tenga un data-lg-size correcto
  // para que lightGallery calcule transiciones respetando la relación de aspecto
  // (evita estirados cuando las imágenes son verticales).
  try {
    const gallery = document.getElementById('gallery-container');
    if (gallery) {
      gallery.querySelectorAll('a').forEach(a => {
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
            // Fallback: si no hay <img> (por ejemplo video thumbs), precargar desde href
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
    if (typeof console !== 'undefined' && console.warn) console.warn('initGallery pre-size error', err);
  }

  lightGallery(document.getElementById('gallery-container'), {
    plugins: [lgThumbnail, lgZoom, lgFullscreen, lgShare, lgRotate, lgVideo],
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
      rotate: true
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
    
  // Crear pestaña Toggle thumbnails en .lg-components
  document.getElementById('gallery-container').addEventListener('lgAfterOpen', function() {
    const outer = document.querySelector('.lg-outer');
    if (!outer) return;
    const components = outer.querySelector('.lg-components');
    if (!components) return;
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
        const subHtml = components.querySelector('.lg-sub-html');
        let anyHidden = false;
        Array.from(components.children).forEach(child => {
          if (child !== subHtml && child !== btn) {
            child.classList.toggle('hide-lg-comp');
            if (child.classList.contains('hide-lg-comp')) {
              anyHidden = true;
            }
          }
        });
        // Guardar estado del toggle en el contenedor outer para poder
        // re-aplicarlo cuando cambie la slide si corresponde.
        if (anyHidden) {
          outer.setAttribute('data-thumb-toggled', '1');
        } else {
          outer.setAttribute('data-thumb-toggled', '0');
        }

        // Sólo aplicar la clase expandida cuando la slide actual contenga video
        const currentItem = outer.querySelector('.lg-item.lg-current');
        const hasVideoNow = currentItem && (currentItem.querySelector('video') || currentItem.querySelector('.lg-video-cont') || currentItem.querySelector('iframe'));
        if (anyHidden && hasVideoNow) {
          outer.classList.add('lg-expanded');
        } else {
          // Si no hay video en la slide actual, asegurar que no se aplique
          outer.classList.remove('lg-expanded');
        }
      };
      if (getComputedStyle(components).position === 'static') {
        components.style.position = 'relative';
      }
      components.appendChild(btn);
    }
    // Cuando se cierra la galería, limpiar estados para evitar que
    // queden clases persistentes y afecten aperturas futuras.
    document.getElementById('gallery-container').addEventListener('lgAfterClose', function() {
      const outer = document.querySelector('.lg-outer');
      if (!outer) return;
      outer.classList.remove('lg-expanded');
      outer.setAttribute('data-thumb-toggled', '0');
      // Asegurar que los componentes no queden ocultos accidentalmente
      const components = outer.querySelector('.lg-components');
      if (components) {
        Array.from(components.children).forEach(child => {
          child.classList.remove('hide-lg-comp');
        });
      }
    });
  });
}

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

function getScrollbarWidth() {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.msOverflowStyle = 'scrollbar';
  document.body.appendChild(outer);
  const inner = document.createElement('div');
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return scrollbarWidth;
}

function updateBackButtonPosition() {
  const container = document.getElementById('gallery-container');
  const backButton = document.getElementById('backButton');
  if (container && backButton) {
    const containerRect = container.getBoundingClientRect();
    const buttonWidth = backButton.offsetWidth;
    const scrollbarWidth = getScrollbarWidth();
    let rightOffset = window.innerWidth - containerRect.right;
    if (rightOffset < scrollbarWidth) {
      rightOffset = scrollbarWidth;
    }
    const maxRight = containerRect.width - buttonWidth;
    if (rightOffset > maxRight) {
      rightOffset = maxRight > scrollbarWidth ? maxRight : scrollbarWidth;
    }
    backButton.style.right = rightOffset + 'px';
  }
}
window.addEventListener('resize', updateBackButtonPosition);
window.addEventListener('scroll', updateBackButtonPosition);
document.addEventListener('DOMContentLoaded', function() {
  updateBackButtonPosition();
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', function() {
      if (window.self === window.top) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '../social_media/index.html';
        }
      } else {
        window.parent.postMessage({ action: 'closeGallery' }, '*');
      }
    });
  }
});
