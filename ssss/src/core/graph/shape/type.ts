import { TextStyleFontStyle, TextStyleFontWeight } from "pixi.js"


export interface IBlockShape extends IBlockShapeData, IBlockShapePosition, IBlockShapeSize, IBlockShapeStyle, IBlockShapeInteraction {

}

export interface IBlockShapeData {
    id: string
    parentId?: string
    label?: string
    stereotype?: string

    isDelete?: boolean
}


export interface IBlockShapeStyle {
    fillColor?: string
    fillBgImg?: string
    fillAlpha?: number

    strokeColor?: string
    strokeAlpha?: number
    strokeWidth?: number
    activeStrokeColor?: string
    activeStrokeAlpha?: number

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


export type ClassType<T> = new (
    ...args: ConstructorParameters<{ new(...args: any[]): T }>
) => T;



export interface IPoint {
    x: number
    y: number
}