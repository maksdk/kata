import { Application, Container, Renderer, Filter } from 'pixi.js';

export class Game {
    public stage: Container;
    public app: Application;
    public renderer: Renderer;

    public constructor() {
        this.app = new Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x0000FF,
        });

        this.stage = this.app.stage;
        this.renderer = this.app.renderer;

        document.body.appendChild(this.app.view);

        const fragmentShader = `
            varying vec2 vTextureCoord;
            void main() {
                gl_FragColor = vec4(vTextureCoord.x, vTextureCoord.y, 0.0, 1.0);
            }
        `;

        const filter = new Filter(null, fragmentShader);

        const container = new Container();
        container.filterArea = this.app.screen;
        container.filters = [filter];
        this.stage.addChild(container);
    }
}


// var app = new PIXI.Application({width : window.innerWidth, height : window.innerHeight});
// app.resizeTo = window;

// let fragmentShader = document.getElementById('fragmentShader').textContent;

// let filter = new PIXI.Filter(null, fragmentShader);
// filter.uniforms.iResolution = [app.screen.width, app.screen.height];
// filter.uniforms.iGlobalTime = 0.0;

// let container = new PIXI.Container();
// container.filterArea = app.screen;
// container.filters = [filter];

// app.stage.addChild(container);
// document.getElementById('container').appendChild(app.view);

// function onresize(event) {
//     if (app.resize)
//         app.resize();
//     container.filterArea = app.screen;
//     filter.uniforms.iResolution = [app.screen.width, app.screen.height];
// }
// window.addEventListener('resize', onresize, false);

// startTime = Date.now();
// app.ticker.add(function(delta) {
//     var currentTime = Date.now();
//     filter.uniforms.iGlobalTime = (currentTime - startTime) * 0.0005;
// });