assert = require('chai').assert
canonical = require 'canonical-json'

# Handy compare assertion that deep compares
module.exports = (actual, expected, message) ->
  assert.equal canonical(actual), canonical(expected), "\ngot:" + canonical(actual) + "\nexp:" + canonical(expected) + "\n" + (message or "")
