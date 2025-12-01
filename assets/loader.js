// Función para inicializar el loader
function initLoader() {
  const body = document.body;
  const loader = document.querySelector('.loader');
  
  // Agregar clase loading al body
  body.classList.add('loading');
  
  // Función para ocultar el loader
  function hideLoader() {
    body.classList.remove('loading');
    body.classList.add('loaded');
  }
  
  // Ocultar loader cuando la página termine de cargar
  window.addEventListener('load', hideLoader);
  
  // Ocultar loader cuando todas las imágenes estén cargadas
  if (typeof imagesLoaded !== 'undefined') {
    imagesLoaded(document.querySelectorAll('img'), hideLoader);
  }
  
  // Ocultar loader cuando todos los videos estén cargados
  const videos = document.querySelectorAll('video');
  let videosLoaded = 0;
  
  videos.forEach(video => {
    video.addEventListener('loadeddata', () => {
      videosLoaded++;
      if (videosLoaded === videos.length) {
        hideLoader();
      }
    });
  });
  
  // Ocultar loader cuando todos los iframes estén cargados
  const iframes = document.querySelectorAll('iframe');
  let iframesLoaded = 0;
  
  iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
      iframesLoaded++;
      if (iframesLoaded === iframes.length) {
        hideLoader();
      }
    });
  });
}

// Inicializar el loader cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initLoader);

// Función para manejar la carga de iframes
function handleIframeLoad(iframe) {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
  }
  
  iframe.addEventListener('load', () => {
    if (loader) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }
  });
}

// Exportar la función para que pueda ser usada desde otras páginas
window.handleIframeLoad = handleIframeLoad; 