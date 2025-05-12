import { PointData } from "pixi.js";
import { Graph } from "../../graph/graph";

export class LineShape {

    static get name(): string {
        throw new Error('必须定义Shape的静态属性name,eg: static get name(): string { return "shape名称" }')
    }

    constructor(public readonly graph: Graph) {

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

}

