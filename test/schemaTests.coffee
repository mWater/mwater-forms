assert = require('chai').assert
schema = require '../src/schema'
jjv = require 'jjv'
_ = require 'lodash'

schemaEnv = jjv()
schemaEnv.addSchema("form-design", schema)

allforms = require './allforms.js'

describe "form design schema", ->
  it "validates all forms", ->
    allErrors = []
    for form in _.values(allforms)
      errors = schemaEnv.validate("form-design", form.design)
      if errors
        allErrors.push errors
        console.log form._id

      # assert.isNull errors, JSON.stringify(errors) + ":" + form._id
    assert.equal allErrors.length, 0, JSON.stringify(allErrors)
