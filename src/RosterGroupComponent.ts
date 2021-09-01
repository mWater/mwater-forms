import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import TextExprsComponent from "./TextExprsComponent"
import ItemListComponent from "./ItemListComponent"
import cx from "classnames"

interface RosterGroupComponentProps {
  /** Design of roster group. See schema */
  rosterGroup: any
  /** Current data of response. */
  data?: any
  /** Called when data changes */
  onDataChange: any
  /** (id) tells if an item is visible or not */
  isVisible: any
  /** ResponseRow object (for roster entry if in roster) */
  responseRow?: any
  schema: any
}

interface RosterGroupComponentState {
  /** The indices that are collapsed */
  collapsedEntries: number[]
}
// TODO Add focus()

// Rosters are repeated information, such as asking questions about household members N times.
// A roster group is a group of questions that is asked once for each roster entry
export default class RosterGroupComponent extends React.Component<RosterGroupComponentProps, RosterGroupComponentState> {
  static contextTypes = {
    locale: PropTypes.string,
    T: PropTypes.func.isRequired // Localizer to use
  }

  constructor(props: RosterGroupComponentProps) {
    super(props)

    this.state = {
      collapsedEntries: []
    }
  }

  // Gets the id that the answer is stored under
  getAnswerId() {
    // Prefer rosterId if specified, otherwise use id.
    return this.props.rosterGroup.rosterId || this.props.rosterGroup._id
  }

  // Get the current answer value
  getAnswer() {
    return this.props.data[this.getAnswerId()] || []
  }

  // Propagate an answer change to the onDataChange
  handleAnswerChange = (answer: any) => {
    const change = {}
    change[this.getAnswerId()] = answer
    return this.props.onDataChange(_.extend({}, this.props.data, change))
  }

  // Handles a change in data of a specific entry of the roster
  handleEntryDataChange = (index: any, data: any) => {
    const answer = this.getAnswer().slice()
    answer[index] = _.extend({}, answer[index], { data })
    return this.handleAnswerChange(answer)
  }

  handleAdd = () => {
    const answer = this.getAnswer().slice()
    answer.push({ _id: formUtils.createUid(), data: {} })
    return this.handleAnswerChange(answer)
  }

  handleRemove = (index: any) => {
    const answer = this.getAnswer().slice()
    answer.splice(index, 1)
    return this.handleAnswerChange(answer)
  }

  async validate(scrollToFirstInvalid: any) {
    // For each entry
    let foundInvalid = false
    const iterable = this.getAnswer()
    for (let index = 0; index < iterable.length; index++) {
      const entry = iterable[index]
      const result = await this[`itemlist_${index}`].validate(scrollToFirstInvalid && !foundInvalid)
      if (result) {
        foundInvalid = true
      }
    }

    return foundInvalid
  }

  isChildVisible = (index: any, id: any) => {
    return this.props.isVisible(`${this.getAnswerId()}.${index}.${id}`)
  }

  handleToggle = (index: number) => {
    this.setState({collapsedEntries: _.xor(this.state.collapsedEntries, [index])})
  }

  renderName() {
    return R("h4", { key: "prompt" }, formUtils.localizeString(this.props.rosterGroup.name, this.context.locale))
  }

  renderEntryTitle(entry: any, index: any) {
    return R(TextExprsComponent, {
      localizedStr: this.props.rosterGroup.entryTitle,
      exprs: this.props.rosterGroup.entryTitleExprs,
      schema: this.props.schema,
      responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
      locale: this.context.locale
    })
  }

  renderEntry(entry: any, index: any) {
    const isCollapsed = this.state.collapsedEntries.includes(index)
    const bodyStyle = {
      height: isCollapsed ? 0: 'auto',
      transition: 'height 0.25s ease-in',
      padding: isCollapsed? 0: 15,
      overflow: 'hidden'
    }

    return R(
      "div",
      { key: index, className: "panel panel-default" },
      R(
        "div",
        { key: "header", className: "panel-heading", style: { fontWeight: "bold", position: "relative" }},
        `${index + 1}. `,
        this.renderEntryTitle(entry, index),
        R("button", {
          className: "btn btn-link", 
          style: {position: 'absolute', right: 0, top: 5}, 
          onClick: this.handleToggle.bind(null, index)
        }, R("span", {className: cx('glyphicon', {'glyphicon-chevron-up': !isCollapsed, 'glyphicon-chevron-down': isCollapsed})}))
      ),
      R(
        "div",
        { key: "body", className: "panel-body", style: bodyStyle },
        this.props.rosterGroup.allowRemove
          ? R(
              "button",
              {
                type: "button",
                style: { float: "right" },
                className: "btn btn-sm btn-link",
                onClick: this.handleRemove.bind(null, index)
              },
              R("span", { className: "glyphicon glyphicon-remove" })
            )
          : undefined,

        R(ItemListComponent, {
          ref: (c: any) => {
            return (this[`itemlist_${index}`] = c)
          },
          contents: this.props.rosterGroup.contents,
          data: this.getAnswer()[index].data,
          responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
          onDataChange: this.handleEntryDataChange.bind(null, index),
          isVisible: this.isChildVisible.bind(null, index),
          schema: this.props.schema
        })
      )
    )
  }

  renderAdd() {
    if (this.props.rosterGroup.allowAdd) {
      return R(
        "div",
        { key: "add" },
        R(
          "button",
          { type: "button", className: "btn btn-default btn-sm", onClick: this.handleAdd },
          R("span", { className: "glyphicon glyphicon-plus" }),
          " " + this.context.T("Add")
        )
      )
    }
  }

  renderEmptyPrompt() {
    return R(
      "div",
      { style: { fontStyle: "italic" } },
      formUtils.localizeString(this.props.rosterGroup.emptyPrompt, this.context.locale) ||
        this.context.T("Click +Add to add an item")
    )
  }

  render() {
    return R(
      "div",
      { style: { padding: 5, marginBottom: 20 } },
      this.renderName(),
      _.map(this.getAnswer(), (entry, index) => this.renderEntry(entry, index)),

      // Display message if none and can add
      this.getAnswer().length === 0 && this.props.rosterGroup.allowAdd ? this.renderEmptyPrompt() : undefined,

      this.renderAdd()
    )
  }
}