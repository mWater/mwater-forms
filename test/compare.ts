// @ts-nocheck
import { assert } from "chai"
import canonical from "canonical-json"

// Handy compare assertion that deep compares
export default (actual: any, expected: any, message: any) =>
  assert.equal(
    canonical(actual),
    canonical(expected),
    "\ngot:" + canonical(actual) + "\nexp:" + canonical(expected) + "\n" + (message || "")
  )
