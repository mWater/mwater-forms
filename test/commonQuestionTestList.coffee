_ = require 'underscore'
Backbone = require 'backbone'
assert = require('chai').assert
#FormCompiler = require '../src/FormCompiler'

# Tests that should run on all questions
# Assumes question is @q and compiler is @compiler
module.exports = ->
  describe "Common question tests", ->
    beforeEach ->
      @q.text = { _base: "en", en: "English", es: "Spanish" }
      @q.hint = { _base: "en", en: "", es: "HINT" }
      @q.help = { _base: "en", en: "", es: "has *formatting*" }
      @q.required = true

      @qview = @compiler.compileQuestion(@q).render()

    it "displays question text", ->
      assert.match @qview.el.outerHTML, /Spanish/

    it "displays hint", ->
      assert.match @qview.el.outerHTML, /HINT/

    it "displays required", ->
      assert.match @qview.el.outerHTML, /\*/    

    it "displays help", ->
      assert.match @qview.el.outerHTML, /<em>formatting<\/em>/    

    it "hides only when conditions are false", ->
      @q.conditions = [
        { lhs: { question: "q1" }, op: "=", rhs: { literal: 1 }}
        { lhs: { question: "q2" }, op: "=", rhs: { literal: 2 }}
      ]
      @qview = @compiler.compileQuestion(@q).render()

      assert.isFalse @qview.shouldBeVisible()

      @model.set({ q1: { value: 1 }})
      assert.isFalse @qview.shouldBeVisible()

      @model.set({ q2: { value: 2 }})
      assert.isTrue @qview.shouldBeVisible()

    it "display comment box", ->
      @q.commentsField = true
      @qview = @compiler.compileQuestion(@q).render()
      @qview.$("#comments").val("some comment").change()
      assert.equal @model.get("q1234").comments, "some comment"

    it "loads comment box", ->
      @q.commentsField = true
      @model.set("q1234", { comments: "some comment" })
      @qview = @compiler.compileQuestion(@q).render()
      assert.equal @qview.$("#comments").val(), "some comment"

    it "records timestamp", ->
      @q.recordTimestamp = true
      @qview = @compiler.compileQuestion(@q).render()

      before = new Date().toISOString()
      @qview.setAnswerValue(null)
      after = new Date().toISOString()
      # Some imprecision in the date stamp was causing occassional failures
      assert @model.get("q1234").timestamp.substr(0,10) >= before.substr(0,10), @model.get("q1234").timestamp + " < " + before
      assert @model.get("q1234").timestamp.substr(0,10) <= after.substr(0,10), @model.get("q1234").timestamp + " > " + after

    # TODO: Fix test without FormCompiler
    #it "records location", ->
    #  @q.recordLocation = true
    #  ctx = {
    #    locationFinder: new MockLocationFinder()
    #  }
    #  ctx.locationFinder.getLocation = (success, error) =>
    #    success({ coords: { latitude: 2, longitude: 3, accuracy: 10}})
    #
    #  @compiler = new FormCompiler(model: @model, locale: "es", ctx: ctx)
    #  @qview = @compiler.compileQuestion(@q).render()
    #
    #  @qview.setAnswerValue(null)
    #  assert.deepEqual @model.get("q1234").location, { latitude: 2, longitude: 3, accuracy: 10}

    it "records alternate na", ->
      @q.alternates = {na: true}
      @qview = @compiler.compileQuestion(@q).render()
      @qview.$("#na").click()

      assert.equal @model.get("q1234").alternate, "na"

    it "loads alternate na", ->
      @q.alternates = {na: true}
      @model.set("q1234", { alternate: "na" })
      @qview = @compiler.compileQuestion(@q).render()
      assert @qview.$("#na").hasClass("checked")

    it "records alternate dontknow", ->
      @q.alternates = {dontknow: true, na: true}
      @qview = @compiler.compileQuestion(@q).render()
      @qview.$("#dontknow").click()

      assert.equal @model.get("q1234").alternate, "dontknow"

    it "allows alternate for required", ->
      @q.alternates = {na: true}
      @qview = @compiler.compileQuestion(@q).render()

      assert @qview.validate()

      @qview.$("#na").click()

      assert not @qview.validate()


class MockLocationFinder
  constructor:  ->
    _.extend @, Backbone.Events

  getLocation: (success, error) ->
  startWatch: ->
  stopWatch: ->
