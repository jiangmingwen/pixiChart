import { AttrItemBase } from "./AttrItemBase";

/**
 * 发送属性
 * «event»${名称}: 参数1,参数2...
 */
export class EventAttr extends AttrItemBase {
    label: string;
    params?: string[];
    
}