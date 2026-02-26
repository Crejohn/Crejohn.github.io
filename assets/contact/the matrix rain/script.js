/* 
Matrix Rain Effect - Dense Version
*/

const s = (p) => {  
  const FONT_SIZE = 20;
  const charList = (charCode, n) => String.fromCharCode(...Array.from({length: n}, (_, i) => charCode + i));
  const unicodeA = 65;
  const unicode0 = 48;
  const unicodeKa = 65398;
  const alphabet = charList(unicodeA, 26); 
  const numbers = charList(unicode0, 10);
  const katakana = charList(unicodeKa, 32);
  const SYMBOLS = ['*', '+', '<', '>', ...alphabet, ...numbers, ...katakana];
  let m;
  
  p.setup = () => {
    p.frameRate(60);    
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.id("mycanvas");
    p.colorMode(p.HSB, 360, 100, 100, 100);  
    p.textFont("monospace", FONT_SIZE);
    p.textAlign(p.LEFT, p.TOP);

    m = new Matrix();
    m.run();
  }
  
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    m = new Matrix();
    m.run();
  }
  
  class Symbol {
    constructor({ x, y, symbol, died }) {
      this.pos = p.createVector(x, y);
      this.color = p.color(360, 100, 100);
      this.life = 100;
      this.symbol = symbol || SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.died = died || (() => {});
    }

    update(newColor) {
      if (newColor) {
        this.color = newColor;
      } else {
        if (this.life <= 0) {
          this.died(this);
          return;
        } else if (this.life > 50) {
          this.life -= 0.5;
        } else {
          this.life -= 1;
        }

        if (this.life % 20 === 0 && Math.random() > 0.9) {
          this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];    
        } 
        this.color = p.color(105, 100, this.life);
      }
    }

    display() {
      p.fill(this.color);
      p.text(this.symbol, this.pos.x, this.pos.y);   
    }
  }
  
  class Raindrop {
    constructor({x, y, died, speed}) {
      this.pos = p.createVector(x, y);        
      this.symbols = new Map();    
      this.addSymbol({ x, y });
      this.died = died || (() => {});
      this.symbolCount = 0;
      this.speed = speed || 4; // Velocidad ajustable
    }

    addSymbol({x, y, symbol }) {
      const s = new Symbol({ x, y, symbol, died: this.removeSymbol.bind(this) });
      this.lowestSymbol = s;
      this.symbols.set(s, s);
      this.symbolCount += 1;
    }

    update() {
      this.pos.add(p.createVector(0, this.speed));   

      const nextSymbolY = this.symbolCount * FONT_SIZE;
      const { x, y } = this.pos;
      
      // Añadir más símbolos con mayor frecuencia
      if (y < p.height + FONT_SIZE * 3 && y > nextSymbolY) {
        this.addSymbol({ x, y: nextSymbolY });
      } else if (y > p.height && this.symbols.size === 1) {
        this.died();
      }
    }

    display() {
      this.symbols.forEach((symbol) => {
        const lowestSymbol = symbol === this.lowestSymbol;
        const lowestSymbolColor = lowestSymbol ? p.color(0, 0, 100) : null;

        symbol.update(lowestSymbolColor);
        symbol.display();
      });
    }

    removeSymbol(key) {
      this.symbols.delete(key);
    }
  }
  
  class Cloud {
    constructor() {
      this.raindrops = new Map();    
      this.newRaindropTime = 0;
      this.maxRaindrops = Math.floor(p.width / FONT_SIZE) * 2; // Duplicamos la cantidad máxima
    }
    
    update() {   
      if (p.millis() > this.newRaindropTime) {
        if (this.raindrops.size < this.maxRaindrops) {
          // Crear múltiples gotas a la vez
          const newDropsCount = Math.floor(Math.random() * 3) + 1; // 1-3 gotas nuevas
          for (let i = 0; i < newDropsCount; i++) {
            const col = Math.floor(Math.random() * Math.floor(p.width / FONT_SIZE));
            this.addRaindrop(col);
          }
        }
        this.newRaindropTime = p.millis() + Math.random() * 50 + 25; // Intervalo más corto
      }
    }

    display() {
      this.raindrops.forEach(raindrop => {
        raindrop.update();
        raindrop.display();
      });
    }

    addRaindrop(col) {
      if (!this.raindrops.get(col)) {
        // Variar la velocidad para mayor efecto dinámico
        const speed = Math.random() * 2 + 3; // Entre 3 y 5
        this.raindrops.set(col, new Raindrop({ 
          x: FONT_SIZE * col, 
          y: -FONT_SIZE * Math.floor(Math.random() * 10), // Comienzan en diferentes alturas
          died: this.removeRaindrop.bind(this, col),
          speed: speed
        }));
        return true;
      }
    }

    removeRaindrop(col) {
      this.raindrops.delete(col);        
    }
  }
  
  class Rain {
    constructor() {
      this.cloud = new Cloud();
      this.name = 'Rain';
    }

    draw() {
      p.background(0, 0, 0, 25); // Fondo con ligera transparencia para efecto de rastro
      this.cloud.update();
      this.cloud.display();
    }
  }
  
  class Matrix {
    constructor() {
      this.isAnimating = true;
      this.scene = new Rain();
    }  
    
    run() {
      this.isAnimating = true;
      p.loop();
    }
  }
  
  p.draw = () => {
    m.scene.draw();
  }; 
}

const myp5 = new p5(s);