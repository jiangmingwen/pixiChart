import { Graphics } from "pixi.js";
import { IPIXIGraph, SEBaseGraph } from "../graph/SEBaseGraph";
import { SEBaseShape, ShapeConfig } from "./SEBaseShape";


export interface CircleConfig extends ShapeConfig {
    radius: number;
    color: number;
}

export class CircleGraphic extends SEBaseShape<CircleConfig> {
    /** 图形名称 */
    static  get name() {
        return 'circle';
    }

  
    createPixiObject(): IPIXIGraph {
        const graphics = new Graphics();
        graphics.circle(this.config.x??0, this.config.y??0, this.config.radius);
        graphics.fill({
            color: this.config.color,
            alpha: 1,
        });
        graphics.interactive = true;
        
        return this.pixiObject = graphics;
    }

    init(app: SEBaseGraph): this {
        this.app = app;
        this.createPixiObject();
        return this;
    }



}
