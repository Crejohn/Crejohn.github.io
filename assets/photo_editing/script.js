// Botón Back: funcionalidad igual que en flyer
document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    // Ajustar posición respecto a la barra deslizadora
    function adjustButtonPosition() {
      const galleryContainer = document.querySelector('.main .container');
      if (galleryContainer && backButton) {
        const hasScrollbar = galleryContainer.scrollHeight > galleryContainer.clientHeight;
        if (hasScrollbar) {
          backButton.style.right = '15px';
        } else {
          backButton.style.right = '0px';
        }
      }
    }
    adjustButtonPosition();
    window.addEventListener('resize', adjustButtonPosition);
    const observer = new MutationObserver(adjustButtonPosition);
    observer.observe(document.body, { childList: true, subtree: true });
    backButton.addEventListener('click', function() {
      if (window.self === window.top) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '../graphic_design/index.html';
        }
      } else {
        window.parent.postMessage({ action: 'closeGallery' }, '*');
      }
    });
  }
});
// Fancybox Configuration
$('[data-fancybox="gallery"]').fancybox({
  buttons: [
    "slideShow",
    "thumbs",
    "zoom",
    "fullScreen",
    "share",
    "close"
  ],
  loop: false,
  protect: true,
  clickOutside: false, // Desactiva el cierre por click fuera del modal
  clickContent: false, // Desactiva acción por click sobre el contenido (evita toggle zoom)
  clickSlide: false,
  afterLoad: function(instance, current) {
    // Interceptar el botón share
    setTimeout(function() {
      var $shareBtn = $(".fancybox-button--share");
      if ($shareBtn.length && !$shareBtn.data('custom-share')) {
        $shareBtn.data('custom-share', true);
        $shareBtn.off('click').on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          // Crear overlay y popup global
          if (!document.getElementById('custom-share-overlay')) {
            var overlay = document.createElement('div');
            overlay.id = 'custom-share-overlay';
            overlay.style.position = 'fixed';
            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.zIndex = '99998';
            overlay.style.background = 'rgba(30,30,30,0.87)';
            overlay.onclick = function() {
              document.getElementById('custom-share-popup')?.remove();
              overlay.remove();
            };
            document.body.appendChild(overlay);
          }
          if (!document.getElementById('custom-share-popup')) {
            var popup = document.createElement('div');
            popup.id = 'custom-share-popup';
            popup.style.position = 'fixed';
            popup.style.left = '50%';
            popup.style.top = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.zIndex = '99999';
            popup.style.background = '#fff';
            popup.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
            popup.style.borderRadius = '12px';
            popup.style.minWidth = '260px';
            popup.style.padding = '24px 32px';
            popup.innerHTML = `
              <div style='position:absolute;top:18px;right:18px;cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;' id='custom-share-close'>
                <svg id='custom-share-x' width='24' height='24' viewBox='0 0 24 24' fill='none' style='opacity:0.2;transition:opacity 0.2s;' xmlns='http://www.w3.org/2000/svg'><path d='M8 8L16 16M16 8L8 16' stroke='#3a3c40' stroke-width='2' stroke-linecap='round'/></svg>
              </div>
              <div style='font-size:20px;font-weight:600;margin-bottom:18px;text-align:center;'>Share</div>
              <div style='display:flex;flex-direction:column;gap:14px;'>
                <a href='https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(current.src)}' target='_blank' rel='noopener' style='display:flex;align-items:center;gap:10px;background:#4267B2;color:#fff;text-decoration:none;font-size:16px;border-radius:6px;padding:10px 0;justify-content:center;min-width:120px;max-width:180px;width:80%;margin:0 auto;'>
                  <svg width='22' height='22' viewBox='0 0 32 32' fill='#fff'><path d='M29 0h-26c-1.7 0-3 1.3-3 3v26c0 1.7 1.3 3 3 3h13v-14h-4v-5h4v-3.7c0-4.1 2.5-6.3 6.1-6.3 1.8 0 3.6.3 3.6.3v4h-2c-2 0-2.6 1.2-2.6 2.5v3.2h5l-1 5h-4v14h7c1.7 0 3-1.3 3-3v-26c0-1.7-1.3-3-3-3z'/></svg>
                  Facebook
                </a>
                <a href='https://twitter.com/intent/tweet?url=${encodeURIComponent(current.src)}' target='_blank' rel='noopener' style='display:flex;align-items:center;gap:10px;background:#1DA1F2;color:#fff;text-decoration:none;font-size:16px;border-radius:6px;padding:10px 0;justify-content:center;min-width:120px;max-width:180px;width:80%;margin:0 auto;'>
                  <svg width='22' height='22' viewBox='0 0 32 32' fill='#fff'><path d='M32 6.1c-1.2.5-2.5.9-3.8 1.1 1.4-.8 2.4-2.1 2.9-3.6-1.3.8-2.7 1.4-4.1 1.7-1.2-1.3-2.9-2.1-4.7-2.1-3.6 0-6.5 2.9-6.5 6.5 0 .5.1 1 .2 1.5-5.4-.3-10.2-2.9-13.4-6.8-.6 1-1 2.1-1 3.3 0 2.3 1.2 4.3 3 5.5-1.1 0-2.1-.3-3-.8v.1c0 3.2 2.3 5.8 5.3 6.4-.6.2-1.2.2-1.8.2-.4 0-.9-.1-1.3-.1.9 2.7 3.5 4.7 6.6 4.7-2.4 1.9-5.4 3-8.7 3-.6 0-1.2 0-1.8-.1 3.1 2 6.7 3.2 10.6 3.2 12.7 0 19.7-10.5 19.7-19.7 0-.3 0-.5 0-.8 1.4-1 2.5-2.2 3.4-3.6z'/></svg>
                  Twitter
                </a>
                <a href='https://pinterest.com/pin/create/button/?url=${encodeURIComponent(current.src)}' target='_blank' rel='noopener' style='display:flex;align-items:center;gap:10px;background:#E60023;color:#fff;text-decoration:none;font-size:16px;border-radius:6px;padding:10px 0;justify-content:center;min-width:120px;max-width:180px;width:80%;margin:0 auto;'>
                  <svg width='22' height='22' viewBox='0 0 32 32' fill='#fff'><path d='M16 0c-8.8 0-16 7.2-16 16 0 7.1 4.6 13.1 11.1 15.3-.2-1.3-.4-3.2.1-4.6.4-1.3 2.6-8.7 2.6-8.7s-.7-1.4-.7-3.5c0-3.3 1.9-5.7 4.2-5.7 2 0 2.9 1.5 2.9 3.3 0 2-.1 4.4-.8 6.3-.2.6-.5 1.5-.6 2.1-.2.7.4 1.3 1.1 1.3 1.3 0 2.3-1.4 2.3-3.5 0-4.6-3.3-7.8-8-7.8-5.5 0-8.7 4-8.7 8.2 0 1.6.6 3.3 1.4 4.2.2.2.2.3.1.5-.1.2-.3.7-.4.9-.1.2-.2.3-.4.2-1.1-.5-1.8-2.1-1.8-4.1 0-5.5 4.6-10.7 13.7-10.7 7.3 0 12.1 5.2 12.1 10.8 0 7.5-4.2 13.1-10.2 13.1-2 0-3.9-.8-5.1-2.2-.2-.2-.4-.5-.3-.8.1-.3.3-.7.4-.9.1-.2.2-.3.4-.2z'/></svg>
                  Pinterest
                </a>
              </div>
            `;
            document.body.appendChild(popup);
            // Opacity hover effect for X icon
            var closeBtn = document.getElementById('custom-share-close');
            var xIcon = document.getElementById('custom-share-x');
            closeBtn.onmouseover = function() { xIcon.style.opacity = '1'; };
            closeBtn.onmouseout = function() { xIcon.style.opacity = '0.2'; };
            document.getElementById('custom-share-close').onclick = function(e) {
              popup.remove();
              document.getElementById('custom-share-overlay')?.remove();
              e.stopPropagation();
            };
          }
        });
      }
    }, 300);
  }
});
// Integrate imagereveal slider into Fancybox modal
$.fancybox.defaults.afterShow = function(instance, current) {
  // Get image URL
  var imgUrl = current.src;
  var foregroundImage = '';
  if (current.opts.$orig && current.opts.$orig.attr('data-foreground')) {
    foregroundImage = current.opts.$orig.attr('data-foreground');
  } else {
    foregroundImage = "https://i.imgur.com/PfIWek4.jpg";
  }
  // Tamaño original adaptado a la imagen
  var defaultWidth = 1333.33;
  var defaultHeight = 750;
  var $origImg = null;
  if (current.opts.$orig && current.opts.$orig.find('img').length) {
    $origImg = current.opts.$orig.find('img')[0];
  }
  if ($origImg && $origImg.naturalWidth && $origImg.naturalHeight) {
    // Siempre usar la reducción proporcional 1920x1080 -> 1333.33x750
    var imgRatio = $origImg.naturalWidth / $origImg.naturalHeight;
    defaultWidth = 1333.33;
    defaultHeight = defaultWidth / imgRatio;
    // Si la altura calculada supera 750px, ajustar por altura
    if (defaultHeight > 750) {
      defaultHeight = 750;
      defaultWidth = defaultHeight * imgRatio;
    }
  }
  // Tamaño pantalla completa
  var fullscreenWidth = 1400;
  var fullscreenHeight = 900;
  // Tamaño zoom
  var zoomWidth = 1333.33 * 1.1; // 10% más grande
  var zoomHeight = 750 * 1.1;
  var isZoomed = false;
  // Devuelve la anchura/altura base según el breakpoint solicitado por el usuario
  function getBreakpointBase() {
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    // Priorizar pantallas muy grandes (>=1920)
    if (w >= 1920) return { w: 1920, h: 1080 };
    // 2xl
    if (w >= 1536) return { w: 1536, h: 864 };
    // xl
    if (w >= 1280) return { w: 1280, h: 720 };
    // lg
    if (w >= 1024) return { w: 1024, h: 576 };
    // md
    if (w >= 768) return { w: 768, h: 432 };
    // sm
    if (w >= 640) return { w: 640, h: 360 };
    // fallback pequeño
    return { w: Math.min(480, w - 40), h: Math.round((Math.min(480, w - 40) * 9) / 16) };
  }

  // Calcula tamaño final manteniendo la relación de aspecto del breakpoint
  function computeModalSize() {
    var base = getBreakpointBase();
    var maxW = window.innerWidth - 80; // dejar margen en la ventana
    var maxH = window.innerHeight - 120;
    var scale = Math.min(1, maxW / base.w, maxH / base.h);
    return { width: Math.round(base.w * scale), height: Math.round(base.h * scale) };
  }
  // Inicializar tamaños a partir del breakpoint adaptado
  var bpSize = computeModalSize();
  defaultWidth = bpSize.width;
  defaultHeight = bpSize.height;
  fullscreenWidth = Math.min(window.innerWidth, bpSize.width);
  fullscreenHeight = Math.min(window.innerHeight, bpSize.height);
  zoomWidth = Math.round(defaultWidth * 1.1);
  zoomHeight = Math.round(defaultHeight * 1.1);
  function getRevealHtml(width, height) {
    return `
      <div class='imagereveal-modal-center'>
        <div class='container imagereveal-modal-container' style="position:relative;width:${width}px;height:${height}px;border:2px solid white;">
          <div class='img background-img' style='position:absolute;top:0;left:0;width:100%;height:100%;background-image:url(${imgUrl});background-size:${width}px 100%;background-position:left top;background-repeat:no-repeat;'></div>
          <div class='img foreground-img' style='position:absolute;top:0;left:0;width:50%;height:100%;background-image:url(${foregroundImage});background-size:${width}px 100%;background-position:left top;background-repeat:no-repeat;'></div>
        <input type="range" min="0" max="100" value="50" class="slider" name='slider' id="slider-modal" style="position:absolute;width:100%;height:100%;background:rgba(242,242,242,0.05);outline:none;margin:0;transition:all 0.2s;display:flex;justify-content:center;align-items:center;">
    <div class='slider-button' style="pointer-events:none;position:absolute;width:30px;height:30px;border-radius:50%;background-color:white;left:calc(50% - 15px);top:calc(50% - 18px);display:flex;justify-content:center;align-items:center;"></div>
        </div>
      </div>
    `;
  }
  // Inicializar con tamaño normal
  current.$content.html(getRevealHtml(defaultWidth, defaultHeight));
  setTimeout(function() {
    var $slider = current.$content.find("#slider-modal");
    var $foreground = current.$content.find('.foreground-img');
    var $button = current.$content.find('.slider-button');
    $slider.off("input change");
    $slider.on("input change", function(e){
      var sliderPos = e.target.value;
      $foreground.css('width', sliderPos + '%');
      if (sliderPos <= 0) {
        $button.css('left', '-15px');
      } else if (sliderPos >= 100) {
        $button.css('left', 'calc(100% - 15px)');
      } else {
        $button.css('left', 'calc(' + sliderPos + '% - 15px)');
      }
    });
    $slider.on("focus", function(){
      $(this).css({outline: "none", boxShadow: "none"});
    });
      // Permitir que los clicks fuera del slider se propaguen para que
      // Fancybox pueda manejar clickOutside/close correctamente.
  }, 0);
  // Evento pantalla completa
  document.addEventListener('fullscreenchange', function() {
    var fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (fullscreenElement) {
      current.$content.html(getRevealHtml(defaultWidth, defaultHeight));
      setTimeout(function() {
        var $slider = current.$content.find("#slider-modal");
        var $foreground = current.$content.find('.foreground-img');
        var $button = current.$content.find('.slider-button');
        $slider.off("input change");
        $slider.on("input change", function(e){
          var sliderPos = e.target.value;
          $foreground.css('width', sliderPos + '%');
          if (sliderPos <= 0) {
            $button.css('left', '-15px');
          } else if (sliderPos >= 100) {
            $button.css('left', 'calc(100% - 15px)');
          } else {
            $button.css('left', 'calc(' + sliderPos + '% - 15px)');
          }
        });
        $slider.on("focus", function(){
          $(this).css({outline: "none", boxShadow: "none"});
        });
      }, 0);
    } else {
      current.$content.html(getRevealHtml(defaultWidth, defaultHeight));
      setTimeout(function() {
        var $slider = current.$content.find("#slider-modal");
        var $foreground = current.$content.find('.foreground-img');
        var $button = current.$content.find('.slider-button');
        $slider.off("input change");
        $slider.on("input change", function(e){
          var sliderPos = e.target.value;
          $foreground.css('width', sliderPos + '%');
          if (sliderPos <= 0) {
            $button.css('left', '-15px');
          } else if (sliderPos >= 100) {
            $button.css('left', 'calc(100% - 15px)');
          } else {
            $button.css('left', 'calc(' + sliderPos + '% - 15px)');
          }
        });
        $slider.on("focus", function(){
          $(this).css({outline: "none", boxShadow: "none"});
        });
      }, 0);
    }
  });
  // Evento zoom
  setTimeout(function() {
    var $zoomBtn = $(".fancybox-button--zoom");
    if ($zoomBtn.length) {
      $zoomBtn.off("click.imagereveal");
      $zoomBtn.on("click.imagereveal", function(e) {
        e.preventDefault();
        isZoomed = !isZoomed;
        var width = isZoomed ? zoomWidth : defaultWidth;
        var height = isZoomed ? zoomHeight : defaultHeight;
        current.$content.html(getRevealHtml(width, height));
        setTimeout(function() {
          var $slider = current.$content.find("#slider-modal");
          var $foreground = current.$content.find('.foreground-img');
          var $button = current.$content.find('.slider-button');
          $slider.off("input change");
          $slider.on("input change", function(e){
            var sliderPos = e.target.value;
            $foreground.css('width', sliderPos + '%');
            if (sliderPos <= 0) {
              $button.css('left', '-15px');
            } else if (sliderPos >= 100) {
              $button.css('left', 'calc(100% - 15px)');
            } else {
              $button.css('left', 'calc(' + sliderPos + '% - 15px)');
            }
          });
          $slider.on("focus", function(){
            $(this).css({outline: "none", boxShadow: "none"});
          });
        }, 0);
      });
    }
  }, 300);
};
// Inject imagereveal CSS if not present
if (!document.getElementById('imagereveal-css')) {
  var style = document.createElement('style');
  style.id = 'imagereveal-css';
  style.innerHTML = `
    .imagereveal-modal-center,
    .imagereveal-modal-container {
      cursor: default !important;
    }
    .imagereveal-modal-center {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      min-height: 300px;
      box-sizing: border-box;
    }
    .imagereveal-modal-container {
      position: relative;
      border: 2px solid white;
      background: #000;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      z-index: 1001;
    }
    .imagereveal-modal-container .img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background-repeat: no-repeat;
    }
    .imagereveal-modal-container .background-img {
      width: 100% !important;
      left: 0;
      z-index: 0; /* Fondo debajo */
    }
    .imagereveal-modal-container .foreground-img {
      width: 50%;
      left: 0;
      z-index: 1; /* Primer plano encima */
    }
    .imagereveal-modal-container .slider {
      z-index: 2; /* Slider por encima de las imágenes */
    }
    .imagereveal-modal-container .slider-button {
      z-index: 3; /* Botón del slider por encima */
    }
    .imagereveal-modal-container .slider {
      position: absolute;
      appearance: none;
      width: 100%;
      height: 100%;
  background: rgba(242,242,242,0.05);
      outline: none;
      margin: 0;
      transition: all 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .imagereveal-modal-container .slider:hover { background: rgba(242,242,242,0.1); }
    .imagereveal-modal-container .slider::-webkit-slider-thumb { width: 6px; height: 100%; background: white; cursor: pointer; }
    .imagereveal-modal-container .slider::-moz-range-thumb { width: 6px; height: 100%; background: white; cursor: pointer; }
    .imagereveal-modal-container .slider-button {
      pointer-events: none;
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: white;
      left: calc(50% - 18px);
      top: calc(50% - 18px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .imagereveal-modal-container .slider-button:after {
      content: "";
      padding: 3px;
      display: inline-block;
      border: solid #5D5D5D;
      border-width: 0 2px 2px 0;
      transform: rotate(-45deg);
    }
    .imagereveal-modal-container .slider-button:before {
      content: "";
      padding: 3px;
      display: inline-block;
      border: solid #5D5D5D;
      border-width: 0 2px 2px 0;
      transform: rotate(135deg);
    }
    /* Fuerza el popup de share por encima del slider y el modal */
    .lg-dropdown {
      position: fixed !important;
      z-index: 99999 !important;
      pointer-events: auto !important;
      left: 50% !important;
      top: 20% !important;
      transform: translateX(-50%) !important;
      background: white !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.2);
      border-radius: 8px;
      min-width: 220px;
      padding: 12px 0;
    }
  `;
  document.head.appendChild(style);
}