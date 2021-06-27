// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import MatrixAnswerComponent from "../../src/answers/MatrixAnswerComponent"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

describe("MatrixAnswerComponent", function () {
  before(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      options = _.extend(
        {
          items: [
            { id: "a", label: { _base: "en", en: "AA" }, hint: { _base: "en", en: "a-hint" } },
            { id: "b", label: { _base: "en", en: "BB" } },
            { id: "c", label: { _base: "en", en: "CC" } }
          ],
          value: null,
          onValueChange() {
            return null
          },
          columns: [{ _id: "c1", _type: "TextColumnQuestion", name: { en: "C1" } }],
          data: {}
        },
        options
      )
      const elem = R(MatrixAnswerComponent, options)
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

  it("displays items", function () {
    const testComponent = this.render()

    const itemA = testComponent.findDOMNodeByText(/AA/)
    return assert(itemA != null, "Not showing choice AA")
  })

  it("displays item hints", function () {
    const testComponent = this.render()

    const hintA = testComponent.findDOMNodeByText(/a-hint/)
    return assert(hintA != null, "Not showing hint")
  })

  return it("records text change", function (done) {
    const testComponent = this.render({
      onValueChange(value: any) {
        assert.deepEqual(value, { a: { c1: { value: "x" } } })
        return done()
      }
    })

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(testComponent.getComponent(), "input")
    inputs[0].value = "x"
    return ReactTestUtils.Simulate.change(inputs[0])
  });
})
