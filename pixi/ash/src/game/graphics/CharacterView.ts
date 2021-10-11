import { Graphics } from 'pixi.js';

export class CharacterView extends Graphics {
    private color = 0xffffff;

    public constructor(color?: number) {
        super();
        
        this.draw(color || this.color);
    }

    public redraw(color: number): CharacterView {
        this.draw(color);
        return this;
    }

    private draw(color: number): void {
        this.moveTo(20, 0)
        .beginFill(color)
        .lineTo(-14, 14)
        .lineTo(-8, 0)
        .lineTo(-14, -14)
        .lineTo(20, 0)
        .endFill();
    }
}