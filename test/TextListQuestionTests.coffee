$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

describe "TextListQuestion", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @q = {
      _id: "q1234"
      _type: "TextListQuestion"
      text: { _base: "en", en: "English", es: "Spanish" }
      required: true
    }
    @qview = @compiler.compileQuestion(@q).render()

  # Run common tests
  commonQuestionTestList.call(this)

  it "records add", ->
    $(@qview.$el.find("input")[0]).val("entry1").trigger('input')
    assert.deepEqual @model.get('q1234').value, ["entry1"]

  it "records remove", ->
    @model.set('q1234', { value: ['entry1', 'entry2']})
    $(@qview.$("button.remove")[1]).trigger('click')
    assert.deepEqual @model.get('q1234').value, ["entry1"]

  it "empty and required is not ok", ->
    assert @qview.validate()

  it "loads existing values", ->
    # Set first value
    @model.set(@q._id, { value: ["entry1"]})

    # Add second value
    $(@qview.$el.find("input")[1]).val("entry2").trigger('input')
    assert.deepEqual @model.get('q1234').value, ["entry1", "entry2"]    
