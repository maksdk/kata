// @ts-check
import { Container, Graphics, Sprite } from 'pixi.js';

export class MainStage extends Container {
    constructor() {
        super();

        this.playerSpeed = 20;
        this.playerDir = 1;

        this.gw = 600;
        this.gh = 600;

        this.obstacleRunning = false;
        this.obstacleSpeed = 40;
        this.obstacleDir = 1;

        const player = this.addChild(new Graphics())
            .beginFill(0xFFFFFF)
            .drawRect(0, 0, 50, 50)
            .endFill();
        player.tint = 0x0000FF;
        player.x = 150;


        const remotePlayer =  this.addChild(new Graphics())
            .beginFill(0xFFFFFF)
            .drawRect(0, 0, 50, 50)
            .endFill();
        remotePlayer.tint = 0x00FFFF;
        remotePlayer.x = 450;


        this.entities = {
            player: { name: 'player', elem: player, direction: 1, state: 'idle' },
            remotePlayer: {name: 'remote', elem: remotePlayer, direction: 1, state: 'idle' }
        };

    
        this.obstacle = this.addChild(new Graphics())
            .beginFill(0xFFFF00)
            .drawRect(0, 0, 20, 20)
            .endFill();
        this.obstacle.once('pointerdown', () => {
            this.emit('runObstacle');
            this.obstacleRunning = true;
        });
        this.obstacle.interactive = true;
        this.obstacle.y = 200;


        this.eventShape = this.addChild(new Sprite());
        this.eventShape.width = this.gw;
        this.eventShape.height = this.gh;
        this.eventShape.interactive = true;

        this.eventShape.on('pointerdown', () => {
            this.emit('movePlayer');
            this.moveEntity('player');
        }, this);


        this.eventShape.on('pointerup', () => {
            this.emit('stopPlayer');
            this.stopEntity('player');
        }, this);
    }


    rectIntersect(r0, r1) {
        return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }

    rangeIntersect(min0, max0, min1, max1) {
        return Math.max(max0, min0) >= Math.min(min1, max1) && 
            Math.min(max0, min0) <= Math.max(max1, min1);
    }

    collide(entity) {
        entity.tint = 0xFF0000;
    }

    moveEntity(name = 'player') {
        if (this.entities[name].state === 'died') return;
        this.entities[name].state = 'move';
        console.log('move', name)
    }

    stopEntity(name = 'player') {
        if (this.entities[name].state === 'died') return;
        this.entities[name].state = 'stop';
    }

    tick(delta) {
        // if(this.stopped) return;

        /**
         * Move obstacle
         */
        if (this.obstacleRunning) {
            const obstacleSpeed = (delta / 100) * this.obstacleSpeed;
            this.obstacle.x += obstacleSpeed * this.obstacleDir;
            if (this.obstacle.x + 20 > this.gw) {
                this.obstacle.x = this.gw - 20;
                this.obstacleDir *= -1;
            } else if (this.obstacle.x < 0) {
                this.obstacle.x = 0;
                this.obstacleDir *= -1;
            }
        }
        

        /**
         * Move player
         */
        const playerSpeed = (delta / 100) * this.playerSpeed;
        Object.values(this.entities)
            .forEach(({ name, state, elem, direction }) => {
                if (name === 'remote') {
                    console.log(state)
                }
                if (state === 'move') {
                    elem.y += playerSpeed * direction;

                    if (elem.y + 50 > this.gh) {
                        elem.y = this.gh - 50;
                        direction *= -1;
                    }
                }
            });


        /**
         * Check collide
         */
        const obstacleRect = { width: 20, height: 20, x: this.obstacle.x, y: this.obstacle.y };
        Object.values(this.entities)
            .forEach((entity) => {
                if (entity.state === 'died') return;
                const playerRect = { width: 50, height: 50, x: entity.elem.x, y: entity.elem.y };

                if (this.rectIntersect(obstacleRect, playerRect)) {
                    entity.elem.tint = 0xFF0000;
                    entity.state = 'died';
                }
            });
    }
}