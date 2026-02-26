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
// Script para el formulario de contacto y slider
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Menu interactividad
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, idx) => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Formulario contacto
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            formMessage.textContent = '¡Gracias por contactarnos! Te responderemos pronto.';
            form.reset();
        });
    }
    
    // Slider functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;
    
    // Initialize slider
    function initSlider() {
        if (slides.length === 0) return;
        
        showSlide(currentSlide);
        startSlideShow();
    }
    
    // Show specific slide
    function showSlide(index) {
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Start automatic slideshow
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Stop automatic slideshow
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // Event listeners for controls
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });
        
        prevBtn.addEventListener('click', () => {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });
    
    // Initialize the slider
    initSlider();
    
    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopSlideShow);
        slider.addEventListener('mouseleave', startSlideShow);
    }
    

});

