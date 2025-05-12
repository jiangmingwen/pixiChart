import { Assets, DestroyOptions, FillInput, Sprite, StrokeInput, StrokeStyle } from "pixi.js";
import { SEContainer } from "../../pixiOverrides/container";
import { SEGraphics } from "../../pixiOverrides/graphics";
import { IBlockContainerOptions, IBoundsPoint } from "./type";
import { GlobalStyle } from "../../config/globalStyle";

/** Block容器 */
export abstract class BlockContainer extends SEContainer {
    /** 边界框 */
    boundsbox!: SEGraphics


    set width(value: number) {
        this.__width = value;
        this.initBoundsbox(true)
    }

    set height(value: number) {
        this.__height = value;
        this.initBoundsbox(true)
    }


    get width(): number {
        return this.__width
    }

    get height() {
        return this.__height
    }

    constructor(public options?: IBlockContainerOptions) {
        super(options)
        this.interactive = true
        this.visibleBounds = this.calcVisibleBounds()
        this.initBoundsbox()
    }


    getSize() {
        return {
            width: this.boundsbox.width,
            height: this.boundsbox.height
        }
    }


    /** 可见图的外框 */
    private visibleBounds: number[][] = []

    /** 计算可见图的外框 */
    abstract calcVisibleBounds(): IBoundsPoint

    getOffsetPosition(rx: number, ry: number) {
        const dx = 0, dy = 0
        return [dx, dy]
    }

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


    private getStrokeStyle() {
        const strokeStyle: StrokeStyle = {
            color: this.options?.strokeColor ?? GlobalStyle.strokeColor,
            width: this.options?.strokeWidth ?? GlobalStyle.strokeWidth,
        }
        return strokeStyle
    }

    private getFillStyle() {
        const fillStyle: FillInput = { color: 'transparent' }
        if (this.options?.fillColor) {
            fillStyle.color = this.options.fillColor
        }
        return fillStyle
    }


    initBoundsbox(isClear?: boolean) {
        if (!this.visibleBounds) return
        let fillStyle = this.getFillStyle()
        let strokeStyle = this.getStrokeStyle()
        if (this.boundsbox) {
            //如果存在边界框，需要清除了重新绘制
            if (isClear) {
                this.boundsbox.clear()
                fillStyle = this.boundsbox.fillStyle
                strokeStyle = this.boundsbox.strokeStyle
            }
            // 如果存在边界框，不重新绘制
            else return
        }
        const boundsbox = new SEGraphics({
            x: 0,
            y: 0,
            width: this.__width,
            height: this.__height,
            interactive: true,
            zIndex: -1,
            cursor: 'pointer'
        })


        this.visibleBounds.forEach((item, index) => {
            let x = item[0]
            if (Math.abs(x) <= 1) {
                x = item[0] * this.width
            }
            let y = item[1]
            if (Math.abs(y) <= 1) {
                y = item[1] * this.height
            }

            if (index === 0) {
                boundsbox.moveTo(x, y)
            } else {
                boundsbox.lineTo(x, y)
            }
        })
        boundsbox.closePath()
        boundsbox.stroke(strokeStyle).fill(fillStyle)
        this.boundsbox = this.addChild(boundsbox)
    }

    /** 更新边界框的边框样式 */
    updateBoundsboxStroke(color: number, width?: number) {
        if (!this.boundsbox) return
        this.boundsbox.strokeStyle.color = color
        if (width) this.boundsbox.strokeStyle.width = width
        this.boundsbox.endFill()
    }

    /** 恢复边界框的边界样式 */
    restoreBoundsboxStroke() {
        if (!this.boundsbox) return
        const strokeStyle = this.getStrokeStyle()
        this.boundsbox.strokeStyle.color = strokeStyle.color as number
        this.boundsbox.strokeStyle.width = strokeStyle.width ?? 1
        this.boundsbox.endFill()
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options)
        if (this.boundsbox) {
            this.boundsbox.destroy(options)
        }
    }
}
