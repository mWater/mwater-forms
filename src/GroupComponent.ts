// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let GroupComponent
import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"

// A group is a list of questions/other items that can have a common condition and a header
export default GroupComponent = (function () {
  GroupComponent = class GroupComponent extends React.Component {
    static initClass() {
      this.contextTypes = { locale: PropTypes.string }

      this.propTypes = {
        group: PropTypes.object.isRequired, // Design of group. See schema
        data: PropTypes.object, // Current data of response (for roster entry if in roster)
        responseRow: PropTypes.object, // ResponseRow object (for roster entry if in roster)
        onDataChange: PropTypes.func.isRequired, // Called when data changes
        isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
        onNext: PropTypes.func.isRequired, // Called when moving out of the GroupComponent questions
        schema: PropTypes.object.isRequired
      }
      // Schema to use, including form
    }

    validate(scrollToFirstInvalid) {
      return this.itemlist.validate(scrollToFirstInvalid)
    }

    render() {
      // To avoid circularity
      const ItemListComponent = require("./ItemListComponent")

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
            ref: (c) => {
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
      )
    }
  }
  GroupComponent.initClass()
  return GroupComponent
})()
