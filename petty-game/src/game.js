// @ts-check
/* eslint-disable */
import {
  Application, Container, Graphics, Text, utils, Sprite
} from 'pixi.js';
import range from 'lodash/range';
import chunk from 'lodash/chunk';

const config = {
  width: 1280,
  height: 720,
  scale: 1,
  w: 0,
  h: 0,
  backgroundColor: 0x607d8b
};

const cellH = 20;
const cellW = 20;
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

class Cell extends Container {
    constructor(w, h, index, state) {
        super();

        this.index = index;

        this.state = state;

        this.back = new Graphics();
        this.back.beginFill(0xFFFFFF);
        this.back.drawRect(0, 0, w, h);
        this.back.endFill();
        this.addChild(this.back);

        const border = new Graphics();
        border.lineStyle(1, 0x000000);
        border.drawRect(0, 0, w, h);
        border.endFill();
        this.addChild(border);

        this[state](this.state);
    }

    fill(state) {
        this.state = state;
        this.back.tint = 0x666666;
    }

    clear(state) {
        this.state = state;
        this.back.tint = 0xFFFFFF;
    }
}

class EventShape extends utils.EventEmitter {
    constructor(target) {
        super();

        this.target = target;
        this.pointerState = 'none';
        
        target.interactive = true;

        target.on('pointerdown', this.onPointerDown, this);
        target.on('pointerup', this.onPointerUp, this);
        target.on('pointerupoutside', this.onPointerUp, this);
        target.on('pointerout', this.onPointerUp, this);
        target.on('pointermove', this.onPointerMove, this);
    }

    onPointerDown(e) {
        if (this.pointerState === 'none') {
            this.pointerState = 'down';
            this.emit('eventShape:down', e, this.target);
        }
    }

    onPointerUp(e) {
        if (this.pointerState === 'down' || this.pointerState === 'move') {
            this.pointerState = 'none';
            this.emit('eventShape:up', e, this.target);
        }
    }

    onPointerMove(e) {
        if (this.pointerState === 'down' || this.pointerState === 'move') {
            this.pointerState = 'move';
            this.emit('eventShape:move', e, this.target);
        }
    }
}

class MainWindow extends Container {
  constructor() {
    super();

    let editState = 'fill';

    const board = new Graphics();
    board.beginFill(0xFFFFFF);
    board.drawRect(0, 0, config.width, config.height);
    board.endFill();
    board.x = config.width * -0.5;
    board.y = config.height * -0.5;
    this.addChild(board);


    const world = new Container();
    world.x = config.width * -0.5;
    world.y = config.height * -0.5;
    this.addChild(world);

    const cells = range(gridLength).map((index) => {
        const [x, y] = getPoint(index, gridWidth, gridHeight);

        const cell = new Cell(cellW, cellH, index, editState);
        cell.x = x * cellW;
        cell.y = y * cellH;
        world.addChild(cell);

        return cell;
    });

    const eventShape = new EventShape(board);
    eventShape.on('eventShape:down', (e) => {
        const pos = e.data.getLocalPosition(board);
        const x = Math.floor(pos.x / cellH);
        const y = Math.floor(pos.y / cellH);
        const index = getIndex(x, y, gridWidth);
        const cell = cells[index];

        if (editState === 'fill' && editState === cell.state) {
            editState = 'clear';
        } else if (editState === 'clear' && editState === cell.state) {
            editState = 'fill';
        }

        cell[editState](editState);
    });
    eventShape.on('eventShape:up', (e) => {
        // const result = cells.map((cell) => {
        //     if (cell.state === 'fill') return 1;
        //     return 0;
        // });
        // console.table(chunk(result, gridWidth));
    });
    eventShape.on('eventShape:move', (e) => {
        const pos = e.data.getLocalPosition(board);
        const x = Math.floor(pos.x / cellH);
        const y = Math.floor(pos.y / cellH);
        const index = getIndex(x, y, gridWidth);
        const cell = cells[index];
        cell[editState](editState);
    });
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
