$(document).ready(function(){
  // Initialize icon functionality
  Reg();
  
  // Close all menus when clicking outside
  $(document).click(function(e){
    if (!$(e.target).closest('.icon-container').length) {
      $(".menu").removeClass("showMenu");
    }
  });
});

// Icon functionality
var c1="#ccffcc",c2="#ebccff",c3="#cce0ff",c4="#ffcccc";
var flaghide1=false,flaghide2=false,flaghide3=false,flaghide4=false;

function Reg(){
  // Manejar clic en todos los iconos, incluyendo home
  $(".icon-container").click(function(e) {
    e.stopPropagation();
    var iconId = $(this).find(".ic").attr("id");
    var menu = $(this).find(".menu");
    
    // Toggle menu sin ocultar la página
    $(".menu").not(menu).removeClass("showMenu");
    menu.toggleClass("showMenu");
    
    // Highlight icon sin ocultar la página
    switch(iconId) {
      case 'pic2': $(this).toggleClass('active-icon-2'); break;
      case 'pic3': $(this).toggleClass('active-icon-3'); break;
      case 'pic4': $(this).toggleClass('active-icon-4'); break;
    }
  });

  // Evento hover para los iconos
  $(".icon-container").hover(
    function() {
      // Si hay algún menú abierto
      if ($(".menu.showMenu").length > 0) {
        var menu = $(this).find(".menu");
        // Cerrar todos los menús y abrir el del icono hover
        $(".menu").removeClass("showMenu");
        menu.addClass("showMenu");
      }
    },
    function() {
      // No hacemos nada al salir del hover
    }
  );
  
  // Close menu when clicking on menu items
  $(".menu > li").click(function(e){
    e.stopPropagation();
    $(this).parent().removeClass("showMenu");
  });
}

function showWin1(){
  if (!$("#studypic").hasClass('active-icon-1')) {
    $(".icon-container").removeClass("active-icon-1 active-icon-2 active-icon-3 active-icon-4");
    $("#studypic").addClass("active-icon-1");
  }
}

function showWin2(){
  if (!$("#codepic").hasClass('active-icon-2')) {
    $(".icon-container").removeClass("active-icon-1 active-icon-2 active-icon-3 active-icon-4");
    $("#codepic").addClass("active-icon-2");
  }
}

function showWin3(){
  if (!$("#workpic").hasClass('active-icon-3')) {
    $(".icon-container").removeClass("active-icon-1 active-icon-2 active-icon-3 active-icon-4");
    $("#workpic").addClass("active-icon-3");
  }
}

function showWin4(){
  if (!$("#homepic").hasClass('active-icon-4')) {
    $(".icon-container").removeClass("active-icon-1 active-icon-2 active-icon-3 active-icon-4");
    $("#homepic").addClass("active-icon-4");
  }
}

function toggleBox(lp, className){
  if(flaghide(lp)){
    hideBox(lp, className);
    setFlag(lp, false);
  }else{
    hideAllBoxes();
    showBox(lp, className);
    setFlag(lp, true);
  }
}

function flaghide(lp){
  switch(lp){
    case 1: return flaghide1;
    case 2: return flaghide2;
    case 3: return flaghide3;
    case 4: return flaghide4;
  }
}

function setFlag(lp, value){
  switch(lp){
    case 1: flaghide1 = value; break;
    case 2: flaghide2 = value; break;
    case 3: flaghide3 = value; break;
    case 4: flaghide4 = value; break;
  }
}

function showBox(lp, className){
  $("#pic"+lp).addClass(className);
}

function hideBox(lp, className){
  $("#pic"+lp).removeClass(className);
}

function hideAllBoxes(){
  for(let i = 1; i <= 4; i++) {
    $("#pic"+i).removeClass('active-icon-1 active-icon-2 active-icon-3 active-icon-4');
  }
  flaghide1=flaghide2=flaghide3=flaghide4=false;
}
// ==============================================
// SCROLL FUNCTIONALITY FOR MENU ICONS
// ==============================================
if (typeof currentHoveredIcon === 'undefined') {
  var currentHoveredIcon = null;
}

// Función para obtener el siguiente icono
function getNextIcon(currentId) {
  const iconIds = ['homepic', 'codepic', 'workpic', 'studypic'];
  const currentIndex = iconIds.indexOf(currentId);
  const nextIndex = (currentIndex + 1) % iconIds.length;
  return iconIds[nextIndex];
}

// Función para obtener el icono anterior
function getPreviousIcon(currentId) {
  const iconIds = ['homepic', 'codepic', 'workpic', 'studypic'];
  const currentIndex = iconIds.indexOf(currentId);
  const prevIndex = (currentIndex - 1 + iconIds.length) % iconIds.length;
  return iconIds[prevIndex];
}

// Función para activar un icono específico
function activateIcon(iconId) {
  const icon = document.getElementById(iconId);
  if (icon) {
    // Aplicar clase de scroll al icono activo
    icon.classList.add('scroll-active');
    
    // Remover clase de scroll de otros iconos
    ['homepic', 'codepic', 'workpic', 'studypic'].forEach(id => {
      if (id !== iconId) {
        const otherIcon = document.getElementById(id);
        if (otherIcon) {
          otherIcon.classList.remove('scroll-active');
        }
      }
    });

    // Si hay algún menú abierto, cambiar al menú correspondiente al icono activo
    if ($(".menu.showMenu").length > 0) {
      // Cerrar todos los menús primero
      $(".menu").removeClass("showMenu");
      
      // Abrir el menú correspondiente al icono activo
      const menu = $(icon).find(".menu");
      menu.addClass("showMenu");
    }
  }
}

// Evento de scroll para los iconos
document.addEventListener('wheel', (e) => {
  if (currentHoveredIcon) {
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

// Actualizar currentHoveredIcon en los eventos mouseenter/mouseleave
$(".icon-container").on({
  mouseenter: function() {
    currentHoveredIcon = $(this).attr('id');
  },
  mouseleave: function() {
    currentHoveredIcon = null;
  }
});
