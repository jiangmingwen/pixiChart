import { FederatedPointerEvent } from "pixi.js";
import { InteractionPlugin } from "../interactionPlugin";
import { MaxLayer, GlobalStype } from "../../../core/shapes/GlobalStyle";
import { BlockShape } from "../../shapes/blocks/blockShape";
import { SystemEventType } from "../../utils/type";
import { clamp } from "../../utils/utils";
import { IDropValidFn, INestValidFn, IPreviewData } from "./type";
import { SEGraphics } from "../../pixiOverrides/graphics";
import { Graph } from "../../graph/graph";




/** 拖拽图元插件 */
export class DragPlugin extends InteractionPlugin {

    /** 拖拽开始坐标 */
    private dragStartPosition?: {
        globalX: number,
        globalY: number,
        x: number,
        y: number
    }

    /** 可以嵌套的父图元 */
    nestParentShape?: BlockShape

    private isDragging = false

    /** 鼠标拖动的基准图元 */
    baseShape?: BlockShape

    /** 嵌套校验 */
    private nestValid?: INestValidFn

    // /** 拖拽释放的图元校验 */
    // private dropValid?: IDropValidFn

    // /** 拖拽的图元类型  （从画布外拖进画布内）*/
    // private dragGraphType?: string = ''

    init() {
        this.onDragEnd = this.onDragEnd.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragMove = this.onDragMove.bind(this)
        // this.onDragToGraph = this.onDragToGraph.bind(this)
        this.graph.app.stage.on('pointerdown', this.onDragStart)
        this.graph.app.stage.on('pointerup', this.onDragEnd)
        this.graph.app.stage.on('pointerupoutside', this.onDragEnd)
    }


    setNestValidate(fn: INestValidFn) {
        this.nestValid = fn
    }


    // setDragGraphType(type: string) {
    //     this.dragGraphType = type
    //     this.graph.app.stage.on('pointermove', this.onDragToGraph)
    //     window.addEventListener('mouseup',()=> {
    //         this.dragGraphType = undefined
    //         this.graph.app.stage.off('pointermove', this.onDragToGraph)
    //     })

    //     // this.graph.app.stage.on('pointerup', this.onDragEnd)
    // }

    // private onDragToGraph(event: FederatedPointerEvent){
    //     const shape = this.graph.hitTest(event.globalX, event.globalY)
    //     console.log(shape,'shape')
    //     if(shape) {

    //     }
    // }
    /** 预览图形 */
    previewBox?: SEGraphics
    /**
     * 线上预览图形
     * @param param0 预览参数
     * @param x 
     * @param y 
     */
    showPreview({ graphType, ...rest }: IPreviewData, x: number, y: number) {
        if (!this.previewBox) {
            const previewShape = Graph.getClassShape(graphType).getPreviewGeometry(rest)
            this.previewBox = this.graph.app.stage.addChild(previewShape)
        }
        this.previewBox.x = x
        this.previewBox.y = y
    }

    /** 隐藏预览图形 */
    hidePreview() {
        if (!this.previewBox) return
        this.graph.app.stage.removeChild(this.previewBox)
        this.previewBox = undefined
    }



    private onDragStart(e: FederatedPointerEvent) {
        if (this.interactions.connection.isConnecting) return
        if (this.interactions.active.activedShapes.size === 0) return
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
        if (preParentId !== this.baseShape!.parentId) {
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
        this.interactions.hignlight.hideNest()
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
                const baseShapeGlobalPoint = shape.getGlobalPoint()
                shape.parent.removeChild(shape)
                this.graph.addChild(this.baseShape)
                shape.x = baseShapeGlobalPoint.x
                shape.y = baseShapeGlobalPoint.y
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
                this.interactions.hignlight.showNest(targetShape.id)
            }
        } else {
            if (targetShape) this.interactions.hignlight.showNest(targetShape.id)
            else this.interactions.hignlight.hideNest()

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
                x = clamp(x, pointParent.x + GlobalStype.SafePadding, pointParent.x + parent.width - this.baseShape!.width - GlobalStype.SafePadding)
                y = clamp(y, pointParent.y + GlobalStype.SafePadding, pointParent.y + parent.height - this.baseShape!.height - GlobalStype.SafePadding)
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