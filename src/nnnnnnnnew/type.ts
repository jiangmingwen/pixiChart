import type { PointData } from "pixi.js";
import type { BlockShape } from './shapes/blocks/blockShape';
import type { LineShape } from "./shapes/lines/lineShape";

/** 类的类型 */
export type ClassType<T> = new (...args: any[]) => T;

/** blockShape的类 */
export type IClassBlockShape = typeof BlockShape


/** lineShape的类 */
export type IClassLineShape = typeof LineShape

/** 坐标 */
export type IPointData = PointData

