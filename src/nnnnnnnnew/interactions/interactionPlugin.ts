import { Graph } from "../graph/graph";


/** 交互插件 */
export abstract class InteractionPlugin {
    constructor(public readonly graph: Graph) {
        this.init()
    }

    abstract init(): void

    abstract destroy(): void

    get interactions() {
        return this.graph.interactions
    }


}