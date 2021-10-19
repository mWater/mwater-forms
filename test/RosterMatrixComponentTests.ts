// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import compare from "./compare"
import { assert } from "chai"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import RosterMatrixComponent from "../src/RosterMatrixComponent"
import MockTContextWrapper from "./MockTContextWrapper"
import { default as ResponseRow } from "../src/ResponseRow"
import { default as HTML5Backend } from "react-dnd-html5-backend"
import { DragDropContext } from "react-dnd"

class Wrapper extends React.Component {
  render() {
    return this.props.children
  }
}

Wrapper = DragDropContext(HTML5Backend)(Wrapper)

describe("RosterMatrixComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    this.render = (options: any) => {
      const elem = R(
        Wrapper,
        null,
        R(
          RosterMatrixComponent,
          _.defaults(options, {
            isVisible() {
              return true
            },
            onDataChange() {},
            responseRow: new ResponseRow({
              responseData: options.data,
              formDesign: { contents: [this.rosterGroup] }
            })
          })
        )
      )
      const comp = new TestComponent(R(MockTContextWrapper, null, elem))
      this.toDestroy.push(comp)
      return comp
    }

    // Create sample rosterMatrix with each type of column
    return (this.rosterMatrix = {
      _id: "a",
      name: { en: "Name" },
      contents: [
        { _id: "text", _type: "TextColumnQuestion", text: { en: "Text" } },
        { _id: "number", _type: "NumberColumnQuestion", text: { en: "Number" }, decimal: false },
        { _id: "check", _type: "CheckColumnQuestion", text: { en: "Check" } },
        {
          _id: "dropdown",
          _type: "DropdownColumnQuestion",
          text: { en: "Dropdown" },
          choices: [
            { id: "x", label: { en: "X" } },
            { id: "y", label: { en: "Y" } }
          ]
        },
        {
          _id: "units",
          _type: "UnitsColumnQuestion",
          text: { en: "Units" },
          units: [
            { id: "cm", label: { en: "CM" } },
            { id: "inch", label: { en: "INCH" } }
          ]
        },
        { _id: "textColumn", _type: "TextColumn", text: { en: "TextColumn" } }
      ]
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy())
  })

  it("adds entry when add is clicked", function (done) {
    const onDataChange = (val: any) => {
      assert.equal(val.a.length, 1)
      assert(val.a[0]._id)
      assert.deepEqual(val.a[0].data, {})
      return done()
    }

    this.rosterMatrix.allowAdd = true
    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: {}, onDataChange })
    const buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "button")
    return TestComponent.click(buttons[0])
  })

  it("does not show add if add is disabled", function () {
    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: {} })
    return assert(!comp.findDOMNodeByText(/add/i))
  })

  it("removes entry when remove is clicked", function (done) {
    const onDataChange = (val: any) => {
      // Removes first one
      compare(val, { a: [{ _id: "2", data: { x: { value: 2 } } }] })
      return done()
    }

    this.rosterMatrix.allowRemove = true
    const comp = this.render({
      rosterMatrix: this.rosterMatrix,
      data: {
        a: [
          { _id: "1", data: { x: { value: 1 } } },
          { _id: "2", data: { x: { value: 2 } } }
        ]
      },
      onDataChange
    })
    return TestComponent.click(ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "fa-times")[0])
  })

  it("does not show remove if remove is disabled", function () {
    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: {} })
    return assert.equal(ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "fa-times").length, 0)
  })

  it("puts answers from column components in correct position in array", function (done) {
    const onDataChange = (val: any) => {
      compare(val, {
        a: [
          { _id: "1", data: {} },
          { _id: "2", data: { text: { value: "x" } } }
        ]
      })
      return done()
    }

    const comp = this.render({
      rosterMatrix: this.rosterMatrix,
      data: {
        a: [
          { _id: "1", data: {} },
          { _id: "2", data: {} }
        ]
      },
      onDataChange
    })

    // Set 3rd input (second row text)
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[3].value = "x"
    return ReactTestUtils.Simulate.change(inputs[3])
  })

  it("uses alternate rosterId if specified", function (done) {
    const onDataChange = (val: any) => {
      assert.equal(val.b.length, 1)
      assert(val.b[0]._id)
      assert.deepEqual(val.b[0].data, {})
      return done()
    }

    this.rosterMatrix.allowAdd = true
    this.rosterMatrix.rosterId = "b"
    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: {}, onDataChange })
    return TestComponent.click(ReactTestUtils.findRenderedDOMComponentWithTag(comp.getComponent(), "button"))
  })

  it("displays prompt", function () {
    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: {} })
    return assert(comp.findDOMNodeByText(/Name/))
  })

  it("records text", function (done) {
    const onDataChange = (val: any) => {
      compare(val.a[0].data, { text: { value: "x" } })
      return done()
    }

    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: { a: [{}] }, onDataChange })

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[0].value = "x"
    return ReactTestUtils.Simulate.change(inputs[0])
  })

  it("records number", function (done) {
    const onDataChange = (val: any) => {
      compare(val.a[0].data, { number: { value: 1 } })
      return done()
    }

    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: { a: [{}] }, onDataChange })

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input")
    inputs[1].value = "1"
    ReactTestUtils.Simulate.change(inputs[1])
    return ReactTestUtils.Simulate.blur(inputs[1])
  }) // Have to leave to set it

  it("records check", function (done) {
    const onDataChange = (val: any) => {
      compare(val.a[0].data, { check: { value: true } })
      return done()
    }

    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: { a: [{}] }, onDataChange })

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "touch-checkbox")
    return ReactTestUtils.Simulate.click(inputs[0])
  })

  it("records dropdown", function (done) {
    const onDataChange = (val: any) => {
      compare(val.a[0].data, { dropdown: { value: "y" } })
      return done()
    }

    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: { a: [{}] }, onDataChange })

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "select")
    inputs[0].value = "y"
    return ReactTestUtils.Simulate.change(inputs[0], { target: { value: "y" } })
  })

  it("requires required columns fail", function () {
    this.rosterMatrix.contents[0].required = true

    const comp = this.render({ rosterMatrix: this.rosterMatrix, data: { a: [{ _id: "1", data: {} }] } })
    return assert.isTrue(
      ReactTestUtils.findRenderedComponentWithType(comp.getComponent(), RosterMatrixComponent).validate(false),
      "Should fail validation"
    )
  })

  it("requires required columns pass", function () {
    this.rosterMatrix.contents[0].required = true

    const comp = this.render({
      rosterMatrix: this.rosterMatrix,
      data: { a: [{ _id: "1", data: { text: { value: "x" } } }] }
    })
    return assert.isFalse(
      ReactTestUtils.findRenderedComponentWithType(comp.getComponent(), RosterMatrixComponent).validate(false),
      "Should pass validation"
    )
  })

  it("validates columns fail", function () {
    this.rosterMatrix.contents[0].validations = [
      {
        op: "lengthRange",
        rhs: { literal: { min: 4, max: 6 } },
        message: { en: "message" }
      }
    ]

    const comp = this.render({
      rosterMatrix: this.rosterMatrix,
      data: { a: [{ _id: "1", data: { text: { value: "x" } } }] }
    })
    return assert.isTrue(
      ReactTestUtils.findRenderedComponentWithType(comp.getComponent(), RosterMatrixComponent).validate(false),
      "Should fail validation"
    )
  })

  return it("validates columns pass", function () {
    this.rosterMatrix.contents[0].validations = [
      {
        op: "lengthRange",
        rhs: { literal: { min: 4, max: 6 } },
        message: { en: "message" }
      }
    ]

    const comp = this.render({
      rosterMatrix: this.rosterMatrix,
      data: { a: [{ _id: "1", data: { text: { value: "12345" } } }] }
    })
    return assert.isFalse(
      ReactTestUtils.findRenderedComponentWithType(comp.getComponent(), RosterMatrixComponent).validate(false),
      "Should pass validation"
    )
  })
})
