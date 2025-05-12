import { FederatedPointerEvent } from "pixi.js";
import { GraphPlugin } from "./plugin";
import { BaseBlockShape } from "./BaseBlockShape";
import { IPoint } from "./type";
import { EHighlightMode } from "./hignlightPlugin";
import { clamp } from "./utils";
import { GlobalStype, MaxLayer } from "../../shapes/GlobalStyle";
import { SystemEventType } from "../SystemEvent";


/** 嵌套图元校验函数
 * @param id 图元id
 * @param parentId 父图元id 不存在表示拖拽到画布上
 */
export type INestValidFn = (id: string, parentId?: string) => boolean

/** 拖拽图元插件 */
export class DragShapePlugin extends GraphPlugin {

    /** 拖拽开始坐标 */
    private dragStartPosition?: {
        globalX: number,
        globalY: number,
        x: number,
        y: number
    }

    /** 可以嵌套的父图元 */
    nestParentShape?: BaseBlockShape

    private isDragging = false

    /** 鼠标拖动的基准图元 */
    baseShape?: BaseBlockShape



    private nestValid?: INestValidFn


    init() {
        this.onDragEnd = this.onDragEnd.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragMove = this.onDragMove.bind(this)
        this.graph.app.stage.on('pointerdown', this.onDragStart)
        this.graph.app.stage.on('pointerup', this.onDragEnd)
        this.graph.app.stage.on('pointerupoutside', this.onDragEnd)
    }


    setNestValidate(fn: INestValidFn) {
        this.nestValid = fn
    }


    private onDragStart(e: FederatedPointerEvent) {
        if(this.graph.connection.isConnecting) return
        if (this.graph.active.activedShapes.size === 0 ) return
        if (this.dragStartPosition) return
        this.graph.app.stage.on('pointermove', this.onDragMove)
    }

    private onDragEnd(event: FederatedPointerEvent) {
        this.graph.app.stage.off('pointermove', this.onDragMove)
        if (!this.isDragging) return
        let preParentId = this.baseShape?.parentId
        if (this.baseShape) {
            this.baseShape.zIndex = this.baseShape.options.zIndex
            if (this.nestParentShape) {
                this.graph.app.stage.removeChild(this.baseShape)
                this.nestParentShape.addChild(this.baseShape)
                const point = this.baseShape!.getRelativePoint({ x: this.baseShape.x, y: this.baseShape.y }, this.nestParentShape)
                this.baseShape.x = point.x
                this.baseShape.y = point.y
                this.baseShape.parentId = this.nestParentShape.id
            } else {
                const parent = this.graph.getParentShape(this.baseShape.id)
                if (parent) {
                    // 如果之前的parent存在，现在不存在，则表示从嵌套里拖出来了
                    this.baseShape.parentId = undefined
                }
            }
        }
        if(preParentId !== this.baseShape!.parentId) {
            this.graph.events.emit(SystemEventType.Nest, {
                [this.baseShape!.id]: {
                    parentId: this.baseShape!.parentId,
                }
            })
        }
        this.graph.events.emit(SystemEventType.Move, {
            [this.baseShape!.id]: {
                x: this.baseShape!.x,
                y: this.baseShape!.y
            }
        }).end()

        this.isDragging = false
        this.dragStartPosition = undefined
        this.baseShape = undefined
        this.nestParentShape = undefined
        this.graph.hignlight.hideNest()
    }





    private onDragMove(e: FederatedPointerEvent) {

        if (!this.isDragging) {
            // 增加性能，移动过程中只检测一次
            const shape = this.graph.hitTest(e.globalX, e.globalY)
            this.graph.events.begin()
            if (shape) {

                // 拖拽的鼠标上有图元
                this.isDragging = true
                this.baseShape = shape
                const baseShapeGlobalPoint = this.baseShape.getGlobalPoint()
                this.baseShape.parent.removeChild(shape)
                this.graph.addChild(this.baseShape)
                this.baseShape.x = baseShapeGlobalPoint.x
                this.baseShape.y = baseShapeGlobalPoint.y
                this.dragStartPosition = {
                    x: baseShapeGlobalPoint.x,
                    y: baseShapeGlobalPoint.y,
                    globalX: e.global.x,
                    globalY: e.global.y
                }
            } else {
                //拖拽 鼠标上没有图元，则为框选行为
                return
            }
        }

        if (!this.dragStartPosition || !this.baseShape) return
        // // 临时隐藏当前图元，让检测能够跳过鼠标拖拽的图元
        this.baseShape.zIndex = MaxLayer
        this.baseShape.visible = false
        const targetShape = this.graph.hitTest(e.globalX, e.globalY)

        if (this.nestParentShape) {
            if (targetShape && this.nestParentShape !== targetShape) {
                // 如果之前存在高亮的图元,先隐藏，再高亮现在的图元
                this.graph.hignlight.showNest(targetShape.id)
            }
        } else {
            if (targetShape) this.graph.hignlight.showNest(targetShape.id)
            else this.graph.hignlight.hideNest()

        }
        this.nestParentShape = targetShape
        // // 检测完毕后进行恢复
        this.baseShape.visible = true
        const { x, y } = this.calculatePosition(e)
        this.baseShape.x = x
        this.baseShape.y = y

    }



    //拖拽时候的快捷键说明
    // ctrl   alt  
    // 什么都不按，可以拖出父图元
    // ctrl  不能拖出父图元，父图元扩展
    // alt   不能拖出父图元 
    private calculatePosition(e: FederatedPointerEvent) {
        const startPosition = this.baseShape!.parent.toLocal({
            x: this.dragStartPosition!.globalX,
            y: this.dragStartPosition!.globalY
        })
        const endPoistion = this.baseShape!.parent.toLocal({
            x: e.global.x,
            y: e.global.y
        })
        const dx = endPoistion.x - startPosition.x
        const dy = endPoistion.y - startPosition.y
        let x = this.dragStartPosition!.x + dx
        let y = this.dragStartPosition!.y + dy

        if (!e.ctrlKey && !e.altKey) {
            //TODO 自由拖拽，parent可能会改变


        } else if (e.ctrlKey) {
            // 扩展父图元 TODO: 递归扩展父图元
            const parentId = this.getNestParent(this.baseShape!.id)
            const parent = this.graph.getShapeById(parentId ?? '')
            if (parent) {
                const dwx = x - (parent.width - this.baseShape!.width - GlobalStype.SafePadding)
                const dhy = y - (parent.height - this.baseShape!.height - GlobalStype.SafePadding)
                const parentWidth = parent.width + dwx
                const parentHeight = dhy > 0 ? parent.height + dhy : parent.height
                parent.width = parentWidth
                parent.height = parentHeight
                this.graph.events.emit(SystemEventType.Resize, {
                    [parent.id]: {
                        width: parentWidth,
                        height: parentHeight
                    }
                })
            }

        } else if (e.altKey) {
            // 边界限制
            const parent = this.graph.getParentShape(this.baseShape!.id)
            if (parent) {
                const pointParent = parent.getGlobalPoint()
                x = clamp(x,pointParent.x + GlobalStype.SafePadding,pointParent.x + parent.width - this.baseShape!.width - GlobalStype.SafePadding)
                y = clamp(y,pointParent.y + GlobalStype.SafePadding,pointParent.y+ parent.height - this.baseShape!.height - GlobalStype.SafePadding)
            }
        }

        return {
            x,
            y
        }
    }


    private getNestParent(id: string): string | undefined {
        let parent = this.graph.getParentShape(id)
        // 如果不校验，父图元直接可以嵌套
        if (!this.nestValid) return parent?.id
        while (!!parent) {
            const validate = this.nestValid(id, parent.id)
            if (validate) return parent.id
            // 继续查找可以嵌套的父图元
            parent = this.graph.getParentShape(parent.id)
        }
        return undefined
    }



    destroy() {
        this.graph.app.stage.off('pointerdown', this.onDragStart)
        this.graph.app.stage.off('pointerup', this.onDragEnd)
        this.graph.app.stage.off('pointerupoutside', this.onDragEnd)
    }
}