// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las imágenes de fondo
    const items = document.querySelectorAll('.item');
    let loadedImages = 0;
    let imagesLoaded = Array(items.length).fill(false);

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

    items.forEach((item, index) => {
        const imageUrl = item.getAttribute('data-image');
        if (imageUrl) {
            // Crear una nueva imagen para precargar
            const img = new Image();
            img.onload = function() {
                item.style.backgroundImage = `url(${imageUrl})`;
                // Aplicar el posicionamiento correcto según el índice del item
                if (index === 1) {
                    item.style.backgroundPosition = 'center 35%';
                } else if (index === 2) {
                    item.style.backgroundPosition = 'center 8%';
                }
                imagesLoaded[index] = true;
                loadedImages++;
                // Si todas las imágenes están cargadas, animar aparición
                if (loadedImages === items.length) {
                    // Primero los centrales
                    setTimeout(() => {
                        items[1].classList.add('slide-in');
                        items[2].classList.add('slide-in');
                    }, 100);
                    // Luego los laterales
                    setTimeout(() => {
                        items[0].classList.add('slide-in');
                        items[3].classList.add('slide-in');
                    }, 600);
                    // Inicializar el resto de la funcionalidad
                    setTimeout(() => {
                        initializeItems();
                    }, 800);
                }
            };
            img.src = imageUrl;
        }
    });

    // Configuración del menú flotante
    const homepic = document.getElementById('homepic');
    if (homepic) {
        homepic.addEventListener('click', function() {
            window.location.href = '../../index.html';
        });
    }

    // Inicialización del menú flotante
    const iconContainers = document.querySelectorAll('.icon-container');
    let activeMenu = null;

    iconContainers.forEach(container => {
        // Evento click para abrir/cerrar el menú
        container.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = this.querySelector('.menu');
            if (menu) {
                if (activeMenu && activeMenu !== menu) {
                    activeMenu.classList.remove('showMenu');
                }
                menu.classList.toggle('showMenu');
                activeMenu = menu.classList.contains('showMenu') ? menu : null;
            }
        });

        // Evento mouseenter para mantener el menú abierto al mover entre íconos
        container.addEventListener('mouseenter', function(e) {
            if (activeMenu) {
                const menu = this.querySelector('.menu');
                if (menu && menu !== activeMenu) {
                    activeMenu.classList.remove('showMenu');
                    menu.classList.add('showMenu');
                    activeMenu = menu;
                }
            }
        });
    });

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.icon-container')) {
            document.querySelectorAll('.menu').forEach(menu => {
                menu.classList.remove('showMenu');
            });
            activeMenu = null;
        }
    });

    // Manejo de submenús
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const frameId = this.getAttribute('data-frame');
            let url = '';

            switch (frameId) {
                case 'aboutme-frame':
                    url = '../about/about/index.html';
                    break;
                case 'timeline-frame':
                    url = '../about/timeline/index.html';
                    break;
                case 'portfolio-frame':
                    url = '../portfolio/index.html';
                    break;
                case 'logo-frame':
                    url = '../logo_design/index.html';
                    break;
                case 'graphic-frame':
                    url = '../graphic_design/index.html';
                    break;
                case 'photo-frame':
                    url = '../photo_editing/index.html';
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
                case 'contact-frame':
                    url = '../contact/contact form/index.html';
                    break;
                case 'website-frame':
                    url = '../websites/index.html';
                    break;
            }

            if (url) {
                window.location.href = url;
            }
        });
    });

    // Ensure loader is hidden after page load
    const loader = document.querySelector('.loader');
    window.addEventListener('load', function() {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    });
});

let expandedItem = null;

// Función para contraer el panel expandido
function contractPanel() {
    if (expandedItem) {
        expandedItem.classList.remove('expanded');
        expandedItem.classList.remove('fully-expanded');
        expandedItem.classList.remove('clicked');
        expandedItem = null;
    }
}

    // Función para inicializar la funcionalidad de los items
function initializeItems() {
    // Manejar interacción con los paneles
    document.querySelectorAll('.item').forEach(item => {
        // Agregar eventos de hover
        item.addEventListener('mouseenter', () => {
            if (expandedItem && expandedItem !== item) {
                expandedItem.classList.remove('expanded');
                expandedItem.classList.remove('fully-expanded');
                expandedItem.classList.remove('clicked');
                // Remover el área de hover del item anterior
                const existingHoverArea = expandedItem.querySelector('#left-hover-area');
                if (existingHoverArea) {
                    existingHoverArea.remove();
                }
            }
            item.classList.add('expanded');
            expandedItem = item;
            // Mostrar el texto .quote quitando estilos en línea
            const quote = item.querySelector('.quote');
            if (quote && !item.classList.contains('clicked')) {
                quote.style.removeProperty('opacity');
                quote.style.removeProperty('transform');
            }
                // Cambiar cursor a pointer al expandir
                item.style.cursor = 'pointer';
            // Iniciar temporizador para contraer después de 3 segundos de inactividad
            if (!item._contractTimeout) {
                item._contractTimeout = null;
            }
            if (item._contractTimeout) {
                clearTimeout(item._contractTimeout);
            }
            item._contractTimeout = setTimeout(() => {
                // Solo contraer si no está clickeado y el mouse sigue sobre el item
                if (!item.classList.contains('clicked')) {
                    item.classList.remove('expanded');
                    item.classList.remove('fully-expanded');
                    if (expandedItem === item) expandedItem = null;
                    // Ocultar el texto .quote con transición
                    const quote = item.querySelector('.quote');
                    if (quote) {
                        quote.style.opacity = '0';
                        quote.style.transform = 'translate(-50%, 50%)';
                    }
                        // Cambiar cursor a default al contraer
                        item.style.cursor = 'default';
                }
            }, 3000);
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('clicked')) {
                item.classList.remove('expanded');
                item.classList.remove('fully-expanded');
                expandedItem = null;
                    // Ocultar el texto .quote con transición
                    const quote = item.querySelector('.quote');
                    if (quote) {
                        quote.style.opacity = '0';
                        quote.style.transform = 'translate(-50%, 50%)';
                    }
                    // Cambiar cursor a default al contraer
                    item.style.cursor = 'default';
            }
                // Limpiar el temporizador si el mouse sale
                if (item._contractTimeout) {
                    clearTimeout(item._contractTimeout);
                    item._contractTimeout = null;
                }
        });
        // Manejar el click en el panel
        item.addEventListener('click', (e) => {
            if (expandedItem && expandedItem !== item) {
                expandedItem.classList.remove('expanded');
                expandedItem.classList.remove('fully-expanded');
                expandedItem.classList.remove('clicked');
                // Remover el área de hover del item anterior
                const existingHoverArea = expandedItem.querySelector('#left-hover-area');
                if (existingHoverArea) {
                    existingHoverArea.remove();
                    // Mostrar el texto .quote quitando estilos en línea
                    const quote = item.querySelector('.quote');
                    if (quote) {
                        quote.style.removeProperty('opacity');
                        quote.style.removeProperty('transform');
                    }
                }
            }
            
            if (item.classList.contains('clicked')) {
                // Mostrar el texto .quote con transición
                    const quote = item.querySelector('.quote');
                    if (quote && !item.classList.contains('clicked')) {
                        quote.style.removeProperty('opacity');
                        quote.style.removeProperty('transform');
                        // Forzar repaint para asegurar visibilidad
                        void quote.offsetWidth;
                    }
                // Si ya está expandido, lo contraemos
                item.classList.remove('expanded');
                item.classList.remove('fully-expanded');
                item.classList.remove('clicked');
                // Remover el área de hover
                const existingHoverArea = item.querySelector('#left-hover-area');
                if (existingHoverArea) {
                    existingHoverArea.remove();
                }
                expandedItem = null;
                    // Cambiar cursor a default al contraer
                    item.style.cursor = 'default';
            } else {
                // Expandir a pantalla completa de manera fluida
                item.classList.add('expanded');
                item.classList.add('clicked');
                expandedItem = item;
                    // Cambiar cursor a pointer al expandir por click
                    item.style.cursor = 'pointer';
            }
        });

        item.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'flex-basis' && item.classList.contains('expanded')) {
                item.classList.add('fully-expanded');
                // Si es el primer item y está clickeado, cargar la gallery
                if (item === document.querySelector('.item:nth-child(1)') && 
                    item.classList.contains('clicked')) {
                    // Evitar duplicados
                    if (!item.querySelector('.gallery-content')) {
                        const galleryContainer = document.createElement('div');
                        galleryContainer.className = 'gallery-content';
                        galleryContainer.style.position = 'absolute';
                        galleryContainer.style.top = '0';
                        galleryContainer.style.left = '0';
                        galleryContainer.style.width = '100%';
                        galleryContainer.style.height = '100%';
                        galleryContainer.style.zIndex = '10';
                        galleryContainer.style.opacity = '0';
                        galleryContainer.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)';
                        galleryContainer.style.background = '#111'; // Fondo oscuro mientras carga
                        
                        const iframe = document.createElement('iframe');
                        iframe.src = '../youtube_thumbnails/index.html';
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                        iframe.id = 'gallery-iframe';
                        
                        iframe.onload = function() {
                            galleryContainer.style.opacity = '1';
                        };
                        
                        galleryContainer.appendChild(iframe);
                        item.appendChild(galleryContainer);
                    }
                } else if (item === document.querySelector('.item:nth-child(2)') && 
                    item.classList.contains('clicked')) {
                    // Evitar duplicados
                    if (!item.querySelector('.gallery-content')) {
                        const galleryContainer = document.createElement('div');
                        galleryContainer.className = 'gallery-content';
                        galleryContainer.style.position = 'absolute';
                        galleryContainer.style.top = '0';
                        galleryContainer.style.left = '0';
                        galleryContainer.style.width = '100%';
                        galleryContainer.style.height = '100%';
                        galleryContainer.style.zIndex = '10';
                        galleryContainer.style.opacity = '0';
                        galleryContainer.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)';
                        galleryContainer.style.background = '#111'; // Fondo oscuro mientras carga
                        
                        const iframe = document.createElement('iframe');
                        iframe.src = '../flyer/index.html'; // Cambiado a flyer
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                        iframe.id = 'gallery-iframe';
                        
                        iframe.onload = function() {
                            galleryContainer.style.opacity = '1';
                        };
                        
                        galleryContainer.appendChild(iframe);
                        item.appendChild(galleryContainer);
                    }
                } else if (item === document.querySelector('.item:nth-child(3)') && 
                    item.classList.contains('clicked')) {
                    // Evitar duplicados
                    if (!item.querySelector('.gallery-content')) {
                        const galleryContainer = document.createElement('div');
                        galleryContainer.className = 'gallery-content';
                        galleryContainer.style.position = 'absolute';
                        galleryContainer.style.top = '0';
                        galleryContainer.style.left = '0';
                        galleryContainer.style.width = '100%';
                        galleryContainer.style.height = '100%';
                        galleryContainer.style.zIndex = '10';
                        galleryContainer.style.opacity = '0';
                        galleryContainer.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)';
                        galleryContainer.style.background = '#111'; // Fondo oscuro mientras carga
                        
                        const iframe = document.createElement('iframe');
                        iframe.src = '../photo_editing/index.html';
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                        iframe.id = 'gallery-iframe';
                        
                        iframe.onload = function() {
                            galleryContainer.style.opacity = '1';
                        };
                        
                        galleryContainer.appendChild(iframe);
                        item.appendChild(galleryContainer);
                    }
                } else if (item === document.querySelector('.item:nth-child(4)') && 
                    item.classList.contains('clicked')) {
                    // Evitar duplicados
                    if (!item.querySelector('.gallery-content')) {
                        const galleryContainer = document.createElement('div');
                        galleryContainer.className = 'gallery-content';
                        galleryContainer.style.position = 'absolute';
                        galleryContainer.style.top = '0';
                        galleryContainer.style.left = '0';
                        galleryContainer.style.width = '100%';
                        galleryContainer.style.height = '100%';
                        galleryContainer.style.zIndex = '10';
                        galleryContainer.style.opacity = '0';
                        galleryContainer.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)';
                        galleryContainer.style.background = '#111'; // Fondo oscuro mientras carga
                        
                        const iframe = document.createElement('iframe');
                        // Abrir design_extras en lugar de random_design
                        iframe.src = '../design_extras/index.html';
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                        iframe.id = 'gallery-iframe';
                        
                        iframe.onload = function() {
                            galleryContainer.style.opacity = '1';
                        };
                        
                        galleryContainer.appendChild(iframe);
                        item.appendChild(galleryContainer);
                    }
                }
            }
        });
    });
}

// Funcionalidad de scroll para los iconos
let currentHoveredIcon = null;
let isOverMenu = false;

function getNextIcon(currentId) {
  const iconIds = ['homepic', 'codepic', 'workpic', 'studypic'];
  const currentIndex = iconIds.indexOf(currentId);
  const nextIndex = (currentIndex + 1) % iconIds.length;
  return iconIds[nextIndex];
}

function getPreviousIcon(currentId) {
  const iconIds = ['homepic', 'codepic', 'workpic', 'studypic'];
  const currentIndex = iconIds.indexOf(currentId);
  const prevIndex = (currentIndex - 1 + iconIds.length) % iconIds.length;
  return iconIds[prevIndex];
}

function activateIcon(iconId) {
  const icon = document.getElementById(iconId);
  if (icon) {
    icon.classList.add('scroll-active');
    ['homepic', 'codepic', 'workpic', 'studypic'].forEach(id => {
      if (id !== iconId) {
        const otherIcon = document.getElementById(id);
        if (otherIcon) {
          otherIcon.classList.remove('scroll-active');
        }
      }
    });

    if ($(".menu.showMenu").length > 0) {
      $(".menu").removeClass("showMenu");
      const menu = $(icon).find(".menu");
      menu.addClass("showMenu");
    }
  }
}

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

// --- Comunicación con iframe gallery ---
// Detectar mouse en el borde izquierdo y avisar al iframe
function notifyGalleryIframeToClose() {
    const iframe = document.getElementById('gallery-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ action: 'closeGallery' }, '*');
    }
}
document.body.addEventListener('mousemove', function(e) {
    // Solo si el iframe está visible
    const iframe = document.getElementById('gallery-iframe');
    if (iframe && e.clientX < 30) {
        notifyGalleryIframeToClose();
    }
});
// Escuchar mensaje del iframe para cerrar el panel
window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'closeGallery') {
        // Si hay un item expandido y está clickeado, quitar la clase y eliminar el iframe
        if (expandedItem && expandedItem.classList.contains('clicked')) {
            expandedItem.classList.remove('clicked');
            const galleryContent = expandedItem.querySelector('.gallery-content');
            if (galleryContent) {
                galleryContent.remove();
            }
        }
        contractPanel(); // Contraer el panel inmediatamente
    }
});