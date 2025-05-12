import { Assets, ContainerOptions, DestroyOptions, FillInput, Graphics, Sprite, StrokeInput } from "pixi.js";
import { SEContainer } from "../override/container";
import { SEGraphics } from "../override/graphics";
import { IBlockShapeStyle, IBlockShapeSize } from "./type";


export interface IBlockContainerOptions extends Omit<ContainerOptions, 'height' | 'width'>, IBlockShapeStyle, IBlockShapeSize {

}

/**
 * 边界坐标点
 * [x, y] []
 *  x,y 的绝对值大于1等于1，则为绝对坐标
 *  x,y 的绝对值小于1，则为相对坐标
 * 
 *  如: [0.5, 0.5] 表示宽的一半，高的一半
 */
export type IBoundsPoint = [number, number][];

export abstract class BlockContainer extends SEContainer {
    /** 边界框 */
    boundsbox!: SEGraphics


    set width(value: number) {
        this.__width = value;
        this.drawBoundsbox()
    }

    set height(value: number) {
        this.__height = value;
        this.drawBoundsbox()
    }


    get width(): number {
        return this.__width
    }

    get height() {
        return this.__height
    }

    strokeStyle?: StrokeInput
    fillStyle?: FillInput

    constructor(options?: IBlockContainerOptions) {
        super(options)
        this.interactive = true
        this.visibleBounds = this.calcVisibleBounds()
        const boundsbox = new SEGraphics({
            x: 0,
            y: 0,
            width: this.__width,
            height: this.__height,
            interactive: true,
            zIndex: -1,
            cursor: 'pointer'
        })
        this.boundsbox = this.addChild(boundsbox)
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

    setStrokeStyle(style: StrokeInput, render?: boolean) {
        this.strokeStyle = style
        if (render) this.drawBoundsbox()
    }


    setFillStyle(style: FillInput, render?: boolean) {
        this.fillStyle = style
        if (render) this.drawBoundsbox()
    }

    drawBoundsbox() {
        if (!this.boundsbox) return
        this.boundsbox.clear()
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
                this.boundsbox.moveTo(x, y)
            } else {
                this.boundsbox.lineTo(x, y)
            }
        })
        this.boundsbox.closePath()
        this.boundsbox.stroke(this.strokeStyle).fill(this.fillStyle)
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options)
        if (this.boundsbox) {
            this.boundsbox.destroy(options)
        }
    }
}
