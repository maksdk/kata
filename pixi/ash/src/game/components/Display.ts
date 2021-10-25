import { BaseView } from '@core/game/graphics/BaseView';
import { RenderViewLayer } from '@core/game/systems/RenderSystem';

export class Display {
    public constructor(
        public view: BaseView,
        public layer: RenderViewLayer,
    ) { }

    public resize(): void {
        this.view.resize();
    }
}