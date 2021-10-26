import { Application, Container, Renderer, Filter, InteractionEvent } from 'pixi.js';

interface IUniform {
    uResolution: [number, number];
    uMouse: [number, number];
}

export class Game {
    public stage: Container;
    public app: Application;
    public renderer: Renderer;
    private filter: Filter;

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
            uniform vec2 uResolution;
            uniform vec2 uMouse;

            float circleSoft(vec2 pt, vec2 center, float radius, float soft) {
                vec2 p = pt - center;
                float edge = radius * soft;
                return smoothstep(radius - edge, radius + edge, length(p));
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                uv.y = 1.0 - uv.y; // flip Y coord
        
                vec2 center = uMouse.xy / uResolution.xy;

                float inCircle = circleSoft(uv.xy, center, 0.15, 0.1);
                vec3 color = vec3(uv.x, uv.y, 0.0) * inCircle;
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        this.filter = new Filter(null, fragmentShader);
        (this.filter.uniforms as IUniform).uResolution = [this.app.screen.width, this.app.screen.height];
        (this.filter.uniforms as IUniform).uMouse = [0, 0];

        const container = new Container();
        container.filterArea = this.app.screen;
        container.filters = [this.filter];
        this.stage.addChild(container);

        this.stage.interactive = true;
        this.stage.buttonMode = true;
        this.stage.on('pointermove', this.onMove, this);
    }

    private onMove(e: InteractionEvent): void {
        const locPos = e.data.getLocalPosition(this.stage);
        (this.filter.uniforms as IUniform).uMouse = [locPos.x, locPos.y];
    }
}