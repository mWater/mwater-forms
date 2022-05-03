import React, { useCallback, useMemo } from "react"
import { localizeString } from "../formUtils"
import { Choice } from "../formDesign"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
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
  

  const items = useMemo(() => {
    return _.sortBy(choices, (item) => !!answer ? (answer[item.id] ?? 0) : 0)
  }, [choices, answer])

  const handleReorder = useCallback((result) => {
    if (!result.destination) {
      return;
    }

    const _items = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    onValueChange(reduceAnswer(_items))
  }, [onValueChange, items])

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

  return (
    <DragDropContext onDragEnd={handleReorder}>
      <Droppable droppableId="ranked__droppable">
      {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div className="__ranked_option">
                        <div className="label">
                        <span className="fas fa-arrows-alt" />
                          {`${index+1}. `}
                          <span>{localizeString(item.label, locale)}</span>
                        </div>
                        <div className="controls">
                          <button className="btn" disabled={index == 0} onClick={() => moveUp(index)}><span className="fas fa-arrow-up"/></button>
                          <button className="btn" disabled={index+1 === items.length} onClick={() => moveDown(index)}><span className="fas fa-arrow-down"/></button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
      </Droppable>
    </DragDropContext>
  )
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  borderRadius: 4,

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
});

export default RankedQuestion
