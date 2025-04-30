import { Graph } from "../graph/Graph";
import { Container } from "./Container";


// 基础图形配置
export interface ShapeConfig {
    [key: string]: any;
    x?: number;
    y?: number;

    graphicType: string;
}





// 基础图形接口
export abstract class SEBaseShape<T extends ShapeConfig = ShapeConfig> {

    id!: string


    static get name(): string {
        throw new Error('必须定义Graphic的静态属性 name ')
    }

    public container!: Container;
    public children: SEBaseShape[] = [];

    readonly graph!: Graph;

    

    constructor(app: Graph) {
        this.graph = app;
        this.created()
    }

    created() {

    }

    abstract renderEntry(): void;


    init(): this {
        this.renderEntry();
        return this;
    }


}