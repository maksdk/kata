import { Application, Container, Renderer } from 'pixi.js';

export class Game {
    public stage: Container;
    public app: Application;
    public renderer: Renderer;

    public constructor() {
        this.app = new Application({
            width: 600,
            height: 600,
            backgroundColor: 0x0000FF,
        });

        this.stage = this.app.stage;
        this.renderer = this.app.renderer;

        document.body.appendChild(this.app.view);
    }
}
