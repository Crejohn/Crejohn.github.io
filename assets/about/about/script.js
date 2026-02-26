$(document).ready(function(){
  // Inicializar funcionalidad de iconos
  initMenu();
  
  // Cerrar menús al hacer clic fuera
  $(document).click(function(e){
    if (!$(e.target).closest('.icon-container').length) {
      $(".menu").removeClass("showMenu");
    }
  });

  // Evento click para el icono home
  $("#homepic").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "../../../index.html";
  });
});

function initMenu() {
  // Manejar clic en iconos (excluyendo el icono home)
  $(".icon-container:not(#homepic)").click(function(e) {
    e.stopPropagation();
    var iconId = $(this).find(".ic").attr("id");
    var menu = $(this).find(".menu");
    
    // Alternar menú sin ocultar la página
    $(".menu").not(menu).removeClass("showMenu");
    menu.toggleClass("showMenu");
    
    // Resaltar icono
    switch(iconId) {
      case 'pic2': $(this).toggleClass('active-icon-2'); break;
      case 'pic3': $(this).toggleClass('active-icon-3'); break;
      case 'pic4': $(this).toggleClass('active-icon-4'); break;
    }
  });

  // Evento hover para todos los iconos
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

  // Evento hover específico para el icono home
  $("#homepic").hover(
    function() {
      currentHoveredIcon = $(this).attr('id');
      // Ocultar cualquier menú que esté desplegado
      $(".menu").removeClass("showMenu");
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
        case 'about-frame':
          url = 'index.html';
          break;
        case 'aboutme-frame':
          url = 'index.html';
          break;
        case 'timeline-frame':
          url = '../timeline/index.html';
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

    // Si es el icono home, ocultar cualquier menú desplegado
    if (iconId === 'homepic') {
      $(".menu").removeClass("showMenu");
    } else if ($(".menu.showMenu").length > 0) {
      // Si no es el icono home y hay un menú desplegado, mostrar el menú correspondiente
      const menu = $(icon).find(".menu");
      $(".menu").removeClass("showMenu");
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

document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad del botón de ángulo
    const angleDown = document.querySelector('.angle-down');
    const contentBox = document.querySelector('.content');
    const box = document.querySelector('.box');

    angleDown.addEventListener('click', function(e) {
        e.preventDefault();
        contentBox.classList.toggle('active');
        box.classList.toggle('active');
    });

    // Funcionalidad de los botones de scroll
    const buttons = document.querySelectorAll('#pagination button');
    const txtContent = document.querySelector('.txt');
    let currentSlide = 0;
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
        
        // Si es el segundo botón (índice 1), redirigir al proyecto de timeline
        if (slideIndex === 1) {
            window.location.href = '../timeline/index.html';
            return;
        }
        
        // Buscar los títulos que actúan como secciones
        const sections = document.querySelectorAll('.txt .titulo');
        
        if (sections[slideIndex]) {
            // Actualizar botones
            currentSlide = slideIndex;
            updateButtons();
            
            // Scroll suave al elemento usando scrollIntoView
            sections[slideIndex].scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
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

    // Manejo mejorado del evento wheel
    window.addEventListener('wheel', function(e) {
        if (contentBox.classList.contains('active')) {
            const rect = contentBox.getBoundingClientRect();
            const isOverContent = e.clientX >= rect.left && 
                                e.clientX <= rect.right && 
                                e.clientY >= rect.top && 
                                e.clientY <= rect.bottom;
            
            if (isOverContent) {
                e.stopPropagation();
                return;
            }
        }
        
        if (!contentBox.classList.contains('active')) {
            e.preventDefault();
            e.stopPropagation();
            scrollController.handleScroll(e.deltaY);
        }
    }, { passive: false });

    // Detectar scroll para actualizar botones
    let scrollTimeout;
    
    txtContent.addEventListener('scroll', () => {
        if (isAnimating) return;
        
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            // Solo actualizar los botones si el content NO está activo
            if (!contentBox.classList.contains('active')) {
                const sections = document.querySelectorAll('.txt .titulo');
                const scrollPosition = txtContent.scrollTop;
                const viewportHeight = txtContent.clientHeight;
                
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
                }
            }
        }, 100);
    });

    // Soporte para gestos táctiles
    let startY = 0;
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        // Solo manejar gestos táctiles si el contenedor .content NO está activo
        if (!contentBox.classList.contains('active')) {
            if (!e.changedTouches[0]) return;
            let endY = e.changedTouches[0].clientY;
            let diffY = startY - endY;
            
            if (Math.abs(diffY) > 50) { // Umbral mínimo para considerar como swipe
                scrollController.handleScroll(diffY);
            }
        }
    }, { passive: true });
    
    // Inicializar el estado de los botones
    updateButtons();
});