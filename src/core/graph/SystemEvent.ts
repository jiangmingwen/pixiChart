import { Graph } from "./Graph";
import { IBlockShape } from "./shape/type";

export enum SystemEventType {
    Resize = 'Resize',

    Move = 'Move',


    Scale = 'Scale',

    Zindex = 'Zindex',

    Nest = 'Nest',

    DataChange = 'DataChange',

}

export class SystemEvent {

    private messages: Map<string, any[]> = new Map();

    blockUpdate: Record<string, Partial<IBlockShape>> = {}


    constructor(public graph: Graph) { }

    begin() {
        this.blockUpdate = {}

    }

    end() {
        console.log('end', this.blockUpdate)
        // this.blockUpdate.clear();
    }

    private mergeData(data: Record<string, Partial<IBlockShape>>) {
        for (let key in data) {
            const existData = this.blockUpdate[key] ?? {}
            this.blockUpdate[key] = Object.assign(existData, data[key])
        }
    }

    emit(type: SystemEventType, data: Record<string, Partial<IBlockShape>>) {
        this.mergeData(data)
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