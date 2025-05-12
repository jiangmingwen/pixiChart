
export interface ILineShape {
    /** 起点shape */
    sourceId?: string;
    /** 结束点shape */
    targetId?: string;
    /** 线起点在起点shape上的相对坐标x */
    exitX?: number
    /** 线起点在起点shape上的相对坐标y */
    exitY?: number
    /** 线终点在终点shape上的相对坐标x */
    entryX?: number
    /** 线终点在终点shape上的相对坐标y */
    entryY?: number
    /** 线终点在终点shape上x偏移量 */
    elementType?: string

}