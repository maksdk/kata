// @ts-check
/* eslint-disable */
import {
  Application, Container, Graphics, Text
} from 'pixi.js';

const config = {
  width: 1280,
  height: 720,
  scale: 1,
  w: 0,
  h: 0,
  backgroundColor: 0x607d8b
};

const cellH = 40
const cellW = 40
const gridWidth = config.width / cellH;
const gridHeight = config.height / cellW;
const gridLength = gridWidth * gridHeight;

function getIndex(x, y, w) {
  const index = w * y + x;
  return index;
}

function getPoint(index, w, h) {
  const y = Math.floor(index / w);
  const x = index - (y * w);
  return [ x, y ]; 
}

class MainWindow extends Container {
  constructor() {
    super();
  
    const back = new Graphics();
    back.beginFill(0xFFFFFF);
    back.drawRect(config.width * -0.5, config.height * -0.5, config.width, config.height);
    back.endFill();
    this.addChild(back);

    const field = new Container();
    field.x = config.width * -0.5;
    field.y = config.height * -0.5;
    this.addChild(field);

    for (let i = 0; i < gridLength; i += 1) {
      const cell = new Graphics();
      cell.lineStyle(1, 0xFF0000);
      cell.drawRect(0, 0, cellW, cellH);
      cell.endFill();
      field.addChild(cell);

      // const text = new Text(String(i), { fontSize: 10 });
      // text.anchor.set(0.5);
      // text.x = cellW * 0.5;
      // text.y = cellH * 0.5;
      // cell.addChild(text);

      const [x, y] = getPoint(i, gridWidth, gridHeight);
      cell.x = x * cellW;
      cell.y = y * cellH;
    }
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
    this.app = new Application(config);
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
      gh = config.width;
      gw = Math.floor(gh * (w / h));
  
      if (gw < config.height) {
        gw = config.height;
        gh = Math.floor(config.height * (h / w));
      }
    } else {
      gh = config.height;
      gw = Math.floor(gh * (w / h));
  
      if (gw < config.width) {
        gw = config.width;
        gh = Math.floor(config.width * (h / w));
      }
    }

    this.app.renderer.resize(gw * 0.75, gh * 0.75);
  
    this.app.view.style.width = `${w}px`;
    this.app.view.style.height = `${h}px`;
  }
}

export default Game;
