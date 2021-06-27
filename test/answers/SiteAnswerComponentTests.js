// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import SiteAnswerComponent from "../../src/answers/SiteAnswerComponent"
import AnswerValidator from "../../src/answers/AnswerValidator"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement
import PropTypes from "prop-types"

// TODO: Fix 4 failing test

class SiteContext extends React.Component {
  static initClass() {
    this.childContextTypes = {
      selectEntity: PropTypes.func,
      getEntityById: PropTypes.func,
      getEntityByCode: PropTypes.func,
      renderEntitySummaryView: PropTypes.func,
      onNextOrComments: PropTypes.func,
      T: PropTypes.func
    }
  }

  getChildContext() {
    return {
      selectEntity() {
        return null
      },
      getEntityById() {
        return null
      },
      getEntityByCode(code) {
        if (code === "10007") {
          return true
        }
        return null
      },
      renderEntitySummaryView() {
        return null
      },
      onNextOrComments() {
        return null
      },
      T() {
        return null
      }
    }
  }

  render() {
    return this.props.children
  }
}
SiteContext.initClass()

describe("SiteAnswerComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      const elem = R(SiteContext, {}, R(SiteAnswerComponent, options))
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp) => comp.destroy())
  })

  it("allows valid site codes", function (done) {
    const testComponent = this.render({
      async onValueChange(value) {
        assert.equal(value.code, "10007")

        // Validate answer
        const answer = { value }
        const answerValidator = new AnswerValidator()
        const question = { _type: "SiteQuestion" }
        const result = await answerValidator.validate(question, answer)
        assert.equal(result, null)

        return done()
      }
    })
    const input = testComponent.findInput()
    TestComponent.changeValue(input, "10007")
    return ReactTestUtils.Simulate.blur(input)
  })

  return it("rejects invalid site codes", function (done) {
    const testComponent = this.render({
      async onValueChange(value) {
        assert.equal(value.code, "10008")

        // Validate answer
        const answer = { value }
        const answerValidator = new AnswerValidator()
        const question = { _type: "SiteQuestion" }
        const result = await answerValidator.validate(question, answer)
        assert.equal(result, "Invalid code")

        return done()
      }
    })
    const input = testComponent.findInput()
    TestComponent.changeValue(input, "10008")
    return ReactTestUtils.Simulate.blur(input)
  })
})
