// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import SiteColumnAnswerComponent from "../../src/answers/SiteColumnAnswerComponent"
import AnswerValidator from "../../src/answers/AnswerValidator"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement
import PropTypes from "prop-types"

class SiteContext extends React.Component {
  static initClass() {
    this.childContextTypes = {
      selectEntity: PropTypes.func,
      getEntityById: PropTypes.func,
      getEntityByCode: PropTypes.func,
      renderEntityListItemView: PropTypes.func,
      T: PropTypes.func
    }
  }

  getChildContext() {
    return {
      selectEntity(options: any) {
        return options.callback("testid")
      },
      getEntityById(entityType: any, entityId: any, callback: any) {
        if (entityId === "testid") {
          return callback({
            _id: "testid",
            code: "10007"
          })
        }
      },
      getEntityByCode(entityType: any, entityCode: any, callback: any) {
        if (entityCode === "10007") {
          return callback({
            _id: "testid",
            code: "10007"
          })
        }
      },
      renderEntityListItemView(entityType: any, entity: any) {
        return R("div", null, entity.code)
      },
      T(str: any) {
        return str
      }
    }
  }

  render() {
    return this.props.children
  }
}
SiteContext.initClass()

describe("SiteColumnAnswerComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      const elem = R(SiteContext, {}, R(SiteColumnAnswerComponent, options))
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy())
  })

  it("selects entity", function (done) {
    const testComponent = this.render({
      siteType: "water_point",
      async onValueChange(value: any) {
        assert.equal(value.code, "10007")

        // Validate answer
        const answer = { value }
        const answerValidator = new AnswerValidator()
        const question = { _type: "SiteColumnQuestion" }
        const result = await answerValidator.validate(question, answer)
        assert.equal(result, null)

        return done()
      }
    })
    return TestComponent.click(testComponent.findDOMNodeByText(/Select/))
  })

  it("displays entity", function (done) {
    const testComponent = this.render({
      siteType: "water_point",
      value: { code: "10007" },
      onValueChange(value: any) {}
    })

    return _.defer(() => {
      // Check for display
      assert(testComponent.findDOMNodeByText(/10007/), "Should display code")
      return done()
    })
  })

  return it("clears entity", function (done) {
    const testComponent = this.render({
      siteType: "water_point",
      value: { code: "10007" },
      onValueChange(value: any) {
        assert(!value)
        return done()
      }
    })

    const clearButton = ReactTestUtils.findRenderedDOMComponentWithTag(testComponent.getComponent(), "button")
    assert(clearButton)
    return TestComponent.click(clearButton)
  })
})
