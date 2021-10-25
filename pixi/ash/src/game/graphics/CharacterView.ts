import { BaseView } from '@core/game/graphics/BaseView';
import { Vector } from '@core/game/math/Vector';
import { Graphics } from 'pixi.js';

export class CharacterView extends BaseView {
    private color = 0xffffff;

    public constructor(color: number, private vertices: Vector[]) {
        super();

        this.draw(color || this.color);
    }

    public redraw(color: number): CharacterView {
        this.draw(color);
        return this;
    }

    private draw(color: number): void {
        const graphics = this.addChild(new Graphics());

        this.vertices.forEach((v, i) => {
            if (i === 0) {
                graphics.moveTo(v.x, v.y)
                .beginFill(color);
            } else {
                graphics.lineTo(v.x, v.y);
            }

            if (i + 1 === this.vertices.length) {
                graphics.endFill();
            }
        });
    }
}