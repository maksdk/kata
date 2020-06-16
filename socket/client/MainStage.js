// @ts-check
import { Container, Graphics, Sprite } from 'pixi.js';

export class MainStage extends Container {
    constructor() {
        super();

        this.stopped = false;

        this.playerIsRun = false;
        this.playerSpeed = 20;
        this.playerDir = 1;

        this.gw = 600;
        this.gh = 600;

        this.obstacleSpeed = 40;
        this.obstacleDir = 1;

        this.player = this.addChild(new Graphics())
            .beginFill(0xFFFFFF)
            .drawRect(0, 0, 50, 50)
            .endFill();
        this.player.tint = 0x0000FF;
        this.player.x = 150;


        this.remotePlayer =  this.addChild(new Graphics())
            .beginFill(0x00FFFF)
            .drawRect(0, 0, 50, 50)
            .endFill();
        this.remotePlayer.x = 450;

        this.obstacle = this.addChild(new Graphics())
            .beginFill(0xFFFF00)
            .drawRect(0, 0, 20, 20)
            .endFill();
        this.obstacle.y = 200;

        this.eventShape = this.addChild(new Sprite());
        this.eventShape.width = this.gw;
        this.eventShape.height = this.gh;
        this.eventShape.interactive = true;
        this.eventShape.on('pointerdown', this.onDown, this);
        this.eventShape.on('pointerup', this.onUp, this);
    }

    onDown() {
        this.playerIsRun = true;
    }
    
    onUp() {
        this.playerIsRun = false;
    }

    rectIntersect(r0, r1) {
        return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }

    rangeIntersect(min0, max0, min1, max1) {
        return Math.max(max0, min0) >= Math.min(min1, max1) && 
            Math.min(max0, min0) <= Math.max(max1, min1);
    }

    collide() {
        this.player.tint = 0xFF0000;
    }

    tick(delta) {
        if(this.stopped) return;

        const obstacleSpeed = (delta / 100) * this.obstacleSpeed;
        this.obstacle.x += obstacleSpeed * this.obstacleDir;
        if (this.obstacle.x + 20 > this.gw) {
            this.obstacle.x = this.gw - 20;
            this.obstacleDir *= -1;
        } else if (this.obstacle.x < 0) {
            this.obstacle.x = 0;
            this.obstacleDir *= -1;
        }


        if (this.playerIsRun) {
            const playerSpeed = (delta / 100) * this.playerSpeed;
            this.player.y += playerSpeed * this.playerDir;

            if (this.player.y + 50 > this.gh) {
                this.player.y = this.gh - 50;
                this.playerDir *= -1;
            }
        }

        const obstacleRect = { width: 20, height: 20, x: this.obstacle.x, y: this.obstacle.y };
        const playerRect = { width: 50, height: 50, x: this.player.x, y: this.player.y };
        if (this.rectIntersect(obstacleRect, playerRect)) {
            this.collide();
            this.stopped = true;
        }
    }
}