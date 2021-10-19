// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import UnitsAnswerComponent from "../../src/answers/UnitsAnswerComponent"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

describe("UnitsAnswerComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      options = _.extend(
        {
          onValueChange() {
            return null
          },
          units: [
            { id: "a", label: { _base: "en", es: "AA" }, hint: { _base: "en", es: "a-hint" } },
            { id: "b", label: { _base: "en", es: "BB" } },
            { id: "c", label: { _base: "en", es: "CC" } }
          ],
          prefix: false,
          decimal: true
        },
        options
      )
      const elem = R(UnitsAnswerComponent, options)
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy())
  })

  it("allows changing of units", function (done) {
    const testComponent = this.render({
      answer: {
        quantity: null,
        units: "a"
      },
      onValueChange(value: any) {
        assert.equal(value.units, "b")
        return done()
      }
    })

    let unitInput = ReactTestUtils.findAllInRenderedTree(
      testComponent.getComponent(),
      (inst) => ReactTestUtils.isDOMComponent(inst) && inst.id === "units"
    )

    unitInput = unitInput[0]

    return TestComponent.changeValue(unitInput, "b")
  })

  it("allows changing of decimal quantity", function (done) {
    const testComponent = this.render({
      answer: {
        quantity: "a",
        unit: null
      },

      onValueChange(value: any) {
        assert.equal(value.quantity, 13.33)
        return done()
      }
    })

    const quantityInput = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent.getComponent(), "INPUT")

    TestComponent.changeValue(quantityInput, "13.33")
    return ReactTestUtils.Simulate.blur(quantityInput)
  })

  it("allows changing of whole quantity", function (done) {
    const testComponent = this.render({
      answer: {
        quantity: "a",
        unit: null
      },
      decimal: false,
      onValueChange(value: any) {
        assert.equal(value.quantity, 13)
        return done()
      }
    })

    const quantityInput = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent.getComponent(), "INPUT")

    TestComponent.changeValue(quantityInput, "13")
    return ReactTestUtils.Simulate.blur(quantityInput)
  })

  return it("defaults unit", function (done) {
    const testComponent = this.render({
      answer: {
        quantity: null,
        units: null
      },
      defaultUnits: "b",
      onValueChange(value: any) {
        assert.equal(value.quantity, 13.33)
        assert.equal(value.units, "b")
        return done()
      }
    })

    const quantityInput = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent.getComponent(), "INPUT")

    TestComponent.changeValue(quantityInput, "13.33")
    return ReactTestUtils.Simulate.blur(quantityInput)
  })
})
