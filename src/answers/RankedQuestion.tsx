import React, { useCallback, useMemo } from "react"
import ReorderableListComponent from "react-library/lib/reorderable/ReorderableListComponent"
import { localizeString } from "../formUtils"
import { Choice } from "../formDesign"
import _ from "lodash"

type RankedQuestionProps = {
  choices: Choice[]
  answer: any
  /** Locale to use */
  locale: string
  onValueChange: (value?: any) => void
}

const RankedQuestion:React.FC<RankedQuestionProps> = ({choices, locale, answer, onValueChange}) => {
  const handleReorder = useCallback((value: any[]) => {
    onValueChange(value.reduce((v, c, i) => {
      v[c.id] = i+1
      return v
    }, {}))
  }, [onValueChange])

  const items = useMemo(() => {
    return _.sortBy(choices, (item) => !!answer ? (answer[item.id] ?? 0) : 0)
  }, [choices, answer])

  const renderItem = (entry: any, index: any, connectDragSource: any, connectDragPreview: any, connectDropTarget: any) => {
    return connectDropTarget(connectDragPreview(
      <div className="__ranked_option">
        <p>
          {
            connectDragSource(<span className="glyphicon glyphicon-align-justify" />)
          }
          <span>{localizeString(entry.label, locale)}</span>
        </p>
      </div>
    ))
  }

  return (
    <>
      <ReorderableListComponent 
        items={items}
        onReorder={handleReorder}
        renderItem={renderItem}
        getItemId={(entry: any) => entry.id}
      />
    </>
  )
}


export default RankedQuestion
