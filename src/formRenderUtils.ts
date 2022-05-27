import _ from "lodash"
import * as formUtils from "./formUtils"
import React, { ReactElement } from "react"
const R = React.createElement

import QuestionComponent from "./QuestionComponent"
import InstructionsComponent from "./InstructionsComponent"
import TimerComponent from "./TimerComponent"
import GroupComponent from "./GroupComponent"
import RosterGroupComponent from "./RosterGroupComponent"
import RosterMatrixComponent from "./RosterMatrixComponent"
import { Item } from "./formDesign"
import { Schema } from "mwater-expressions"
import { default as ResponseRow } from "./ResponseRow"
import { ResponseData } from "./response"

/** Render an item, given its data, visibility function, etc. */
export function renderItem(
  item: Item,
  data: ResponseData,
  responseRow: ResponseRow,
  schema: Schema,
  onDataChange: (data: ResponseData) => void,
  isVisible: (id: string) => boolean,
  onNext: () => any,
  ref?: (c: any) => void
): ReactElement {
  const handleAnswerChange = (id: any, answer: any) => {
    const change = {}
    change[id] = answer
    return onDataChange(_.extend({}, data, change))
  }

  if (formUtils.isQuestion(item)) {
    let component
    return (component = R(QuestionComponent, {
      key: item._id,
      ref,
      question: item,
      onAnswerChange: handleAnswerChange.bind(null, item._id),
      data,
      responseRow,
      schema,
      onNext
    }))
  } else if (item._type === "Instructions") {
    return R(InstructionsComponent, {
      key: item._id,
      ref,
      instructions: item,
      data,
      responseRow,
      schema
    })
  } else if (item._type === "Timer") {
    return R(TimerComponent, {
      key: item._id,
      ref,
      timer: item
    })
  } else if (item._type === "Group") {
    return R(GroupComponent, {
      key: item._id,
      ref,
      group: item,
      data,
      onDataChange,
      responseRow,
      schema,
      isVisible,
      onNext
    })
  } else if (item._type === "RosterGroup") {
    return R(RosterGroupComponent, {
      key: item._id,
      ref,
      rosterGroup: item,
      data,
      onDataChange,
      responseRow,
      schema,
      isVisible
    })
  } else if (item._type === "RosterMatrix") {
    return R(RosterMatrixComponent, {
      key: item._id,
      ref,
      rosterMatrix: item,
      data,
      onDataChange,
      schema,
      responseRow,
      isVisible
    })
  } else if (item._type === "Section") {
    // Sections are not usually rendered like this, except when in single-page mode. In which case, render as a group
    return R(GroupComponent, {
      key: item._id,
      ref,
      group: item,
      data,
      onDataChange,
      responseRow,
      schema,
      isVisible,
      onNext
    })
  } else {
    throw new Error(`Unknown item of type ${(item as any)._type}`)
  }
}
