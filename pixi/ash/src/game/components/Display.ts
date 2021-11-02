import { SceneLayer } from '@core/game/Scene';
import { BaseView } from '@core/game/graphics/BaseView';

export class Display {
    public constructor(
        public view: BaseView,
        public layer: SceneLayer,
    ) { }

    public resize(): void {
        this.view.resize();
    }
}