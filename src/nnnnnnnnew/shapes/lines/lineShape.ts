import { Graphics, type PointData } from "pixi.js";
import { Graph } from "../../graph/graph";
import type { ILineData } from "../../graph/type";
import { SEContainer } from "../../pixiOverrides/container";

export class LineShape extends SEContainer {
    id: string
    static get shapeType(): string {
        throw new Error('必须定义Shape的静态属性shapeType,eg: static get name(): string { return "shape名称" }')
    }

    constructor(public readonly graph: Graph, public options: ILineData) {
        super()
        this.id = options.id
        this.sourceId = options.sourceId
        this.targetId = options.targetId
        this.exitX = options.exitX
        this.exitY = options.exitY
        this.entryX = options.entryX
        this.entryY = options.entryY
        this.points = options.points
        this.drawLine()
    }

    /** 起点shape */
    sourceId?: string;
    /** 结束点shape */
    targetId?: string;

    /** 折点 */
    points?: PointData[]
    /** 线起点在起点shape上的相对坐标x */
    exitX?: number
    /** 线起点在起点shape上的相对坐标y */
    exitY?: number
    /** 线起点在起点shape上x偏移量 */
    exitDx?: number
    /** 线起点在起点shape上y偏移量 */
    exitDy?: number
    /** 线终点在终点shape上的相对坐标x */
    entryX?: number
    /** 线终点在终点shape上的相对坐标y */
    entryY?: number
    /** 线终点在终点shape上x偏移量 */
    entryDx?: number
    /** 线终点在终点shape上y偏移量 */
    entryDy?: number

    getStartPoint() {
        const shape = this.graph.getShapeById(this.sourceId!)
        if (!shape) return
        const sourcePos = this.graph.interactions.connection.getAbsolutePosition(shape)

        const [dx, dy] = shape.getOffsetPosition(this.exitX ?? 0, this.exitY ?? 0)
        let x = sourcePos.x + (this.exitX ?? 0 * shape.width)
        let y = sourcePos.y + (this.exitY ?? 0) * shape.height
        return {
            x: x + dx,
            y: y + dy
        }
    }

    getEndPoint() {
        const shape = this.graph.getShapeById(this.targetId!)
        if (!shape) return
        const sourcePos = this.graph.interactions.connection.getAbsolutePosition(shape)
        console.log(this.entryX, this.entryY)
        const [dx, dy] = shape.getOffsetPosition(this.entryX ?? 0, this.entryY ?? 0)
        let x = sourcePos.x + (this.entryX ?? 0 * shape.width)
        let y = sourcePos.y + (this.entryY ?? 0) * shape.height

        return {
            x: x + dx,
            y: y + dy
        }
    }


    drawLine() {
        if (!this.sourceId || !this.targetId) return
        const startPos = this.getStartPoint()
        const endPos = this.getEndPoint()
        if (!startPos || !endPos) return
        const g = new Graphics({
            x: 0,
            y: 0,
            interactive: true
        })
        console.log(startPos, endPos, 'start and end')
        g.moveTo(startPos.x, startPos.y)
        this.points?.forEach(point => {
            g.lineTo(point.x, point.y)
        })
        g.lineTo(endPos.x, endPos.y)
        g.stroke({
            color: 0x000000,
            width: 1,
            pixelLine: true
        })
        this.addChild(g)
    }

}

