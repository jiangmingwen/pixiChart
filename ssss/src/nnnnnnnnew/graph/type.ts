import { ActiveShapePlugin } from "../interactions/active/activePlugin"
import { ConnectionPlugin } from "../interactions/connection/connectionPlugin"
import { DragPlugin } from "../interactions/drag/dragPlugin"
import { HignlightPlugin } from "../interactions/hignlight/hignlightPlugin"
import { IBlockShape } from "../shapes/blocks/type"
import { ILineShape } from "../shapes/lines/type"
import type { Graph } from "./graph"

export interface IGraphOptions {
    /** 视图的宽 */
    width: number
    /** 视图的高 */
    height: number
    /** 画布挂载的根元素 */
    el: HTMLElement
    /** 视图id */
    id: string
}

/**  滚动条  */
export type IOverflow = 'hidden' | 'auto' | 'scroll'

export interface IScrollViewOptions {
    graph: Graph
    diagramWidth: number
    diagramHeight: number
}


export interface IQuickCreateInfo {
    lineKey: string
    blockKey: string
}

export interface IPreview {
    graphType: string
    defaultWidth: number
    defaultHeight: number
    title?: string
    stereotype?: string
}


// export interface IQuickStartMenu {
//     lineType: IOptions
//     blockTypes: IOptions[]
// }

// export interface IQuickStart extends IEditSelectOptions {
//     menus: IQuickStartMenu[]
// }



// 更新数据的类型
export interface IBlockData extends IBlockShape {
    graphType: string
}

export interface ILineData extends ILineShape {
    graphType: string
}


export interface IInteractions {
    drag: DragPlugin
    hignlight: HignlightPlugin
    connection: ConnectionPlugin
    active: ActiveShapePlugin

}