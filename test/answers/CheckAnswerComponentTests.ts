// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import { assert } from "chai"
import CheckAnswerComponent from "../../src/answers/CheckAnswerComponent"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

describe("CheckAnswerComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      const elem = R(CheckAnswerComponent, options)
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy());
  })

  it("can check", function (callback) {
    function onValueChange(value: any) {
      assert.equal(value, true)
      return callback()
    }

    this.comp = this.render({ value: false, onValueChange, label: { en: "test label", _base: "en" } })
    const checkbox = ReactTestUtils.findRenderedDOMComponentWithClass(this.comp.getComponent(), "touch-checkbox")

    return TestComponent.click(checkbox)
  })

  return it("can uncheck", function (callback) {
    function onValueChange(value: any) {
      assert.equal(value, false)
      return callback()
    }

    this.comp = this.render({ value: true, onValueChange, label: { en: "test label", _base: "en" } })
    const checkbox = ReactTestUtils.findRenderedDOMComponentWithClass(this.comp.getComponent(), "touch-checkbox")

    return TestComponent.click(checkbox)
  });
})
