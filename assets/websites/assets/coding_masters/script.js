document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = '../../index.html';
        });
    }
});
// Ejecutar el ajuste de posición también en window.onload para asegurar el layout final
window.onload = function() {
    updateBackButtonPosition();
};
// Función para ajustar la altura de la sección estática
function adjustStaticSectionHeight() {
    const headerHeight = document.querySelector('header').offsetHeight;
    const footerHeight = document.querySelector('footer').offsetHeight;
    const windowHeight = window.innerHeight;
    
    const staticSection = document.querySelector('.static-section');
    if (staticSection) {
        staticSection.style.height = `${windowHeight - headerHeight}px`;
    }
}

// Función para el menú hamburguesa
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animación del icono hamburguesa a X
        hamburger.classList.toggle('active');
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    adjustStaticSectionHeight();
    setupHamburgerMenu();
    window.addEventListener('resize', adjustStaticSectionHeight);
    

});

// --- Back Button Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = '../../index.html';
        });
    }
});
// ...existing code...

