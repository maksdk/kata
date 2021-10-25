import { Vector } from '@core/game/math/Vector';
import { Graphics } from 'pixi.js';
import { BaseView } from '@core/game/graphics/BaseView';
import { PrimitiveType } from '@core/game/components/RigidBody';

export class DebugCollisionShapeView extends BaseView {
    private debugColor = 0x00FF00;
    private debugBackgroundAlpha = 0.2;
    private debugLineWidth = 1;
    private debugLineAlpha = 0.5;

    public constructor(props: { type: PrimitiveType, polygon?: Vector[]; radius?: number }) {
        super();
        const { type, polygon = [], radius = 0 } = props;

        switch (type) {
            case PrimitiveType.Rect:
                this.drawDebugRect(polygon);
                break;
            case PrimitiveType.Circle:
                this.drawDebugCircle(radius);
                break;
            default:
                throw new Error(`Wrong collision shape type: "${type as string}".`);
        }
    }

    private drawDebugRect(polygon: Vector[]): void {
        if (polygon.length === 0) {
            throw new Error('You try to draw empty polygon');
        }

        const graphics = this.addChild(new Graphics());


        for (let i = 0; i < polygon.length; i += 1) {
            if (i === 0) {
                graphics.moveTo(polygon[0].x, polygon[0].y);
                graphics.lineStyle(this.debugLineWidth, this.debugColor, this.debugLineAlpha);
                graphics.beginFill(this.debugColor, this.debugBackgroundAlpha);
            }

            graphics.lineTo(polygon[i].x, polygon[i].y);

            if (i + 1 === polygon.length) {
                graphics.lineTo(polygon[0].x, polygon[0].y);
            }
        }

        graphics.endFill();

        const p1 = polygon[0];
        const p2 = polygon[1];
        const p3 = polygon[2];
        const p4 = polygon[3];

        graphics.moveTo(p1.x, p1.y);
        graphics.lineTo(p3.x, p3.y);
        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(p4.x, p4.y);
    }

    private drawDebugCircle(radius: number): void {
        if (radius === 0) {
            throw new Error('Radius must be more then 0px');
        }
        const graphics = this.addChild(new Graphics());
        graphics.lineStyle(this.debugLineWidth, this.debugColor, this.debugLineAlpha)
        .beginFill(this.debugColor, this.debugBackgroundAlpha)
        .drawCircle(0, 0, radius)
        .endFill();
    }
}