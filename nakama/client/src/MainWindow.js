import { Container, Graphics } from 'pixi.js';

export class MainWindow extends Container {
	constructor(game) {
		super();
		this.enemySpeed = 20;
		this.enemyDirection = 1;
		this.game = game;

		const board = new Graphics();
		board.beginFill(0xFFFFFF);
		board.drawRect(0, 0, this.game.width, this.game.height);
		board.endFill();
		board.x = this.game.width * -0.5;
		board.y = this.game.height * -0.5;
		this.addChild(board);
        
		const healthArea = new Graphics();
		healthArea.beginFill(0xFFFF00);
		healthArea.drawRect(-200, -200, 400, 400);
		healthArea.endFill();
		this.healthArea = healthArea;
		this.addChild(healthArea);

		const enemy = new Graphics();
		enemy.beginFill(0xFF0000);
		enemy.drawRect(-30, -30, 60, 60);
		enemy.endFill();
		enemy.x = this.game.width * -0.5;
		enemy.y = 0;
		this.enemy = enemy;
		this.addChild(enemy);
	}
    
	update(dt) {
		this.enemy.x += (dt / 100) * this.enemySpeed * this.enemyDirection;
		if (this.enemy.x > this.game.width * 0.5 
            || this.enemy.x < this.game.width * -0.5) {
			this.enemyDirection *= -1;
		}
	}
}