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

            float circleSoft(vec2 pt, vec2 center, float radius, float soft) {
                vec2 p = pt - center;
                float edge = radius * soft;
                return smoothstep(radius - edge, radius + edge, length(p));
            }

            void main() {
                float inCircle = circleSoft(vTextureCoord.xy, vec2(0.5, 0.5), 0.15, 0.1);
                vec3 color = vec3(vTextureCoord.x, vTextureCoord.y, 0.0) * inCircle;
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const filter = new Filter(null, fragmentShader);

        const container = new Container();
        container.filterArea = this.app.screen;
        container.filters = [filter];
        this.stage.addChild(container);
    }
}