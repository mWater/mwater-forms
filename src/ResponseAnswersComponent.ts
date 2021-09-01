import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import moment from "moment"
import ezlocalize from "ez-localize"
import * as ui from "react-library/lib/bootstrap"
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"
import VisibilityCalculator from "./VisibilityCalculator"
import { default as ResponseRow } from "./ResponseRow"
import TextExprsComponent from "./TextExprsComponent"
import ImageDisplayComponent from "./ImageDisplayComponent"
import EntityDisplayComponent from "./EntityDisplayComponent"
import AdminRegionDisplayComponent from "./AdminRegionDisplayComponent"
import AquagenxCBTDisplayComponent from "./answers/AquagenxCBTDisplayComponent"
import { CascadingListDisplayComponent } from "./answers/CascadingListDisplayComponent"
import { CascadingRefDisplayComponent } from "./answers/CascadingRefDisplayComponent"
import { CalculationsDisplayComponent } from "./CalculationsDisplayComponent"
import { Schema } from "mwater-expressions"
import { FormDesign } from "./formDesign"
import { ResponseData } from "./response"

interface ResponseAnswersComponentProps {
  formDesign: FormDesign
  data: ResponseData
  /** Schema of the */
  schema: Schema
  /** Deployment id of the response */
  deployment?: string
  /** True to hide empty answers */
  hideEmptyAnswers?: boolean
  /** Defaults to english */
  locale?: string
  /** Localizer to use */
  T: any
  /** Form context to use */
  formCtx: any
  /** Previous data */
  prevData?: any
  showPrevAnswers?: boolean
  highlightChanges?: boolean
  hideUnchangedAnswers?: boolean
  showChangedLink?: boolean
  onChangedLinkClick?: any
  onCompleteHistoryLinkClick?: any
  hideCalculations?: boolean
}

interface ResponseAnswersComponentState {
}

// Displays the answers of a response in a table
export default class ResponseAnswersComponent extends AsyncLoadComponent<ResponseAnswersComponentProps, ResponseAnswersComponentState> {
  // Check if form design or data are different
  isLoadNeeded(newProps: any, oldProps: any) {
    return !_.isEqual(newProps.formDesign, oldProps.formDesign) || !_.isEqual(newProps.data, oldProps.data)
  }

  // Call callback with state changes
  load(props: ResponseAnswersComponentProps, prevProps: ResponseAnswersComponentProps, callback: any) {
    const responseRow = new ResponseRow({
      responseData: props.data,
      formDesign: props.formDesign,
      getEntityById: props.formCtx.getEntityById,
      getEntityByCode: props.formCtx.getEntityByCode,
      getCustomTableRow: props.formCtx.getCustomTableRow,
      deployment: props.deployment,
      schema: props.schema
    })

    // Calculate visibility asynchronously
    return new VisibilityCalculator(props.formDesign, props.schema).createVisibilityStructure(
      props.data,
      responseRow,
      (error: any, visibilityStructure: any) => {
        return callback({ error, visibilityStructure, responseRow })
      }
    )
  }

  handleLocationClick(location: any) {
    if (this.props.formCtx.displayMap) {
      return this.props.formCtx.displayMap(location)
    }
  }

  renderLocation(location: any) {
    if (location) {
      return R(
        "div",
        null,
        R(
          "a",
          { onClick: this.handleLocationClick.bind(this, location), style: { cursor: "pointer" } },
          `${location.latitude}\u00B0 ${location.longitude}\u00B0`,
          location.accuracy != null ? `(+/-) ${location.accuracy.toFixed(3)} m` : undefined,
          location.method ? ` (${location.method})` : undefined
        )
      )
    }
    return null
  }

  renderAnswer(q: any, answer: any) {
    let label, specify
    if (!answer) {
      return null
    }

    // Handle alternates
    if (answer.alternate) {
      switch (answer.alternate) {
        case "na":
          return R("em", null, this.props.T("Not Applicable"))
          break
        case "dontknow":
          return R("em", null, this.props.T("Don't Know"))
          break
      }
    }

    if (answer.confidential != null) {
      return R("em", null, this.props.T("Redacted"))
    }

    if (answer.value == null) {
      return null
    }

    switch (formUtils.getAnswerType(q)) {
      case "text":
        // Format as url if url
        if (
          answer.value &&
          answer.value.match(
            /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:,&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:,&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&,;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/
          )
        ) {
          // Open in system window if in cordova
          const target = window.cordova != null ? "_system" : "_blank"
          return R("a", { href: answer.value, target }, answer.value)
        }

        return answer.value
      case "number":
        return "" + answer.value
      case "choice":
        var choice = _.findWhere(q.choices, { id: answer.value })
        if (choice) {
          label = formUtils.localizeString(choice.label, this.props.locale)
          if (answer.specify != null) {
            specify = answer.specify[answer.value]
          } else {
            specify = null
          }

          return R(
            "div",
            null,
            label,
            (() => {
              if (specify) {
                ;(": ")
                return R("em", null, specify)
              }
            })()
          )
        } else {
          return R("span", { className: "label label-danger" }, "Invalid Choice")
        }
      case "choices":
        return _.map(answer.value, (v) => {
          choice = _.findWhere(q.choices, { id: v })
          if (choice) {
            return R(
              "div",
              null,
              formUtils.localizeString(choice.label, this.props.locale),
              (() => {
                if (answer.specify != null && answer.specify[v]) {
                  ;(": ")
                  return R("em", null, answer.specify[v])
                }
              })()
            )
          } else {
            return R("div", { className: "label label-danger" }, "Invalid Choice")
          }
        })

      case "date":
        // Depends on precision
        if (answer.value.length <= 7) {
          // YYYY or YYYY-MM
          return R("div", null, answer.value)
        } else if (answer.value.length <= 10) {
          // Date
          return R("div", null, moment(answer.value).format("LL"))
        } else {
          return R("div", null, moment(answer.value).format("LLL"))
        }

      case "units":
        if (answer.value && answer.value.quantity != null && answer.value.units != null) {
          // Find units
          const units = _.findWhere(q.units, { id: answer.value.units })

          const valueStr = "" + answer.value.quantity
          const unitsStr = units ? formUtils.localizeString(units.label, this.props.locale) : "(Invalid)"

          if (q.unitsPosition === "prefix") {
            return R("div", null, R("em", null, unitsStr), " ", valueStr)
          } else {
            return R("div", null, valueStr, " ", R("em", null, unitsStr))
          }
        }
        break

      case "boolean":
        if (answer.value) {
          return this.props.T("True")
        } else {
          return this.props.T("False")
        }

      case "location":
        return this.renderLocation(answer.value)

      case "image":
        if (answer.value) {
          return R(ImageDisplayComponent, {
            image: answer.value,
            imageManager: this.props.formCtx.imageManager,
            T: this.props.T
          })
        }
        break

      case "images":
        return _.map(answer.value, (img) => {
          return R(ImageDisplayComponent, {
            image: img,
            imageManager: this.props.formCtx.imageManager,
            T: this.props.T
          })
        })

      case "texts":
        return _.map(answer.value, (txt) => {
          return R("div", null, txt)
        })

      case "site":
        var code = answer.value
        // TODO Eventually always go to code parameter. Legacy responses used code directly as value.
        if (_.isObject(code)) {
          ;({ code } = code)
        }

        // Convert to new entity type
        var siteType = (q.siteTypes ? q.siteTypes[0] : undefined) || "water_point"

        // Site column question have siteType
        if (q._type === "SiteColumnQuestion") {
          siteType = q.siteType || "water_point"
        }

        var entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_")

        return R(EntityDisplayComponent, {
          entityCode: code,
          entityType,
          getEntityByCode: this.props.formCtx.getEntityByCode,
          renderEntityView: this.props.formCtx.renderEntitySummaryView,
          T: this.props.T
        })

      case "entity":
        return R(EntityDisplayComponent, {
          entityId: answer.value,
          entityType: q.entityType,
          getEntityById: this.props.formCtx.getEntityById,
          renderEntityView: this.props.formCtx.renderEntitySummaryView,
          T: this.props.T
        })

      case "admin_region":
        return R(AdminRegionDisplayComponent, {
          getAdminRegionPath: this.props.formCtx.getAdminRegionPath,
          value: answer.value,
          T: this.props.T
        })

      case "items_choices":
        for (let item of q.items) {
          const choiceId = answer.value[item.id]
          if (choiceId != null) {
            choice = _.findWhere(q.choices, { id: choiceId })
            if (choice != null) {
              return R("div", null, formUtils.localizeString(choice.label, this.props.locale))
            } else {
              return R("span", { className: "label label-danger" }, "Invalid Choice")
            }
          }
        }

      case "aquagenx_cbt":
        return R(AquagenxCBTDisplayComponent, {
          value: answer.value,
          questionId: q._id,
          imageManager: this.props.formCtx.imageManager
        })

      case "cascading_list":
        return R(CascadingListDisplayComponent, {
          question: q,
          value: answer.value,
          locale: this.props.locale
        })

      case "cascading_ref":
        return R(CascadingRefDisplayComponent, {
          question: q,
          value: answer.value,
          locale: this.props.locale,
          schema: this.props.schema,
          getCustomTableRow: this.props.formCtx.getCustomTableRow
        })
    }
  }

  // Special render on multiple rows
  renderLikertAnswer(q: any, answer: any, prevAnswer: any) {
    if (!answer) {
      return null
    }
    if (answer.alternate) {
      return null
    }
    if (answer.value == null) {
      return null
    }

    if (formUtils.getAnswerType(q) === "items_choices") {
      const contents = []
      for (let item of q.items) {
        const itemTd = R(
          "td",
          { style: { textAlign: "center" } },
          formUtils.localizeString(item.label, this.props.locale)
        )
        let choiceId = answer.value[item.id]
        if (choiceId != null) {
          let choice = _.findWhere(q.choices, { id: choiceId })
          if (choice != null) {
            contents.push(
              R("tr", null, itemTd, R("td", null, formUtils.localizeString(choice.label, this.props.locale)))
            )
          } else {
            contents.push(
              R("tr", null, itemTd, R("td", null, R("span", { className: "label label-danger" }, "Invalid Choice")))
            )
          }

          if (this.props.showPrevAnswers && prevAnswer) {
            choiceId = prevAnswer.value[item.id]
            if (choiceId != null) {
              choice = _.findWhere(q.choices, { id: choiceId })
              if (choice != null) {
                contents.push(
                  R("tr", null, itemTd, R("td", null, formUtils.localizeString(choice.label, this.props.locale)))
                )
              } else {
                contents.push(
                  R("tr", null, itemTd, R("td", null, R("span", { className: "label label-danger" }, "Invalid Choice")))
                )
              }
            }
          }
        }
      }
      return contents
    } else {
      return null
    }
  }

  renderQuestion(q: any, dataId: any) {
    // Get answer
    let answer
    const dataIds = dataId.split(".")
    if (dataIds.length === 1) {
      answer = this.props.data[dataId]
    } else {
      let rosterData = this.props.data[dataIds[0]]
      if (rosterData.value != null) {
        rosterData = rosterData.value
        answer = rosterData[dataIds[1]][dataIds[2]]
      } else {
        answer = rosterData[dataIds[1]].data[dataIds[2]]
      }
    }

    // Do not display if empty and hide empty true
    if (this.props.hideEmptyAnswers && answer?.value == null && !answer?.alternate) {
      return null
    }

    let prevAnswer = null
    const trProps = { key: dataId }

    if (this.props.prevData) {
      if (dataIds.length === 1) {
        prevAnswer = this.props.prevData.data[dataId]
      } else {
        let prevRosterData = this.props.prevData.data[dataIds[0]]
        if (prevRosterData != null) {
          if (prevRosterData.value != null) {
            prevRosterData = prevRosterData.value
            prevAnswer = prevRosterData[dataIds[1]]?.[dataIds[2]]
          } else {
            prevAnswer = prevRosterData[dataIds[1]]?.data[dataIds[2]]
          }
        }
      }
    }

    const likertAnswer = this.renderLikertAnswer(q, answer, prevAnswer)

    // If both answer and previous answer are falsy
    if (!prevAnswer && answer?.value == null && this.props.hideUnchangedAnswers) {
      return null
    }

    if (!_.isEqual(prevAnswer?.value, answer?.value) || !_.isEqual(prevAnswer?.specify, answer?.specify)) {
      if (this.props.highlightChanges) {
        trProps["style"] = { background: "#ffd" }
      }
    } else {
      if (this.props.hideUnchangedAnswers) {
        return null
      }
    }

    return [
      R(
        "tr",
        trProps,
        R("td", { key: "name", style: { width: "50%" } }, formUtils.localizeString(q.text, this.props.locale)),
        R(
          "td",
          { key: "value" },
          R(
            "div",
            null,
            likertAnswer == null ? this.renderAnswer(q, answer, dataId) : undefined,
            (() => {
              if (answer && answer.timestamp) {
                this.props.T("Answered")
                ;(": ")
                return moment(answer.timestamp).format("llll")
              }
            })(),
            answer && answer.location ? this.renderLocation(answer.location) : undefined,

            answer && answer.comments ? R("div", { className: "text-muted" }, answer.comments) : undefined,

            prevAnswer != null && !_.isEqual(prevAnswer.value, answer?.value) && this.props.showChangedLink
              ? R(
                  "a",
                  {
                    style: { float: "right", display: "inline-block", cursor: "pointer", fontSize: 9 },
                    onClick: this.props.onChangedLinkClick,
                    key: "view_change"
                  },
                  R(ui.Icon, { id: "glyphicon-pencil" }),
                  " ",
                  this.props.T("Edited")
                )
              : undefined
          )
        ),

        this.props.showPrevAnswers && this.props.prevData
          ? R(
              "td",
              { key: "prevValue" },
              prevAnswer != null && !_.isEqual(prevAnswer.value, answer?.value) && this.props.onCompleteHistoryLinkClick
                ? R(
                    "a",
                    {
                      style: { float: "right", display: "inline-block", cursor: "pointer", fontSize: 9 },
                      onClick: this.props.onCompleteHistoryLinkClick,
                      key: "view_history"
                    },
                    this.props.T("Show Changes")
                  )
                : undefined,

              typeof prevMatrixAnswer === "undefined" || prevMatrixAnswer === null
                ? this.renderAnswer(q, prevAnswer)
                : undefined,
              prevAnswer && prevAnswer.timestamp
                ? R("div", null, this.props.T("Answered"), ": ", moment(prevAnswer.timestamp).format("llll"))
                : undefined,
              prevAnswer && prevAnswer.location ? this.renderLocation(prevAnswer.location) : undefined
            )
          : undefined
      ),
      likertAnswer
    ]
  }

  // Add all the items with the proper rosterId to items array
  // Looks inside groups and sections
  collectItemsReferencingRoster(items: any, contents: any, rosterId: any) {
    // Get the contents of all the other question that are referencing this roster
    return (() => {
      const result = []
      for (let otherItem of contents) {
        if (otherItem._type === "Group" || otherItem._type === "Section") {
          this.collectItemsReferencingRoster(items, otherItem.contents, rosterId)
        }
        if (otherItem.rosterId === rosterId) {
          result.push(items.push.apply(items, otherItem.contents))
        } else {
          result.push(undefined)
        }
      }
      return result
    })()
  }

  // dataId is the key used for looking up the data + testing visibility
  // dataId is simply item._id except for rosters children
  renderItem(item: any, visibilityStructure: any, dataId: any) {
    let data, items
    var contents, dataId
    if (!visibilityStructure[dataId]) {
      return
    }

    const colspan = this.props.showPrevAnswers && this.props.prevData ? 3 : 2
    // Sections and Groups behave the same
    if (item._type === "Section" || item._type === "Group") {
      contents = _.map(item.contents, (item) => {
        let id = item._id
        if (dataId) {
          // The group is inside a roster
          const parts = dataId.split(".")
          parts.pop()
          parts.push(item._id)
          id = parts.join(".")
        }
        return this.renderItem(item, visibilityStructure, id)
      })

      // Remove nulls
      contents = _.compact(contents)

      // Do not display if empty
      if (contents.length === 0) {
        return null
      }

      return [
        R(
          "tr",
          { key: item._id },
          R(
            "td",
            { colSpan: colspan, style: { fontWeight: "bold" } },
            formUtils.localizeString(item.name, this.props.locale)
          )
        ),
        contents
      ]
    }

    // RosterMatrices and RosterGroups behave the same
    // Only the one storing the data will display it
    // The rosters referencing another one will display a simple text to say so
    if (item._type === "RosterMatrix" || item._type === "RosterGroup") {
      items = []
      // Simply display a text referencing the other roster if a reference
      if (item.rosterId != null) {
        // Unless hiding empty, in which case blank
        if (this.props.hideEmptyAnswers) {
          return null
        }

        const referencedRoster = formUtils.findItem(this.props.formDesign, item.rosterId)
        return R(
          "tr",
          null,
          R("td", { style: { fontWeight: "bold" } }, formUtils.localizeString(item.name, this.props.locale)),
          R(
            "td",
            { colSpan: colspan - 1 },
            R(
              "span",
              { style: { fontStyle: "italic" } },
              this.props.T("Data is stored in {0}", formUtils.localizeString(referencedRoster.name, this.props.locale))
            )
          )
        )
      }

      // Get the data for that roster
      data = this.props.data[item._id]

      if ((!data || data.length === 0) && this.props.hideEmptyAnswers) {
        return null
      }

      // Get the questions of the other rosters referencing this one
      items = _.clone(item.contents)
      this.collectItemsReferencingRoster(items, this.props.formDesign.contents, item._id)

      return [
        R(
          "tr",
          { key: item._id },
          R(
            "td",
            { colSpan: colspan, style: { fontWeight: "bold" } },
            formUtils.localizeString(item.name, this.props.locale)
          )
        ),

        data != null
          ? // For each entry in data
            (() => {
              const result = []
              for (var index = 0; index < data.length; index++) {
                const entry = data[index]
                contents = _.map(items, (childItem) => {
                  dataId = `${item._id}.${index}.${childItem._id}`
                  return this.renderItem(childItem, visibilityStructure, dataId)
                })

                // Remove nulls
                contents = _.compact(contents)

                // Do not display if empty
                if (contents.length === 0) {
                  result.push(null)
                } else {
                  result.push([
                    // Display the index of the answer
                    R("tr", null, R("td", { colSpan: colspan, style: { fontWeight: "bold" } }, `${index + 1}.`)),
                    // And the answer for each question
                    contents
                  ])
                }
              }
              return result
            })()
          : undefined
      ]
    }

    if (item._type === "MatrixQuestion") {
      const answer = this.props.data[dataId]
      if (answer?.value != null) {
        const rows = []
        rows.push(
          R(
            "tr",
            { key: item._id },
            R(
              "td",
              { colSpan: colspan, style: { fontWeight: "bold" } },
              formUtils.localizeString(item.text, this.props.locale)
            )
          )
        )
        for (let rowItem of item.items) {
          const itemValue = answer.value[rowItem.id]
          if (itemValue) {
            rows.push(
              R(
                "tr",
                null,
                R(
                  "td",
                  { colSpan: colspan, style: { fontStyle: "italic" } },
                  formUtils.localizeString(rowItem.label, this.props.locale)
                )
              )
            )
            for (let column of item.columns) {
              if (itemValue[column._id]) {
                dataId = `${item._id}.${rowItem.id}.${column._id}`
                rows.push(this.renderItem(column, visibilityStructure, dataId))
              }
            }
          }
        }
        return rows
      } else {
        return null
      }
    }

    if (formUtils.isQuestion(item)) {
      return this.renderQuestion(item, dataId)
    }

    if (formUtils.isExpression(item)) {
      return this.renderExpression(item, dataId)
    }
  }

  renderExpression(q: any, dataId: any) {
    return [
      R(
        "tr",
        { key: dataId },
        R("td", { key: "name", style: { width: "50%" } }, formUtils.localizeString(q.text, this.props.locale)),
        R("td", { key: "value" }, R("div", null, this.renderExpressionAnswer(q, dataId))),

        this.props.showPrevAnswers && this.props.prevData ? R("td", { key: "prevValue" }, null) : undefined
      )
    ]
  }

  renderExpressionAnswer(q: any, dataId: any) {
    let rosterId = null
    let rosterEntryIndex = undefined
    if (dataId != null) {
      const dataIds = dataId.split(".")
      rosterId = dataIds[0]
      rosterEntryIndex = dataIds[1]
    }

    return R(TextExprsComponent, {
      localizedStr: q._type === "TextColumn" ? q.cellText : { _base: "en", en: "{0}" },
      exprs: q._type === "TextColumn" ? q.cellTextExprs : [q.expr],
      schema: this.props.schema,
      format: q.format,
      responseRow: new ResponseRow({
        responseData: this.props.data,
        schema: this.props.schema,
        formDesign: this.props.formDesign,
        rosterId,
        rosterEntryIndex,
        getEntityById: this.props.formCtx.getEntityById,
        getEntityByCode: this.props.formCtx.getEntityByCode
      }),
      locale: this.props.locale
    })
  }

  render() {
    if (this.state.error) {
      return R("div", { className: "alert alert-danger" }, this.state.error.message)
    }

    if (!this.state.visibilityStructure) {
      return R("div", null, "Loading...")
    }

    return R(
      "div",
      null,
      R(
        "table",
        { className: "table table-bordered table-condensed", style: { marginBottom: 0 } },
        R(
          "thead",
          null,
          R(
            "tr",
            null,
            R("th", null, "Question"),
            R("th", null, "Answer"),
            this.props.showPrevAnswers ? R("th", null, "Original Answer") : undefined
          )
        ),
        R(
          "tbody",
          null,
          _.map(this.props.formDesign.contents, (item) => {
            return this.renderItem(item, this.state.visibilityStructure, item._id)
          })
        )
      ),
      this.props.formDesign.calculations &&
        this.props.formDesign.calculations.length > 0 &&
        this.state.responseRow &&
        !this.props.hideCalculations
        ? R(
            "div",
            { key: "calculations" },
            R("h4", null, this.props.T("Calculations")),
            R(CalculationsDisplayComponent, {
              formDesign: this.props.formDesign,
              schema: this.props.schema,
              responseRow: this.state.responseRow,
              locale: this.props.locale
            })
          )
        : undefined
    )
  }
}