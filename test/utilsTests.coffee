_ = require 'lodash'
assert = require("chai").assert
utils = require '../src/utils'

describe "utils.getRelativeLocation", ->
  it "gives correct angle and bearing S", ->
    from = { latitude: 10, longitude: 20 }
    to = { latitude: 9, longitude: 20 }

    rel = utils.getRelativeLocation(from, to)
    assert.closeTo rel.angle, 180, 0.1
    assert.closeTo rel.distance, 111200, 1000

  it "gives correct angle and bearing E", ->
    from = { latitude: 0, longitude: 20 }
    to = { latitude: 0, longitude: 21 }

    rel = utils.getRelativeLocation(from, to)
    assert.closeTo rel.angle, 90, 0.1
    assert.closeTo rel.distance, 111319, 2000
