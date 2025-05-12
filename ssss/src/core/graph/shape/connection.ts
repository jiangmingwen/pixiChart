import { EventSystem, FederatedPointerEvent, Graphics, PointData } from "pixi.js";
import { Graph } from "../Graph";
import { BaseBlockShape } from "./BaseBlockShape";
import { SEContainer } from "../override/container";
import { SEGraphics } from "../override/graphics";
import { SystemEventType } from "../SystemEvent";

/**
 * 校验是否可以链接
 * @param lineType 连线类型
 * @param sourceId 起点shapeId 若为undefined 则为表示校验场景为：选择起点图元。若不为undefined 则表示校验场景为：选择终点图元。
 * @param targetId 终点shape 若为undefined 则为表示校验场景为：终点落在画布上。如果不为undefined 则表示校验场景为：选择终点图元。
 */
export type IValidFn<T = any> = (lineType: T, sourceId?: string, targetId?: string) => boolean

export class Connection {
    /** 是否处于连线模式 */
    private _isConnecting: boolean = false;

    get isConnecting() {
        return this._isConnecting;
    }
    /** 设置连接类型 */
    private connectingType: any;
    private sourceShape?: BaseBlockShape;
    private previewStartShape?: SEGraphics
    private previewEndShape?: SEGraphics

    private sourceData?: {
        id: string
        exitX: number
        exitY: number
    }

    private targetData?: {
        id: string
        entryX: number
        entryY: number
    }

    /** 校验是否可连接方法 {@link IValidFn} */
    private validFn?: IValidFn

    constructor(public graph: Graph) {
        this.onConnectStart = this.onConnectStart.bind(this)
        this.onConnectProcess = this.onConnectProcess.bind(this)
        this.onConnectEnd = this.onConnectEnd.bind(this)
        this.graph.app.stage.on('mousedown', this.onConnectStart)
        this.graph.app.stage.on('mouseup', this.onConnectEnd)

    }

    onConnectStart(event: FederatedPointerEvent) {
        if (!this.connectingType) return // 没有连线类型
        // 找到点击的图形
        const shape = this.graph.hitTest(event.globalX, event.globalY) as BaseBlockShape
        if (!shape) return
        this.graph.hignlight.hideConnecting()
        const valided = this.validFn?.(this.connectingType, shape.id)
        if (valided === false) return // 校验不通过
        this.sourceShape = shape as BaseBlockShape
        this.graph.hignlight.showConnecting(this.sourceShape.id)
        this.graph.app.stage.on('mousemove', this.onConnectProcess)

    }

    /**
     * 查找shape的边与某全局坐标的最近的连接点
     * 思路为：查找shape的绝对坐标，用其中心坐标与全局连线，通过连线与图形相交的边为最近边，相交的点为连接点
     * @param shape 目标shape
     * @param globalX 全局x坐标
     * @param globalY 全局y坐标
     * @returns 
     */
    findExitPoint(
        shape: BaseBlockShape,
        globalX: number,
        globalY: number,
    ): [number, number] {
        // 1. 计算图形绝对坐标
        let absPosition = this.getShapeCache(shape)
        const { absX, absY } = absPosition
        const centerX = absX + shape.width / 2;
        const centerY = absY + shape.height / 2;
        // 2. 计算方向向量
        const dx = globalX - centerX;
        const dy = globalY - centerY;

        // 3. 初始化最小交点参数
        let minT = Infinity;
        let intersectX = centerX;
        let intersectY = centerY;

        // 4. 边界坐标预计算
        const boundaries = [
            { type: 'x', value: absX },               // 左边界
            { type: 'x', value: absX + shape.width }, // 右边界
            { type: 'y', value: absY },               // 上边界
            { type: 'y', value: absY + shape.height } // 下边界
        ];

        // 5. 遍历所有边界计算交点
        boundaries.forEach(({ type, value }) => {
            let t = Infinity;
            // 计算交点参数t
            if (type === 'x' && dx !== 0) {
                t = (value - centerX) / dx;
            } else if (type === 'y' && dy !== 0) {
                t = (value - centerY) / dy;
            }
            // 有效性检查
            if (t >= 0 && t < minT) {
                // 计算另一坐标轴的值
                const x = centerX + t * dx;
                const y = centerY + t * dy;
                // 边界范围验证
                if (type === 'x') {
                    if (y >= absY && y <= absY + shape.height) {
                        minT = t;
                        intersectX = value;
                        intersectY = y;
                    }
                } else {
                    if (x >= absX && x <= absX + shape.width) {
                        minT = t;
                        intersectX = x;
                        intersectY = value;
                    }
                }
            }
        });
        // 6. 转换为相对坐标
        const xRatio = (intersectX - absX) / shape.width;
        const yRatio = (intersectY - absY) / shape.height;
        return [xRatio, yRatio];
    }



    clamp = (value: number, min: number, max: number) =>
        value < min ? min : value > max ? max : value;
    /** 
     * 递归计算绝对坐标
     */
    getAbsolutePosition(
        shape: BaseBlockShape
    ) {
        let x = shape.x;
        let y = shape.y;
        let current = shape;

        while (current.parentId) {
            const parent = this.graph.getShapeById(current.parentId);
            if (!parent) break;

            x += parent.x;
            y += parent.y;
            current = parent;
        }
        return { x, y };
    }

    // 全局缓存避免重复计算
    shapeCache = new WeakMap<BaseBlockShape, ShapeCache>();

    getShapeCache(shape: BaseBlockShape): ShapeCache {
        if (!this.shapeCache.has(shape)) {
            // 使用位运算加速坐标累加
            let absX = shape.x | 0, absY = shape.y | 0; // 转换为整数
            let current: BaseBlockShape | undefined = shape;

            while (current?.parentId) {
                const parent = this.graph.getParentShape(current.id);
                if (!parent) break;
                absX += parent.x | 0;
                absY += parent.y | 0;
                current = parent;
            }

            const width = shape.width;
            const height = shape.height;
            this.shapeCache.set(shape, {
                absX, absY,
                left: absX,
                right: absX + width,
                top: absY,
                bottom: absY + height,
                width,
                height,
                invWidth: 1 / width,  // 预计算倒数
                invHeight: 1 / height
            });
        }
        return this.shapeCache.get(shape)!;
    }

    // 重用变量减少内存分配
    reuseCheck = {
        t: 0,
        intersectX: 0,
        intersectY: 0
    };


    optimizeIntersection(
        shape: BaseBlockShape,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): [number, number] {
        const cache = this.getShapeCache(shape);
        console.log(cache, 'xx')
        // 快速范围检查（使用位运算取整）
        if ((x2 | 0) < cache.left || (x2 | 0) > cache.right ||
            (y2 | 0) < cache.top || (y2 | 0) > cache.bottom) {
            return [NaN, NaN]; // 非法值快速返回
        }

        // 向量计算（使用单精度浮点数）
        const dx = x2 - x1;
        const dy = y2 - y1;
        let nearestT = Infinity;
        let resultX = cache.width * 0.5 * cache.invWidth; // 默认中心
        let resultY = cache.height * 0.5 * cache.invHeight;

        // 边界检测顺序优化（基于方向预测）
        const boundaries = dx > 0 ?
            [
                { value: cache.left, vertical: true },   // 左
                { value: cache.right, vertical: true },  // 右
                { value: cache.top, vertical: false },   // 上
                { value: cache.bottom, vertical: false } // 下
            ] : [
                { value: cache.right, vertical: true },
                { value: cache.left, vertical: true },
                { value: cache.bottom, vertical: false },
                { value: cache.top, vertical: false }
            ];

        for (const { value, vertical } of boundaries) {
            const delta = vertical ? dx : dy;
            if (delta === 0) continue;

            this.reuseCheck.t = (value - (vertical ? x1 : y1)) / delta;

            // 提前终止条件：t超出[0,1]范围或已找到更优解
            if (this.reuseCheck.t >= nearestT || this.reuseCheck.t < 0 || this.reuseCheck.t > 1) continue;

            this.reuseCheck.intersectX = x1 + this.reuseCheck.t * dx;
            this.reuseCheck.intersectY = y1 + this.reuseCheck.t * dy;

            // 快速整数范围检查（利用缓存值）
            const inRange = vertical ?
                (this.reuseCheck.intersectY | 0) >= cache.top &&
                (this.reuseCheck.intersectY | 0) <= cache.bottom :
                (this.reuseCheck.intersectX | 0) >= cache.left &&
                (this.reuseCheck.intersectX | 0) <= cache.right;

            if (inRange) {
                nearestT = this.reuseCheck.t;
                if (vertical) {
                    resultX = (value === cache.left ? 0 : 1);
                    resultY = (this.reuseCheck.intersectY - cache.absY) * cache.invHeight;
                } else {
                    resultX = (this.reuseCheck.intersectX - cache.absX) * cache.invWidth;
                    resultY = (value === cache.top ? 0 : 1);
                }
                if (nearestT <= 0) break; // 找到最近点立即退出
            }
        }

        return [resultX, resultY];
    }



    onConnectProcess(event: FederatedPointerEvent) {
        const shape = this.graph.hitTest(event.globalX, event.globalY) as BaseBlockShape
        if (!this.sourceShape) return
        if (shape === this.sourceShape) return
        let rx1 = 0, rx2 = 0, ry1 = 0, ry2 = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0, dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;
        [rx1, ry1] = this.findExitPoint(this.sourceShape, event.globalX, event.globalY);
        [x1, y1, dx1, dy1] = this.drawPreviewStart(rx1, ry1)
        this.sourceData = {
            id: this.sourceShape.id,
            exitX: rx1,
            exitY: ry1
        }
        this.targetData = undefined

        if (shape) {
            const validShape = this.validFn?.(this.connectingType, this.sourceShape.id, shape.id)
            if (validShape === false) {
                // 校验不通过，不允许链接
                x2 = event.globalX
                y2 = event.globalY
            } else {
                // 校验通过
                [rx2, ry2] = this.optimizeIntersection(shape, x1, y1, event.globalX, event.globalY);
                if (Number.isNaN(rx2) || Number.isNaN(ry2)) {
                    x2 = event.globalX
                    y2 = event.globalY
                } else {
                    [x2, y2] = this.drawPreviewEnd(shape, rx2, ry2);
                }
                this.targetData = {
                    id: shape.id,
                    entryY: ry2,
                    entryX: rx2
                }
            }
        } else {
            // 校验不通过，不允许链接
            x2 = event.globalX
            y2 = event.globalY

        }
        this.drawPreviewLine(x1 + dx1, y1 + dy1, x2 + dx2, y2 + dy2)

    }



    private drawPreviewEnd(endShape: BaseBlockShape, rx: number, ry: number): [number, number, number, number] {
        if (!this.sourceShape) return [0, 0, 0, 0]
        if (this.previewEndShape) this.graph.app.stage.removeChild(this.previewEndShape)
        const shape = new SEGraphics()

        const startShapePosition = this.getShapeCache(endShape)!
        const [dx, dy] = this.sourceShape.getOffsetPosition(rx, ry)
        let x = startShapePosition.absX + rx * endShape.width
        let y = startShapePosition.absY + ry * endShape.height
        shape.x = x + dx
        shape.y = y + dy
        //TODO: UI给起点示意图形
        shape.rect(0, 0, 10, 10).fill(0xff0000)
        this.previewEndShape = this.graph.app.stage.addChild(shape)
        return [x, y, dx, dy]
    }

    previewLine?: Graphics


    private drawPreviewStart(rx: number, ry: number): [number, number, number, number] {
        if (!this.sourceShape) return [0, 0, 0, 0]
        if (this.previewStartShape) this.graph.app.stage.removeChild(this.previewStartShape)
        const shape = new SEGraphics()
        const startShapePosition = this.getShapeCache(this.sourceShape)
        const [dx, dy] = this.sourceShape.getOffsetPosition(rx, ry)
        let x = startShapePosition.absX + rx * this.sourceShape.width
        let y = startShapePosition.absY + ry * this.sourceShape.height
        shape.x = x + dx
        shape.y = y + dy

        //TODO: UI给起点示意图形
        shape.rect(0, 0, 10, 10).fill(0xff0000)
        this.previewStartShape = this.graph.app.stage.addChild(shape)
        return [x, y, dx, dy]
    }



    private drawPreviewLine(startX: number, startY: number, endX: number, endY: number) {
        let graphics = this.previewLine ?? new Graphics()
        graphics.clear()
        graphics.moveTo(startX, startY)
            .lineTo(endX, endY)
            .stroke({ color: 0xff0000, pixelLine: true });
        if (!this.previewLine) {
            this.previewLine = graphics
            this.graph.app.stage.addChild(graphics)
        }
    }


    onConnectEnd(event: FederatedPointerEvent) {
        if(!this.isConnecting) return
        if (!this.sourceData || !this.targetData){
            this.ready(this.connectingType)
            if (this.previewStartShape) this.graph.app.stage.removeChild(this.previewStartShape)
            if (this.previewEndShape) this.graph.app.stage.removeChild(this.previewEndShape)
            if (this.previewLine) this.graph.app.stage.removeChild(this.previewLine)
            this.sourceShape = undefined
            this.previewLine = undefined
            return
        }
        if (this.previewStartShape) this.graph.app.stage.removeChild(this.previewStartShape)
        if (this.previewEndShape) this.graph.app.stage.removeChild(this.previewEndShape)
        this.graph.app.stage.off('mousemove', this.onConnectProcess)
        this.graph.hignlight.hideConnecting()
        this._isConnecting = false

        this.graph.events.begin()
            .emit(SystemEventType.Connect, undefined, {
                ['new1']: {
                    sourceId: this.sourceData.id,
                    entryX: this.targetData.entryX,
                    entryY: this.targetData.entryY,
                    exitX: this.sourceData.exitX,
                    exitY: this.sourceData.exitY,
                    elementType: this.connectingType,
                    targetId: this.targetData.id
                }
            }).end()
        // const shape = this.graph.hitTest(event.globalX, event.globalY) as SEContainer
        // console.log('onConnectEnd', shape)

    }

    destory() {
        this.graph.app.stage.off('mousedown', this.onConnectStart)
        this.graph.app.stage.off('mouseup', this.onConnectEnd)
    }

    /** 进入连线模式 */
    ready<T = any>(type: T) {
        this.connectingType = type;
        this._isConnecting = true
        this.graph.idMapBlocks.forEach((shape) => {
            const valid = this.validFn?.(type, shape.id)
            if (valid !== false) this.graph.hignlight.showConnecting(shape.id)
        })
    }

    /** 结束连线模式 */
    end() {
        this.connectingType = undefined;
        this._isConnecting = false
    }
    /**
     * 设置校验函数 
     * @param fn 校验函数 {@link IValidFn}
     */
    setValidFn<T>(fn: IValidFn<T>) {
        this.validFn = fn
    }

}

export interface ShapeCache {
    /**
     * 图形在全局画布上的绝对X坐标（已累加所有父容器的偏移量）
     * 计算方式：递归累加自身及所有父容器的x属性
     */
    absX: number;

    /**
     * 图形在全局画布上的绝对Y坐标（已累加所有父容器的偏移量）
     * 计算方式：递归累加自身及所有父容器的y属性
     */
    absY: number;

    /**
     * 图形左边界在全局画布上的绝对X坐标
     * 等价于 absX，预存避免重复计算
     */
    left: number;

    /**
     * 图形右边界在全局画布上的绝对X坐标
     * 计算方式：absX + shape.width
     */
    right: number;

    /**
     * 图形上边界在全局画布上的绝对Y坐标
     * 等价于 absY，预存用于快速范围检测
     */
    top: number;

    /**
     * 图形下边界在全局画布上的绝对Y坐标
     * 计算方式：absY + shape.height
     */
    bottom: number;

    /**
     * 图形的原始宽度（不受缩放影响）
     * 直接从 shape.width 获取，用于相对坐标计算
     */
    width: number;

    /**
     * 图形的原始高度（不受缩放影响）
     * 直接从 shape.height 获取，用于相对坐标计算
     */
    height: number;

    /**
     * 宽度的倒数 (1/width)，预计算用于优化性能
     * 用途：将绝对坐标转换为相对坐标时，用乘法替代除法
     * 示例：relativeX = (x - absX) * invWidth
     */
    invWidth: number;

    /**
     * 高度的倒数 (1/height)，预计算用于优化性能
     * 用途：将绝对坐标转换为相对坐标时，用乘法替代除法
     * 示例：relativeY = (y - absY) * invHeight
     */
    invHeight: number;
}
