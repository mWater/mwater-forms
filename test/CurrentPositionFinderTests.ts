// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "underscore"
import { assert } from "chai"
import Backbone from "backbone"
import sinon from "sinon"
import { default as CurrentPositionFinder } from "../src/CurrentPositionFinder"

const initialDelay = 10000
const goodDelay = 5000
const excellentAcc = 5
const goodAcc = 10
const fairAcc = 50
const recentThreshold = 90000

function createPos(accuracy: any, timeago = 0) {
  return {
    coords: {
      latitude: 1,
      longitude: 2,
      accuracy
    },

    timestamp: new Date().getTime() - timeago
  }
}

// Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event.
describe("CurrentPositionFinder", function () {
  beforeEach(function () {
    this.locationFinder = new MockLocationFinder()
    this.clock = sinon.useFakeTimers()
    this.posFinder = new CurrentPositionFinder({ locationFinder: this.locationFinder })

    this.pos = null
    this.posFinder.on("found", (pos: any) => {
      return (this.pos = pos)
    })

    this.status = null
    this.posFinder.on("status", (status: any) => {
      return (this.status = status)
    })

    return this.posFinder.start()
  })

  afterEach(function () {
    return this.clock.restore()
  })

  it("starts location finder", function () {
    return assert.isTrue(this.locationFinder.watching)
  })

  it("sets location if excellent", function () {
    const pos = createPos(excellentAcc - 1)
    this.locationFinder.fire(pos)
    return assert.deepEqual(this.pos, pos)
  })

  it("stops location finder after setting", function () {
    const pos = createPos(excellentAcc - 1)
    this.locationFinder.fire(pos)
    return assert.isFalse(this.locationFinder.watching)
  })

  it("stops on stop", function () {
    this.posFinder.stop()

    const pos = createPos(excellentAcc - 1)
    this.locationFinder.fire(pos)
    assert.isNull(this.pos)
    return assert.equal(this.status.strength, "none")
  })

  it("does not set immediately if good", function () {
    const pos = createPos(goodAcc - 1)
    this.locationFinder.fire(pos)
    return assert(!this.pos)
  })

  it("sets after good delay if good", function () {
    const pos = createPos(goodAcc - 1)
    this.locationFinder.fire(pos)

    this.clock.tick(goodDelay + 1)
    return assert.deepEqual(this.pos, pos)
  })

  it("sets after first good signal, using last good report", function () {
    const pos1 = createPos(goodAcc - 1)
    this.locationFinder.fire(pos1)

    this.clock.tick(goodDelay / 3)

    const pos2 = createPos(goodAcc - 2)
    this.locationFinder.fire(pos2)

    this.clock.tick(goodDelay / 3)

    // Bad position
    const pos3 = createPos(goodAcc + 2)
    this.locationFinder.fire(pos3)

    this.clock.tick(goodDelay / 3 + 10)

    return assert.deepEqual(this.pos, pos2)
  })

  it("still sets after good delay even if signal is now poor", function () {
    const pos1 = createPos(goodAcc - 1)
    this.locationFinder.fire(pos1)

    this.clock.tick(goodDelay / 2)

    const pos2 = createPos(goodAcc + 100)
    this.locationFinder.fire(pos2)

    this.clock.tick(goodDelay / 2 + 2)

    return assert.deepEqual(this.pos, pos1)
  })

  it("useable true if good", function () {
    const pos1 = createPos(goodAcc - 1)
    this.locationFinder.fire(pos1)

    return assert.equal(this.status.useable, true)
  })

  it("useable false initially", function () {
    return assert.equal(this.status.useable, false)
  })

  it("strength is none initially", function () {
    return assert.equal(this.status.strength, "none")
  })

  it("strength is none initially if old gps", function () {
    const pos1 = createPos(goodAcc - 1, recentThreshold + 1)
    this.locationFinder.fire(pos1)
    return assert.equal(this.status.strength, "none")
  })

  it("strength is poor if poor", function () {
    const pos1 = createPos(fairAcc + 1)
    this.locationFinder.fire(pos1)
    return assert.equal(this.status.strength, "poor")
  })

  it("strength is fair if fair", function () {
    const pos1 = createPos(fairAcc - 1)
    this.locationFinder.fire(pos1)
    assert.equal(this.status.strength, "fair")
    return assert.equal(this.posFinder.strength, "fair")
  })

  it("useable false immediately if poor", function () {
    const pos1 = createPos(fairAcc + 1)
    this.locationFinder.fire(pos1)
    return assert.equal(this.status.useable, false)
  })

  it("useable false immediately if fair", function () {
    const pos1 = createPos(fairAcc - 1)
    this.locationFinder.fire(pos1)
    return assert.equal(this.status.useable, false)
  })

  it("useable true if poor and after initial delay", function () {
    const pos1 = createPos(fairAcc + 1)
    this.locationFinder.fire(pos1)

    this.clock.tick(initialDelay + 2)

    assert.equal(this.status.useable, true)
    return assert.deepEqual(this.status.pos, pos1)
  })

  it("useable true if fair and after initial delay", function () {
    const pos1 = createPos(fairAcc - 1)
    this.locationFinder.fire(pos1)

    this.clock.tick(initialDelay + 2)

    assert.equal(this.status.useable, true)
    return assert.deepEqual(this.status.pos, pos1)
  })

  it("fires error if location finder reports error", function () {
    let error = ""
    this.posFinder.on("error", (err: any) => (error = err))

    this.locationFinder.trigger("error", "some error")
    assert.equal(error, "some error")
    return assert.equal(this.posFinder.error, "some error")
  })

  return it("stops if location finder reports error", function () {
    this.locationFinder.trigger("error", "some error")
    return assert.equal(this.posFinder.running, false)
  })
})

class MockLocationFinder {
  constructor() {
    _.extend(this, Backbone.Events)
  }

  getLocation(success: any, error: any) {}
  startWatch() {
    return (this.watching = true)
  }
  stopWatch() {
    return (this.watching = false)
  }

  fire(loc: any) {
    return this.trigger("found", loc)
  }
}
