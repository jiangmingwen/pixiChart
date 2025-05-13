/** 拖拽数据 */
export interface IDragData {
    /** 关键字 */
    key: string
    /** 图形类型  */
    graphType: string
}


export interface IDragParam<T extends IDragData = any> {
    /** 
     * 拖拽开始
     */
    onDragStart?: () => void
    /** 
     * 拖拽过程 
     */
    onDragHover?: () => void
    /** 
     * 拖拽结束
     */
    onDragEnd?: () => void
    /** 
     * 拖拽的数据
     */
    dragData: T
}

/** 拖拽事件 */
export interface IDragDropEvent<T extends IDragData = any> {
    /** 原生鼠标事件 */
    event: MouseEvent
    /** 拖拽和释放的数据 */
    dragData: T
    /** 拖拽的元素 */
    dragElem: HTMLElement
}

export interface IDropParam {
    /** 拖拽过程 */
    onDragHover: (dragData: IDragData, event: MouseEvent) => void
    /** 拖拽结束 */
    onDragEnd: (dragData: IDragData, event: MouseEvent) => void
}