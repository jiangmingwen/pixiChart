import { SEGraphics } from "../override/graphics"
import { BaseBlockShape } from "./BaseBlockShape"
import { GlobalStype } from "../../shapes/GlobalStyle"
import { Graph } from "../Graph"
import { GraphPlugin } from "./plugin"
import { SystemEventType } from "../SystemEvent"
import { IBlockShape } from "./type"


export enum EHighlightMode {
    /** 基准高亮 */
    Base = 'Base',
    /** 连线高亮 */
    Connecting = 'Connecting',
    /** 嵌套高亮 */
    Nest = 'Nest',
    /** 选中图元的高亮 */
    Active = 'Active',
}


export const hignlightStyleConfig: Record<EHighlightMode, IHignlightStyle> = {
    [EHighlightMode.Base]: {
        width: GlobalStype.BaseShapeHighlightWidth,
        color: GlobalStype.BaseShapeHighlightColor,
    },
    [EHighlightMode.Connecting]: {
        width: GlobalStype.ConnectingHighlightWidth,
        color: GlobalStype.ConnectingHighlightColor,
    },
    [EHighlightMode.Nest]: {
        width: GlobalStype.NestHighlightWidth,
        color: GlobalStype.NestHighlightColor,
    },
    [EHighlightMode.Active]: {
        width: GlobalStype.ActiveHighlightWidth,
        color: GlobalStype.ActiveHighlightColor,
    }
}

export interface IHignlightStyle {
    /** 高亮的颜色 */
    color: string
    /** 高亮的线宽 */
    width: number
}




export class Hignlight extends GraphPlugin {

    // /** 嵌套高亮的图元 */
    private nestShape?: string
    // /** 连线高亮的图元 */
    private connectingShapes: Record<string, boolean> = {}
    // /** 基准高亮的图元 */
    private baseShape?: string
    // /** 选中的高亮图元 */
    private activeShape: Record<string, boolean> = {}

    /** 图元是否高亮
     * @param id 图元id
     */
    isHignlighted(id: string, mode?: EHighlightMode) {
        switch (mode) {
            case EHighlightMode.Base:
                return this.baseShape === id
            case EHighlightMode.Connecting:
                return this.connectingShapes[id]
            case EHighlightMode.Nest:
                return this.nestShape === id
            case EHighlightMode.Active:
                return this.activeShape[id]
            default:
                return this.baseShape === id || this.connectingShapes[id] || this.nestShape === id || this.activeShape[id]
        }
    }

    /** 连接高亮展示
     * @param id 要高亮显示的图元
     */
    showConnecting(id: string) {
        if (this.connectingShapes[id]) return
        this.show(id, EHighlightMode.Connecting)
    }
    /** 高亮基准图元 
     * @param id 要高亮显示的图元
    */
    showBase(id: string) {
        if (this.baseShape === id) return
        this.show(id, EHighlightMode.Base)
    }

    /** 嵌套高亮展示
     * @param id 要高亮显示的图元
     */
    showNest(id: string) {
        if (this.nestShape === id) return
        if(this.nestShape) {
            // 取消嵌套高亮的图元，如果有选中图元，选中状态须保留
            const targetShape = this.graph.getShapeById(this.nestShape)
            if (!targetShape) return //要高亮的目标图元不存在，不做处
            targetShape.updateBoundsStyle()
        }
        this.show(id, EHighlightMode.Nest)
    }
    /** 选中高亮展示 
     * @param id 要高亮显示的图元
    */
    showActive(id: string) {
        if(this.activeShape[id]) return true
        this.show(id, EHighlightMode.Active)
    }

    /** 隐藏连线模式的高亮 */
    hideConnecting() {
        // 取消连线的高亮，如果有选中图元，选中状态须保留
        for (const id in this.connectingShapes) {
            const targetShape = this.graph.getShapeById(id)
            if (!targetShape) return //要高亮的目标图元不存在，不做处
            targetShape.updateBoundsStyle()
            this.hideEffectCache(id, EHighlightMode.Connecting)
        }
    }

    /** 隐藏基准图元模式的高亮 */
    hideBase() {
        if (!this.baseShape) return
        // 取消基准图元的高亮，如果有选中图元，选中状态须保留
        const targetShape = this.graph.getShapeById(this.baseShape)
        this.hideEffectCache(this.baseShape, EHighlightMode.Base)
        if (!targetShape) return //要高亮的目标图元不存在，不做处
        if (this.activeShape[this.baseShape]) {
            // 取消高亮的时候，如果选中状态，需要保留选中状态
            targetShape.updateBoundsStyle(hignlightStyleConfig[EHighlightMode.Active])
        } else {
            targetShape.updateBoundsStyle()
        }
    }

    /** 隐藏嵌套高亮模式的高亮 */
    hideNest() {
        if (!this.nestShape) return
        // 取消嵌套高亮的图元，如果有选中图元，选中状态须保留
        const targetShape = this.graph.getShapeById(this.nestShape)
        this.hideEffectCache(this.nestShape, EHighlightMode.Nest)
        if (!targetShape) return //要高亮的目标图元不存在，不做处
        targetShape.updateBoundsStyle()
    }

    /**
     * 
     * @param id 隐藏选中状态的图元
     */
    hideActive(id?: string) {
        if (id) {
            // 指定隐藏某个图元的选中状态
            const targetShape = this.graph.getShapeById(id)
            if (!targetShape) return //要高亮的目标图元不存在，不做处理
            targetShape.updateBoundsStyle()
            delete this.activeShape[id]
            this.baseShape = undefined
            this.nestShape = undefined
        } else {
            for (const id in this.activeShape) {
                const targetShape = this.graph.getShapeById(id)
                if (!targetShape) return //要高亮的目标图元不存在，不做处理
                targetShape.updateBoundsStyle()
            }
            this.activeShape = {}
            this.baseShape = undefined
            this.nestShape = undefined
        }
    }

    /**
     * 高亮显示
     * @param id 要高亮显示的图元 
     * @param param 高亮参数
     * @returns 
     */
    private show(id: string, mode: EHighlightMode): void {
        const targetShape = this.graph.getShapeById(id)
        if (!targetShape) return //要高亮的目标图元不存在，不做处理
        targetShape.boundsbox.stroke(hignlightStyleConfig[mode])
        this.cacheShape(id, mode)
    }

    /** 缓存高亮的图元
     * @param id 要高亮的图元id
     * @param graphic 高亮图元
     * @param mode 高亮模式
     */
    private cacheShape(id: string, mode: EHighlightMode) {
        switch (mode) {
            case EHighlightMode.Base:
                this.baseShape = id
                break;
            case EHighlightMode.Nest:
                this.nestShape = id
                break;
            case EHighlightMode.Connecting:
                this.connectingShapes[id] = true
                break;
            case EHighlightMode.Active:
            default:
                this.activeShape[id] = true

        }
    }

    private onResize(data: Record<string, Partial<IBlockShape>>) {
        // for (const key in data) {
        //     const shape = this.getCachedShape(key)
        //     if (shape) {
        //         const style = shape.strokeStyle
        //         shape.clear()
        //         shape.width = data[key].width!
        //         shape.height = data[key].height!
        //         shape.rect(0, 0, shape.width, shape.height)
        //             .stroke(style)
        //     }
        // }
    }

    init() {
        this.onResize = this.onResize.bind(this)
        this.graph.events.on(SystemEventType.Resize, this.onResize)
    }

    destroy(): void {
        this.graph.events.off(SystemEventType.Resize, this.onResize)
    }
    /**
     * 隐藏高亮图案 处理高亮缓存
     * @param id 目标图元
     * @param mode 目标模式
     * @returns 
     */
    private hideEffectCache(id: string, mode: EHighlightMode) {
        switch (mode) {
            case EHighlightMode.Base:
                this.baseShape = undefined
                break;
            case EHighlightMode.Nest:
                this.nestShape = undefined
                break;
            case EHighlightMode.Connecting:
                delete this.connectingShapes[id]
                break
            default:
                delete this.activeShape[id]
                break;
        }
    }

    /** 清除所有高亮 */
    clear() {
        const data = {
            ...this.connectingShapes,
            ...this.activeShape,
            ...this.nestShape ? { [this.nestShape]: true } : {},
            ...this.baseShape ? { [this.baseShape]: true } : {}
        }
        for (const key in data) {
            const shape = this.graph.getShapeById(key)
            if (shape) {
                shape.updateBoundsStyle()
            }
        }
        this.baseShape = undefined
        this.nestShape = undefined
        this.connectingShapes = {}
        this.activeShape = {}
    }
}

