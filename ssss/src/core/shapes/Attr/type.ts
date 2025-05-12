import { IParam } from "../ClassBlock/type";

export interface ITextNode {
    prev?: ITextNode;
    next?: ITextNode;
    key: string;
    text: string;
    startX: number;
    endX: number;
    startY: number;
    endY: number;

    x1: number;
    x2: number;
    y1: number;
    y2: number;
    source: string | IParam
    paramKey?: string
}