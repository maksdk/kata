// @ts-check
/* eslint-disable */
import {
  Application, Container, Graphics
} from 'pixi.js';

const CONFIG = {
  width: 1280,
  height: 720,
  scale: 1,
  w: 0,
  h: 0,
  backgroundColor: 0xFF0000
};

class MainWindow extends Container {
  constructor() {
    super();
  
    const rect = new Graphics();
    rect.beginFill(0xFFFFFF);
    rect.drawRect(CONFIG.width * -0.5, CONFIG.height * -0.5, CONFIG.width, CONFIG.height);
    rect.endFill();

    this.addChild(rect);
  }
}

class Game {
  constructor() {
    this.app = null;
    this.currentWindow = null;
  }

  init() {

  }

  create() {
    this.app = new Application(CONFIG);
    this.app.view.style.position = 'absolute';
    this.app.view.style.left = '0';
    this.app.view.style.top = '0';
    document.body.appendChild(this.app.view);

    this.fitLayout();
  }

  start() {
    this.currentWindow = new MainWindow();
    this.app.stage.addChildAt(this.currentWindow, 0);
    this.currentWindow.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);

    this.onResize();
  }

  onResize() {
    if (this.currentWindow) {
      this.currentWindow.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
      // if (this.currentWindow.onResize) this.currentWindow.onResize();
    }
  }

  fitLayout() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    document.body.style.width = `${w}px`;
    document.body.style.height = `${h}px`;

    const isLand = w > h;
    let gw; 
    let gh;

    if (isLand) {
      gh = CONFIG.width;
      gw = Math.floor(gh * (w / h));
  
      if (gw < CONFIG.height) {
        gw = CONFIG.height;
        gh = Math.floor(CONFIG.height * (h / w));
      }
    } else {
      gh = CONFIG.height;
      gw = Math.floor(gh * (w / h));
  
      if (gw < CONFIG.width) {
        gw = CONFIG.width;
        gh = Math.floor(CONFIG.width * (h / w));
      }
    }

    this.app.renderer.resize(gw * 0.75, gh * 0.75);
  
    this.app.view.style.width = `${w}px`;
    this.app.view.style.height = `${h}px`;
  }
}

export default Game;
