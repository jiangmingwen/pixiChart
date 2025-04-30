export interface IAttrGroup {
    type: 'standard' | 'event' | 'func' | 'signal' | 'express'
    title: string
    attrs: IAttr[]
}
/** 属性 */
export interface IAttr {
    id: string
    /** 名称前缀 会被用 */
    prefix?:string
    /** 类型 */
    type?:  string
    /** 标题 */
    label?: string
    /** 方法的名字 */
    fnLabel?: string
    /** 多重性 */
    multiplicity?: string
    /** 表达式 */
    express?: string
    /** 参数列表 */
    params?: IParam[]
    /** 方法的参数列表 */
    fnParams?: IParam[]
    /** 参数括号 */
    paramsBreackets?: [string,string]
    /** 发送方 */
    sender?: string
    /** 返回值 */
    returnValue?: string
    /** 值 */
    defaultValue?: string
    /** 度量单位 */
    messaureUnit?: string
    /* * 度量符号 */
    messaureOperator?: string
    /* * 度量值 */
    messaureValue?: string
}

export interface IParam {
    id: string
    /** 参数名称 */
    label: string
    /** 参数类型 */
    type?: string
    /** 参数默认值 */
    defaultValue?: string
}