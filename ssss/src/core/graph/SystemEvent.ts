import { Graph } from "./Graph";
import { ILineShape } from "./shape/lines/LineShape";
import { IBlockShape } from "./shape/type";

export enum SystemEventType {
    Resize = 'Resize',

    Move = 'Move',


    Scale = 'Scale',

    Zindex = 'Zindex',

    Nest = 'Nest',

    DataChange = 'DataChange',

    Connect = 'Connect'

}

export class SystemEvent {

    private messages: Map<string, any[]> = new Map();

    blockUpdate: Record<string, Partial<IBlockShape>> = {}

    lineUpdate: Record<string, Partial<ILineShape>> = {}


    constructor(public graph: Graph) { }

    begin() {
        this.blockUpdate = {}
        this.lineUpdate = {}
        return this
    }

    end() {
        console.log('end :blockUpdate', this.blockUpdate)
        console.log('end :lineUpdate', this.lineUpdate)
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