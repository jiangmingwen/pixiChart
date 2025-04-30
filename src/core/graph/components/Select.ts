import { Assets, Container, ContainerOptions, Graphics, Sprite } from "pixi.js";
import { ScrollBox } from '@pixi/ui'
import { GlobalStype } from "../../shapes/GlobalStyle";

export interface IOptions {
    tooltip?: string
    icon: string
    value: string
}

export interface IEditSelectOptions {
    maxHeight?: number
    itemHeight?: number
    width?: number
}

export interface ISelectOptions extends ContainerOptions, IEditSelectOptions {
    value?: string
    onSelect?: (value: string) => void
    options: IOptions[]
}

export class Select extends Container {

    scrollBox: ScrollBox
    options: IOptions[]
    itemHeight: number
    onSelect?: (value: string) => void

    constructor({ maxHeight = 300, width = 180, itemHeight = 30, value, onSelect, options, ...containerOptions }: ISelectOptions) {
        super(containerOptions)
        this.scrollBox = new ScrollBox({
            background: 0XFFFFFF,
            width,
            height: options.length * itemHeight > maxHeight ? maxHeight : options.length * itemHeight,
        })
        this.options = options
        this.width = width
        this.itemHeight = itemHeight
        this.onSelect = onSelect
        this.addChild(this.scrollBox)
    }

    async show(parent: Graphics, height: number) {
        const items = await this.createItem(this.options, this.width, this.itemHeight)
        this.scrollBox.addItems(items)
        this.addToParent(parent, height)
    }

    hide() {
        this.parent.removeChild(this)
    }

    addToParent(parent: Graphics, height: number) {
        console.log(this.scrollBox, parent.x, parent.y, parent.width, parent.height)
        this.scrollBox.x = 6 + parent.width
        this.scrollBox.y = (height - this.scrollBox.height) / 2
        parent.addChild(this)

    }

    async createItem(options: IOptions[], width: number, itemHeight: number) {
        await Assets.load(options.map(item => item.icon));
        return options.map((item, i) => {
            const option = new Graphics()
            option.rect(0,0, width, itemHeight).fill()
            const icon = Sprite.from(item.icon)
            icon.anchor.set(0, 0)
            icon.width = 20
            icon.height = 20
            icon.x = (width - 20) / 2
            icon.y = 5
            option.addChild(icon)
            if (i != options.length - 1) {
                option.moveTo(4, itemHeight)
                    .lineTo(width - 4, itemHeight)
                    .closePath()
                    .stroke({
                        width: 1,
                        color: GlobalStype.strokeColor
                    })
            }
            option.interactive = true;
            option.on('click',()=> {
                this.onSelect?.(item.value)
            })
            return option
        })
    }


    render(options: ISelectOptions) {
        const t = Assets.add({ alias: 'flowerTop', src: 'https://pixijs.com/assets/flowerTop.png' });
        const t2 = Assets.add({ alias: 'eggHead', src: 'https://pixijs.com/assets/eggHead.png' });
        return [
            new Graphics({

            })
        ]
    }





}