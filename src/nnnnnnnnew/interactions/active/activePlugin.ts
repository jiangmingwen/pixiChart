import { FederatedPointerEvent } from "pixi.js";
import { InteractionPlugin } from "../interactionPlugin";
import { BlockShape } from "../../shapes/blocks/blockShape";


/** 选中图元插件 */
export class ActiveShapePlugin extends InteractionPlugin {
    /** 
     * 已激活的图元
     */
    activedShapes: Map<string, BlockShape> = new Map()

    private validate(shape: BlockShape) {
        return shape.options.selectable !== false
    }

    setValidate(fn: (shape: BlockShape) => boolean) {
        this.validate = fn
    }

    private pointerdown(e: FederatedPointerEvent) {
        console.log(1,'1')
        if (this.interactions.connection.isConnecting) return
        const shape = this.graph.hitTest(e.globalX, e.globalY)
        if (!shape) {
            this.clear()
            return
        }
        if (!this.validate(shape)) return;
        if (!e.ctrlKey) {  // 按下了ctrl键，表示多选
            // 不是多选，清空之前的
            this.clear()
        }

        this.interactions.hignlight.showActive(shape.id)
        this.activedShapes.set(shape.id, shape)
    }

    /** 清除所有选中的图元 */
    clear() {
        this.interactions.hignlight.hideActive()
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