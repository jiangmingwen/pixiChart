import { Assets, ContainerOptions, DestroyOptions, Sprite } from "pixi.js";
import { SEContainer } from "../override/container";
import { SEGraphics } from "../override/graphics";
import { IBlockShapeStyle, IBlockShapeSize } from "./type";


export interface IBlockContainerOptions extends Omit<ContainerOptions, 'height' | 'width'>, IBlockShapeStyle, IBlockShapeSize {
 
}

export type IBoundsPoint = [number, number][];

export abstract class BlockContainer extends SEContainer {
    /** 边界框 */
    boundsbox!: SEGraphics

   

    constructor(options?: IBlockContainerOptions) {
        super(options)
        this.interactive = true
        this.visibleBounds = this.calcVisibleBounds()
        this.drawBoundsbox()
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

    private drawBoundsbox() {
        let box: SEGraphics
        if (this.boundsbox) {
            box = this.boundsbox.clear()
        } else {
            box = new SEGraphics({
                x: 0,
                y: 0,
                width: this.__width,
                height: this.__height,
                interactive: true,
                zIndex: -1
            })
        }
        this.visibleBounds.forEach((item, index) => {
            if (index === 0) {
                box.moveTo(item[0], item[1])
            } else {
                box.lineTo(item[0], item[1])
            }
        })
        box.closePath()
        box.stroke({
            width: 1,
            color: 'red'
        }).fill({
            color: 'transparent'
        })
        if (!this.boundsbox) {
            this.boundsbox = this.addChild(box)
        }
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options)
        if (this.boundsbox) {
            this.boundsbox.destroy(options)
        }
    }
}
