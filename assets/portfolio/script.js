// Variables globales
let inactivityTimer;
let expandedItem = null;
let isFullyExpanded = false;
// Selector y flag para deshabilitar temporalmente el item que abre marketplace
const marketplaceItemSelector = '.item:nth-child(6)';
let marketplaceItem = null;
let marketplaceDisabled = true; // cambiar a false para habilitar

// Función para contraer el panel expandido
function contractPanel() {
    if (expandedItem) {
        // Remover el contenido de gallery si existe
        const galleryContent = expandedItem.querySelector('.gallery-content');
        if (galleryContent) {
            galleryContent.style.opacity = '0';
            galleryContent.style.transition = 'opacity 0.2s ease-out';
            setTimeout(() => {
                galleryContent.remove();
            }, 200);
        }
            // Ocultar el texto .quote manualmente
            const quote = expandedItem.querySelector('.quote');
            if (quote) {
                quote.style.opacity = '0';
                quote.style.transform = 'translate(-50%, 50%)';
            }
        expandedItem.classList.remove('expanded');
        expandedItem.classList.remove('fully-expanded');
        expandedItem.classList.remove('clicked');
        isFullyExpanded = false;
        expandedItem = null;
    }
}

// Función para ocultar el dropholder al hacer clic en un item
function hideDropholderOnItemClick() {
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Si este item es el marketplace y está deshabilitado, ignorar
            // el click para que la barra de menú no se oculte.
            if (item === marketplaceItem && marketplaceDisabled) {
                e.stopPropagation();
                return;
            }
            if (isFullyExpanded && item.classList.contains('fully-expanded')) {
                const dropholder = document.querySelector('.dropholder');
                if (dropholder) {
                    dropholder.style.opacity = '0';
                    dropholder.style.pointerEvents = 'none';
                    setTimeout(() => {
                        dropholder.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
}

// Manejar interacción con los paneles
document.addEventListener('DOMContentLoaded', function() {
    // Resolver el elemento de marketplace tras cargar DOM
    marketplaceItem = document.querySelector(marketplaceItemSelector);

    // Si está deshabilitado desde el inicio, asegurar cursor apropiado
    if (marketplaceItem && marketplaceDisabled) {
        marketplaceItem.classList.add('disabled-marketplace');
        marketplaceItem.style.cursor = 'not-allowed';
    }
    // Inicializar la función para ocultar el dropholder
    hideDropholderOnItemClick();
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'flex-basis' && item.classList.contains('expanded')) {
                isFullyExpanded = true;
                item.classList.add('fully-expanded');
                    // Si este item es el marketplace y está deshabilitado,
                    // cambiar el cursor para indicar que está deshabilitado
                    if (item === marketplaceItem && marketplaceDisabled) {
                        item.classList.add('disabled-marketplace');
                        item.style.cursor = 'not-allowed';
                    } else {
                        // Asegurar cursor por defecto en otros casos
                        item.style.cursor = '';
                    }
                // Si está expandido y clickeado, cargar la gallery
                if (item.classList.contains('clicked')) {
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
                        galleryContainer.style.transition = 'opacity 0.3s ease-in';
                        
                        // Cargar la gallery usando iframe
                        const iframe = document.createElement('iframe');
                        // Determinar qué página cargar basado en el item
                        if (item === document.querySelector('.item:nth-child(1)')) {
                            iframe.src = '../logo_design/index.html';
                        } else if (item === document.querySelector('.item:nth-child(2)')) {
                            iframe.src = '../graphic_design/index.html';
                        } else if (item === document.querySelector('.item:nth-child(3)')) {
                            iframe.src = '../websites/index.html';
                        } else if (item === document.querySelector('.item:nth-child(4)')) {
                            iframe.src = '../social_media/index.html';
                        } else if (item === document.querySelector('.item:nth-child(5)')) {
                            iframe.src = '../hand-drawn/index.html';
                        } else if (item === document.querySelector('.item:nth-child(6)')) {
                            // Cambiado para cargar la página de marketplace
                            // Ruta relativa desde assets/portfolio -> assets/marketplace/index.html
                            iframe.src = '../marketplace/index.html';
                        }
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                        iframe.id = 'gallery-iframe';
                        
                        // Asegurarnos de que la animación se aplique después de que el iframe se cargue
                        iframe.onload = function() {
                            galleryContainer.style.opacity = '1';
                        };
                        galleryContainer.appendChild(iframe);
                        
                        // Crear área invisible para hover lateral izquierdo
                        const leftHoverArea = document.createElement('div');
                        leftHoverArea.id = 'left-hover-area';
                        leftHoverArea.style.position = 'absolute';
                        leftHoverArea.style.top = '0';
                        leftHoverArea.style.left = '0';
                        leftHoverArea.style.width = '10px';
                        leftHoverArea.style.height = '100%';
                        leftHoverArea.style.zIndex = '20';
                        leftHoverArea.style.background = 'transparent';
                        leftHoverArea.style.cursor = 'pointer';
                        leftHoverArea.addEventListener('mouseenter', function() {
                            if (expandedItem && expandedItem.classList.contains('clicked')) {
                                // Remover el contenido de gallery si existe
                                const galleryContent = expandedItem.querySelector('.gallery-content');
                                if (galleryContent) {
                                    galleryContent.style.opacity = '0';
                                    galleryContent.style.transition = 'opacity 0.2s ease-out';
                                    setTimeout(() => {
                                        galleryContent.remove();
                                    }, 200);
                                }
                                expandedItem.classList.remove('clicked');
                                contractPanel();
                            }
                        });
                        galleryContainer.appendChild(leftHoverArea);
                        item.appendChild(galleryContainer);
                    }
                }
            }
        });

        item.addEventListener('mouseenter', () => {
            if (expandedItem && expandedItem !== item) {
                // Remover el contenido de gallery si existe
                const galleryContent = expandedItem.querySelector('.gallery-content');
                if (galleryContent) {
                    galleryContent.style.opacity = '0';
                    galleryContent.style.transition = 'opacity 0.2s ease-out';
                    setTimeout(() => {
                        galleryContent.remove();
                    }, 200);
                }
                expandedItem.classList.remove('expanded');
                expandedItem.classList.remove('fully-expanded');
                expandedItem.classList.remove('clicked');
            }
            item.classList.add('expanded');
            expandedItem = item;
                // Limpiar estilos inline para que el CSS maneje la animación
                const quote = item.querySelector('.quote');
                if (quote) {
                    quote.style.opacity = '';
                    quote.style.transform = '';
                    quote.style.transition = '';
                }
            
            // Iniciar el timer cuando el mouse entra
            clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    if (!item.classList.contains('clicked')) {
                        // Ocultar el texto .quote manualmente
                        const quote = item.querySelector('.quote');
                        if (quote) {
                            quote.style.opacity = '0';
                            quote.style.transform = 'translate(-50%, 50%)';
                        }
                        contractPanel();
                    }
                }, 3000);
        });

        item.addEventListener('mousemove', () => {
            if (item === expandedItem && !item.classList.contains('clicked')) {
                // Reiniciar el timer al mover el mouse
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    if (!item.classList.contains('clicked')) {
                        contractPanel();
                    }
                }, 5000);
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('clicked')) {
                item.classList.remove('expanded');
                item.classList.remove('fully-expanded');
                isFullyExpanded = false;
                clearTimeout(inactivityTimer);
                expandedItem = null;
            }
        });

        // Manejar el click en el panel expandido
        item.addEventListener('click', (e) => {
            // Si es el marketplace y está deshabilitado, ignorar el click
            if (item === marketplaceItem && marketplaceDisabled) {
                e.preventDefault();
                e.stopPropagation();
                return; // No hacer nada
            }
            if (isFullyExpanded && item.classList.contains('fully-expanded')) {
                if (item.classList.contains('clicked')) {
                    // Si ya está clickeado, lo contraemos
                    item.classList.remove('clicked');
                    // Limpiar el contenido de gallery si existe
                    const galleryContent = item.querySelector('.gallery-content');
                    if (galleryContent) {
                        galleryContent.remove();
                    }
                    // Iniciamos el timer después de contraer
                    clearTimeout(inactivityTimer);
                    inactivityTimer = setTimeout(() => {
                        if (!item.classList.contains('clicked')) {
                            contractPanel();
                        }
                    }, 5000);
                } else {
                    // Solo marcar como clicked, la carga de gallery será en transitionend
                    item.classList.add('clicked');
                    clearTimeout(inactivityTimer);
                }
            }
        });
    });
});

// Funciones para habilitar/deshabilitar el marketplace desde fuera (temporal)
window.enableMarketplace = function() {
    marketplaceDisabled = false;
    if (!marketplaceItem) marketplaceItem = document.querySelector(marketplaceItemSelector);
    if (marketplaceItem) {
        marketplaceItem.classList.remove('disabled-marketplace');
        marketplaceItem.style.cursor = '';
    }
};

window.disableMarketplace = function() {
    marketplaceDisabled = true;
    if (!marketplaceItem) marketplaceItem = document.querySelector(marketplaceItemSelector);
    if (marketplaceItem) {
        marketplaceItem.classList.add('disabled-marketplace');
        marketplaceItem.style.cursor = 'not-allowed';
    }
};

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
    if (event.data && event.data.action === 'closeIframeFromGallery') {
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

// Detectar el cursor en el lado izquierdo y activar el dropholder
document.body.addEventListener('mousemove', function(e) {
    const dropholder = document.querySelector('.dropholder');
    if (e.clientX < 30 && window.location.pathname.includes('portfolio')) {
        if (dropholder) {
            dropholder.style.display = 'block';
            dropholder.style.opacity = '1';
            dropholder.style.pointerEvents = 'auto';
        }
    }
});