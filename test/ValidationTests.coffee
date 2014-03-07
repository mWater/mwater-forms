$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'

describe "Validation compiler", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")

  it "validates length range between", ->
    validation = {
      op: "lengthRange"
      rhs: { literal: { min: 6, max: 8 } }
    }
    result = @compiler.compileValidations([validation])({ value: "1234567" })
    assert not result

  it "validates length range below min", ->
    validation = {
      op: "lengthRange"
      rhs: { literal: { min: 10 } }
    }
    result = @compiler.compileValidations([validation])({ value: "1234567" })
    assert result

  it "validates length range above max", ->
    validation = {
      op: "lengthRange"
      rhs: { literal: { max: 6 } }
    }
    result = @compiler.compileValidations([validation])({ value: "1234567" })
    assert result

  it "validates regex ok", ->
    validation = {
      op: "regex"
      rhs: { literal: "^\\d+$" }
    }
    result = @compiler.compileValidations([validation])({ value: "1234567" })
    assert not result

  it "validates regex not ok", ->
    validation = {
      op: "regex"
      rhs: { literal: "^\\d+$" }
    }
    result = @compiler.compileValidations([validation])({ value: "1234567a" })
    assert result

  it "validates range between", ->
    validation = {
      op: "range"
      rhs: { literal: { min: 6, max: 6 } }
    }
    result = @compiler.compileValidations([validation])({ value: 6 })
    assert not result

  it "validates range below min", ->
    validation = {
      op: "range"
      rhs: { literal: { min: 6 } }
    }
    result = @compiler.compileValidations([validation])({ value: 5 })
    assert result

  it "validates range above max", ->
    validation = {
      op: "range"
      rhs: { literal: { max: 6 } }
    }
    result = @compiler.compileValidations([validation])({ value: 8 })
    assert result

  it "validates two conditions", ->
    validations = [
      {
        op: "range"
        rhs: { literal: { max: 6 } }
      }, 
      {
        op: "range"
        rhs: { literal: { min: 4 } }
      }]
    result = @compiler.compileValidations(validations)({ value: 5 })
    assert not result

    result = @compiler.compileValidations(validations)({ value: 7 })
    assert result

    result = @compiler.compileValidations(validations)({ value: 3 })
    assert result
