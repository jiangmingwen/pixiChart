import { TextStyle, Text, Application } from "pixi.js";
import { GlobalStype } from "../GlobalStyle";
import { IAttrGroup } from "../ClassBlock/type";
import { Container } from "../Container";
import { AttrItemBase } from "./AttrItemBase";
import { StandardAttr } from "./StandardAttr";
import { EventAttr } from "./EventAttr";
import { FuncAttr } from "./FuncAttr";
import { SignalAttr } from "./SignalAttr";
import { ExpressAttr } from "./ExpressAttr";

export class AttrGroup {
    /** 双链表 prev指针 */
    prev?: AttrGroup
    /** 双链表 next指针 */
    next?: AttrGroup
    title: string = '组成部分属性';
    startY: number = 0;
    height: number = 50;
    container: Container
    parent: Container
    data: IAttrGroup
    private readonly app: Application;

    constructor(parent: Container, data: IAttrGroup,app: Application) {
        this.data = data
        this.parent = parent
        this.app = app
        this.container = new Container();
        this.container._width = parent._width
        this.container.position.set(0, this.startY);

        this.drawTitle()
        this.drawList()
        parent.addChild(this.container)
    }

    private drawList() {
        let prev: AttrItemBase | undefined
        this.data.attrs?.forEach(item => {
            let NewClass = AttrItemBase
            if (this.data.type === 'standard') {
                NewClass = StandardAttr
            } else if (this.data.type === 'event') {
                NewClass = EventAttr
            } else if (this.data.type === 'func') {
                NewClass = FuncAttr
            } else if (this.data.type === 'signal') {
                NewClass = SignalAttr
            } else if (this.data.type === 'express') {
                NewClass = ExpressAttr
            }
            // console.log(this.app,'app')
            const attr = new NewClass(this.container, item,this.app)
            if (prev) {
                prev.next = attr
                attr.prev = prev
            }
            prev = attr;
            attr.create()
        })
    }

    drawTitle() {
        const style = new TextStyle({
            fontSize: GlobalStype.AttrTitleFontSize,
            fill: { color: GlobalStype.fontColor },
            align: 'center',
        });
        const text = `${this.title}`;
        const textShape = new Text({
            text,
            style,
            x: (this.parent._width - this.title.length * GlobalStype.AttrTitleFontSize) / 2, //aligncenter不生效，手动偏移
            y: this.startY + GlobalStype.AttrTitleFontSize / 2
        });
        this.parent.addChild(textShape)
    }

}