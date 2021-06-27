// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let ItemListComponent
import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import * as formRenderUtils from "./formRenderUtils"

// Display a list of items
export default ItemListComponent = (function () {
  ItemListComponent = class ItemListComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        contents: PropTypes.array.isRequired,
        data: PropTypes.object, // Current data of response (for roster entry if in roster)
        responseRow: PropTypes.object.isRequired, // ResponseRow object (for roster entry if in roster)
        onDataChange: PropTypes.func.isRequired,
        onNext: PropTypes.func,
        isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
        schema: PropTypes.object.isRequired
      }
      // Schema to use, including form
    }

    constructor(props: any) {
      super(props)

      // Refs of all items
      this.itemRefs = {}
    }

    async validate(scrollToFirstInvalid: any) {
      let foundInvalid = false
      for (let item of this.props.contents) {
        // Only if validation is possible
        if (this.itemRefs[item._id]?.validate) {
          const result = await this.itemRefs[item._id]?.validate(scrollToFirstInvalid && !foundInvalid)
          // DO NOT BREAK, it's important to call validate on each item
          if (result) {
            foundInvalid = true
          }
        }
      }

      return foundInvalid
    }

    handleNext(index: any) {
      index++
      if (index >= this.props.contents.length) {
        return this.props.onNext?.()
      } else {
        return this.itemRefs[this.props.contents[index]._id]?.focus?.()
      }
    }

    renderItem = (item: any, index: any) => {
      if (this.props.isVisible(item._id) && !item.disabled) {
        return formRenderUtils.renderItem(
          item,
          this.props.data,
          this.props.responseRow,
          this.props.schema,
          this.props.onDataChange,
          this.props.isVisible,
          this.handleNext.bind(this, index),
          (c: any) => {
            return (this.itemRefs[item._id] = c)
          }
        );
      }
    }

    render() {
      return R("div", null, _.map(this.props.contents, this.renderItem))
    }
  }
  ItemListComponent.initClass()
  return ItemListComponent
})()
