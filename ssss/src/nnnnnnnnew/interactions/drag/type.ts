
/** 嵌套图元校验函数
 * @param idOrType 图元类型或者图元id
 * @param parentId 父图元id 不存在表示拖拽到画布上
 */
export type INestValidFn = (idOrType: string, parentId?: string) => boolean



/** 拖拽图元到画布的校验
 * @param dragData 图元类型或图元id
 * @param parentId 父图元id 不存在表示拖拽到画布上
 */
export type IDropValidFn = (dragData: string, parentId?: string) => boolean

/** 图形预览数据 */
export interface IPreviewData {
    /** 图形类型 */
    graphType: string

    /** 宽度 */
    width: number
    /** 高度 */
    height: number
    /** 填充颜色 */
    fillColor?: number
    /** 边框颜色 */
    strokeColor?: number
    /** 边框宽度 */
    strokeWidth?: number
    /** 缩放比例 */
    scale?: number
}