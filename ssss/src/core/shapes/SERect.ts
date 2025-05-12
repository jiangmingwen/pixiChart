
import { Graphics } from 'pixi.js';
import { SEBaseShape, ShapeConfig } from './SEBaseShape';
import { Container } from './Container';



export class RectGraphic extends SEBaseShape<ShapeConfig> {
    /** 图形名称 */
    static get name() {
        return 'rect';
    }

    renderEntry() {
        const graphics = new Graphics();
        graphics.rect(800, 50, 200, 1700);
        graphics.fill(0x650a5a);
        graphics.stroke({ width: 2, color: 0xfeeb77 });
        graphics.interactive = true;
        this.container = graphics as unknown as Container;
    }



}

