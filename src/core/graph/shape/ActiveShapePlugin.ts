import { FederatedPointerEvent } from "pixi.js";
import { GraphPlugin } from "./plugin";
import { BaseBlockShape } from "./BaseBlockShape";

/** 选中图元插件 */
export class ActiveShapePlugin extends GraphPlugin {
    /** 
     * 已激活的图元
     */
    activedShapes: Map<string, BaseBlockShape> = new Map()

    private validate(shape: BaseBlockShape) {
        return shape.options.selectable !== false
    }

    setValidate(fn: (shape: BaseBlockShape) => boolean) {
        this.validate = fn
    }

    private pointerdown(e: FederatedPointerEvent) {
        const shape = this.graph.hitTest(e.globalX, e.globalY)
        console.log(1,shape)
        if (!shape) {
            this.clear()
            return
        }
        if (!this.validate(shape)) return;
        if (!e.ctrlKey) {  // 按下了ctrl键，表示多选
            // 不是多选，清空之前的
            this.clear()
        }
       
        this.graph.hignlight.showActive(shape.id)
        this.activedShapes.set(shape.id, shape)
    }

    /** 清除所有选中的图元 */
    clear() {
        this.graph.hignlight.hideActive()
        this.activedShapes.clear()
    }



    override  init(): void {
        this.pointerdown = this.pointerdown.bind(this)
        this.graph.app.stage.on('pointerdown', this.pointerdown)
    }

    override destroy(): void {
        this.graph.app.stage.off('pointerdown', this.pointerdown)
    }


}