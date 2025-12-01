// Inicializar las imágenes de fondo
/*
 Responsive adjustments added: adjustMenuItemWidths now honors breakpoints.
 Breakpoints used (px):
  - 2xl: >=1536
  - xl: >=1280
  - lg: >=1024 (desktop/laptop - distribute items by container width)
  - md: >=768  (tablet - fixed small item width)
  - sm: >=640  (small tablet)
  - <640: compact mobile widths
 This preserves existing behavior (indicator, scrollIntoView) while preventing
 the timeline menu from wrapping or breaking layout on small screens.
*/
document.querySelectorAll('.item').forEach(item => {
    const imageUrl = item.getAttribute('data-image');
    if (imageUrl) {
        item.style.backgroundImage = `url(${imageUrl})`;
    }
});

let expandedItem = null;
let isFullyExpanded = false;
let activeMenuIndex = null;
let keepIndicatorActive = false; // Variable para controlar si mantener el indicador activo
let inactivityTimer = null; // temporizador para inactividad (hover leave)
let clickCount = 0; // Variable para contar los clics
let clickTimer = null; // Variable para el temporizador de clics

// Función para contraer el panel expandido
function contractPanel() {
    if (expandedItem) {
        expandedItem.classList.remove('expanded');
        expandedItem.classList.remove('fully-expanded');
        expandedItem.classList.remove('clicked');
        expandedItem.classList.remove('extra-expanded');
        isFullyExpanded = false;
        expandedItem = null;
        clickCount = 0;
        
        // Desactivar el ítem del menú solo si no queremos mantener el indicador activo
        if (!keepIndicatorActive && activeMenuIndex !== null) {
            const activeItem = document.querySelector(`.timeline-menu ul li[data-index="${activeMenuIndex}"]`);
            if (activeItem) {
                activeItem.classList.remove('active');
            }
            activeMenuIndex = null;
        }
    }
}

// Función para actualizar el indicador del menú
function updateIndicator(index) {
    const indicator = document.querySelector('.timeline-menu .indicator');
    const menuItem = document.querySelector(`.timeline-menu ul li[data-index="${index}"]`);
    
    if (indicator && menuItem) {
        // Cache los resultados de getBoundingClientRect
        const menuRect = document.querySelector('.timeline-menu').getBoundingClientRect();
        const menuItemRect = menuItem.getBoundingClientRect();
        const indicatorWidth = indicator.offsetWidth;
        
        // Calcular todas las posiciones de una vez
        const centerPosition = menuItemRect.left - menuRect.left + (menuItemRect.width / 2) - (indicatorWidth / 2);
        
        // Asegurar que el indicador esté visible y actualizar su posición en el mismo frame
        requestAnimationFrame(() => {
            indicator.classList.add('visible');
            indicator.style.transform = `translateX(${centerPosition}px)`;
        });
    }
}

// Función para activar un ítem del menú
function activateMenuItem(index) {
    // Cache las referencias DOM
    const previousItem = activeMenuIndex !== null ? document.querySelector(`.timeline-menu ul li[data-index="${activeMenuIndex}"]`) : null;
    const menuItem = document.querySelector(`.timeline-menu ul li[data-index="${index}"]`);
    const menuContainer = document.querySelector('.timeline-menu');
    
    if (previousItem) {
        previousItem.classList.remove('active');
    }
    
    if (menuItem && menuContainer) {
        // Agrupar las operaciones de lectura
        const menuRect = menuContainer.getBoundingClientRect();
        const itemRect = menuItem.getBoundingClientRect();
        const isOutOfView = itemRect.left < menuRect.left || itemRect.right > menuRect.right;
        
        // Agrupar las operaciones de escritura
        requestAnimationFrame(() => {
            menuItem.classList.add('active');
            activeMenuIndex = index;
            
            if (isOutOfView) {
                menuItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
            
            updateIndicator(index);
        });
    }
}

// Función optimizada para mantener el indicador activo
function toggleItemExpansion(item) {
    const itemIndex = parseInt(item.getAttribute('data-index'));
    
    // Limpiar cualquier temporizador existente
    if (clickTimer) {
        clearTimeout(clickTimer);
    }
    
    // Si el elemento ya está expandido, lo contraemos
    if (item.classList.contains('expanded')) {
        // Activar la bandera para mantener el indicador activo
        keepIndicatorActive = true;
        
        // Incrementar el contador de clics
        clickCount++;
        
        // Si es el segundo clic, expandir un 10% más
        if (clickCount === 2) {
            item.classList.add('extra-expanded');
            
            // Configurar un temporizador para contraer después de un tiempo
            // Mantener el mismo timeout que en el primer click (60s) para consistencia
            clickTimer = setTimeout(() => {
                if (expandedItem === item) {
                    contractPanel();
                }
            }, 60000); // 60 segundos
        } 
        // Si es el tercer clic, contraer completamente
        else if (clickCount >= 3) {
            item.classList.remove('expanded');
            item.classList.remove('fully-expanded');
            item.classList.remove('clicked');
            item.classList.remove('extra-expanded');
            expandedItem = null;
            isFullyExpanded = false;
            clickCount = 0;
        }
    } else {
        // Desactivar la bandera para comportamiento normal
        keepIndicatorActive = false;
        
        // Reiniciar el contador de clics
        clickCount = 1;
        
        // Contraer cualquier panel expandido antes de expandir el nuevo
        if (expandedItem && expandedItem !== item) {
            expandedItem.classList.remove('expanded');
            expandedItem.classList.remove('fully-expanded');
            expandedItem.classList.remove('clicked');
            expandedItem.classList.remove('extra-expanded');
        }
        
        // Expandir el panel actual
        item.classList.add('expanded');
        expandedItem = item;
        
        // Activar el ítem del menú correspondiente
        activateMenuItem(itemIndex);
        
        // Configurar un temporizador para contraer después de un tiempo
        clickTimer = setTimeout(() => {
            if (expandedItem === item) {
                // Mantener el indicador activo al contraer después del primer clic
                keepIndicatorActive = true;
                contractPanel();
            }
        }, 60000); // 60 segundos
    }
}

// Manejar interacción con los paneles
document.querySelectorAll('.item').forEach((item, index) => {
    // Añadir índice al ítem si no lo tiene
    if (!item.hasAttribute('data-index')) {
        item.setAttribute('data-index', index);
    }
    
    item.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'flex-basis' && item.classList.contains('expanded')) {
            isFullyExpanded = true;
            item.classList.add('fully-expanded');
            
            // Actualizar el indicador después de la transición
            const itemIndex = parseInt(item.getAttribute('data-index'));
            updateIndicator(itemIndex);
        }
    });

    // Manejar el click en el panel
    item.addEventListener('click', (e) => {
        toggleItemExpansion(item);
    });
    
    // Manejar el hover en el panel
    item.addEventListener('mouseenter', () => {
        // Limpiar cualquier temporizador existente
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        // Sincronizar con el icono del menú: marcar el <li> correspondiente
        const menuLi = document.querySelector(`.timeline-menu ul li[data-index="${index}"]`);
        if (menuLi) {
            menuLi.classList.add('hovered-by-item');
        }
    });
    
    item.addEventListener('mouseleave', () => {
        // Configurar un temporizador para contraer después de un tiempo de inactividad
        if (expandedItem === item) {
            inactivityTimer = setTimeout(() => {
                // Mantener el indicador activo al contraer después del primer clic
                keepIndicatorActive = true;
                contractPanel();
            }, 60000); // 60 segundos
        }
        // Remover la clase de hover sincronizada en el menú
        const menuLi = document.querySelector(`.timeline-menu ul li[data-index="${index}"]`);
        if (menuLi) {
            menuLi.classList.remove('hovered-by-item');
        }
    });
});

// Manejar interacción con los ítems del menú
// Sincroniza el click en el icono con el item correspondiente

document.querySelectorAll('.timeline-menu ul li').forEach((menuItem) => {
    menuItem.style.cursor = 'pointer';
    const index = parseInt(menuItem.getAttribute('data-index'));
    // Click en <li>
    menuItem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('.timeline-menu ul li').forEach(li => li.classList.remove('active'));
        menuItem.classList.add('active');
        const item = document.querySelector(`.item[data-index="${index}"]`);
        if (item) {
            toggleItemExpansion(item);
        }
    });
    // Click en <a> o <span class="icon">
    const link = menuItem.querySelector('a');
    if (link) {
        link.style.cursor = 'pointer';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('.timeline-menu ul li').forEach(li => li.classList.remove('active'));
            menuItem.classList.add('active');
            const item = document.querySelector(`.item[data-index="${index}"]`);
            if (item) {
                toggleItemExpansion(item);
            }
        });
        const icon = link.querySelector('.icon');
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.querySelectorAll('.timeline-menu ul li').forEach(li => li.classList.remove('active'));
                menuItem.classList.add('active');
                const item = document.querySelector(`.item[data-index="${index}"]`);
                if (item) {
                    toggleItemExpansion(item);
                }
            });
        }
    }
    // Hover visual: sincronizar con el item correspondiente
    menuItem.addEventListener('mouseenter', () => {
        menuItem.classList.add('hovered');
        const item = document.querySelector(`.item[data-index="${index}"]`);
        if (item) {
            item.classList.add('hovered-by-menu');
        }
    });
    menuItem.addEventListener('mouseleave', () => {
        menuItem.classList.remove('hovered');
        const item = document.querySelector(`.item[data-index="${index}"]`);
        if (item) {
            item.classList.remove('hovered-by-menu');
        }
    });
});

// Ajustar el ancho de los ítems del menú para que coincidan con los ítems de la galería
function adjustMenuItemWidths() {
    const container = document.getElementById('quotes-container');
    const menuItems = document.querySelectorAll('.timeline-menu ul li');
    
    if (menuItems.length === 0) return;

    // Keep menu sizing independent from the gallery items so icons never shift
    const menu = document.querySelector('.timeline-menu');
    const ul = document.querySelector('.timeline-menu ul');
    const menuRect = menu.getBoundingClientRect();
    const itemCount = menuItems.length;

    // Compute a fixed width per menu item based on the visible menu width
    const itemWidth = Math.max(56, Math.floor(menuRect.width / itemCount));

    // Ensure UL fills the menu and does not translate based on gallery
    if (ul) {
        ul.style.width = '100%';
        ul.style.transform = 'none';
        ul.style.transition = '';
    }

    // Assign fixed width to each li so they don't move when gallery items expand
    menuItems.forEach((menuItem) => {
        menuItem.style.flex = `0 0 ${itemWidth}px`;
        menuItem.style.minWidth = `${itemWidth}px`;
        menuItem.style.boxSizing = 'border-box';
        menuItem.style.margin = '0';
        menuItem.style.padding = '0';
    });

    // Update indicator after widths set
    if (activeMenuIndex !== null) {
        requestAnimationFrame(() => updateIndicator(activeMenuIndex));
    }
    }

// Observar cambios en los ítems de la galería para ajustar los ítems del menú
// Usar un debounce para evitar múltiples actualizaciones rápidas
let resizeTimeout;
const resizeObserver = new ResizeObserver(entries => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        adjustMenuItemWidths();
    }, 100);
});

// Observar todos los ítems de la galería
document.querySelectorAll('.item').forEach(item => {
    resizeObserver.observe(item);
});

// Posicionar el indicador directamente en el centro antes de que la página sea visible
document.addEventListener('DOMContentLoaded', () => {
    // No inicializar si estamos en sm (<=640px) ya que el proyecto debe estar oculto
    if (window.innerWidth <= 640) return;

    // Asegurarse de que el indicador esté oculto inicialmente (ya está en CSS)
    const indicator = document.querySelector('.timeline-menu .indicator');
    if (indicator) {
        // Desactivar transiciones temporalmente para evitar la animación inicial
        indicator.classList.remove('visible');
        indicator.style.transition = 'none';

        // Posicionar el indicador en el centro inicialmente sin animación
        const menuRect = document.querySelector('.timeline-menu').getBoundingClientRect();
        const centerPosition = (menuRect.width / 2) - (indicator.offsetWidth / 2);
        indicator.style.transform = `translateX(${centerPosition}px)`;

        // Forzar reflow para asegurar la posición antes de restaurar la transición más tarde
        // (no la restauramos aquí para que el siguiente código de `load` pueda decidir cuándo hacerlo)
        void indicator.offsetHeight;
    }
});

// Ajustar los anchos inicialmente e inicializar el indicador
window.addEventListener('load', () => {
    // No inicializar en pantallas sm donde el proyecto está oculto
    if (window.innerWidth <= 640) return;

    adjustMenuItemWidths();
    
    // Inicializar el indicador con el ítem central
    const items = document.querySelectorAll('.item');
    if (items.length > 0) {
        const centerIndex = Math.floor(items.length / 2);
        // Restaurar la transición del indicador antes/después de activar el ítem
        const indicator = document.querySelector('.timeline-menu .indicator');
        if (indicator) {
            // Mantener la transición desactivada hasta que activemos el item
            // para evitar que la posición inicial se anime desde la izquierda.
            // Luego restauramos la transición en el siguiente frame.
            activateMenuItem(centerIndex);
            requestAnimationFrame(() => {
                // Restaurar la transición CSS (vaciar inline para respetar la hoja de estilos)
                indicator.style.transition = '';
            });
        } else {
            activateMenuItem(centerIndex);
        }
    }
});

// Actualizar al redimensionar
window.addEventListener('resize', () => {
    // Evitar ajustes si el proyecto está oculto en sm
    if (window.innerWidth <= 640) return;

    adjustMenuItemWidths();
    
    // Actualizar la posición del indicador al redimensionar
    if (activeMenuIndex !== null) {
        updateIndicator(activeMenuIndex);
    }
});

// Funcionalidad de los botones de scroll
const buttons = document.querySelectorAll('#pagination button');
let currentSlide = 1; // Inicializar en 1 para que el segundo botón esté activo por defecto
let isAnimating = false;
let lastScrollTime = 0;
const scrollDelay = 800; // Delay entre scrolls

// Función para actualizar el estado de los botones
function updateButtons() {
    buttons.forEach((button, index) => {
        if (index === currentSlide) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Función para hacer scroll a una sección
function scrollToSlide(slideIndex) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Si es el primer botón (índice 0), redirigir al proyecto de about
    if (slideIndex === 0) {
        window.location.href = '../about/index.html';
        return;
    }
    
    // Buscar los elementos que actúan como secciones
    const sections = document.querySelectorAll('.item');
    
    if (sections[slideIndex]) {
        // Actualizar botones
        currentSlide = slideIndex;
        updateButtons();
        
        // Scroll suave al elemento
        window.scrollTo({
            top: sections[slideIndex].offsetTop,
            behavior: 'smooth'
        });
        
        // Permitir que el scroll termine antes de permitir otro scroll
        setTimeout(() => {
            isAnimating = false;
        }, scrollDelay);
    } else {
        isAnimating = false;
    }
}

// Controlador central de scroll
const scrollController = {
    handleScroll: function(deltaY) {
        const now = Date.now();
        if (now - lastScrollTime < scrollDelay || isAnimating) return;
        
        lastScrollTime = now;
        
        if (deltaY > 0) {
            // Scroll hacia abajo
            let nextSlide = Math.min(currentSlide + 1, buttons.length - 1);
            scrollToSlide(nextSlide);
        } else if (deltaY < 0) {
            // Scroll hacia arriba
            let prevSlide = Math.max(currentSlide - 1, 0);
            scrollToSlide(prevSlide);
        }
    }
};

// Eventos de click en botones
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        scrollToSlide(index);
    });
});

// Detectar scroll para actualizar botones
let scrollTimeout;

window.addEventListener('scroll', () => {
    if (isAnimating) return;
    
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('.item');
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Encontrar la sección actual basada en la posición del scroll
        let currentSectionIndex = -1;
        let closestSection = -1;
        let closestDistance = Infinity;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Calcular la distancia desde el centro de la vista al centro de la sección
            const sectionCenter = sectionTop + (sectionHeight / 2);
            const viewportCenter = scrollPosition + (viewportHeight / 2);
            const distance = Math.abs(sectionCenter - viewportCenter);
            
            // Actualizar la sección más cercana
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = index;
            }
            
            // Verificar si la sección está visible en la vista
            if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionTop + sectionHeight - 50) {
                currentSectionIndex = index;
            }
        });
        
        // Si no se encontró una sección visible, usar la más cercana
        if (currentSectionIndex === -1 && closestSection !== -1) {
            currentSectionIndex = closestSection;
        }
        
        // Actualizar el botón activo si se encontró una sección
        if (currentSectionIndex !== -1 && currentSectionIndex !== currentSlide) {
            currentSlide = currentSectionIndex;
            updateButtons();
            
            // Si la sección actual es la primera (índice 0), redirigir al proyecto de about
            if (currentSectionIndex === 0) {
                window.location.href = '../about/index.html';
            }
        }
    }, 50);
});

// Agregar el evento wheel para el controlador de scroll
window.addEventListener('wheel', function(e) {
    e.preventDefault();
    scrollController.handleScroll(e.deltaY);
}, { passive: false });

// Soporte para gestos táctiles
let startY = 0;
document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    if (!e.changedTouches[0]) return;
    let endY = e.changedTouches[0].clientY;
    let diffY = startY - endY;
    
    if (diffY > 50) {
        let nextSlide = Math.min(currentSlide + 1, buttons.length - 1);
        scrollToSlide(nextSlide);
    } else if (diffY < -50) {
        let prevSlide = Math.max(currentSlide - 1, 0);
        scrollToSlide(prevSlide);
    }
}, { passive: true });

// Inicializar el estado de los botones
updateButtons();

document.addEventListener('DOMContentLoaded', function() {
});

$(document).ready(function(){
  // Inicializar funcionalidad de iconos
  initMenu();
  
  // Cerrar menús al hacer clic fuera
  $(document).click(function(e){
    if (!$(e.target).closest('.icon-container').length) {
      $(".menu").removeClass("showMenu");
    }
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
      // Definir rutas específicas para este proyecto
      let url = '';
      switch(frameId) {
        case 'portfolio-frame':
          url = '../../portfolio/index.html';
          break;
        case 'aboutme-frame':
          url = '../about/index.html';
          break;
        case 'timeline-frame':
          url = 'index.html';
          break;
        case 'contact-frame':
          url = '../../contact/contact form/index.html';
          break;
      }
      
      if (url) {
        window.location.href = url;
      }
    }
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