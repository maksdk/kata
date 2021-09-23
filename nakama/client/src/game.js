// @ts-check
import { Application } from 'pixi.js';
import { MainWindow } from './MainWindow';

export class Game {
	constructor() {
		this.app = null;
		this.currentWindow = null;
		this.width = 1280;
		this.height = 720;
	}

	create() {
		this.app = new Application({
			width: this.width,
			height: this.height,
			backgroundColor: 0x607d8b
		});
		this.app.view.style.position = 'absolute';
		this.app.view.style.left = '0';
		this.app.view.style.top = '0';
		document.body.appendChild(this.app.view);

		this.fitLayout();
	}

	start() {
		this.currentWindow = new MainWindow(this);
		this.app.stage.addChildAt(this.currentWindow, 0);
		this.currentWindow.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
        
		this.app.ticker.add(this.update.bind(this));

		this.onResize();
	}

	onResize() {
		if (this.currentWindow) {
			this.currentWindow.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
		}
	}
    
	update() {
		this.currentWindow.update(this.app.ticker.elapsedMS);
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
			gh = this.width;
			gw = Math.floor(gh * (w / h));

			if (gw < this.height) {
				gw = this.height;
				gh = Math.floor(this.height * (h / w));
			}
		} else {
			gh = this.height;
			gw = Math.floor(gh * (w / h));

			if (gw < this.width) {
				gw = this.width;
				gh = Math.floor(this.width * (h / w));
			}
		}

		this.app.renderer.resize(gw * 1.5, gh * 1.5);

		this.app.view.style.width = `${w}px`;
		this.app.view.style.height = `${h}px`;
	}
}