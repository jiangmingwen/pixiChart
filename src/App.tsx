import { useEffect, useRef } from 'react'
import './App.css'
import type { IBlockData } from './nnnnnnnnew/graph/type'
import { RectBlockShape } from './nnnnnnnnew/shapes/blocks/rect/rectBlockShape'
import { RectWithAttrBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithAttr/rectWithAttrBlockShape'
import { RectWithHeaderBlockShape } from './nnnnnnnnew/shapes/blocks/rectWithHeader/rectWithHeaderBlockShape'
import type { IReactPixichartInstance } from './reactPixichart'
import { ReactPixiChart } from './reactPixichart/reactPixichart'



function App() {
  const graphRef = useRef<IReactPixichartInstance>(null)

  useEffect(() => {
    const blocks = [
      {
        id: '1112345',
        x: 240,
        y: 120,
        width: 100,
        height: 50,
        zIndex: 1,
        graphType: RectBlockShape.shapeType,
        label: '事件1_1',
        stereotype: '事件',
        stereotypeVisible: true

      },
      {
        id: '112345',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        zIndex: 1,
        graphType: RectWithHeaderBlockShape.shapeType,
        label: '包_1',
        stereotype: 'Package',
        stereotypeVisible: false

      },
      {
        id: '12345',
        x: 50,
        y: 20,
        width: 100,
        height: 100,
        zIndex: 1,
        graphType: RectWithAttrBlockShape.shapeType,
        parentId: '1234',

      }, {
        id: '1234',
        x: 300,
        y: 300,
        width: 200,
        height: 200,
        zIndex: 2,
        graphType: RectWithAttrBlockShape.shapeType,
      },
      {
        id: '12346',
        x: 500,
        y: 100,
        width: 200,
        height: 200,
        zIndex: 2,
        graphType: RectWithAttrBlockShape.shapeType,
      }
    ] as IBlockData[]

    graphRef.current?.compositeUpdateBlocksAndLines({ blocks, lines: [] })

  }, [])

  return (
    <>
      <ReactPixiChart diagramId='diagramId' ref={graphRef} />
    </>
  )
}

export default App
