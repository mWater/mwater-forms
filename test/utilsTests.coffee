_ = require 'lodash'
assert = require("chai").assert
utils = require '../src/utils'

# Fake localization
T = (str) -> str

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

describe "utils.getCompassBearing", ->
  it "gives N when slightly positive", ->
    assert.equal utils.getCompassBearing(5, T), "N"

  it "gives N when slightly negative", ->
    assert.equal utils.getCompassBearing(-5, T), "N"

  it "gives NE when 45 deg", ->
    assert.equal utils.getCompassBearing(45, T), "NE"

describe "utils.formatRelativeLocation", ->
  it "gives 111.3 km E when on equator", ->
    rel = { distance: 111324.3, angle: 90 }
    assert.equal utils.formatRelativeLocation(rel, T), "111.3 km E"
