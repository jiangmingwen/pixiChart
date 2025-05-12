import { Application } from 'pixi.js'

export interface ISEColumns {
    key: string
    label: string;
    width?: number | string
    ellipsis?: boolean
}

export interface ISETableOptions {
    showHeaderIcon?: boolean
    showBorder?: boolean
    borderWidth?: number
    borderColor?: string
    columns: ISEColumns[] 
    dataSource: ISEDataSource[]

}


export interface ISEDataSource {

}

export class TableBase {
    columns: ISEColumns[] = []

    dataSource: ISEDataSource[] = []

    private readonly app: Application;
    private dom: HTMLElement

    constructor(dom: HTMLElement, options: ISETableOptions = {
        dataSource: [],
        columns: [],
    }) {
        this.app = new Application();
        this.dom = dom;
        this.dataSource = options.dataSource;
        this.columns = options.columns;
    }

    private _renderHeader(){
        
    }



    update() {
        
    }

    updateHeader() {

    }



}