import { Application, Assets, FillInput, PointData, Sprite, StrokeInput, StrokeStyle } from "pixi.js";
import { Graph } from "../Graph";
import { IBlockShape } from "./type";
import { GlobalStype } from "../../shapes/GlobalStyle";
import { SEGraphics } from "../override/graphics";
import { BlockContainer, IBoundsPoint } from "./BlockContainer";


export abstract class BaseBlockShape extends BlockContainer implements IBlockShape {

    static get name(): string {
        throw new Error('必须定义Shape的静态属性name,eg: static get name(): string { return "shape名称" }')
    }

    //TODO:  图标为自定义渲染
    static async icon(options: IBlockShape) {
        const canvas = Graph.getOffScreenElement();
        const view = canvas.transferControlToOffscreen();
        const app = new Application();
        // Initialize the application
        await app.init({ view, width: options.width, height: options.height });
        const icon = new SEGraphics({
            x: 0,
            y: 0
        })
        icon.roundRect(0, 0, GlobalStype.IconWidth, GlobalStype.IconHeight, 2)
            .stroke({
                width: 1,
                color: 0x000000,
            })
        app.stage.addChild(icon)
        app.stop();
        const url = await app.renderer.extract.base64(icon);
        return url
    }

    /**  */
    static preview(options: IBlockShape) {
        const graph = new SEGraphics()
        return graph
    }

    interactiveId: number = 0

    options: IBlockShape

    styles: IBlockShape

    parentId?: string

    childList?: BaseBlockShape[];

    get graphScale(): number {
        return this.graph.scale
    }

    /**
     * @param graph 画布实例
     * @param options shape配置
     */
    constructor(public readonly graph: Graph, options: IBlockShape) {
        super(options)
        this.id = options.id
        this.interactive = true
        this.options = options
        this.styles = options
        this.parentId = options.parentId
        this.init()
        this.updateBoundsStyle()
    }



    /** 更新边界样式 */
    updateBoundsStyle() {
        this.fillStyle = this.getFillStyle()
        this.strokeStyle = this.getStrokeStyle()
        this.drawBoundsbox()
    }

    /** 计算可见图的外框 */
    abstract calcVisibleBounds(): IBoundsPoint

    /** 获取图片
     * @param image 图片地址
     */
    getImage(image: string): Promise<Sprite> {
        return new Promise((resolve) => {
            Assets.load(image).then(texture => {
                const sprite = new Sprite(texture);
                sprite.x = 0
                sprite.y = 0
                resolve(sprite)
            })
        })
    }

    setStrokeStyle(style: StrokeInput, render?: boolean) {
        this.strokeStyle = style
        if (render) this.drawBoundsbox()
    }

    setFillStyle(style: FillInput, render?: boolean) {
        this.fillStyle = style
        if (render) this.drawBoundsbox()
    }

    /** 重置样式 */
    resetStyle() {
        this.fillStyle = this.getFillStyle()
        this.strokeStyle = this.getStrokeStyle()
        this.drawBoundsbox()
    }

    /** 重置样式 */
    resetStyleByOptions() {
        this.fillStyle = this.getFillStyle()
        this.strokeStyle = this.getStrokeStyle()
        this.drawBoundsbox()

    }

    private getStrokeStyle() {
        const strokeStyle: StrokeStyle = {
            color: this.options.strokeColor ?? GlobalStype.strokeColor,
            width: this.options.strokeWidth ?? GlobalStype.strokeWidth,
        }
        if (this.options.strokeAlpha) {
            strokeStyle.alpha = this.options.strokeAlpha
        }
        return strokeStyle
    }

    private getFillStyle() {
        const fillStyle: FillInput = { color: 'transparent' }
        if (this.options.fillColor) {
            fillStyle.color = this.options.fillColor
        }
        if (this.options.fillAlpha) {
            fillStyle.alpha = this.options.fillAlpha
        }
        return fillStyle
    }


    private onResize(data: Record<string, Partial<IBlockShape>>) {
        const changeData = data[this.id]
        if (changeData) {
            this.updateSize(changeData.width!, changeData.height!)
        }
    }

    abstract init(): void
    // {
    //     this.boundsbox.stroke({
    //         color: 'blue'
    //     }).fill({
    //         color: 'red'
    //     })
    //     // this.onResize = this.onResize.bind(this)
    //     // this.graph.events.on(SystemEventType.Resize, this.onResize)
    // }

    destroy() {
        super.destroy()
        this.destroy()
    }

    updateSize(width: number, height: number) {
        this.styles.width = width
        this.styles.height = height
        this.width = width
        this.height = height
        // this.boundsbox.clear()
        // this.drawBackground(width, height)
    }

    update(data: Partial<IBlockShape>) {
        this.options = {
            ...this.options,
            ...data
        }
        this.x = this.options.x || 0
        this.y = this.options.y || 0
        // this.boundsbox.clear()
        // this.drawBackground()
    }


    drawBackground(_width?: number, _height?: number) {
        // const width = _width ?? this.options.width
        // const height = _height ?? this.options.height
        // const bg = this.boundsbox ?? new SEGraphics({
        //     x: 0,
        //     y: 0,
        //     width,
        //     height,
        //     zIndex: -1,
        //     interactive: true
        // })
        // bg.width = width
        // bg.height = height

        // const fillStyle: FillInput = {
        //     color: this.options.fillColor,
        //     alpha: this.options.fillAlpha
        // }
        // const strokeStyle: StrokeInput = {
        //     color: this.options.strokeColor ?? GlobalStype.strokeColor,
        //     width: this.options.strokeWidth ?? GlobalStype.strokeWidth,
        //     alpha: this.options.strokeAlpha
        // }

        // bg.rect(0, 0, width, height)
        //     .stroke(removeUndefined(strokeStyle))
        //     .fill(removeUndefined(fillStyle))
        // // 背景图片
        // if (this.options.fillBgImg) {
        //     if (this.boundsbox) {
        //         this.boundsbox.removeChildAt(0)
        //     }
        //     Assets.load(this.options.fillBgImg).then(texture => {
        //         const sprite = new Sprite(texture);
        //         sprite.x = 0
        //         sprite.y = 0
        //         sprite.width = width
        //         sprite.height = height
        //         bg.addChild(sprite)
        //     })
        // }
        // if (!this.boundsbox) {
        //     this.boundsbox = this.addChild(bg)
        // }
        // return this.boundsbox
    }

    /** 获取相当于画布的绝对坐标 */
    getGlobalPoint(shape?: BaseBlockShape) {
        let globalX = shape? shape.x: this.x, globalY = shape?shape.y: this.y
        let parent = this.graph.getParentShape(shape?shape.id:this.id) 
        while (parent) {
            globalX += parent.x
            globalY += parent.y
            parent = this.graph.getParentShape(parent?.id)
        }
        return {
            x: globalX,
            y: globalY
        }
    }


    getRelativePoint(globalPoint: PointData, parent?: BaseBlockShape) {
        const parentGlobalPoint = parent ? this.getGlobalPoint(parent) : { x: 0, y: 0 }
        return {
            x: globalPoint.x - parentGlobalPoint.x,
            y: globalPoint.y - parentGlobalPoint.y
        }
    }


}