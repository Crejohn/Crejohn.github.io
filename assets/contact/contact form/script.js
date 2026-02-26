// =============================================
// CONFIGURACIÓN INICIAL DEL CANVAS
// =============================================
const c = document.createElement('canvas');
const ctx = c.getContext('2d');
let cw = c.width = window.innerWidth;
let ch = c.height = window.innerHeight;

// =============================================
// CONFIGURACIÓN DE LOS MENSAJES
// =============================================
const messages = [
  "Wake up...",
  "The Matrix has you...",
  "Send a message to Crejohn.",
  "The Matrix is everywhere. It is all around us. Even now in this very room"
];

const doorMessages = [
  "I can only show you the door...",
  "You have to walk through it."
];

const noOptionMessages = [
  "Remember, all i'm offering is the truth.",
  "Nothing more."
];

const lastChanceMessage = "This is your last chance. After this, there is no turning back.";

const redPillMessages = [
  "You stay in Wonderland.",
  "I'll show you how deep the rabbit hole goes."
];

const bluePillMessage = "The story ends. You wake up in your bed and believe whatever you want to believe.";

// =============================================
// VARIABLES DE CONTROL DE ANIMACIÓN
// =============================================
const state = {
  currentMessageIndex: 0,
  messageArray: messages[0].split(''),
  messageLength: messages[0].length,
  pointer: 0,
  typeTick: 0,
  typeTickMax: 5,
  typeResetTick: 0,
  typeResetMax: 250,
  randomDelays: [50, 80, 100, 120, 150],
  lastTypeTime: 0,
  showConfirmation: false,
  confirmationDelay: 0,
  confirmationDelayMax: 100,
  paused: false,
  showSkip: false,
  skipMode: false,
  initialDelay: true,
  initialDelayTime: 0,
  initialDelayMax: 100,
  skipDelay: true,
  skipDelayTime: 0,
  skipDelayMax: 100,
  contactFormActive: false,
  showDoorMessages: false,
  currentDoorMessageIndex: 0,
  doorMessageArray: doorMessages[0].split(''),
  doorMessagePointer: 0,
  doorMessageTick: 0,
  doorMessageResetTick: 0,
  showNoOptionMessages: false,
  currentNoOptionMessageIndex: 0,
  noOptionMessageArray: noOptionMessages[0].split(''),
  noOptionMessagePointer: 0,
  noOptionMessageTick: 0,
  noOptionMessageResetTick: 0,
  showLastChance: false,
  lastChanceMessageArray: lastChanceMessage.split(''),
  lastChancePointer: 0,
  lastChanceTick: 0,
  lastChanceResetTick: 0,
  showRedPillMessages: false,
  currentRedPillMessageIndex: 0,
  redPillMessageArray: redPillMessages[0].split(''),
  redPillPointer: 0,
  redPillTick: 0,
  redPillResetTick: 0,
  showBluePillMessage: false,
  bluePillMessageArray: bluePillMessage.split(''),
  bluePillPointer: 0,
  bluePillTick: 0,
  bluePillResetTick: 0,
  showFinalMessage: false,
  finalMessageArray: "The Matrix is everywhere. It is all around us. Even now in this very room.".split(''),
  finalMessagePointer: 0,
  finalMessageTick: 0,
  finalMessageResetTick: 0,
  currentCharIndex: 0,
  confirmationMessage: "Do you want to proceed?",
  finalMessageStartTime: null,
  finalMessageInitialDelay: true,
  finalMessageInitialDelayTime: 0,
  finalMessageInitialDelayMax: 2000
};

// =============================================
// CONFIGURACIÓN DE ESTILOS
// =============================================
function updateCanvasStyle() {
  const bodyStyle = getComputedStyle(document.body);
  ctx.font = bodyStyle.font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowColor = '#3f3';
}

// =============================================
// MANEJO DE REDIMENSIONAMIENTO DE VENTANA
// =============================================
const handleResize = () => {
  cw = c.width = window.innerWidth;
  ch = c.height = window.innerHeight;
  updateCanvasStyle();
};

window.addEventListener('resize', handleResize);

// =============================================
// PRECARGA DE RECURSOS
// =============================================
const preloadedResources = {
  p5: false,
  p5dom: false,
  lodash: false,
  matrixRain: false
};

// Función para cargar scripts dinámicamente
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Precargar recursos
async function preloadResources() {
  try {
    // Cargar p5.js y sus dependencias
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/p5.min.js');
    preloadedResources.p5 = true;
    
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/addons/p5.dom.min.js');
    preloadedResources.p5dom = true;
    
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js');
    preloadedResources.lodash = true;
    
    // Cargar el script de la lluvia Matrix
    await loadScript('../the matrix rain/script.js');
    preloadedResources.matrixRain = true;
    
    console.log('Recursos precargados exitosamente');
  } catch (error) {
    console.error('Error al precargar recursos:', error);
  }
}

// Iniciar precarga
preloadResources();

// =============================================
// LÓGICA PRINCIPAL DE TIPEO
// =============================================
function updateTypeTick(now) {
  if (state.showFinalMessage) {
    handleFinalMessage(now);
    return;
  }
  
  if (state.showBluePillMessage) {
    handleBluePillMessage(now);
    return;
  }
  
  if (state.showRedPillMessages) {
    handleRedPillMessage(now);
    return;
  }
  
  if (state.showLastChance) {
    handleLastChanceMessage(now);
    return;
  }
  
  if (state.showNoOptionMessages) {
    handleNoOptionMessage(now);
    return;
  }
  
  if (state.showDoorMessages) {
    handleDoorMessage(now);
    return;
  }
  
  if (state.paused && !state.contactFormActive && !state.showFinalMessage) {
    if (state.confirmationDelay < state.confirmationDelayMax) {
      state.confirmationDelay++;
    } else if (!state.showConfirmation) {
      state.showConfirmation = true;
      state.currentCharIndex = state.confirmationMessage.length;
    }
    return;
  }
  
  handleMainMessage(now);
}

function handleNoOptionMessage(now) {
  if (state.noOptionMessagePointer < state.noOptionMessageArray.length) {
    if (state.noOptionMessageTick < state.typeTickMax) {
      state.noOptionMessageTick++;
    } else if (now - state.lastTypeTime > state.randomDelays[Math.floor(Math.random() * state.randomDelays.length)]) {
      state.noOptionMessageTick = 0;
      state.noOptionMessagePointer++;
      state.lastTypeTime = now;
    }
  } else {
    if (state.noOptionMessageResetTick < state.typeResetMax) {
      state.noOptionMessageResetTick++;
    } else {
      state.noOptionMessageResetTick = 0;
      state.currentNoOptionMessageIndex++;
      
      if (state.currentNoOptionMessageIndex < noOptionMessages.length) {
        state.noOptionMessageArray = noOptionMessages[state.currentNoOptionMessageIndex].split('');
        state.noOptionMessagePointer = 0;
        state.noOptionMessageTick = 0;
      } else {
        setTimeout(() => {
          state.showNoOptionMessages = false;
          state.showLastChance = true;
          state.lastChancePointer = state.lastChanceMessageArray.length;
          createLastChanceButtons();
        }, 1000);
      }
    }
  }
}

function handleDoorMessage(now) {
  if (state.doorMessagePointer < state.doorMessageArray.length) {
    if (state.doorMessageTick < state.typeTickMax) {
      state.doorMessageTick++;
    } else if (now - state.lastTypeTime > state.randomDelays[Math.floor(Math.random() * state.randomDelays.length)]) {
      state.doorMessageTick = 0;
      state.doorMessagePointer++;
      state.lastTypeTime = now;
    }
  } else {
    if (state.doorMessageResetTick < state.typeResetMax) {
      state.doorMessageResetTick++;
    } else {
      state.doorMessageResetTick = 0;
      state.currentDoorMessageIndex++;
      
      if (state.currentDoorMessageIndex < doorMessages.length) {
        state.doorMessageArray = doorMessages[state.currentDoorMessageIndex].split('');
        state.doorMessagePointer = 0;
        state.doorMessageTick = 0;
      } else {
        showContactForm();
        state.showDoorMessages = false;
      }
    }
  }
}

function handleMainMessage(now) {
  // Aplicar delay inicial
  if (state.initialDelay) {
    if (state.initialDelayTime < state.initialDelayMax) {
      state.initialDelayTime++;
      return;
    } else {
      state.initialDelay = false;
      // Activar showSkip inmediatamente cuando termine el delay inicial
      // para que aparezca al mismo tiempo que el primer mensaje ("Wake up...").
      state.showSkip = true;
      // Desactivar el delay interno de Skip para que se muestre inmediatamente
      state.skipDelay = false;
      state.skipDelayTime = state.skipDelayMax;
    }
  }
  
  if (state.pointer < state.messageArray.length) {
    if (state.typeTick < state.typeTickMax) {
      state.typeTick++;
    } else if (now - state.lastTypeTime > state.randomDelays[Math.floor(Math.random() * state.randomDelays.length)]) {
      state.typeTick = 0;
      state.pointer++;
      state.lastTypeTime = now;
      
      if (state.currentMessageIndex === 2 && state.pointer === state.messageLength) {
        state.paused = true;
        state.confirmationDelay = 0;
        state.showConfirmation = false;
      }
    }
  } else {
    if (state.typeResetTick < state.typeResetMax) {
      state.typeResetTick++;
    } else {
      state.typeResetTick = 0;
      state.currentMessageIndex++;
      
      if (state.currentMessageIndex < messages.length) {
        state.messageArray = messages[state.currentMessageIndex].split('');
        state.messageLength = state.messageArray.length;
        state.pointer = 0;
        state.typeTick = 0;
      } else {
        showContactForm();
      }
    }
  }
}

function handleLastChanceMessage(now) {
  if (state.lastChancePointer < state.lastChanceMessageArray.length) {
    if (state.lastChanceTick < state.typeTickMax) {
      state.lastChanceTick++;
    } else if (now - state.lastTypeTime > state.randomDelays[Math.floor(Math.random() * state.randomDelays.length)]) {
      state.lastChanceTick = 0;
      state.lastChancePointer++;
      state.lastTypeTime = now;
    }
  } else {
    if (state.lastChanceResetTick < state.typeResetMax) {
      state.lastChanceResetTick++;
    } else {
      state.lastChanceResetTick = 0;
      createLastChanceButtons();
    }
  }
}

function createLastChanceButtons() {
  const centerX = cw / 2;
  const centerY = ch / 2;
  
  // Eliminar botones existentes si los hay
  const existingContainer = document.getElementById('lastChanceButtons');
  if (existingContainer) existingContainer.remove();
  
  // Crear contenedor para los botones
  const buttonsContainer = document.createElement('div');
  buttonsContainer.id = 'lastChanceButtons';
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'center';
  buttonsContainer.style.alignItems = 'center';
  buttonsContainer.style.position = 'fixed';
  buttonsContainer.style.top = '0';
  buttonsContainer.style.left = '0';
  buttonsContainer.style.width = '100%';
  buttonsContainer.style.height = '100%';
  buttonsContainer.style.zIndex = '1000';
  buttonsContainer.style.pointerEvents = 'none';
  document.body.appendChild(buttonsContainer);
  
  // Crear contenedor para los botones
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.style.display = 'flex';
  buttonsWrapper.style.gap = '50px'; // Separación entre botones
  buttonsWrapper.style.marginTop = '50px'; // Separación del texto
  buttonsContainer.appendChild(buttonsWrapper);
  
  // Crear botón rojo
  const redButton = document.createElement('div');
  redButton.id = 'redButton';
  buttonsWrapper.appendChild(redButton);
  
  // Crear botón azul
  const blueButton = document.createElement('div');
  blueButton.id = 'blueButton';
  buttonsWrapper.appendChild(blueButton);
  
  // Configurar eventos
  const handleRedClick = () => {
    buttonsContainer.remove();
    state.showLastChance = false;
    state.showRedPillMessages = true;
    state.currentRedPillMessageIndex = 0;
    state.redPillMessageArray = redPillMessages[0].split('');
    state.redPillPointer = 0;
    state.redPillTick = 0;
    state.redPillResetTick = 0;
  };
  
  const handleBlueClick = () => {
    buttonsContainer.remove();
    state.showLastChance = false;
    state.showBluePillMessage = true;
    state.bluePillMessageArray = bluePillMessage.split('');
    state.bluePillPointer = 0;
    state.bluePillTick = 0;
    state.bluePillResetTick = 0;
    state.showSkip = false;
  };
  
  redButton.addEventListener('click', handleRedClick);
  blueButton.addEventListener('click', handleBlueClick);
  
  // Mostrar botones inmediatamente
  buttonsContainer.style.pointerEvents = 'auto';
  redButton.classList.add('show-buttons');
  blueButton.classList.add('show-buttons');
}

function handleRedPillMessage(now) {
  if (state.redPillPointer < state.redPillMessageArray.length) {
    if (state.redPillTick < state.typeTickMax) {
      state.redPillTick++;
    } else if (now - state.lastTypeTime > state.randomDelays[Math.floor(Math.random() * state.randomDelays.length)]) {
      state.redPillTick = 0;
      state.redPillPointer++;
      state.lastTypeTime = now;
    }
  } else {
    if (state.redPillResetTick < state.typeResetMax) {
      state.redPillResetTick++;
    } else {
      state.redPillResetTick = 0;
      state.currentRedPillMessageIndex++;
      
      if (state.currentRedPillMessageIndex < redPillMessages.length) {
        state.redPillMessageArray = redPillMessages[state.currentRedPillMessageIndex].split('');
        state.redPillPointer = 0;
        state.redPillTick = 0;
      } else {
        setTimeout(() => {
          state.showRedPillMessages = false;
          showContactForm();
        }, 1000);
      }
    }
  }
}

// Función para limpiar recursos anteriores
function cleanupPreviousState() {
  // Detener cualquier animación en curso
  if (window.animationFrame) {
    cancelAnimationFrame(window.animationFrame);
  }
  
  // Limpiar el canvas original
  const originalCanvas = document.getElementById('canvas-container');
  if (originalCanvas) {
    originalCanvas.style.display = 'none';
  }
  
  // Limpiar cualquier contenedor anterior de Matrix
  const previousContainer = document.getElementById('matrix-rain-container');
  if (previousContainer) {
    previousContainer.remove();
  }
}

function handleBluePillMessage(now) {
  if (state.bluePillPointer < state.bluePillMessageArray.length) {
    if (state.bluePillTick < state.typeTickMax) {
      state.bluePillTick++;
    } else if (now - state.lastTypeTime > state.randomDelays[Math.floor(Math.random() * state.randomDelays.length)]) {
      state.bluePillTick = 0;
      state.bluePillPointer++;
      state.lastTypeTime = now;
    }
  } else {
    if (state.bluePillResetTick < state.typeResetMax) {
      state.bluePillResetTick++;
    } else {
      setTimeout(() => {
        state.showBluePillMessage = false;
        // Reemplazar la página actual con el proyecto Matrix Rain
        window.location.replace('../the matrix rain/index.html');
      }, 1000);
    }
  }
}

function handleFinalMessage(now) {
  if (!state.finalMessageStartTime) {
    state.finalMessageStartTime = now;
    state.finalMessageArray = "The Matrix is everywhere. It is all around us. Even now in this very room.".split('');
    state.finalMessagePointer = 0;
    state.finalMessageTick = 0;
    state.finalMessageResetTick = 0;
  }
  
  if (state.finalMessagePointer < state.finalMessageArray.length) {
    if (state.finalMessageTick < state.typeTickMax) {
      state.finalMessageTick++;
    } else if (now - state.lastTypeTime > state.randomDelays[Math.floor(Math.random() * state.randomDelays.length)]) {
      state.finalMessageTick = 0;
      state.finalMessagePointer++;
      state.lastTypeTime = now;
    }
  } else {
    if (state.finalMessageResetTick < state.typeResetMax) {
      state.finalMessageResetTick++;
    } else {
      setTimeout(() => {
        window.location.replace('../the matrix rain/index.html');
      }, 1000);
    }
  }
}

function renderFinalMessage() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = state.finalMessageArray.slice(0, state.finalMessagePointer);
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  let offsetX = 0, offsetY = 0;
  if (Math.random() < 0.05) offsetX = -2 + Math.random() * 4;
  if (Math.random() < 0.05) offsetY = -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;

  ctx.fillText(text.join(''), cw/2 + offsetX, ch/2 + offsetY);
  ctx.shadowBlur = 0;
}

// =============================================
// FUNCIONES DE RENDERIZADO
// =============================================
function renderMessage() {
  // Mostrar "Skip(S)" solo si el estado lo permite.
  // No debe mostrarse cuando se está mostrando el mensaje final, el formulario de contacto,
  // el mensaje de última oportunidad o el mensaje del botón azul.
  const canShowSkip = !state.showFinalMessage && !state.contactFormActive && !state.showLastChance && !state.showBluePillMessage;
  if (state.showSkip && canShowSkip) {
    renderSkipOption();
  } else {
    const skipOption = document.getElementById('skipOption');
    if (skipOption) {
      skipOption.remove();
    }
  }
  
  if (state.showFinalMessage) {
    renderFinalMessage();
    return;
  }
  
  if (state.showBluePillMessage) {
    renderBluePillMessage();
    return;
  }
  
  if (state.showRedPillMessages) {
    renderRedPillMessage();
    return;
  }
  
  if (state.showLastChance) {
    renderLastChanceMessage();
    return;
  }
  
  if (state.showDoorMessages) {
    renderDoorMessage();
    return;
  }
  
  if (state.showNoOptionMessages) {
    renderNoOptionMessage();
    return;
  }
  
  if (!state.skipMode && !state.contactFormActive) {
    renderMainMessage();
  }
  
  // Solo mostrar la confirmación si estamos en el estado correcto y no hay otros mensajes activos
  if (state.showConfirmation && state.paused && !state.contactFormActive && !state.showFinalMessage && 
      !state.showBluePillMessage && !state.showRedPillMessages && !state.showLastChance && 
      !state.showDoorMessages && !state.showNoOptionMessages) {
    renderConfirmation();
  }
}

function renderSkipOption() {
  if (state.skipDelay) {
    if (state.skipDelayTime < state.skipDelayMax) {
      state.skipDelayTime++;
      return;
    } else {
      state.skipDelay = false;
      state.showSkip = true;
    }
  }

  if (!state.showSkip) {
    const skipOption = document.getElementById('skipOption');
    if (skipOption) {
      document.body.removeChild(skipOption);
    }
    return;
  }
  
  ctx.save();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;
  
  ctx.fillText("Skip(S)", cw - 20, 20);
  
  if (!document.getElementById('skipOption')) {
    createSkipOption();
  }
  
  ctx.restore();
}

function createSkipOption() {
  const skipOption = document.createElement('div');
  skipOption.id = 'skipOption';
  skipOption.style.position = 'fixed';
  skipOption.style.right = '20px';
  skipOption.style.top = '20px';
  skipOption.style.width = '80px';
  skipOption.style.height = '30px';
  skipOption.style.zIndex = '1000';
  skipOption.style.pointerEvents = 'auto';
  skipOption.style.cursor = 'pointer';
  document.body.appendChild(skipOption);

  skipOption.addEventListener('click', () => {
    state.showSkip = false;
    state.skipMode = true;
    state.showConfirmation = false;
    state.paused = false;
    state.showDoorMessages = false;
    showContactForm();
    document.body.removeChild(skipOption);
  });
}

function renderMainMessage() {
  const text = state.messageArray.slice(0, state.pointer);
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  let x = 20, y = 20;

  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  if (Math.random() < 0.05) x += -2 + Math.random() * 4;
  if (Math.random() < 0.05) y += -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;

  ctx.fillText(text.join(''), Math.round(x), Math.round(y));
  ctx.shadowBlur = 0;
}

function renderDoorMessage() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = state.doorMessageArray.slice(0, state.doorMessagePointer);
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  let offsetX = 0, offsetY = 0;
  if (Math.random() < 0.05) offsetX = -2 + Math.random() * 4;
  if (Math.random() < 0.05) offsetY = -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;

  ctx.fillText(text.join(''), cw/2 + offsetX, ch/2 + offsetY);
  ctx.shadowBlur = 0;
}

function renderNoOptionMessage() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = state.noOptionMessageArray.slice(0, state.noOptionMessagePointer);
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  let offsetX = 0, offsetY = 0;
  if (Math.random() < 0.05) offsetX = -2 + Math.random() * 4;
  if (Math.random() < 0.05) offsetY = -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;

  ctx.fillText(text.join(''), cw/2 + offsetX, ch/2 + offsetY);
  ctx.shadowBlur = 0;
}

function renderLastChanceMessage() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = state.lastChanceMessageArray;
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  let offsetX = 0, offsetY = 0;
  if (Math.random() < 0.05) offsetX = -2 + Math.random() * 4;
  if (Math.random() < 0.05) offsetY = -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;

  // Ajustar la posición vertical del texto para que esté más arriba
  ctx.fillText(text.join(''), cw/2 + offsetX, ch/2 - 100 + offsetY);
  ctx.shadowBlur = 0;
}

function renderRedPillMessage() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = state.redPillMessageArray.slice(0, state.redPillPointer);
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  let offsetX = 0, offsetY = 0;
  if (Math.random() < 0.05) offsetX = -2 + Math.random() * 4;
  if (Math.random() < 0.05) offsetY = -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;

  ctx.fillText(text.join(''), cw/2 + offsetX, ch/2 + offsetY);
  ctx.shadowBlur = 0;
}

function renderBluePillMessage() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = state.bluePillMessageArray.slice(0, state.bluePillPointer);
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  let offsetX = 0, offsetY = 0;
  if (Math.random() < 0.05) offsetX = -2 + Math.random() * 4;
  if (Math.random() < 0.05) offsetY = -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;

  ctx.fillText(text.join(''), cw/2 + offsetX, ch/2 + offsetY);
  ctx.shadowBlur = 0;
}

function renderConfirmation() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Asegurar que el texto de confirmación se muestre completamente
  const mainText = state.confirmationMessage;
  const optionsText = "Yes(Y) No(N)";
  
  const centerX = cw / 2;
  const centerY = ch / 2;
  
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'hsla(120, 20%, 50%, 0.25)';
  
  if (Math.random() < 0.05) {
    ctx.fillStyle = `hsla(120, 30%, 50%, ${0.25 + Math.random() * 0.5})`;
  }
  
  let offsetX = 0, offsetY = 0;
  if (Math.random() < 0.05) offsetX = -2 + Math.random() * 4;
  if (Math.random() < 0.05) offsetY = -2 + Math.random() * 4;
  if (Math.random() < 0.1) ctx.shadowBlur = Math.random() * 10;
  
  ctx.fillText(mainText, centerX + offsetX, centerY - 30 + offsetY);
  ctx.fillText(optionsText, centerX + offsetX, centerY + 30 + offsetY);
  
  if (!document.getElementById('yesOption')) {
    createConfirmationOptions(centerX, centerY);
  }
  
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
}

function createConfirmationOptions(centerX, centerY) {
  const yesOption = document.createElement('div');
  yesOption.id = 'yesOption';
  yesOption.style.position = 'fixed';
  yesOption.style.left = `${centerX - 50}px`;
  yesOption.style.top = `${centerY + 20}px`;
  yesOption.style.width = '50px';
  yesOption.style.height = '30px';
  document.body.appendChild(yesOption);

  const noOption = document.createElement('div');
  noOption.id = 'noOption';
  noOption.style.position = 'fixed';
  noOption.style.left = `${centerX + 20}px`;
  noOption.style.top = `${centerY + 20}px`;
  noOption.style.width = '50px';
  noOption.style.height = '30px';
  document.body.appendChild(noOption);

  yesOption.addEventListener('click', () => handleYesOption());
  noOption.addEventListener('click', () => handleNoOption());
}

function handleYesOption() {
  state.showConfirmation = false;
  state.paused = false;
  state.skipMode = true;
  setTimeout(() => {
    state.showDoorMessages = true;
    state.currentDoorMessageIndex = 0;
    state.doorMessageArray = doorMessages[state.currentDoorMessageIndex].split('');
    state.doorMessagePointer = 0;
    state.doorMessageTick = 0;
    state.doorMessageResetTick = 0;
  }, 1000);
  document.body.removeChild(document.getElementById('yesOption'));
  document.body.removeChild(document.getElementById('noOption'));
}

function handleNoOption() {
  state.showConfirmation = false;
  state.paused = false;
  state.skipMode = false;
  setTimeout(() => {
    state.showNoOptionMessages = true;
    state.currentNoOptionMessageIndex = 0;
    state.noOptionMessageArray = noOptionMessages[state.currentNoOptionMessageIndex].split('');
    state.noOptionMessagePointer = 0;
    state.noOptionMessageTick = 0;
    state.noOptionMessageResetTick = 0;
  }, 1000);
  document.body.removeChild(document.getElementById('yesOption'));
  document.body.removeChild(document.getElementById('noOption'));
  
  setTimeout(() => {
    if (state.currentNoOptionMessageIndex === noOptionMessages.length - 1) {
      state.showNoOptionMessages = false;
      state.showLastChance = true;
      state.lastChancePointer = 0;
      state.lastChanceTick = 0;
      state.lastChanceResetTick = 0;
      state.showSkip = false;
    }
  }, 2000);
}

function renderLines() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath();
  for (let i = 0; i < ch / 2; i += 1) {
    ctx.moveTo(0, (i * 2) + 0.5);
    ctx.lineTo(cw, (i * 2) + 0.5);
  }
  ctx.stroke();
  ctx.globalCompositeOperation = 'lighter';
}

// =============================================
// MANEJO DE TECLADO
// =============================================
const handleKeyDown = (e) => {
  if (e.key.toLowerCase() === 's' && state.showSkip) {
    state.showSkip = false;
    state.skipMode = true;
    state.showConfirmation = false;
    state.paused = false;
    state.showDoorMessages = false;
    showContactForm();
    return;
  }

  if (state.showConfirmation) {
    if (e.key.toLowerCase() === 'y') {
      handleYesOption();
    } else if (e.key.toLowerCase() === 'n') {
      handleNoOption();
    }
  }
};

document.addEventListener('keydown', handleKeyDown);

// =============================================
// FUNCIÓN PARA MOSTRAR EL FORMULARIO
// =============================================
function showContactForm() {
  const formHTML = `
    <div class="bg10">
      <div class="contact-form-container">
        <form id="contactForm" action="https://formspree.io/f/xqaobagd" method="POST" accept-charset="UTF-8" autocomplete="on">
          <div class="input-container">
            <input type="text" id="name" name="name" class="cont" placeholder="Name" required>
            <i class="fa fa-user user"></i>
          </div>
          <div class="input-container">
            <input type="email" id="email" name="email" class="cont" placeholder="Email" required>
            <i class="fa fa-envelope email_icon"></i>
          </div>
          <div class="input-container">
            <input type="text" id="subjecting" name="subject" class="cont" placeholder="Subject" required>
            <i class="fa fa-tag subject"></i>
          </div>
          <div class="textarea-container">
            <textarea id="boxing" name="message" class="cont" placeholder="Message" required></textarea>
            <i class="fa fa-comment comment"></i>
          </div>
          <input type="submit" id="submit_button" value="Send Message">
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', formHTML);
  const formContainer = document.querySelector('.bg10');
  formContainer.style.display = 'block';
  state.contactFormActive = true;
  state.showSkip = false;
  state.skipMode = true;
  state.showConfirmation = false;
  state.paused = false;
  state.showDoorMessages = false;
  
  ctx.clearRect(0, 0, cw, ch);
  
  document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Intentar enviar a Formspree; no bloquear la experiencia si falla
    try {
      const resp = await fetch(form.action || 'https://formspree.io/f/mdkpppdy', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!resp.ok) {
        console.error('Formspree returned an error:', resp.statusText);
      }
    } catch (err) {
      console.error('Error sending form to Formspree:', err);
    }

    // Mantener la experiencia original: ocultar el formulario y mostrar el mensaje final
    formContainer.style.display = 'none';
    state.contactFormActive = false;
    state.showConfirmation = false;

    // Asegurar que la opción Skip esté oculta y removida del DOM inmediatamente
    state.showSkip = false;
    // Reiniciar el delay de Skip para evitar reapariciones inesperadas
    state.skipDelay = true;
    state.skipDelayTime = 0;
    const existingSkip = document.getElementById('skipOption');
    if (existingSkip) {
      existingSkip.remove();
    }
    
    // Limpiar el canvas antes de mostrar el mensaje final
    ctx.clearRect(0, 0, cw, ch);
    
    // Activar el mensaje final después de un breve delay
    setTimeout(() => {
      state.showFinalMessage = true;
      state.finalMessageStartTime = null;
      state.finalMessagePointer = 0;
      state.finalMessageTick = 0;
      state.finalMessageResetTick = 0;
      state.paused = false;
      state.showConfirmation = false;
      state.lastTypeTime = Date.now();
      
      // Forzar un redibujado inmediato
      requestAnimationFrame(() => {
        updateTypeTick(Date.now());
        renderMessage();
        renderLines();
      });
    }, 1000);
  });
}

// =============================================
// BUCLE PRINCIPAL DE ANIMACIÓN
// =============================================
function loop() {
  requestAnimationFrame(loop);
  
  if (state.contactFormActive && !state.showFinalMessage) {
    ctx.clearRect(0, 0, cw, ch);
    return;
  }
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, cw, ch);
  
  ctx.globalCompositeOperation = 'lighter';
  
  updateTypeTick(Date.now());
  renderMessage();
  renderLines();
}

// =============================================
// INICIALIZACIÓN
// =============================================
updateCanvasStyle();
const canvasContainer = document.getElementById('canvas-container');
canvasContainer.appendChild(c);

// Iniciar con delay
setTimeout(() => {
  loop();
}, 500);

// Función para ocultar el header justo antes de que comience el texto
setTimeout(() => {
  const header = document.querySelector('header');
  header.style.opacity = '0';
}, 1630);

$(document).ready(function(){
  // Inicializar funcionalidad de iconos
  initMenu();
  
  // Cerrar menús al hacer clic fuera
  $(document).click(function(e){
    if (!$(e.target).closest('.icon-container').length) {
      $(".menu").removeClass("showMenu");
      $(".icon-container").removeClass("scroll-active");
    }
  });

  // Mostrar/ocultar el menú al pasar el cursor
  const header = document.querySelector('header');
  let headerTimeout;

  header.addEventListener('mouseenter', function() {
    clearTimeout(headerTimeout);
    this.style.opacity = '1';
  });
  
  header.addEventListener('mouseleave', function() {
    clearTimeout(headerTimeout);
    headerTimeout = setTimeout(() => {
      this.style.opacity = '0';
    }, 2000);
  });
});

// Variables globales para el menú flotante
let currentHoveredIcon = null;
let isOverMenu = false;
let menuHideTimeout;

// Función para inicializar el menú
function initMenu() {
    // Cerrar menús al hacer clic fuera
    $(document).click(function(e) {
        if (!$(e.target).closest('.icon-container').length) {
            clearTimeout(menuHideTimeout);
            $(".menu").removeClass("showMenu");
            $(".icon-container").removeClass("scroll-active");
        }
    });

    // Manejar clic en el icono de home
    $('#homepic').click(function(e) {
        e.preventDefault();
        window.location.href = '../../../index.html';
    });

    // Mostrar/ocultar menús al hacer clic en los iconos
    $('.icon-container:not(#homepic)').click(function(e) {
        e.stopPropagation();
        const menu = $(this).find('.menu');
        const wasActive = $(this).hasClass('scroll-active');
        
        // Remover clase activa de todos los iconos
        $('.icon-container').removeClass('scroll-active');
        
        if (menu.length) {
            $('.menu').not(menu).removeClass('showMenu');
            menu.toggleClass('showMenu');
            
            // Si el menú se está mostrando, activar el icono
            if (menu.hasClass('showMenu')) {
                $(this).addClass('scroll-active');
            }
            // Si el menú se está ocultando y este icono estaba activo, remover la clase
            else if (wasActive) {
                $(this).removeClass('scroll-active');
            }
        }
    });

    // Manejar hover en los iconos
    $('.icon-container').hover(
        function() {
            clearTimeout(menuHideTimeout);
            // Solo cambiar menús si hay uno abierto y el cursor no salió del área del menú
            if ($(".menu.showMenu").length > 0) {
                const menu = $(this).find('.menu');
                if (menu.length) {
                    // Remover clase activa de todos los iconos
                    $('.icon-container').removeClass('scroll-active');
                    // Activar este icono
                    $(this).addClass('scroll-active');
                    // Cambiar menús
                    $('.menu').removeClass('showMenu');
                    menu.addClass('showMenu');
                }
            }
        },
        function() {
            // No hacer nada al salir del icono
        }
    );

    // Manejar hover en los menús
    $('.menu').hover(
        function() {
            clearTimeout(menuHideTimeout);
        },
        function() {
            const $menu = $(this);
            const $icon = $menu.closest('.icon-container');
            menuHideTimeout = setTimeout(() => {
                $menu.removeClass("showMenu");
                $icon.removeClass('scroll-active');
            }, 1000);
        }
    );

    // Manejar salida del área del menú
    $('.dropholder').mouseleave(function() {
        clearTimeout(menuHideTimeout);
        menuHideTimeout = setTimeout(() => {
            $(".menu").removeClass("showMenu");
            $(".icon-container").removeClass("scroll-active");
        }, 1000);
    });

    // Manejar clic en items del menú
    $(".menu li").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const frameId = $(this).attr('data-frame');
        if (frameId) {
            let url = '';
            switch(frameId) {
                case 'portfolio-frame':
                    url = '../../portfolio/index.html';
                    break;
                case 'logo-frame':
                    url = '../../logo_design/index.html';
                    break;
                case 'graphic-frame':
                    url = '../../graphic_design/index.html';
                    break;
                case 'website-frame':
                    url = '../../websites/index.html';
                    break;
                case 'social-frame':
                    url = '../../social_media/index.html';
                    break;
                case 'illustration-frame':
                    url = '../../hand-drawn/index.html';
                    break;
                case 'video-frame':
                    url = '../../video_editing/index.html';
                    break;
                case 'aboutme-frame':
                    url = '../../about/about/index.html';
                    break;
                case 'timeline-frame':
                    url = '../../about/timeline/index.html';
                    break;
                case 'contact-frame':
                    url = 'index.html';
                    break;
            }
            
            if (url) {
                window.location.href = url;
            }
        }
    });
}

// Función para obtener el siguiente icono
function getNextIcon(currentIcon) {
    const icons = ['homepic', 'codepic', 'workpic', 'studypic'];
    const currentIndex = icons.indexOf(currentIcon.id);
    return document.getElementById(icons[(currentIndex + 1) % icons.length]);
}

// Función para obtener el icono anterior
function getPreviousIcon(currentIcon) {
    const icons = ['homepic', 'codepic', 'workpic', 'studypic'];
    const currentIndex = icons.indexOf(currentIcon.id);
    return document.getElementById(icons[(currentIndex - 1 + icons.length) % icons.length]);
}

// Función para activar un icono
function activateIcon(icon) {
    $('.icon-container').removeClass('scroll-active');
    $(icon).addClass('scroll-active');
    $('.menu').removeClass('showMenu');
    const menu = $(icon).find('.menu');
    if (menu.length) {
        menu.addClass('showMenu');
    }
}

// Evento de rueda del mouse para el menú flotante
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

// Manejar salida del menú
$(".dropholder").mouseleave(function() {
    ['homepic', 'codepic', 'workpic', 'studypic'].forEach(id => {
        const icon = document.getElementById(id);
        if (icon) {
            icon.classList.remove('scroll-active');
        }
    });
    currentHoveredIcon = null;
});
