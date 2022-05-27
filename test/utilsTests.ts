import _ from "lodash"
import { assert } from "chai"
import * as utils from "../src/utils"

// Fake localization
function T(str: any) {
  return str
}

describe("utils.getRelativeLocation", function () {
  it("gives correct angle and bearing S", function () {
    const from = { latitude: 10, longitude: 20 }
    const to = { latitude: 9, longitude: 20 }

    const rel = utils.getRelativeLocation(from, to)
    assert.closeTo(rel.angle, 180, 0.1)
    return assert.closeTo(rel.distance, 111200, 1000)
  })

  return it("gives correct angle and bearing E", function () {
    const from = { latitude: 0, longitude: 20 }
    const to = { latitude: 0, longitude: 21 }

    const rel = utils.getRelativeLocation(from, to)
    assert.closeTo(rel.angle, 90, 0.1)
    return assert.closeTo(rel.distance, 111319, 2000)
  })
})

describe("utils.getCompassBearing", function () {
  it("gives N when slightly positive", () => assert.equal(utils.getCompassBearing(5, T), "N"))

  it("gives N when slightly negative", () => assert.equal(utils.getCompassBearing(-5, T), "N"))

  return it("gives NE when 45 deg", () => assert.equal(utils.getCompassBearing(45, T), "NE"))
})

describe("utils.formatRelativeLocation", () =>
  it("gives 111.3 km E when on equator", function () {
    const rel = { distance: 111324.3, angle: 90 }
    return assert.equal(utils.formatRelativeLocation(rel, T), "111.3 km E")
  }))
