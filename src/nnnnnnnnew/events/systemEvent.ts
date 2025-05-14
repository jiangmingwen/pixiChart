import { Graph } from "../graph/graph";
import type { IBlockShape } from "../shapes/blocks/type";
import type { ILineShape } from "../shapes/lines/type";
import { SystemEventType } from "./type";

export class SystemEvent {

    private messages: Map<string, any[]> = new Map();

    blockUpdate: Record<string, Partial<IBlockShape>> = {}

    lineUpdate: Record<string, Partial<ILineShape>> = {}

    /**  记录批次  */
    private batchCount = 0

    constructor(public graph: Graph) { }

    begin() {
        if (this.batchCount <= 0) {
            //批量更新标识>0表示已经开始批量收集数据了，不初始化
            this.blockUpdate = {}
            this.lineUpdate = {}
        }
        this.batchCount++
        return this
    }

    end(cb?: (blockdata: Record<string, Partial<IBlockShape>>, lineData: Record<string, Partial<ILineShape>>) => void) {
        if (--this.batchCount <= 0) {
            console.log('end :blockUpdate', this.blockUpdate)
            console.log('end :lineUpdate', this.lineUpdate)
        }
        cb?.(this.blockUpdate, this.lineUpdate)
        return this
        // this.blockUpdate.clear();
    }

    private mergeBlockdata(data: Record<string, Partial<IBlockShape>>) {
        for (let key in data) {
            const existData = this.blockUpdate[key] ?? {}
            this.blockUpdate[key] = Object.assign(existData, data[key])
        }
    }


    private mergeLinedata(data: Record<string, Partial<ILineShape>>) {
        for (let key in data) {
            const existData = this.lineUpdate[key] ?? {}
            this.lineUpdate[key] = Object.assign(existData, data[key])
        }
    }

    emit(type: SystemEventType, data?: Record<string, Partial<IBlockShape>>, lineData?: Record<string, Partial<ILineShape>>) {
        if (data) {
            this.mergeBlockdata(data)
        }
        if (lineData) {
            this.mergeLinedata(lineData)
        }
        if (!this.messages.has(type)) return this
        this.messages.get(type)!.forEach(fn => {
            fn(data)
        })
        return this
    }

    on(type: SystemEventType, callback: Function) {
        if (!this.messages.has(type)) {
            this.messages.set(type, [])
        }
        this.messages.get(type)!.push(callback)
    }


    off(type: SystemEventType, callback: Function) {
        if (!this.messages.has(type)) return
        if (!callback) {
            this.messages.delete(type)
            return
        }
        this.messages.get(type)!.splice(this.messages.get(type)!.indexOf(callback), 1)
    }

}