/** 高亮模式 */
export enum EHighlightMode {
    /** 基准高亮 */
    Base = 'Base',
    /** 连线高亮 */
    Connecting = 'Connecting',
    /** 嵌套高亮 */
    Nest = 'Nest',
    /** 选中图元的高亮 */
    Active = 'Active',
}


export interface IHignlightStyle {
    /** 高亮的颜色 */
    color: number | string
    /** 高亮的线宽 */
    width: number
}

