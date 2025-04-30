import { ShapePlugin } from "./plugin";
import { FederatedPointerEvent, FillInput, Graphics, StrokeInput } from "pixi.js";
import { GlobalStype } from "../../shapes/GlobalStyle";
import { removeUndefined } from "./utils";
import { IBlockShape } from "./type";


/** 图元缩放插件 */
export class ResizeShapePlugin extends ShapePlugin {
    /** 激活边框上的点 */
    activePoints: Graphics[] = []

    /** 拖拽开始坐标 */
    private dragStartPosition?: {
        pointIndex: number
        startX: number,
        startY: number,
        width: number,
        height: number,
        x: number
        y: number
    }

    private pointerdown(e: FederatedPointerEvent) {
        this.drawActiveBorder()
    }
    /** 要显示的操作点 */
    private readonly points = [
        [0, 0], [.5, 0], [1, 0],
        [0, .5], [1, .5],
        [0, 1], [.5, 1], [1, 1]
    ]

    private drawActiveBorder() {
        if (this.activePoints.length) return

        const { width, height } = this.shape.backgroundShape

        /** 各操作点的鼠标样式 */
        const cursors = [
            'nw-resize',
            'n-resize',
            'ne-resize',
            'e-resize',
            'e-resize',
            'ne-resize',
            'n-resize',
            'nw-resize',
        ]

        const pointSize = 4
        this.activePoints = this.points.map((point, index) => {
            const shape = new Graphics();
            shape.x = point[0] * width
            shape.y = point[1] * height
            shape.circle(0, 0, pointSize)
                .fill(removeUndefined({
                    color: this.shape.options.activeStrokeColor ?? GlobalStype.activeStrokeColor,
                    alpha: this.shape.options.activeStrokeAlpha
                }))
            shape.interactive = true
            shape.cursor = cursors[index]
            shape.eventMode = 'static'
            shape.zIndex = 10
            shape.on('pointerdown', (e) => {
                this.onDragStart(e, index)
            })
            this.shape.addChild(shape)
            return shape
        })
    }

    updatePoints() {
        this.activePoints.forEach((item, index) => {
            let point = this.points[index]
            const { width, height } = this.shape.options
            item.x = point[0] * width
            item.y = point[1] * height
        })
    }

    private onDragStart(e: FederatedPointerEvent, pointIndex: number) {
        e.stopPropagation()
        if (this.dragStartPosition) return
        const newPoistion = this.shape.parent.toLocal(e.global)
        this.dragStartPosition = {
            pointIndex,
            startX: newPoistion.x,
            startY: newPoistion.y,
            width: this.shape.width,
            height: this.shape.height,
            x: this.shape.x,
            y: this.shape.y
        }
        this.shape.graph.app.stage.on('pointermove', this.onDragMove, this)
    }

    private onDragEnd() {
        if (!this.dragStartPosition) return
        this.shape.graph.app.stage.off('pointermove', this.onDragMove, this)
        this.dragStartPosition = undefined
    }

    private onDragMove(event: FederatedPointerEvent) {
        if (!this.dragStartPosition) return
        const newPoistion = this.shape.parent.toLocal(event.global)
        const { x, y, startX, startY, width, height, pointIndex } = this.dragStartPosition
        let addWidth = newPoistion.x - startX
        let addHeight = newPoistion.y - startY

        let params: Partial<IBlockShape> = {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }

        switch (pointIndex) {
            case 0:
                params = {
                    width: width - addWidth,
                    height: height - addHeight,
                    x: x + addWidth,
                    y: y + addHeight
                }
                break;
            case 1:
                params = {
                    height: height - addHeight,
                    y: y + addHeight
                }
                break;
            case 2:
                params = {
                    width: width + addWidth,
                    height: height - addHeight,
                    y: y + addHeight
                }
                break;
            case 3:
                params = {
                    width: width - addWidth,
                    x: x + addWidth
                }
                break;
            case 4:
                params = {
                    width: width + addWidth
                }
                break;
            case 5:
                params = {
                    width: width - addWidth,
                    height: height + addHeight,
                    x: x + addWidth
                }
                break;
            case 6:
                params = {
                    height: height + addHeight
                }
                break
            case 7:
                params = {
                    width: width + addWidth,
                    height: height + addHeight
                }
                break;
        }

        if (params.width != undefined && (
            (
                (params.width <= 0 || (this.shape.options.minWidth && params.width < this.shape.options.minWidth))
            ) ||
            (this.shape.options.maxWidth && params.width > this.shape.options.maxWidth)
        )
        )
            return //宽度小于或大于限定值
        if (params.height != undefined && (
            (
                (params.height <= 0 || (this.shape.options.minHeight && params.height < this.shape.options.minHeight))
            ) ||
            (this.shape.options.maxHeight && params.height > this.shape.options.maxHeight)
        )
        )
            return //高度小于或大于限定值


        if (this.shape.options.aspect) {// 图元等大小，取尺寸里的最大值
            params.width = Math.max(params.width ?? 0, params.height ?? 0)
            params.height = params.width
        }

        //不超过最小值
        if (this.shape.options.minWidth != undefined && params.width != undefined && params.width < this.shape.options.minWidth) {
            params.width = this.shape.options.minWidth
        }
        if (this.shape.options.minHeight != undefined && params.height != undefined && params.height < this.shape.options.minHeight) {
            params.height = this.shape.options.minHeight
        }
        // 不超过最大值
        if (this.shape.options.maxWidth != undefined && params.width != undefined && params.width > this.shape.options.maxWidth) {
            params.width = this.shape.options.maxWidth
        }
        if (this.shape.options.maxHeight != undefined && params.height != undefined && params.height > this.shape.options.maxHeight) {
            params.height = this.shape.options.maxHeight
        }
        this.shape.update(params)
        this.updatePoints()
        this.shape.loading.update()
    }



    init(): void {
        this.pointerdown = this.pointerdown.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragMove = this.onDragMove.bind(this)
        this.shape.on('pointerdown', this.pointerdown)
        this.shape.graph.app.stage.on('pointerup', this.onDragEnd)
        this.shape.graph.app.stage.on('pointerupoutside', this.onDragEnd)
    }

    destroy(): void {
        this.shape.off('pointerdown', this.pointerdown)
    }

}