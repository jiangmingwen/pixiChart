import type { ContainerOptions, TextStyleFontStyle, TextStyleFontWeight } from "pixi.js";


export interface IBlockContainerOptions extends Omit<ContainerOptions, 'height' | 'width'>, IBlockShapeStyle, IBlockShapeSize {

}

/**
 * 边界坐标点
 * [x, y] []
 *  x,y 的绝对值大于1等于1，则为绝对坐标
 *  x,y 的绝对值小于1，则为相对坐标
 * 
 *  如: [0.5, 0.5] 表示宽的一半，高的一半
 */
export type IBoundsPoint = [number, number][];


export interface IBlockShape extends IBlockShapeData, IBlockShapePosition, IBlockShapeSize, IBlockShapeStyle, IBlockShapeInteraction {

}

export interface IBlockShapeData {
    id: string
    parentId?: string
    label?: string
    stereotype?: string
    stereotypeVisible?: boolean
    isDelete?: boolean
}


export interface IBlockShapeStyle {
    fillColor?: string
    fillBgImg?: string

    strokeColor?: string
    strokeWidth?: number
    activeStrokeColor?: string

    fontSize?: number
    fontColor?: string
    fontFamily?: string
    fontStyle?: TextStyleFontStyle;
    fontWeight?: TextStyleFontWeight;

    textDecoration?: boolean
    textAlign?: string
    textOverflow?: boolean
    /** 圆角尺寸 
     * @default 0
    */
    radius?: number
}

export interface IBlockShapeSize {
    width: number
    height: number
    defaultWidth?: number
    defaultHeight?: number
    maxWidth?: number
    maxHeight?: number
    minWidth?: number
    minHeight?: number
}

export interface IBlockShapePosition {
    x: number
    y: number
    zIndex: number
}

export interface IBlockShapeInteraction {
    moveAble?: boolean
    xMoveAble?: boolean
    yMoveAble?: boolean

    resizeAble?: boolean
    xResizeAble?: boolean
    yResizeAble?: boolean

    /** 是否保持宽高比 */
    aspect?: boolean

    /** 是否可选中 */
    selectable?: boolean

    /** 是否禁用 */
    disabled?: boolean
}

/**  shape的尺寸边界 */
export interface IBlockSize {
    maxWidth?: number
    maxHeight?: number
    minWidth?: number
    minHeight?: number
}
