import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement
import ResponseAnswersComponent from "./ResponseAnswersComponent"
import moment from "moment"

interface ResponseArchivesComponentProps {
  formDesign: any,
  response: any,
  /** Schema of the */
schema: any,
  /** Defaults to english */
locale?: string,
  /** Localizer to use */
T: any,
  /** Form context to use */
formCtx: any,
  /** The archives */
history: any,
  eventsUsernames: any
}

// Show complete change history of response
export default class ResponseArchivesComponent extends React.Component<ResponseArchivesComponentProps> {
  renderRecord = (record: any, previousRecord: any) => {
    return R(
      "div",
      { key: record._rev, style: { marginTop: 10 } },
      R(
        "p",
        { key: "summary" },
        "Changes made by ",
        R("b", null, record.modified.by ? this.props.eventsUsernames[record.modified.by]?.username : "Anonymous"),
        " on ",
        moment(record.modified.on).format("lll")
      ),

      R(
        "div",
        { key: "detail" },
        R(ResponseAnswersComponent, {
          formDesign: this.props.formDesign,
          data: record.data,
          schema: this.props.schema,
          locale: this.props.locale,
          T: this.props.T,
          formCtx: this.props.formCtx,
          prevData: previousRecord,
          showPrevAnswers: true,
          showChangedLink: false,
          highlightChanges: true,
          hideUnchangedAnswers: true,
          deployment: record.deployment
        })
      )
    )
  }

  render() {
    if (this.props.history.length === 0) {
      return R("div", null, R("i", null, "No changes made since submission"))
    }
    return R(
      "div",
      null,
      _.map(this.props.history, (record, index) => {
        if (index === 0) {
          return this.renderRecord(this.props.response, record)
        } else {
          return this.renderRecord(this.props.history[index - 1], record)
        }
      })
    )
  }
};
