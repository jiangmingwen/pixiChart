/** 移除对象里的所有undefined属性 */
export function removeUndefined<T>(obj: T): T {
    for (const key in obj) {
        if (obj[key] === undefined) {
            delete obj[key]
        }
    }
    return obj
}



export function clamp(value: number, min: number, max: number) {
    return value < min ? min : value > max ? max : value;
}