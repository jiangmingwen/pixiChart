import { GlobalStyle } from "../../config/globalStyle";
import { EHighlightMode, IHignlightStyle } from "./type";

export const hignlightStyleConfig: Record<EHighlightMode, IHignlightStyle> = {
    [EHighlightMode.Base]: {
        width: GlobalStyle.BaseShapeHighlightWidth,
        color: GlobalStyle.BaseShapeHighlightColor,
    },
    [EHighlightMode.Connecting]: {
        width: GlobalStyle.ConnectingHighlightWidth,
        color: GlobalStyle.ConnectingHighlightColor,
    },
    [EHighlightMode.Nest]: {
        width: GlobalStyle.NestHighlightWidth,
        color: GlobalStyle.NestHighlightColor,
    },
    [EHighlightMode.Active]: {
        width: GlobalStyle.ActiveHighlightWidth,
        color: GlobalStyle.ActiveHighlightColor,
    }
}