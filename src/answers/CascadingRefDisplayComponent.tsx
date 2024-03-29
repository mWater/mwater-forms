import { CascadingRefAnswerValue } from "../response"
import { CascadingRefQuestion } from "../formDesign"
import React, { ReactNode, useState, useEffect } from "react"
import { localizeString } from "../formUtils"
import { Row, Schema } from "mwater-expressions"

/** Displays a cascading list question answer */
export const CascadingRefDisplayComponent = (props: {
  question: CascadingRefQuestion
  value: CascadingRefAnswerValue
  locale: string

  schema: Schema

  /** Get a specific row of a custom table */
  getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>
}) => {
  const [row, setRow] = useState<Row | null>()
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load row
    if (props.value) {
      setLoading(true)
      props
        .getCustomTableRow(props.question.tableId, props.value)
        .then((r) => {
          if (r) {
            setRow(r)
            setNotFound(false)
            setLoading(false)
          } else {
            setNotFound(true)
            setLoading(false)
          }
        })
        .catch((err) => {
          throw err
        })
    } else {
      setRow(null)
      setNotFound(false)
    }
  }, [props.value])

  if (loading) {
    return (
      <div>
        <i className="fa fa-spinner fa-spin" />
      </div>
    )
  }

  if (notFound) {
    return <div className="text-danger">???</div>
  }

  if (!row) {
    return null
  }

  const parts: ReactNode[] = []

  // Look up each column enum value or text
  for (const dropdown of props.question.dropdowns) {
    const column = props.schema.getColumn(props.question.tableId, dropdown.columnId)
    if (!column) {
      // Not localized because should not happen
      parts.push(<div className="alert alert-danger">Missing column</div>)
      continue
    }

    // Find enum value
    if (column.type == "enum" && column.enumValues) {
      const enumValue = column.enumValues.find((ev) => ev.id == row[column.id])

      parts.push(
        <div>
          <span className="text-muted">{localizeString(dropdown.name, props.locale)}:&nbsp;</span>
          {enumValue ? localizeString(enumValue.name, props.locale) : "???"}
        </div>
      )
    } else {
      parts.push(
        <div>
          <span className="text-muted">{localizeString(dropdown.name, props.locale)}:&nbsp;</span>
          {row[column.id]}
        </div>
      )
    }
  }
  return <div>{parts}</div>
}
