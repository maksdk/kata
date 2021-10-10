import { Vector } from '@core/game/math/Vector';
import { CollisionShapeType } from '@core/game/components/Collision';
import { Graphics } from 'pixi.js';

export class DebugCollisionShapeView extends Graphics {
    private debugColor = 0x00FF00;
    private debugBackgroundAlpha = 0.2;
    private debugLineWidth = 1;
    private debugLineAlpha = 0.5;

    public constructor(props: { type: CollisionShapeType, polygon?: Vector[]; radius?: number }) {
        super();
        const { type, polygon = [], radius = 0 } = props;

        switch (type) {
            case CollisionShapeType.Rect:
                this.drawDebugRect(polygon);
                break;
            case CollisionShapeType.Circle:
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

        for (let i = 0; i < polygon.length; i += 1) {
            if (i === 0) {
                this.moveTo(polygon[0].x, polygon[0].y);
                this.lineStyle(this.debugLineWidth, this.debugColor, this.debugLineAlpha);
                this.beginFill(this.debugColor, this.debugBackgroundAlpha);
            }

            this.lineTo(polygon[i].x, polygon[i].y);

            if (i + 1 === polygon.length) {
                this.lineTo(polygon[0].x, polygon[0].y);
            }
        }

        this.endFill();

        const p1 = polygon[0];
        const p2 = polygon[1];
        const p3 = polygon[2];
        const p4 = polygon[3];

        this.moveTo(p1.x, p1.y);
        this.lineTo(p3.x, p3.y);
        this.lineTo(p1.x, p1.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p4.x, p4.y);
    }

    private drawDebugCircle(radius: number): void {
        if (radius === 0) {
            throw new Error('Radius must be more then 0px');
        }
        this.lineStyle(this.debugLineWidth, this.debugColor, this.debugLineAlpha)
        .beginFill(this.debugColor, this.debugBackgroundAlpha)
        .drawCircle(0, 0, radius)
        .endFill();
    }
}