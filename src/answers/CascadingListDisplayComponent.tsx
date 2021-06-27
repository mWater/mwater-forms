import { CascadingListAnswerValue } from "../response"
import { CascadingListQuestion } from "../formDesign"
import React, { ReactNode } from "react"
import { localizeString } from "../formUtils"

/** Displays a cascading list question answer */
export const CascadingListDisplayComponent = (props: {
  question: CascadingListQuestion
  value: CascadingListAnswerValue
  locale: string
}) => {
  const parts: ReactNode[] = []

  // Look up each column enum value
  for (let column of props.question.columns) {
    // Find enum value
    const enumValue = column.enumValues.find((ev) => ev.id == props.value[column.id])

    parts.push(
      <div>
        <span className="text-muted">{localizeString(column.name, props.locale)}:&nbsp;</span>
        {enumValue ? localizeString(enumValue.name, props.locale) : "???"}
      </div>
    )
  }
  return <div>{parts}</div>
}
