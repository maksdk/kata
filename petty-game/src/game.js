// @ts-check
/* eslint-disable */
import {
  Application, Container, Graphics, Text, utils
} from 'pixi.js';

import has from 'lodash/has';
import FontFaceObserver from 'fontfaceobserver';

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

export class AssetsPreloader {
  constructor(app, assets) {
    this.options = { crossOrigin: 'anonymous' }
    this.app = app;
    this.assets = {
      images: [
        { name: 'cartman', url: 'assets/images/cartman.png' },
        { name: 'butters', url: 'assets/images/butters.png' },
        { name: 'kenny', url: 'assets/images/kenny.png' }
      ],
      fonts: [
        { name: 'MotionPicture', url: 'assets/fonts/MotionPicture.ttf' },
        { name: 'Coneria', url: 'assets/fonts/Coneria.ttf' }
      ]
    };

    this.loadedItemsCount = 0;
    this.totalItemsCount = Object.values(this.assets)
      .reduce((acc, item) => acc + item.length, 0);

    this.loadersMap = {
      images: (loader) => loader.loadImages(),
      fonts: (loader) => loader.loadFonts()
    };

    Object.keys(this.assets)
      .forEach((key) => this.loadersMap[key](this));
  }

  loadImages(images = this.assets.images) {
    images.forEach(({ name, url }) => {
      if (!has(this.app.loader.resources, name)) {
        this.app.loader.add(name, url, this.options);
      }
    });

    this.app.loader.onProgress.add(() => this.incrementProgress());

    return new Promise((resolve) => this.app.loader.load(resolve));
  }

  loadFonts(fonts = this.assets.fonts) {
		const [container] = document.getElementsByTagName('head');
		const promises = fonts.map(({ name, url }) => {
			const style = document.createElement('style');
			style.type = 'text/css';
			style.appendChild(document.createTextNode(`@font-face { font-family:${name}; src: url(${url}); }`));
			container.appendChild(style);

			return new FontFaceObserver(name).load()
				.then(() => this.incrementProgress());
		});

		return Promise.all(promises);
  }
  
  incrementProgress() {
    this.loadedItemsCount += 1;
    console.log('progress: ', this.loadedItemsCount,Math.floor((this.loadedItemsCount / this.totalItemsCount) * 100) );
		// if (this.onProgressCallback) {
		// 	this.onProgressCallback(Math.floor((this.loadedItemsCount / this.totalItemsCount) * 100));
		// }
	}
}

class MainWindow extends Container {
  constructor() {
    super();
  
    const back = new Graphics();
    back.beginFill(0xFFFFFF);
    back.drawRect(config.width * -0.5, config.height * -0.5, config.width, config.height);
    back.endFill();
    this.addChild(back);

    const world = new Container();
    world.x = config.width * -0.5;
    world.y = config.height * -0.5;
    this.addChild(world);

    for (let i = 0; i < gridLength; i += 1) {
      const cell = new Graphics();
      cell.lineStyle(1, 0xFF0000);
      cell.drawRect(0, 0, cellW, cellH);
      cell.endFill();
      world.addChild(cell);

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


    const loader = new AssetsPreloader(this.app, []);
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
