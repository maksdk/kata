import * as PIXI from 'pixi.js';

export class Game {
    public create(): PIXI.Application {
        const app = new PIXI.Application({ width: 600, height: 600, backgroundColor: 0xFF0000 });
        document.body.appendChild(app.view);
        return app;
    }
}
