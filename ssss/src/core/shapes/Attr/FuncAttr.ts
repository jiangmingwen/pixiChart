import { AttrItemBase } from "./AttrItemBase";

/** 方法类的属性
 * ${方法名}(${参数1},${参数2}):${返回值}
 */
export class FuncAttr extends AttrItemBase {
    /** 方法名 */
    label: string
    /** 参数列表 */
    params: string[] = []
    /** 返回值 */
    returnValue?: string
    
}