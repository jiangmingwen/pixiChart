import type { IBlockData, ILineData } from "../nnnnnnnnew/graph/type"

export interface IReactPixichartProps {
    /** 视图id */
    diagramId: string

}



export interface IUpdateData {
    blocks: IBlockData[]
    lines: ILineData[]
}

export interface IReactPixichartInstance {
    compositeUpdateBlocksAndLines: (data: IUpdateData) => void


}