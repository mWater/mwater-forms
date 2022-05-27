import _ from "lodash"
import { assert } from "chai"
import React from "react"
import ReactDOM from "react-dom"
const R = React.createElement

import TestComponent from "react-library/lib/TestComponent"
import ReactTestUtils from "react-dom/test-utils"
import MockTContextWrapper from "../MockTContextWrapper"
import QuestionComponent from "../../src/QuestionComponent"

describe("QuestionComponent", function () {
  beforeEach(function () {
    this.question = {
      _id: "q1234",
      _type: "TextQuestion",
      format: "singleline",
      text: { _base: "en", en: "English" },
      hint: { _base: "en", en: "HINT" },
      help: { _base: "en", en: "has *formatting*" },
      required: true
    }

    this.toDestroy = []

    return (this.render = (options = {}) => {
      this.options = _.extend(
        {
          question: this.question,
          data: {},
          onAnswerChange() {
            return null
          }
        },
        options
      )
      const elem = R(MockTContextWrapper, null, R(QuestionComponent, this.options))
      const comp = new TestComponent(elem)
      this.toDestroy.push(comp)
      return comp
    })
  })

  afterEach(function () {
    return this.toDestroy.map((comp: any) => comp.destroy())
  })

  it("displays question text", function () {
    const testComponent = this.render()

    const prompt = testComponent.findDOMNodeByText(/English/)
    return assert(prompt != null, "Not showing question text")
  })

  it("displays hint", function () {
    const testComponent = this.render()

    const hint = testComponent.findDOMNodeByText(/HINT/)
    return assert(hint != null, "Not showing hint text")
  })

  it("displays required", function () {
    const testComponent = this.render()

    const star = testComponent.findDOMNodeByText(/\*/)
    return assert(star != null, "Not showing required star")
  })

  it("displays help", function () {
    const testComponent = this.render()

    let help = testComponent.findDOMNodeByText(/formatting/)
    assert(help == null, "Help shouldn't be visible")

    const button = testComponent.findComponentById("helpbtn")
    TestComponent.click(button)

    help = testComponent.findDOMNodeByText(/formatting/)
    return assert(help != null, "Help should now be visible")
  })

  it("display comment box", function (done) {
    let testComponent = this.render()
    let comments = testComponent.findComponentById("comments")

    this.question.commentsField = true
    testComponent = this.render({
      onAnswerChange(answer: any) {
        assert.equal(answer.comments, "some comment")
        return done()
      }
    })

    comments = testComponent.findComponentById("comments")
    return TestComponent.changeValue(comments, "some comment")
  })

  it("loads comment box", function () {
    this.question.commentsField = true
    const testComponent = this.render({
      data: { q1234: { comments: "some comment" } }
    })

    const comment = testComponent.findDOMNodeByText(/some comment/)

    return assert(comment, "The comment should be displayed")
  })

  it("records timestamp", function () {
    this.question.recordTimestamp = true
    this.question.commentsField = true
    const testComponent = this.render({
      data: { q1234: { comments: "some comment" } },
      onAnswerChange(answer: any) {
        const after = new Date().toISOString()
        // Some imprecision in the date stamp was causing occassional failures
        assert(answer.timestamp.substr(0, 10) >= before.substr(0, 10), answer.timestamp + " < " + before)
        return assert(answer.timestamp.substr(0, 10) <= after.substr(0, 10), answer.timestamp + " > " + after)
      }
    })

    const comments = testComponent.findDOMNodeByText(/some comment/)

    var before = new Date().toISOString()
    return TestComponent.changeValue(comments, "some comment")
  })

  it("records alternate na", function (done) {
    this.question.alternates = { na: true }
    const testComponent = this.render({
      onAnswerChange(answer: any) {
        assert.equal(answer.alternate, "na")
        return done()
      }
    })
    const na = testComponent.findComponentById("na")
    return TestComponent.click(na)
  })

  it("loads alternate na", function () {
    this.question.alternates = { na: true }
    const testComponent = this.render({
      data: { q1234: { alternate: "na" } }
    })
    const na = testComponent.findComponentById("na")
    return assert(na.className.indexOf("checked") >= 0)
  })

  it("records alternate dontknow", function (done) {
    this.question.alternates = { dontknow: true, na: true }
    const testComponent = this.render({
      onAnswerChange(answer: any) {
        assert.equal(answer.alternate, "dontknow")
        return done()
      }
    })
    const dn = testComponent.findComponentById("dn")
    return TestComponent.click(dn)
  })

  it("erases value on alternate selected", function (done) {
    this.question.alternates = { dontknow: true, na: true }
    const testComponent = this.render({
      data: { q1234: { value: "test" } },
      onAnswerChange(answer: any) {
        assert.equal(answer.alternate, "dontknow")
        assert.equal(answer.value, null)
        return done()
      }
    })
    const dn = testComponent.findComponentById("dn")
    return TestComponent.click(dn)
  })

  it("caches value on alternate selected", function (done) {
    const firstCall = true
    this.question.alternates = { dontknow: true, na: true }
    const myOptions = {
      data: { q1234: { value: "test" } },
      onAnswerChange: (answer: any) => {
        assert.equal(answer.alternate, "dontknow")
        assert.equal(answer.value, null)

        this.options.data = { q1234: answer }
        this.options.onAnswerChange = function (answer: any) {
          assert.equal(null, answer.alternate, "Alternate shouldn't be set anymore")
          assert.equal(answer.value, "test", "Should be back to test")
          return done()
        }

        testComponent.setElement(R(MockTContextWrapper, null, R(QuestionComponent, this.options)))

        function callback() {
          const dn = testComponent.findComponentById("dn")
          return TestComponent.click(dn)
        }

        return setTimeout(callback, 30)
      }
    }

    var testComponent = this.render(myOptions)
    const dn = testComponent.findComponentById("dn")
    return TestComponent.click(dn)
  })

  return it("erases alternate on value entered", function (done) {
    this.question.alternates = { dontknow: true, na: true }
    const testComponent = this.render({
      data: { q1234: { alternate: "na" } },
      onAnswerChange(answer: any) {
        assert.equal(answer.alternate, null)
        assert.equal(answer.value, "test")
        return done()
      }
    })
    const input = testComponent.findComponentById("input")
    TestComponent.changeValue(input, "test")
    return ReactTestUtils.Simulate.blur(input)
  })
})
