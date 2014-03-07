chai = require 'chai'
assert = require('chai').assert

# Tests that should run on all questions
# Assumes question is @q and compiler is @compiler
module.exports = ->
  describe "Common question tests", ->
    beforeEach ->
      @q.text = { _base: "en", en: "English", es: "Spanish" }
      @q.hint = { _base: "en", en: "", es: "HINT" }
      @q.required = true

      @qview = @compiler.compileQuestion(@q).render()

    it "displays question text", ->
      assert.match @qview.el.outerHTML, /Spanish/

    it "displays hint", ->
      assert.match @qview.el.outerHTML, /HINT/

    it "displays required", ->
      assert.match @qview.el.outerHTML, /\*/    

    it "displays help"
    it "display comment box"
    it "records location"
    it "records timestamp"
    it "is sticky"



