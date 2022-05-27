// @ts-nocheck
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import TextListAnswerComponent from "../../src/answers/TextListAnswerComponent"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

describe("TextListAnswerComponent", function () {
  before(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      const elem = R(TextListAnswerComponent, options)
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    for (let comp of this.toDestroy) {
      comp.destroy()
    }
    return (this.toDestroy = [])
  })

  it("records add", function (done) {
    const testComponent = this.render({
      onValueChange(value: any) {
        assert.deepEqual(value, ["some text"])
        return done()
      }
    })
    const newLine = testComponent.findComponentById("newLine")

    return TestComponent.changeValue(newLine, "some text")
  })

  it("records remove", function (done) {
    const testComponent = this.render({
      value: ["some text"],
      onValueChange(value: any) {
        assert.deepEqual(value, [])
        return done()
      }
    })
    const removeBtn = ReactTestUtils.findRenderedDOMComponentWithClass(testComponent.getComponent(), "remove")
    return TestComponent.click(removeBtn)
  })

  return it("loads existing values", function (done) {
    const testComponent = this.render({
      value: ["some text"],
      onValueChange(value: any) {
        assert.deepEqual(value, ["some text", "more text"])
        return done()
      }
    })
    const newLine = testComponent.findComponentById("newLine")

    return TestComponent.changeValue(newLine, "more text")
  })
})
