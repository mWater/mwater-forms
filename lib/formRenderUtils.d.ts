import { Item, FormDesign, Question, QuestionBase } from "./formDesign"
import ResponseRow from "./ResponseRow"
import { Schema } from "mwater-expressions"
import { RefObject, ReactElement } from "react"

/** Render an item, given its data, visibility function, etc. */
export function renderItem(
  item: Item,
  data: any,
  responseRow: ResponseRow,
  schema: Schema,
  onDataChange: () => any,
  isVisible: () => boolean,
  onNext: () => any,
  ref?: (c: any) => void
): ReactElement
