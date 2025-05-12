/**
 * 校验是否可以链接
 * @param lineType 连线类型
 * @param sourceId 起点shapeId 若为undefined 则为表示校验场景为：选择起点图元。若不为undefined 则表示校验场景为：选择终点图元。
 * @param targetId 终点shape 若为undefined 则为表示校验场景为：终点落在画布上。如果不为undefined 则表示校验场景为：选择终点图元。
 */
export type IValidFn<T = any> = (lineType: T, sourceId?: string, targetId?: string) => boolean


export interface ShapeCache {
    /**
     * 图形在全局画布上的绝对X坐标（已累加所有父容器的偏移量）
     * 计算方式：递归累加自身及所有父容器的x属性
     */
    absX: number;

    /**
     * 图形在全局画布上的绝对Y坐标（已累加所有父容器的偏移量）
     * 计算方式：递归累加自身及所有父容器的y属性
     */
    absY: number;

    /**
     * 图形左边界在全局画布上的绝对X坐标
     * 等价于 absX，预存避免重复计算
     */
    left: number;

    /**
     * 图形右边界在全局画布上的绝对X坐标
     * 计算方式：absX + shape.width
     */
    right: number;

    /**
     * 图形上边界在全局画布上的绝对Y坐标
     * 等价于 absY，预存用于快速范围检测
     */
    top: number;

    /**
     * 图形下边界在全局画布上的绝对Y坐标
     * 计算方式：absY + shape.height
     */
    bottom: number;

    /**
     * 图形的原始宽度（不受缩放影响）
     * 直接从 shape.width 获取，用于相对坐标计算
     */
    width: number;

    /**
     * 图形的原始高度（不受缩放影响）
     * 直接从 shape.height 获取，用于相对坐标计算
     */
    height: number;

    /**
     * 宽度的倒数 (1/width)，预计算用于优化性能
     * 用途：将绝对坐标转换为相对坐标时，用乘法替代除法
     * 示例：relativeX = (x - absX) * invWidth
     */
    invWidth: number;

    /**
     * 高度的倒数 (1/height)，预计算用于优化性能
     * 用途：将绝对坐标转换为相对坐标时，用乘法替代除法
     * 示例：relativeY = (y - absY) * invHeight
     */
    invHeight: number;
}
