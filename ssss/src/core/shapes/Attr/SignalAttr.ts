import { AttrItemBase } from "./AttrItemBase";

/** 接收Atrr
 * «signal»${名称}:(参数1,参数2...)=${Sender}
 */
export class SignalAttr extends AttrItemBase {
    label: string

    params?: string[]

    sender?: string
    
}