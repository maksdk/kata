import { utils } from 'pixi.js';

export class EventShape extends utils.EventEmitter {
	constructor(target) {
		super();

		this.target = target;
		this.pointerState = 'none';

		this.target.interactive = true;

		target.on('pointerdown', this.onPointerDown, this);
		target.on('pointerup', this.onPointerUp, this);
		target.on('pointerupoutside', this.onPointerUp, this);
		target.on('pointerout', this.onPointerUp, this);
		target.on('pointermove', this.onPointerMove, this);
	}

	onPointerDown(e) {
		if (this.pointerState === 'none') {
			this.pointerState = 'down';
			this.emit('eventShape:down', e, this.target);
		}
	}

	onPointerUp(e) {
		if (this.pointerState === 'down' || this.pointerState === 'move') {
			this.pointerState = 'none';
			this.emit('eventShape:up', e, this.target);
		}
	}

	onPointerMove(e) {
		if (this.pointerState === 'down' || this.pointerState === 'move') {
			this.pointerState = 'move';
			this.emit('eventShape:move', e, this.target);
		}
	}
}