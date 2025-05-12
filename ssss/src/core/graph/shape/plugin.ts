import { Graph } from "../Graph";



export abstract class GraphPlugin {
    constructor(public readonly graph: Graph) { 
        this.init()
    }

    abstract init(): void

    abstract destroy(): void

    
}