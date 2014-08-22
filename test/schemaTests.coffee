assert = require('chai').assert
schema = require '../src/schema'
jjv = require 'jjv'
_ = require 'lodash'

schemaEnv = jjv()
schemaEnv.addSchema("form-design", schema)

allforms = require './allforms.js'

describe "form design schema", ->
  it "validates all forms", ->
    for form in _.values(allforms)
      errors = schemaEnv.validate("form-design", form.design)
      assert.isNull errors, JSON.stringify(errors)
