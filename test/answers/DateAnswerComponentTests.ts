// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import { assert } from "chai"
import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import DateAnswerComponent from "../../src/answers/DateAnswerComponent"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

// TODO: Fix 3 failing test
// Cannot find datetimepicker

describe.skip("DateAnswerComponent", function () {
  beforeEach(function () {
    this.toDestroy = []

    return (this.render = (options = {}) => {
      const elem = R(DateAnswerComponent, options)
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy());
  })

  it("displays format YYYY-MM-DD", function (done) {
    const testComponent = this.render({
      value: null,
      onValueChange(value: any) {
        assert.equal(value, "2013-12-31")
        return done()
      }
    })
    return TestComponent.changeValue(testComponent.findInput(), "2013-12-31")
  })

  it("displays format MM/DD/YYYY", function () {
    assert(false, "Test not updated yet")
    this.q.format = "MM/DD/YYYY"
    this.qview = this.compiler.compileQuestion(this.q).render()

    this.model.set("q1234", { value: "2013-12-31" })
    return assert.equal(this.qview.$el.find("input").val(), "12/31/2013")
  })

  return it("handles arbitrary date formats in Moment.js format", function () {
    assert(false, "Test not updated yet")
    this.q.format = "MMDDYYYY"
    this.qview = this.compiler.compileQuestion(this.q).render()

    this.model.set("q1234", { value: "2013-12-31" })
    return assert.equal(this.qview.$el.find("input").val(), "12312013")
  })
})
