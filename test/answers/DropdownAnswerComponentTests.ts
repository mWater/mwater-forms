// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import DropdownAnswerComponent from "../../src/answers/DropdownAnswerComponent"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

function createOptions(options: any) {
  return _.extend(
    {
      onAnswerChange() {
        return null
      },
      answer: {},
      choices: [
        {
          id: "a",
          label: { en: "label a", _base: "en" },
          hint: { en: "hint a", _base: "en" },
          specify: false
        },
        {
          id: "b",
          label: { en: "label b", _base: "en" },
          hint: { en: "hint b", _base: "en" },
          specify: true
        }
      ]
    },
    options
  )
}

describe("DropdownAnswerComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      const elem = R(DropdownAnswerComponent, options)
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy());
  })

  it("accepts known value", function (done) {
    const testComponent = this.render(
      createOptions({
        onAnswerChange(answer: any) {
          assert.equal(answer.value, "a")
          return done()
        }
      })
    )

    const select = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent.getComponent(), "select")
    return TestComponent.changeValue(select, "a")
  })

  it("is not disabled with empty value", function (done) {
    const testComponent = this.render(
      createOptions({
        onAnswerChange(answer: any) {
          assert.equal(answer.value, null)
          return done()
        },
        answer: { value: "a" }
      })
    )

    const select = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent.getComponent(), "select")
    return TestComponent.changeValue(select, null)
  })

  it("displays choices and hints", function () {
    const testComponent = this.render(createOptions())

    const labelA = testComponent.findDOMNodeByText(/label a/)
    assert(labelA != null, "Not showing label a")

    const labelB = testComponent.findDOMNodeByText(/label b/)
    assert(labelB != null, "Not showing label b")

    const hintA = testComponent.findDOMNodeByText(/hint a/)
    assert(hintA != null, "Not showing hint a")

    const hintB = testComponent.findDOMNodeByText(/hint b/)
    return assert(hintB != null, "Not showing hint b")
  })

  it("displays specify box when the right choice is selected", function () {
    const testComponent = this.render(createOptions({ value: "b" }))

    const specifyInput = ReactTestUtils.findRenderedDOMComponentWithClass.bind(
      this,
      testComponent.getComponent(),
      "specify-input"
    )
    return assert(specifyInput != null)
  })

  it("it doesn't displays specify box when a choice without specify is selected", function () {
    const testComponent = this.render(createOptions({ value: "a" }))

    return assert.throws(
      ReactTestUtils.findRenderedDOMComponentWithClass.bind(this, testComponent.getComponent(), "specify-input"),
      "Did not find exactly one match (found: 0) for class:specify-input"
    )
  })

  it("records specify value", function (done) {
    const testComponent = this.render(
      createOptions({
        onAnswerChange(answer: any) {
          assert.deepEqual(answer.specify, { b: "specify" })
          return done()
        },
        answer: { value: "b" }
      })
    )

    const specifyInput = ReactTestUtils.findRenderedDOMComponentWithClass(testComponent.getComponent(), "specify-input")
    return TestComponent.changeValue(specifyInput, "specify")
  })

  return it("removes specify value on other selection", function (done) {
    const testComponent = this.render(
      createOptions({
        onAnswerChange(answer: any) {
          assert.deepEqual(answer.specify, null)
          return done()
        },
        answer: { value: "b" }
      })
    )

    const select = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent.getComponent(), "select")
    return TestComponent.changeValue(select, "b")
  });
})
