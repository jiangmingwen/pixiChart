import type { Graph } from "../nnnnnnnnew/graph/graph"
import type { IBlockData, ILineData } from "../nnnnnnnnew/graph/type"
import type { IConnectData } from "../nnnnnnnnew/interactions/connection/type"
import type { IPreviewData } from "../nnnnnnnnew/interactions/drag/type"
import type { IPointData } from "../nnnnnnnnew/type"
import type { IDragData } from "./dragDrop/type"

export interface IReactPixichartProps {
    /** 视图id */
    diagramId: string
    /** 获取预览数据 
     * @param dragData 拖拽数据
     */
    getPreviewData?: (dragData: IDragData) => IPreviewData

    /** 拖拽到画布 
     * @param dragData 拖拽数据
     * @param position 释放位置
     * @param parentId 父节点id
     */
    onDragToGraph?: (dragData: IDragData, position: IPointData, parentId?: string) => void

    /** 连线结束
     * @param lineData 连线数据
     */
    onConnectEnd?: (lineData: IConnectData) => void
}



export interface IUpdateData {
    blocks: IBlockData[]
    lines: ILineData[]
}

export interface IReactPixichartInstance {
    compositeUpdateBlocksAndLines: (data: IUpdateData) => void

    graph: { current: Graph }
}