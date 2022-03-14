import React, { useCallback, useMemo } from "react"
import ReorderableListComponent from "react-library/lib/reorderable/ReorderableListComponent"
import { localizeString } from "../formUtils"
import { Choice } from "../formDesign"
import _ from "lodash"
import { RankedAnswerValue } from "src"

type RankedQuestionProps = {
  choices: Choice[]
  answer: RankedAnswerValue
  /** Locale to use */
  locale: string
  onValueChange: (value?: any) => void
}

const reduceAnswer = (value: any[]) => {
  return value.reduce((v, c, i) => {
    v[c.id] = i+1
    return v
  }, {})
}

const RankedQuestion:React.FC<RankedQuestionProps> = ({choices, locale, answer, onValueChange}) => {
  const handleReorder = useCallback((value: any[]) => {
    onValueChange(reduceAnswer(value))
  }, [onValueChange])

  const items = useMemo(() => {
    return _.sortBy(choices, (item) => !!answer ? (answer[item.id] ?? 0) : 0)
  }, [choices, answer])

  const moveUp = useCallback((index: number) => {
    const newAnswer = [...items] as Choice[]
    [newAnswer[index], newAnswer[index-1]] = [newAnswer[index-1], newAnswer[index]]
    onValueChange(reduceAnswer(newAnswer))
    
  }, [items])

  const moveDown = useCallback((index: number) => {
    const newAnswer = [...items] as Choice[]
    [newAnswer[index], newAnswer[index+1]] = [newAnswer[index+1], newAnswer[index]]
    onValueChange(reduceAnswer(newAnswer))
  }, [items])

  const renderItem = (entry: any, index: any, connectDragSource: any, connectDragPreview: any, connectDropTarget: any) => {
    return connectDropTarget(connectDragPreview(
      <div className="__ranked_option">
        <div className="label">
          {
            connectDragSource(<span className="fas fa-grip-vertical" />)
          }
          <span>{localizeString(entry.label, locale)}</span>
        </div>
        <div className="controls">
          <button className="btn" disabled={index == 0} onClick={() => moveUp(index)}><span className="fas fa-arrow-up"/></button>
          <button className="btn" disabled={index+1 === items.length} onClick={() => moveDown(index)}><span className="fas fa-arrow-down"/></button>
        </div>
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
