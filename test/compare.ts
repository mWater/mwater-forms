// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import { assert } from "chai"
import canonical from "canonical-json"

// Handy compare assertion that deep compares
export default (actual, expected, message) =>
  assert.equal(
    canonical(actual),
    canonical(expected),
    "\ngot:" + canonical(actual) + "\nexp:" + canonical(expected) + "\n" + (message || "")
  )
