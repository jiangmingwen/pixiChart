import { GlobalStype } from "../../../shapes/GlobalStyle";
import { SEGraphics } from "../../override/graphics";
import { BaseBlockShape } from "../BaseBlockShape";
import { IBoundsPoint } from "../BlockContainer";
import { IBlockShape } from "../type";

export class ClassBlockShape extends BaseBlockShape  {

    calcVisibleBounds(): IBoundsPoint {
        return [
            [0,0],
            [20,0],
            [20,-20],
            [150,-20],
            [150,0],
            [200,0],
            [200,200],
            [0,200],
            [0,0]
        ]
    } 
    static get name(): string {
        return 'ClassBlockShape'
    }


    init(){
        console.log(123,'class')
        
    }


}