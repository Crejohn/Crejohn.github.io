document.addEventListener('DOMContentLoaded', function() {
    // Redirigir al portfolio si el mouse está cerca del borde izquierdo
    document.body.addEventListener('mousemove', function(e) {
        if (e.clientX < 30) {
            if (window.self === window.top) {
                window.location.href = '../portfolio/index.html';
            }
        }
    });
    const containers = document.querySelectorAll('.gallery-container');

    // Popup overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'popup-overlay';
    popupOverlay.style.display = 'none';
    popupOverlay.style.position = 'fixed';
    popupOverlay.style.top = '0';
    popupOverlay.style.left = '0';
    popupOverlay.style.width = '100vw';
    popupOverlay.style.height = '100vh';
    popupOverlay.style.background = 'rgba(0,0,0,0.85)';
    popupOverlay.style.justifyContent = 'center';
    popupOverlay.style.alignItems = 'center';
    popupOverlay.style.zIndex = '9999';
    popupOverlay.style.cursor = 'pointer';
    popupOverlay.innerHTML = '<img id="popup-img" style="max-width:90vw;max-height:90vh;box-shadow:0 0 30px #000;border-radius:8px;" />';
    document.body.appendChild(popupOverlay);

    const popupImg = popupOverlay.querySelector('#popup-img');

    popupOverlay.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
        popupImg.src = '';
    });

    containers.forEach((container, idx) => {
        const mainThumb = container.querySelector('a:first-child');
        if (mainThumb) {
            mainThumb.addEventListener('click', function(e) {
                e.preventDefault();
                if (idx === 0) {
                    // Abrir la página de coding_masters en la misma pestaña
                    window.location.href = './assets/coding_masters/index.html';
                    return;
                }
                if (idx === 2) {
                    // Abrir la página de estilo_de_vida en la misma pestaña desde el tercer item
                    window.location.href = './assets/estilo_de_vida/index.html';
                    return;
                }
                if (idx === 1) {
                    // Abrir la página de shameless_snacks en la misma pestaña
                    window.location.href = './assets/shameless_snacks/index.html';
                    return;
                }
                if (idx === 3) {
                    // Abrir la página de talk_video_class en la misma pestaña desde el cuarto item
                    window.location.href = './assets/talk_video_class/index.html';
                    return;
                }
                if (idx === 4) {
                    // Abrir la página de brand en la misma pestaña desde el quinto item
                    window.location.href = './assets/brand/index.html';
                    return;
                }
                const img = mainThumb.querySelector('img');
                if (img) {
                    popupImg.src = img.src;
                    popupOverlay.style.display = 'flex';
                }
            });
        }
    });

    // Floating Menu Logic
    const homepic = document.getElementById('homepic');
    if (homepic) {
        homepic.addEventListener('click', function() {
            window.location.href = '../../index.html';
        });
    }

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
                case 'contact-frame':
                    url = '../contact/contact form/index.html';
                    break;
            }

            if (url) {
                window.location.href = url;
            }
        });
    });
});
