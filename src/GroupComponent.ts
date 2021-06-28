import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import ItemListComponent from "./ItemListComponent"

interface GroupComponentProps {
  /** Design of group. See schema */
group: any,
  /** Current data of response (for roster entry if in roster) */
data?: any,
  /** ResponseRow object (for roster entry if in roster) */
responseRow?: any,
  /** Called when data changes */
onDataChange: any,
  /** (id) tells if an item is visible or not */
isVisible: any,
  /** Called when moving out of the GroupComponent questions */
onNext: any,
  schema: any
}

// A group is a list of questions/other items that can have a common condition and a header
export default class GroupComponent extends React.Component<GroupComponentProps> {
  static initClass() {
    this.contextTypes = { locale: PropTypes.string }
  }

  validate(scrollToFirstInvalid: any) {
    return this.itemlist.validate(scrollToFirstInvalid)
  }

  render() {
    return R(
      "div",
      { className: "panel panel-default" },
      R(
        "div",
        { key: "header", className: "panel-heading" },
        formUtils.localizeString(this.props.group.name, this.context.locale)
      ),

      R(
        "div",
        { key: "body", className: "panel-body" },
        R(ItemListComponent, {
          ref: (c: any) => {
            return (this.itemlist = c)
          },
          contents: this.props.group.contents,
          data: this.props.data,
          responseRow: this.props.responseRow,
          onDataChange: this.props.onDataChange,
          isVisible: this.props.isVisible,
          onNext: this.props.onNext,
          schema: this.props.schema
        })
      )
    );
  }
};


GroupComponent.initClass()
