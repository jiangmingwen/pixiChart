import { IAttr, IAttrGroup, IParam } from "../ClassBlock/type";
import { Container } from "../Container";
import { Application, Text, TextStyle, HTMLText, HTMLTextStyle } from 'pixi.js'
import { ITextNode } from "./type";
import { GlobalStype } from "../GlobalStyle";
import { symbolMap } from "./config";
// import { HTMLText } from '@pixi/text-html'

export class AttrItemBase {
    id: string;

    prev?: AttrItemBase
    next?: AttrItemBase

    data: IAttr;
    parent: Container

    container: Container

    startY: number = 50

    endY: number = 0

    // 十字链表法
    textNode: ITextNode
    private readonly app: Application;


    constructor(parent: Container, data: IAttr, app: Application) {
        this.id = data.id;
        this.data = data;
        this.app = app
        // console.log(app, 'app')
        this.parent = parent;
        this.container = new Container();
        // this.textNode = this.createTextNode()
        // console.log(this.textNode)
    }

    createTextNode() {
        const keys: (keyof IAttr)[] = [
            'prefix',
            'label',
            'fnLabel',
            'type',
            'multiplicity',
            'express',
            'params',
            'sender',
            'defaultValue',
            'returnValue',
            'messaureUnit',
        ]

        // let linkInfo: { textNode?: ITextNode, prev?: ITextNode } = {
        //     textNode: undefined,
        //     prev: undefined
        // }

        // keys.forEach(key => {
        //     const value = this.data[key]
        //     if (!value) return
        //     if (Array.isArray(value)) {
        //         value.forEach(item => {

        //         })
        //     } else {
        //         const node = this.getDrawTextWdith(key, value, linkInfo, value)
        //     }

        // })
        // return linkInfo.textNode as ITextNode
    }

    private drawPrefix(prefix: string,) {



    }

    private drawText(textNode: ITextNode) {
        // const style = new TextStyle({
        //     fontSize: GlobalStype.AttrTitleFontSize,
        //     fill: { color: GlobalStype.fontColor },
        // });
        // const { text, startX, startY } = textNode
        // const textShape = new Text({
        //     text: text,
        //     style,
        //     x: startX,
        //     y: startY
        // });
        const style = new HTMLTextStyle({
            breakWords: true,
            letterSpacing: 0,
            wordWrapWidth: this.parent._width,
            fontSize: 16,
            wordWrap: true,
        })

        const text = new HTMLText({
            text: textNode.text,
            style,
            y: 20
        })
        this.parent.addChild(text)
        text.interactive = true
        text.on('click', (e) => {
            console.log(text.width, e, 'e')
        })
        return text
    }

    private getRequiredWidth(text: string) {
        const style = new TextStyle({
            fontSize: GlobalStype.AttrTitleFontSize,
            fill: { color: GlobalStype.fontColor },
            wordWrapWidth: 20,
            wordWrap: true,
        });
        const textShape = new Text({
            text,
            style,
            x: 0,
            y: 0,

        });
        return textShape.width
    }


    getCount(text: string, width: number): number {
        const pattern = /[\p{Script=Han}]/u;
        let calcWidth = 0, nextWidth = 0;
        for (let i = 0; i < text.length; i++) {
            if (pattern.test(text[i])) {
                nextWidth = GlobalStype.AttrFontSize
            } else {
                nextWidth = GlobalStype.AttrFontSize / 2
            }
            if (calcWidth + nextWidth >= width) {
                return i
            }
            calcWidth += nextWidth
        }
        return text.length
    }


    getDrawTextWdith(key: string, _text: string, linkInfo: { textNode?: ITextNode, prev?: ITextNode }, source: any) {
        let remainWidth = this.parent._width - GlobalStype.ContentPadding * 2 - (!linkInfo.prev || linkInfo.prev.endX >= (this.parent._width - GlobalStype.ContentPadding) ? 0 : linkInfo.prev.endX)
        let text = _text
        let requireWidth = this.getRequiredWidth(text)
        let node: ITextNode = {
            key,
            text: "",
            startX: 0,
            endX: 0,
            startY: 0,
            endY: 0,
            source
        }
        if (requireWidth > remainWidth) {// 需要的长度大于剩余长度，需要截取
            // 需要截取text
            while (remainWidth < requireWidth) {
                let count = this.getCount(text, remainWidth)
                if (count == 0 && linkInfo.prev) {
                    linkInfo.prev.endX = this.parent._width - GlobalStype.ContentPadding
                    remainWidth = this.parent._width - GlobalStype.ContentPadding * 2
                    count = this.getCount(text, remainWidth)
                }
                node = {
                    key,
                    text: text.slice(0, count),
                    startX: linkInfo.prev ? linkInfo.prev.endX : GlobalStype.ContentPadding,
                    endX: 0,
                    startY: 0,
                    endY: 0,
                    source
                }
                // 如果前一个的endX超出了一行位置
                node.startX = linkInfo.prev ? (linkInfo.prev.endX >= (this.parent._width - GlobalStype.ContentPadding) ? GlobalStype.ContentPadding : linkInfo.prev.endX) : GlobalStype.ContentPadding
                node.startY = linkInfo.prev ? (
                    linkInfo.prev.endX >= (this.parent._width - GlobalStype.ContentPadding) ? linkInfo.prev.endY : linkInfo.prev.startY
                ) : this.startY;
                const textShape = this.drawText(node)
                node.endX = node.startX + textShape.width
                node.endY = node.startY + textShape.height

                if (node.endX >= (this.parent._width - GlobalStype.ContentPadding)) {
                    // 新的一行
                    remainWidth = this.parent._width - GlobalStype.ContentPadding * 2
                } else {
                    remainWidth = (this.parent._width - GlobalStype.ContentPadding) - node.endX
                }
                if (!linkInfo.textNode) {
                    linkInfo.textNode = node
                }

                text = text.slice(count)
                requireWidth = this.getRequiredWidth(text)
                if (linkInfo.prev) {
                    linkInfo.prev.next = node
                }
                linkInfo.prev = node
            }

        } else {
            node.text = text
            node.startX = linkInfo.prev ? (linkInfo.prev.endX >= (this.parent._width - GlobalStype.ContentPadding) ? GlobalStype.ContentPadding : linkInfo.prev.endX) : GlobalStype.ContentPadding
            node.startY = linkInfo.prev ? (
                linkInfo.prev.endX >= (this.parent._width - GlobalStype.ContentPadding) ? linkInfo.prev.endY : linkInfo.prev.startY
            ) : this.startY;
            const textShape = this.drawText(node)
            node.endX = node.startX + textShape.width
            node.endY = node.startY + textShape.height
            if (!linkInfo.textNode) {
                linkInfo.textNode = node
            }
            if (linkInfo.prev) {
                linkInfo.prev.next = node
            }
            linkInfo.prev = node
        }
    }

    getTextWidth(text: string) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        return ctx?.measureText(text).width
    }

    getTextStyle() {
        return new TextStyle({
            fontSize: GlobalStype.AttrTitleFontSize,
            fill: { color: GlobalStype.fontColor },
        })
    }

    getTextShape(text: string,x:number,y:number,style:TextStyle ){
        const textShape = new Text({
            text,
            style,
            x,
            y
        })
        return textShape
    }

    create() {
        const keys: (keyof IAttr)[] = [
            'prefix',
            'label',
            'fnLabel',
            'type',
            'multiplicity',
            'express',
            'params',
            'sender',
            'defaultValue',
            'returnValue',
            'messaureUnit',
        ]
        // const textStyle = this.getTextStyle()
        // keys.forEach(key => {
        //     let value = this.data[key]
        //     if (!value) return
        //     console.log(key, 'value', value)
        //     let node: ITextNode = {
        //         key,
        //         text: value as string,
        //         startX: 0,
        //         endX: 0,
        //         startY: 0,
        //         endY: 0,
        //         x1: 0,
        //         x2: 0,
        //         y1: 0,
        //         y2: 0,
        //         source: ''
        //     }

        //     const textShape = this.getTextShape(value,0,30,textStyle)
        //     console.log(textShape.width,'textShape',value)
        // })
    }



    create1(): void {
        const keys: (keyof IAttr)[] = [
            'prefix',
            'label',
            'fnLabel',
            'type',
            'multiplicity',
            'express',
            'params',
            'sender',
            'defaultValue',
            'returnValue',
            'messaureUnit',
        ]
        let content = ''
        let prevNode: ITextNode | undefined
        let startNode: ITextNode | undefined
        let maxCount = Math.floor((this.parent._width - GlobalStype.ContentPadding * 2) / GlobalStype.AttrFontSize)

        keys.forEach(key => {
            let value = this.data[key]
            let subContent = ''
            if (!value) return
            let node: ITextNode = {
                key,
                text: value as string,
                startX: 0,
                endX: 0,
                startY: 0,
                endY: 0,
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
                source: ''
            }

            if (key === 'type') {
                subContent = `: ${value}`
                node.text = value as string
                node.key = key
                node.startX = prevNode?.endX ?? 0
                node.endX = node.startX + subContent.length
                node.x1 = node.startX + 2
                node.x2 = node.startX + subContent.length
                node.source = value as string
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node
            } else if (key === 'multiplicity') {
                subContent = `[${value}]`
                node.key = key
                node.startX = prevNode?.endX ?? 0
                node.endX = node.startX + subContent.length
                node.x1 = node.startX + 1
                node.x2 = node.startX + subContent.length - 1
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node
            } else if (key === 'fnLabel') {
                node.startX = prevNode?.endX ?? 0
                node.x1 = node.startX
                node.x2 = node.startX + value.length
                node.endX = node.startX + value.length + 2
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node;
                const paramNode = this.createParamNode(this.data.fnParams, prevNode)
                if (paramNode) {
                    paramNode.firstNode
                    prevNode = paramNode.lastNode
                }
                subContent = `${value} (${paramNode?.content ?? ''})`
                node.endX = node.startX + subContent.length
            } else if (key === 'messaureUnit') {
                // 度量
                if (this.data.messaureUnit || this.data.messaureValue) {
                    let nodeUsed = false;
                    if (this.data.messaureUnit) {
                        node.startX = prevNode?.endX ?? 0
                        node.endX = node.startX + this.data.messaureUnit.length
                        node.x1 = node.startX + 1
                        node.x2 = node.endX
                        node.key = 'messaureUnit'
                        nodeUsed = true
                        if (prevNode) {
                            prevNode.next = node
                        }
                        node.prev = prevNode
                        prevNode = node
                    }
                    let operator = this.data.messaureOperator ?? '=='

                    if (nodeUsed) {
                        let paramNode: ITextNode = {
                            key: 'messaureOperator',
                            text: operator,
                            startX: 0,
                            endX: 0,
                            startY: 0,
                            endY: 0,
                            x1: 0,
                            x2: 0,
                            y1: 0,
                            y2: 0,
                            source: operator
                        }
                        paramNode.startX = prevNode?.endX ?? 0
                        paramNode.endX = paramNode.startX + operator.length
                        paramNode.x1 = paramNode.startX
                        paramNode.x2 = paramNode.endX
                        if (prevNode) {
                            prevNode.next = paramNode
                        }
                        node.prev = prevNode
                        prevNode = paramNode
                    } else {
                        node.key = 'messaureOperator'
                        node.startX = prevNode?.endX ?? 0
                        node.endX = node.startX + operator.length
                        node.x1 = node.startX
                        node.x2 = node.endX
                        node.text = operator
                        if (prevNode) {
                            prevNode.next = node
                        }
                        node.prev = prevNode
                        prevNode = node
                    }

                    if (this.data.messaureValue) {
                        let paramNode: ITextNode = {
                            key: 'messaureValue',
                            text: this.data.messaureValue,
                            startX: 0,
                            endX: 0,
                            startY: 0,
                            endY: 0,
                            x1: 0,
                            x2: 0,
                            y1: 0,
                            y2: 0,
                            source: this.data.messaureValue
                        }
                        paramNode.startX = prevNode?.endX ?? 0
                        paramNode.endX = paramNode.startX + this.data.messaureValue.length + 1
                        paramNode.x1 = paramNode.startX
                        paramNode.x2 = paramNode.endX - 1
                        if (prevNode) {
                            prevNode.next = paramNode
                        }
                        node.prev = prevNode
                        prevNode = paramNode
                    }
                    subContent = `{${this.data.messaureUnit ?? ''}${operator}${this.data.messaureValue ?? ''}}`
                }

            } else if (key === 'express') {
                subContent = `{${value}}`
                node.startX = prevNode?.endX ?? 0
                node.endX = node.startX + value.length + 2
                node.x1 = node.startX + 1
                node.x2 = node.endX - 1
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node

            } else if (key === 'defaultValue') {
                subContent = `=${value}`
                node.startX = prevNode?.endX ?? 0
                node.endX = node.startX + value.length + 1
                node.x1 = node.startX + 1
                node.x2 = node.endX
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node
            } else if (key === 'returnValue') {
                subContent = `:${value}`
                node.startX = prevNode?.endX ?? 0
                node.endX = node.startX + value.length + 1
                node.x1 = node.startX + 1
                node.x2 = node.endX
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node
            } else if (key === 'sender') {
                subContent = `=${value}`
                node.startX = prevNode?.endX ?? 0
                node.endX = node.startX + value.length + 1
                node.x1 = node.startX + 1
                node.x2 = node.endX
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node
            } else if (key === 'params' && !!this.data.params?.length) {
                const paramNode = this.createParamNode(this.data.params, prevNode, this.data.paramsBreackets?.[0] ? 3 : 2, this.data.paramsBreackets?.[1] ? 1 : 0)
                if (paramNode) {
                    prevNode = paramNode.lastNode
                    paramNode.firstNode
                }

                subContent = paramNode?.content ? `: ${this.data.paramsBreackets?.[0] ?? ''}${paramNode?.content}${this.data.paramsBreackets?.[1] ?? ''}` : ''
            } else {
                subContent = `${value ?? ''}`
                node.startX = prevNode?.endX ?? 0
                node.endX = node.startX + value.length
                node.x1 = node.startX
                node.x2 = node.endX
                if (prevNode) {
                    prevNode.next = node
                }
                node.prev = prevNode
                prevNode = node
            }
            if (!startNode) {
                startNode = node
            }

            content += subContent
        })
        console.log(prevNode?.endX, content.length, maxCount)
        console.log(this.getTextWidth(content), '文字长度', content, content.length)
        this.drawText({
            text: content,
            startX: 0,
            startY: this.startY,
        })
    }

    createParamNode(params?: IParam[], _prevNode?: ITextNode, prefixlength: number = 0, suffixlength: number = 0) {
        if (!params?.length) return
        let prevNode = _prevNode
        let firstNode: ITextNode | undefined = undefined
        let content = ''
        params.forEach((param, index) => {
            if (param.label) {
                let paramNode: ITextNode = {
                    key: param.id,
                    text: param.label,
                    startX: 0,
                    endX: 0,
                    startY: 0,
                    endY: 0,
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0,
                    source: param
                }

                const dotLen = !param.type && !param.defaultValue && index !== params.length - 1 ? 1 : 0
                paramNode.startX = prevNode?.endX ?? 0
                paramNode.endX = paramNode.startX + param.label.length + dotLen
                paramNode.x1 = paramNode.startX
                paramNode.x2 = paramNode.endX - dotLen
                paramNode.paramKey = 'label'
                if (!firstNode) {
                    firstNode = paramNode
                    firstNode.endX += prefixlength
                    firstNode.x1 += prefixlength
                }

                if (prevNode) {
                    prevNode.next = paramNode
                }
                paramNode.prev = prevNode
                prevNode = paramNode
            }
            if (param.type) {
                let paramNode: ITextNode = {
                    key: param.id,
                    text: param.type,
                    startX: 0,
                    endX: 0,
                    startY: 0,
                    endY: 0,
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0,
                    source: param
                }

                const dotLen = !param.defaultValue && index !== params.length - 1 ? 1 : 0
                paramNode.startX = prevNode?.endX ?? 0
                paramNode.endX = paramNode.startX + param.type.length + 1 + dotLen
                paramNode.x1 = paramNode.startX + 1
                paramNode.x2 = paramNode.endX
                paramNode.paramKey = 'type'
                if (!firstNode) {
                    firstNode = paramNode
                    firstNode.endX += prefixlength
                    firstNode.x1 += prefixlength
                }
                if (prevNode) {
                    prevNode.next = paramNode
                }
                paramNode.prev = prevNode
                prevNode = paramNode
            }

            if (param.defaultValue) {
                let paramNode: ITextNode = {
                    key: param.id,
                    text: param.defaultValue,
                    startX: 0,
                    endX: 0,
                    startY: 0,
                    endY: 0,
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0,
                    source: param
                }

                const dotLen = index !== params.length - 1 ? 1 : 0
                paramNode.startX = prevNode?.endX ?? 0
                paramNode.endX = paramNode.startX + param.defaultValue.length + dotLen
                paramNode.x1 = paramNode.startX + 1
                paramNode.x2 = paramNode.endX - dotLen
                paramNode.paramKey = 'defaultValue'
                if (!firstNode) {
                    firstNode = paramNode
                    firstNode.endX += prefixlength
                    firstNode.x1 += prefixlength
                }
                if (prevNode) {
                    prevNode.next = paramNode
                }
                paramNode.prev = prevNode
                prevNode = paramNode
            }
            content += `${param.label}${param.type ? ':' + param.type : ''}${param.defaultValue ? '=' + param.defaultValue : ''}${this.data.fnParams!.length - 1 === index ? '' : ','}`
        })
        if (prevNode) {
            prevNode.endX += suffixlength
        }

        return {
            firstNode: firstNode!,
            lastNode: prevNode,
            content
        }
    }



    private drawText1(content: string, offsetX: number, offsetY: number): number {
        const style = new TextStyle({
            fontSize: GlobalStype.AttrTitleFontSize,
            fill: { color: GlobalStype.fontColor },
        });

        const textShape = new Text({
            text: content,
            style,
            x: offsetX,
            y: offsetY
        });
        textShape.interactive = true
        textShape.on('click', (e) => {
            console.log(e, 'e')
        })

        this.parent.addChild(textShape)
        return 0
    }

}