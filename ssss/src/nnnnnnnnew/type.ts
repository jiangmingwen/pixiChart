import { PointData } from "pixi.js";
import type { BlockShape } from './shapes/blocks/blockShape'

/** 类的类型 */
export type ClassType<T> = new (...args: any[]) => T;

/** blockShape的类 */
export type IClassBlockShape = typeof BlockShape

/** 坐标 */
export type IPointData = PointData

