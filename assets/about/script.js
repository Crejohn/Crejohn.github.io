// El loader se inicializa automáticamente desde ../loader.js
// --- PLATFORMS PROGRESS BAR LOGIC (actualizado y extendido) ---
var platformBarIntervals = {};
var platformBarTimeouts = {};
function resetPlatformBars() {
    ['trello','slack','ai','nanobanana','deepseek'].forEach(function(platform) {
        var bar = document.getElementById('platform-progress-' + platform);
        var percentEl = document.getElementById('platform-' + platform + '-percent');
        if (bar) bar.style.width = '0%';
        if (percentEl) percentEl.textContent = '0%';
        if (platformBarIntervals[platform]) {
            clearInterval(platformBarIntervals[platform]);
            platformBarIntervals[platform] = null;
        }
        if (platformBarTimeouts[platform]) {
            clearTimeout(platformBarTimeouts[platform]);
            platformBarTimeouts[platform] = null;
        }
    });
}

function animatePlatformBars() {
    resetPlatformBars();
    var platforms = {
        "trello": 57,
        "slack": 51,
        "ai": 83,
        "nanobanana": 84,
        "deepseek": 78
    };
    var delays = {
        "trello": 700,
        "slack": 1400,
        "ai": 2100,
        "nanobanana": 2800,
        "deepseek": 3500
    };
    Object.entries(platforms).forEach(function([platform, percent]) {
        var bar = document.getElementById('platform-progress-' + platform);
        var percentEl = document.getElementById('platform-' + platform + '-percent');
        if (bar && percentEl) {
            platformBarTimeouts[platform] = setTimeout(function() {
                var current = 0;
                var target = percent;
                var duration = 1200;
                var stepTime = 15;
                var steps = Math.ceil(duration / stepTime);
                var increment = target / steps;
                platformBarIntervals[platform] = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(platformBarIntervals[platform]);
                        platformBarIntervals[platform] = null;
                    }
                    bar.style.width = current + '%';
                    percentEl.textContent = Math.round(current) + '%';
                }, stepTime);
            }, delays[platform]);
        }
    });
}

function setupPlatformsPopupAnimation() {
    var platformsPopup = document.getElementById('popup-modal-platforms');
    if (!platformsPopup) return;
    var lastVisible = false;
    var lastMinimized = false;
    function checkState() {
        var isVisible = platformsPopup.style.display === 'block';
        var isMinimized = platformsPopup.classList.contains('minimized');
        if (isVisible && !isMinimized && (!lastVisible || lastMinimized)) {
            animatePlatformBars();
        }
        if ((!isVisible && lastVisible) || (isMinimized && !lastMinimized)) {
            resetPlatformBars();
        }
        lastVisible = isVisible;
        lastMinimized = isMinimized;
    }
    var observer = new MutationObserver(checkState);
    observer.observe(platformsPopup, { attributes: true, attributeFilter: ['style', 'class'] });
    resetPlatformBars();
}

// --- SKILLER PROGRESS BAR LOGIC ---
// --- Mejorada: animación de barras y reinicio seguro ---
var skillBarIntervals = {};
var skillBarTimeouts = {};
function resetSkillBars() {
    ['photoshop','illustrator','indesign','aftereffects','premierepro','audition'].forEach(function(skill) {
        var bar = document.getElementById('progress-' + skill);
        var percentEl = document.getElementById(skill + '-percent');
        if (bar) bar.style.width = '0%';
        if (percentEl) percentEl.textContent = '0%';
        // Limpiar animaciones previas
        if (skillBarIntervals[skill]) {
            clearInterval(skillBarIntervals[skill]);
            skillBarIntervals[skill] = null;
        }
        if (skillBarTimeouts[skill]) {
            clearTimeout(skillBarTimeouts[skill]);
            skillBarTimeouts[skill] = null;
        }
    });
}

function animateSkillBars() {
    resetSkillBars();
    var skills = {
        "photoshop": 75,
        "illustrator": 73,
        "indesign": 43,
        "aftereffects": 56,
        "premierepro": 54,
        "audition": 32
    };
    var delays = {
        "photoshop": 700,
        "illustrator": 1400,
        "indesign": 1700,
        "aftereffects": 2100,
        "premierepro": 2800,
        "audition": 3500
    };
    Object.entries(skills).forEach(function([skill, percent]) {
        var bar = document.getElementById('progress-' + skill);
        var percentEl = document.getElementById(skill + '-percent');
        if (bar && percentEl) {
            skillBarTimeouts[skill] = setTimeout(function() {
                var current = 0;
                var target = percent;
                var duration = 1200;
                var stepTime = 15;
                var steps = Math.ceil(duration / stepTime);
                var increment = target / steps;
                skillBarIntervals[skill] = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(skillBarIntervals[skill]);
                        skillBarIntervals[skill] = null;
                    }
                    bar.style.width = current + '%';
                    percentEl.textContent = Math.round(current) + '%';
                }, stepTime);
            }, delays[skill]);
        }
    });
}

// Lanzar animación al abrir el popup-modal de Skills
function setupSkillsPopupAnimation() {
    var skillsPopup = document.getElementById('popup-modal-skills');
    if (!skillsPopup) return;
    var lastVisible = false;
    var lastMinimized = false;
    function checkState() {
        var isVisible = skillsPopup.style.display === 'block';
        var isMinimized = skillsPopup.classList.contains('minimized');
        // Si se abre y no está minimizado, animar
        if (isVisible && !isMinimized && (!lastVisible || lastMinimized)) {
            animateSkillBars();
        }
        // Si se minimiza o se oculta, resetear
        if ((!isVisible && lastVisible) || (isMinimized && !lastMinimized)) {
            resetSkillBars();
        }
        lastVisible = isVisible;
        lastMinimized = isMinimized;
    }
    var observer = new MutationObserver(checkState);
    observer.observe(skillsPopup, { attributes: true, attributeFilter: ['style', 'class'] });
    // Reset inicial
    resetSkillBars();
}

// --- PDF Modal Logic (integrated from open-pdf.js and modal script) ---
(function(){
  const openers = document.querySelectorAll('.open-pdf');
  const modal = document.getElementById('pdf-modal');
  const frame = document.getElementById('pdf-frame');
  const closeBtn = modal ? modal.querySelector('.pdf-modal-close') : null;

  function openPDF(url){
    if(!url || !modal || !frame) return;
    frame.src = url;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    if(closeBtn) closeBtn.focus();
  }

  function closePDF(){
    if(!modal || !frame) return;
    modal.setAttribute('aria-hidden','true');
    frame.src = '';
    document.body.style.overflow = '';
  }

  openers.forEach(function(op){
    op.addEventListener('click', function(e){
      e.preventDefault();
      const file = op.getAttribute('data-pdf');
      openPDF(file);
    });
  });

  if(closeBtn) closeBtn.addEventListener('click', closePDF);
  if(modal) modal.addEventListener('click', function(e){
    if(e.target === modal) closePDF();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false'){
      closePDF();
    }
  });
})();

document.addEventListener('DOMContentLoaded', function() {
    setupSkillsPopupAnimation();
    setupPlatformsPopupAnimation();
});
// --- Popup Modal Logic ---
document.addEventListener('DOMContentLoaded', function() {
    // Lista de popups y sus textos
    var popupMap = {
        'Bio': 'popup-modal-bio',
        'Interests': 'popup-modal-interests',
        'Professional': 'popup-modal-professional',
        'Projects': 'popup-modal-projects',
        'Skills': 'popup-modal-skills',
        'Platforms': 'popup-modal-platforms',
        'Interests-main': 'popup-modal-interests-main'
    };
    var lastNewLink = null;
    var lastPopup = null;
    // Detectar todos los enlaces relevantes (submenús)
    var allLinks = Array.from(document.querySelectorAll('.sidebar-submenu li a'));
    allLinks.forEach(function(link) {
        var text = link.textContent.trim();
        if (popupMap[text]) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                Object.values(popupMap).forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) {
                        el.style.display = 'none';
                        el.classList.remove('minimized');
                        el.style.transform = '';
                    }
                });
                var popup = document.getElementById(popupMap[text]);
                if (popup) {
                    popup.style.display = 'block';
                    popup.classList.remove('minimized');
                    popup.style.transform = '';
                    lastNewLink = link;
                    lastPopup = popup;
                }
            });
        }
    });

    // Detectar los spans del menú principal (Skills, Interests)
    var mainMenuSpans = document.querySelectorAll('#side-nav .sidebar-menu > .sidebar-item > .sidebar-link > span');
    mainMenuSpans.forEach(function(span) {
        var text = span.textContent.trim();
        // Para distinguir el Interests del menú principal
        var key = (text === 'Interests') ? 'Interests-main' : text;
        // Solo Interests debe abrir popup desde el span principal
        if (popupMap[key] && key === 'Interests-main') {
            span.addEventListener('click', function(e) {
                e.preventDefault();
                Object.values(popupMap).forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) {
                        el.style.display = 'none';
                        el.classList.remove('minimized');
                        el.style.transform = '';
                    }
                });
                var popup = document.getElementById(popupMap[key]);
                if (popup) {
                    popup.style.display = 'block';
                    popup.classList.remove('minimized');
                    popup.style.transform = '';
                    lastNewLink = span;
                    lastPopup = popup;
                }
            });
        }
    });

    // Hacer que la primera opción del submenú de Skills abra el popup-modal-skills
    var skillsModalTrigger = document.querySelector('.skills-modal-trigger');
    if (skillsModalTrigger) {
        skillsModalTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            Object.values(popupMap).forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.style.display = 'none';
                    el.classList.remove('minimized');
                    el.style.transform = '';
                }
            });
            var popup = document.getElementById('popup-modal-skills');
            if (popup) {
                popup.style.display = 'block';
                popup.classList.remove('minimized');
                popup.style.transform = '';
                lastNewLink = skillsModalTrigger;
                lastPopup = popup;
            }
        });
    }
    // Hacer que la segunda opción del submenú de Skills abra el popup-modal-platforms
    var platformsModalTrigger = document.querySelectorAll('.sidebar-submenu li a')[1];
    if (platformsModalTrigger && platformsModalTrigger.textContent.trim() === 'Platforms') {
        platformsModalTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            Object.values(popupMap).forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.style.display = 'none';
                    el.classList.remove('minimized');
                    el.style.transform = '';
                }
            });
            var popup = document.getElementById('popup-modal-platforms');
            if (popup) {
                popup.style.display = 'block';
                popup.classList.remove('minimized');
                popup.style.transform = '';
                lastNewLink = platformsModalTrigger;
                lastPopup = popup;
            }
        });
    }
    // Controles de cerrar y minimizar para cada popup
    Object.values(popupMap).forEach(function(id) {
        var popup = document.getElementById(id);
        if (!popup) return;
        var closeBtn = popup.querySelector('.popup-close');
        var minimizeBtn = popup.querySelector('.popup-minimize');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                popup.style.display = 'none';
            });
        }
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', function() {
                if (!popup.classList.contains('minimized')) {
                    var iconTarget = null;
                    if (lastNewLink) {
                        var sidebarItem = lastNewLink.closest('li.sidebar-item');
                        if (!sidebarItem) {
                            var submenu = lastNewLink.closest('.sidebar-submenu');
                            if (submenu) {
                                sidebarItem = submenu.closest('li.sidebar-item');
                            }
                        }
                        if (sidebarItem) {
                            iconTarget = sidebarItem.querySelector('.sidebar-link > i');
                        }
                    }
                    var popupRect = popup.getBoundingClientRect();
                    var iconRect = iconTarget ? iconTarget.getBoundingClientRect() : null;
                    if (iconRect) {
                        var popupCenterX = popupRect.left + popupRect.width / 2;
                        var popupCenterY = popupRect.top + popupRect.height / 2;
                        var iconCenterX = iconRect.left + iconRect.width / 2;
                        var iconCenterY = iconRect.top + iconRect.height / 2;
                        var dx = iconCenterX - popupCenterX;
                        var dy = iconCenterY - popupCenterY;
                        popup.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(0)';
                    } else {
                        popup.style.transform = 'translate(-500px, 500px) scale(0)';
                    }
                    popup.classList.add('minimized');
                } else {
                    popup.classList.remove('minimized');
                    popup.style.transform = '';
                }
            });
        }
    });
});
// Toggle the sidebar without jQuery.
var toggleButton = document.getElementById('toggle');
if (toggleButton) {
    toggleButton.addEventListener('click', function () {
        var nav = this.closest('nav');
        if (!nav) return;

        nav.classList.toggle('width');

        var icon = this.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-caret-left');
            icon.classList.toggle('fa-caret-right');
        }

        // Close all submenus when collapsing
        if (nav.classList.contains('width')) {
            var submenuLis = nav.querySelectorAll('li');
            submenuLis.forEach(function (li) {
                if (li.querySelector('ul')) {
                    li.classList.remove('open');
                    var submenuIcon = li.querySelector('.submenu-icon');
                    if (submenuIcon) {
                        submenuIcon.classList.remove('fa-angle-down');
                        submenuIcon.classList.add('fa-angle-up');
                    }
                }
            });
        }
    });
}

var submenuLinks = document.querySelectorAll('#side-nav .sidebar-menu > .sidebar-item > .sidebar-link');
submenuLinks.forEach(function(link) {
    var parentLi = link.parentElement;
    if (parentLi && parentLi.querySelector('.sidebar-submenu')) {
        link.addEventListener('click', function (event) {
            var nav = document.getElementById('side-nav');
            var toggle = document.getElementById('toggle');
            var toggleIcon = toggle ? toggle.querySelector('i') : null;
            // Si el click fue en el span (texto), solo mostrar/ocultar submenú
            if (event.target.tagName === 'SPAN' || event.target.classList.contains('submenu-icon')) {
                event.preventDefault();
                parentLi.classList.toggle('open');
                var icon = link.querySelector('.submenu-icon');
                if (icon) {
                    icon.classList.toggle('fa-angle-up');
                    icon.classList.toggle('fa-angle-down');
                }
                return;
            }
            if (nav) {
                if (nav.classList.contains('width')) {
                    // Si está contraído, expande
                    nav.classList.remove('width');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-caret-right');
                        toggleIcon.classList.add('fa-caret-left');
                    }
                    event.preventDefault();
                    return;
                } else {
                    // Si está expandido, contrae y cierra submenús
                    nav.classList.add('width');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-caret-left');
                        toggleIcon.classList.add('fa-caret-right');
                    }
                    // Cierra todos los submenús
                    var submenuLis = nav.querySelectorAll('li');
                    submenuLis.forEach(function (li) {
                        if (li.querySelector('ul')) {
                            li.classList.remove('open');
                            var submenuIcon = li.querySelector('.submenu-icon');
                            if (submenuIcon) {
                                submenuIcon.classList.remove('fa-angle-down');
                                submenuIcon.classList.add('fa-angle-up');
                            }
                        }
                    });
                    event.preventDefault();
                    return;
                }
            }
        });
    }
});

// Integrar lógica de expandir/contraer para los íconos de Skills e Interests
document.querySelectorAll('#side-nav .sidebar-menu > .sidebar-item > .sidebar-link > i.fa-gear, #side-nav .sidebar-menu > .sidebar-item > .sidebar-link > i.fa-paintbrush').forEach(function(icon) {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', function(event) {
        var nav = document.getElementById('side-nav');
        var toggle = document.getElementById('toggle');
        var toggleIcon = toggle ? toggle.querySelector('i') : null;
        if (nav) {
            if (nav.classList.contains('width')) {
                nav.classList.remove('width');
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-caret-right');
                    toggleIcon.classList.add('fa-caret-left');
                }
            } else {
                nav.classList.add('width');
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-caret-left');
                    toggleIcon.classList.add('fa-caret-right');
                }
                // Cierra todos los submenús
                var submenuLis = nav.querySelectorAll('li');
                submenuLis.forEach(function (li) {
                    if (li.querySelector('ul')) {
                        li.classList.remove('open');
                        var submenuIcon = li.querySelector('.submenu-icon');
                        if (submenuIcon) {
                            submenuIcon.classList.remove('fa-angle-down');
                            submenuIcon.classList.add('fa-angle-up');
                        }
                    }
                });
            }
        }
        event.preventDefault();
        event.stopPropagation();
    });
});

// --- HOME ICON CLICK: Navega al home igual que posts ---
document.addEventListener('DOMContentLoaded', function() {
  var homeIcon = document.getElementById('pic1');
  if (homeIcon) {
    homeIcon.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '../../index.html';
    });
  }
});