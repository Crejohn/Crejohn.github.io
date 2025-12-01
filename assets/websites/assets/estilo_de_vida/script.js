let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Función para reiniciar animaciones
function resetAnimations() {
    slides.forEach(slide => {
        const text = slide.querySelector('.slide-text');
        const title = slide.querySelector('.slide-title');
        const subtitle = slide.querySelector('.slide-subtitle');
        
        if (text && title && subtitle) {
            // Eliminar clases de animación
            text.style.animation = 'none';
            title.style.animation = 'none';
            subtitle.style.animation = 'none';
            
            // Forzar reflow
            void text.offsetWidth;
            void title.offsetWidth;
            void subtitle.offsetWidth;
            
            // Resetear estilos
            text.style.opacity = '0';
            text.style.transform = 'translateY(40px)';
            text.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)';
            
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
    });
}

// Función para mostrar slide
function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Reiniciar animaciones
    resetAnimations();
    
    // Remover clase active de todos los slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Agregar clase active al slide actual
    slides[currentSlide].classList.add('active');
    
    // Activar animaciones para el slide activo
    const activeSlide = slides[currentSlide];
    const text = activeSlide.querySelector('.slide-text');
    const title = activeSlide.querySelector('.slide-title');
    const subtitle = activeSlide.querySelector('.slide-subtitle');
    
    if (text && title && subtitle) {
        // Aplicar animaciones con delays
        text.style.animation = 'fadeUp 0.8s ease forwards 0.3s';
        title.style.animation = 'textFadeUp 0.8s ease forwards 0.5s';
        subtitle.style.animation = 'textFadeUp 0.8s ease forwards 0.7s';
    }
}

// Función para mover slide
function moveSlide(direction) {
    clearInterval(slideInterval);
    showSlide(currentSlide + direction);
    startSlider();
}

// Función para iniciar slider automático
function startSlider() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Función para manejar submenús
function setupSubmenus() {
    const submenuTriggers = document.querySelectorAll('.submenu-trigger');
    
    submenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            const isActive = submenu.classList.contains('active');
            
            // Cerrar todos los submenús primero
            document.querySelectorAll('.submenu').forEach(menu => {
                if (menu !== submenu) {
                    menu.classList.remove('active');
                }
            });
            
            // Abrir el submenu actual si no estaba activo
            if (!isActive) {
                submenu.classList.add('active');
            } else {
                submenu.classList.remove('active');
            }
        });
    });
    
    // Cerrar submenús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.submenu-trigger') && !e.target.closest('.submenu')) {
            document.querySelectorAll('.submenu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
}

// Ajustar altura del slider
function adjustSliderHeight() {
    const headerHeight = document.querySelector('header').offsetHeight;
    const menuHeight = document.querySelector('.menu').offsetHeight;
    const footerHeight = document.querySelector('footer').offsetHeight;
    const windowHeight = window.innerHeight;
    
    const sliderHeight = windowHeight - headerHeight - menuHeight - footerHeight;
    document.querySelector('.slider-container').style.height = `${sliderHeight}px`;
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.height = `${sliderHeight}px`;
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Ajustar altura del slider
    adjustSliderHeight();
    window.addEventListener('resize', adjustSliderHeight);
    
    // Configurar eventos de los botones del slider
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    prevBtn.addEventListener('click', () => moveSlide(-1));
    nextBtn.addEventListener('click', () => moveSlide(1));
    
    // Iniciar slider
    showSlide(0);
    startSlider();
    
    // Configurar submenús
    setupSubmenus();
    
    // Pausar slider al pasar el ratón
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        startSlider();
    });
    

});

    // Funciones para el botón de retroceso
    function getScrollbarWidth() {
        const div = document.createElement('div');
        div.style.visibility = 'hidden';
        div.style.overflow = 'scroll';
        div.style.msOverflowStyle = 'scrollbar';
        div.style.width = '100px';
        div.style.height = '100px';
        document.body.appendChild(div);
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '100%';
        div.appendChild(inner);
        const scrollbarWidth = div.offsetWidth - inner.offsetWidth;
        div.parentNode.removeChild(div);
        return scrollbarWidth;
    }
    function updateBackButtonPosition() {
        const slide = document.querySelector('.slider-container .slide');
        const backButton = document.getElementById('backButton');
        if (slide && backButton) {
            const slideRect = slide.getBoundingClientRect();
            // Calcula la distancia desde el borde derecho del viewport al borde derecho del slide, ignorando el scroll vertical
            const rightOffset = Math.max(document.documentElement.clientWidth - slideRect.right, 0);
            backButton.style.right = rightOffset + 'px';
            backButton.style.position = 'fixed';
        }
    }
    window.addEventListener('resize', updateBackButtonPosition);
    window.addEventListener('scroll', updateBackButtonPosition);
    document.addEventListener('DOMContentLoaded', function() {
        updateBackButtonPosition();
        const backButton = document.getElementById('backButton');
        if (backButton) {
                backButton.addEventListener('click', function() {
                    window.location.href = '../../index.html';
                });
        }
    });