import _ from "lodash"
import { Schema } from "mwater-expressions"
import React, { ReactElement } from "react"
import { Item, Question } from "./formDesign"
const R = React.createElement

import * as formRenderUtils from "./formRenderUtils"
import { ResponseData } from "./response"
import ResponseRow from "./ResponseRow"

export interface ItemListComponentProps {
  contents: any
  /** Current data of response (for roster entry if in roster) */
  data: ResponseData
  /** ResponseRow object (for roster entry if in roster) */
  responseRow: ResponseRow
  onDataChange: any
  onNext?: any
  /** (id) tells if an item is visible or not */
  isVisible: any
  schema: Schema
}

// Display a list of items
export default class ItemListComponent extends React.Component<ItemListComponentProps> {
  itemRefs: { [itemId: string]: any }

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

  renderItem = (item: Item, index: any) => {
    if (this.props.isVisible(item._id) && !(item as Question).disabled) {
      return formRenderUtils.renderItem(
        item,
        this.props.data,
        this.props.responseRow,
        this.props.schema,
        this.props.onDataChange,
        this.props.isVisible,
        this.handleNext.bind(this, index),
        (c: ReactElement | null) => {
          return (this.itemRefs[item._id] = c)
        }
      )
    }
    return null
  }

  render() {
    return R("div", null, _.map(this.props.contents, this.renderItem))
  }
}
