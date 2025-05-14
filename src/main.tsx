import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Graph } from './nnnnnnnnew/graph/graph.ts'
import { RectBlockShape } from './nnnnnnnnew/shapes/blocks/rect/rectBlockShape.ts'
import { RectWithAttrBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithAttr/rectWithAttrBlockShape.ts'
import { RectWithHeaderBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithHeader/rectWithHeaderBlockShape.ts'
import { StraightLineShape } from './nnnnnnnnew/shapes/lines/straightLine/straightLineShape.ts'

// 注册图形
Graph.registerShape([RectWithAttrBlockShape, RectWithHeaderBlockShape, RectBlockShape])
  .registerShape([StraightLineShape])

createRoot(document.getElementById('root')!).render(
  <App />
)
