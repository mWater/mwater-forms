// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

import TextAnswerComponent from "../../src/answers/TextAnswerComponent"

describe("TextAnswerComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      const elem = R(TextAnswerComponent, options)
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy())
  })

  it("records string in singleline answer", function (callback) {
    function onValueChange(value: any) {
      assert.equal(value, "response")
      return callback()
    }

    this.comp = this.render({ value: null, onValueChange, format: "singleline" })
    const input = this.comp.findInput()
    TestComponent.changeValue(input, "response")
    return ReactTestUtils.Simulate.blur(input)
  })

  return it("records string in singleline answer", function (callback) {
    function onValueChange(value: any) {
      assert.equal(value, "response")
      return callback()
    }

    this.comp = this.render({ value: null, onValueChange, format: "multiline" })
    const textArea = ReactTestUtils.findRenderedDOMComponentWithTag(this.comp.getComponent(), "textarea")
    TestComponent.changeValue(textArea, "response")
    return ReactTestUtils.Simulate.blur(textArea)
  })
})
