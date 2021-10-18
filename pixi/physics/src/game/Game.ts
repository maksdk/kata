import { Application, Container, Graphics, Renderer, Ticker } from 'pixi.js';
import { Bodies, Body, Engine, Events, IEventCollision, Render, Runner, World } from 'matter-js'; 

export class Game {
    public stage: Container;
    public app: Application;
    public renderer: Renderer;
    public ticker: Ticker;

    public constructor() {
        this.app = new Application({
            width: 600,
            height: 600,
            backgroundColor: 0x000000,
        });

        this.stage = this.app.stage;
        this.renderer = this.app.renderer;
        document.body.appendChild(this.app.view);

        const physics = new Physics(this.createMatterCanvas());

        const ground = new Graphics()
            .beginFill(0xFF0000, 0.4)
            .drawRect(400 - 405, 380 - 30, 810, 60)
            .endFill();
        this.stage.addChild(ground);

        const box = new Graphics()
            .beginFill(0xFF0000, 0.4)
            .drawRect(400 - 40, 300 - 40, 80, 80)
            .endFill();
        this.stage.addChild(box);


        const ball = new Graphics()
            .beginFill(0xFF0000, 0.4)
            .drawCircle(0, 0, 40)
            .lineStyle(2, 0x0000ff)
            .moveTo(0, 40)
            .lineTo(0, 0)
            .endFill();
        ball.position.set(350, 100);
        this.stage.addChild(ball);

        this.ticker = Ticker.shared;
        this.ticker.add(() => {
            ball.position.x = physics.ball.position.x;
            ball.position.y = physics.ball.position.y;
            ball.rotation = physics.ball.angle;
        });
        this.ticker.start();
    }

    private createMatterCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = this.renderer.width;
        canvas.height = this.renderer.height;
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.border = '1px solid #0000FF';
        document.body.appendChild(canvas);
        return canvas;
    }
}

class Physics {
    public ball: Body;

    public constructor(private canvas: HTMLCanvasElement) {
        const engine = Engine.create();

        const render = Render.create({
            canvas: this.canvas,
            engine: engine,
            options: {
                background: '#00000000',
                wireframeBackground: '#00000000',
                width: 600,
                height: 600,
                // @ts-ignore
                showCollisions: true
            }});

        const boxA = Bodies.rectangle(400, 300, 80, 80, { isStatic: true });
        const ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });
        const ball = Bodies.circle(350, 100, 40);
        this.ball = ball;

        World.add(engine.world, [boxA, ball, ground]);

        Runner.run(engine);

        Render.run(render);

        Events.on(engine, 'collisionStart',(event: IEventCollision<Engine>) => {
            console.log('Evento: ', event);

            const pairs = event.pairs;
            pairs.forEach(pair => {
                for (let j = 0; j < pair.activeContacts.length; j++) {
                    const contact = pair.activeContacts[j],
                        vertex = contact.vertex;
                }
            });
        });
    }
}
