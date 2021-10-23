import { Vector } from '@core/game/math/Vector';
import { Graphics } from 'pixi.js';

export class CharacterView extends Graphics {
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
        this.vertices.forEach((v, i) => {
            if (i === 0) {
                this.moveTo(v.x, v.y)
                .beginFill(color);
            } else {
                this.lineTo(v.x, v.y);
            }

            if (i + 1 === this.vertices.length) {
                this.endFill();
            }
        });
    }
}