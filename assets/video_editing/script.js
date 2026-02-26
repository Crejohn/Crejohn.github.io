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
  });
// Eliminada funcionalidad de Back Button
// Variables globales
if (typeof currentHoveredIcon === 'undefined') {
  var currentHoveredIcon = null;
}
if (typeof isOverMenu === 'undefined') {
  var isOverMenu = false;
}

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
  lightGallery(document.getElementById('gallery-container'), {
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
    
  // Crear pestaña Toggle thumbnails en .lg-components
  document.getElementById('gallery-container').addEventListener('lgAfterOpen', function() {
    const outer = document.querySelector('.lg-outer');
    if (!outer) return;
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
        if (anyHidden) {
          outer.classList.add('lg-expanded');
        } else {
          outer.classList.remove('lg-expanded');
        }
      };
      if (getComputedStyle(components).position === 'static') {
        components.style.position = 'relative';
      }
      components.appendChild(btn);
    }
  });
  // Llamar limpieza antes de abrir/cerrar para evitar estados residuales
  document.getElementById('gallery-container').addEventListener('lgBeforeOpen', function() { clearGlobalToggleState(); });
  document.getElementById('gallery-container').addEventListener('lgBeforeClose', function() { clearGlobalToggleState(); });

  // Intentar limpiar también al cerrar la galería: buscar listener lgAfterClose
  document.getElementById('gallery-container').addEventListener('lgAfterClose', function() {
    document.querySelectorAll('#global-toggle-thumb').forEach(function(btn) { btn.remove(); });
    clearGlobalToggleState();
  });
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
