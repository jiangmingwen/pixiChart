
/** 嵌套图元校验函数
 * @param id 图元id
 * @param parentId 父图元id 不存在表示拖拽到画布上
 */
export type INestValidFn = (id: string, parentId?: string) => boolean