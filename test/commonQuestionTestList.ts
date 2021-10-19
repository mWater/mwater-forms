// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "underscore"
import Backbone from "backbone"
import { assert } from "chai"

//FormCompiler = require '../src/FormCompiler'

// Tests that should run on all questions
// Assumes question is @q and compiler is @compiler
export default () =>
  describe("Common question tests", function () {
    beforeEach(function () {
      this.q.text = { _base: "en", en: "English", es: "Spanish" }
      this.q.hint = { _base: "en", en: "", es: "HINT" }
      this.q.help = { _base: "en", en: "", es: "has *formatting*" }
      this.q.required = true

      return (this.qview = this.compiler.compileQuestion(this.q).render())
    })

    it("displays question text", function () {
      return assert.match(this.qview.el.outerHTML, /Spanish/)
    })

    it("displays hint", function () {
      return assert.match(this.qview.el.outerHTML, /HINT/)
    })

    it("displays required", function () {
      return assert.match(this.qview.el.outerHTML, /\*/)
    })

    it("displays help", function () {
      return assert.match(this.qview.el.outerHTML, /<em>formatting<\/em>/)
    })

    it("hides only when conditions are false", function () {
      this.q.conditions = [
        { lhs: { question: "q1" }, op: "=", rhs: { literal: 1 } },
        { lhs: { question: "q2" }, op: "=", rhs: { literal: 2 } }
      ]
      this.qview = this.compiler.compileQuestion(this.q).render()

      assert.isFalse(this.qview.shouldBeVisible())

      this.model.set({ q1: { value: 1 } })
      assert.isFalse(this.qview.shouldBeVisible())

      this.model.set({ q2: { value: 2 } })
      return assert.isTrue(this.qview.shouldBeVisible())
    })

    it("display comment box", function () {
      this.q.commentsField = true
      this.qview = this.compiler.compileQuestion(this.q).render()
      this.qview.$("#comments").val("some comment").change()
      return assert.equal(this.model.get("q1234").comments, "some comment")
    })

    it("loads comment box", function () {
      this.q.commentsField = true
      this.model.set("q1234", { comments: "some comment" })
      this.qview = this.compiler.compileQuestion(this.q).render()
      return assert.equal(this.qview.$("#comments").val(), "some comment")
    })

    it("records timestamp", function () {
      this.q.recordTimestamp = true
      this.qview = this.compiler.compileQuestion(this.q).render()

      const before = new Date().toISOString()
      this.qview.setAnswerValue(null)
      const after = new Date().toISOString()
      // Some imprecision in the date stamp was causing occassional failures
      assert(
        this.model.get("q1234").timestamp.substr(0, 10) >= before.substr(0, 10),
        this.model.get("q1234").timestamp + " < " + before
      )
      return assert(
        this.model.get("q1234").timestamp.substr(0, 10) <= after.substr(0, 10),
        this.model.get("q1234").timestamp + " > " + after
      )
    })

    // TODO: Fix test without FormCompiler
    //it "records location", ->
    //  @q.recordLocation = true
    //  ctx = {
    //    locationFinder: new MockLocationFinder()
    //  }
    //  ctx.locationFinder.getLocation = (success, error) =>
    //    success({ coords: { latitude: 2, longitude: 3, accuracy: 10}})
    //
    //  @compiler = new FormCompiler(model: @model, locale: "es", ctx: ctx)
    //  @qview = @compiler.compileQuestion(@q).render()
    //
    //  @qview.setAnswerValue(null)
    //  assert.deepEqual @model.get("q1234").location, { latitude: 2, longitude: 3, accuracy: 10}

    it("records alternate na", function () {
      this.q.alternates = { na: true }
      this.qview = this.compiler.compileQuestion(this.q).render()
      this.qview.$("#na").click()

      return assert.equal(this.model.get("q1234").alternate, "na")
    })

    it("loads alternate na", function () {
      this.q.alternates = { na: true }
      this.model.set("q1234", { alternate: "na" })
      this.qview = this.compiler.compileQuestion(this.q).render()
      return assert(this.qview.$("#na").hasClass("checked"))
    })

    it("records alternate dontknow", function () {
      this.q.alternates = { dontknow: true, na: true }
      this.qview = this.compiler.compileQuestion(this.q).render()
      this.qview.$("#dontknow").click()

      return assert.equal(this.model.get("q1234").alternate, "dontknow")
    })

    return it("allows alternate for required", function () {
      this.q.alternates = { na: true }
      this.qview = this.compiler.compileQuestion(this.q).render()

      assert(this.qview.validate())

      this.qview.$("#na").click()

      return assert(!this.qview.validate())
    })
  })

class MockLocationFinder {
  constructor() {
    _.extend(this, Backbone.Events)
  }

  getLocation(success: any, error: any) {}
  startWatch() {}
  stopWatch() {}
}
